(() => {
    let initialized = false;
    window.initNativeMeetings = () => {
        if (initialized) return; initialized = true;
        const panel = document.getElementById('panel-meetings');
        if (!panel) return;
        const list = panel.querySelector('#meetings-panel-list');
        const status = panel.querySelector('#meetings-status');
        const form = panel.querySelector('#booking-settings-form');
        const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
        let records = [], settings, saving = false;
        async function api(action, body) {
            const base = String(window.TCB_CONTENT_API_CONFIG?.baseUrl || '').replace(/\/$/, '');
            const token = localStorage.getItem('tcb_content_api_token');
            const response = await fetch(`${base}/api/bookings?action=${action}`, { method: body ? 'POST' : 'GET', credentials: 'include', cache: 'no-store',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(45000) });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.message || 'Meetings could not load. Check the booking service connection.');
            return data;
        }
        const when = start => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Budapest', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(start));
        function render() {
            const metric = document.querySelector('[data-booking-metric]');
            if (metric) {
                metric.querySelector('strong').textContent = String(records.filter(b => b.status !== 'cancelled').length);
                metric.querySelector('.metric-delta').textContent = 'Saved bookings · last 180 days';
            }
            const filter = panel.querySelector('#meeting-filter').value;
            const filtered = records.filter(b => filter === 'all' || filter === 'cancelled' && b.status === 'cancelled' || filter === 'upcoming' && b.status !== 'cancelled' && Date.parse(b.start) > Date.now()).sort((a,b) => a.start.localeCompare(b.start));
            list.innerHTML = filtered.length ? filtered.map(b => `<article class="native-meeting" data-id="${escape(b.id)}">
                <div class="meeting-heading"><h3>${escape(b.name)}</h3><span class="soft-pill">${escape(b.status)}</span></div>
                <p><strong>${escape(when(b.start))}</strong> · Hungary time · ${Math.round((Date.parse(b.end)-Date.parse(b.start))/60000)} min</p>
                <p><a href="mailto:${escape(b.email)}">${escape(b.email)}</a> · ${escape(b.service)}</p>
                ${b.notes ? `<p class="meeting-notes">${escape(b.notes)}</p>` : ''}
                <p class="meeting-delivery">Zoom: ${escape(b.integration)} · Email: ${escape(b.delivery)}${b.job ? ' · Processing (if stuck, ask the developer to inspect this task)' : ''}</p>
                ${b.integrationMessage ? `<p>${escape(b.integrationMessage)}</p>` : ''}
                <div class="meeting-actions">${b.joinUrl && b.status !== 'cancelled' ? `<a href="${escape(b.joinUrl)}" target="_blank" rel="noopener noreferrer" class="admin-secondary-btn">Join Zoom ↗</a>` : ''}
                ${b.status !== 'cancelled' && Date.parse(b.start) > Date.now() ? '<button type="button" data-meeting-action="reschedule" class="admin-secondary-btn">Reschedule</button><button type="button" data-meeting-action="cancel" class="admin-secondary-btn">Cancel</button>' : ''}
                ${b.delivery !== 'sent' || b.integration !== 'ready' ? '<button type="button" data-meeting-action="retry" class="admin-secondary-btn">Retry integrations</button>' : ''}</div>
                <div data-meeting-reschedule hidden><label>New studio date<input type="date" data-new-date></label><label>Available time (Hungary)<select data-new-slot><option value="">Choose a date first</option></select></label><button type="button" data-meeting-action="confirm-reschedule" class="admin-primary-btn">Confirm new time</button></div>
                </article>`).join('') : '<p class="meeting-empty">No bookings in this view.</p>';
            const upcoming = records.filter(b => b.status !== 'cancelled' && Date.parse(b.start) > Date.now()).sort((a,b)=>a.start.localeCompare(b.start)).slice(0,3);
            document.getElementById('meeting-list').innerHTML = upcoming.length ? upcoming.map(b=>`<article class="meeting-item"><span><i class="fa-regular fa-calendar"></i></span><div><strong>${escape(b.name)}</strong><p>${escape(b.service)}</p></div><em>${escape(when(b.start))}</em></article>`).join('') : '<p>No upcoming bookings yet.</p>';
        }
        async function refresh() {
            status.textContent = 'Loading bookings…';
            try {
                const data = await api('admin'); records = data.bookings; settings = data.settings;
                for (const key of ['start', 'end', 'duration', 'buffer', 'noticeHours', 'horizonDays']) form.elements[key].value = settings[key];
                form.elements.enabled.checked = settings.enabled;
                form.elements.blockedDates.value = settings.blockedDates.join('\n');
                form.querySelectorAll('[name="weekdays"]').forEach(e => e.checked = settings.weekdays.includes(Number(e.value)));
                panel.querySelector('#booking-connections').textContent = data.preview ? 'LOCAL PREVIEW · Private local storage. Email and Zoom are not connected; test reservations never send invitations.' : `Private storage: ${data.connections.storage ? 'connected' : 'not connected'} · Zoom: ${data.connections.zoom ? 'configured' : 'not connected'} · Email: ${data.connections.email ? 'configured' : 'not connected'}`;
                form.querySelector('button[type="submit"]').disabled = false;
                render(); status.textContent = `${records.length} booking records. Times shown in Europe/Budapest.`;
            } catch (e) {
                status.textContent = e.message; document.getElementById('meeting-list').textContent = 'Meetings unavailable. Open Meetings for details.';
                const metric = document.querySelector('[data-booking-metric]');
                if (metric) { metric.querySelector('strong').textContent = '—'; metric.querySelector('.metric-delta').textContent = 'Booking service unavailable'; }
            }
        }
        panel.querySelector('#refresh-meetings').addEventListener('click', refresh);
        panel.querySelector('#meeting-filter').addEventListener('change', render);
        document.querySelector('[data-admin-panel="meetings"]')?.addEventListener('click', () => { if (!saving) refresh(); });
        form.addEventListener('submit', async e => {
            e.preventDefault(); if (saving || !settings) return;
            saving = true; const button = form.querySelector('[type="submit"]'); button.disabled = true;
            const f = new FormData(form);
            try {
                await api('settings', { enabled: form.elements.enabled.checked, timezone: 'Europe/Budapest', start: f.get('start'), end: f.get('end'),
                    duration: Number(f.get('duration')), buffer: Number(f.get('buffer')), noticeHours: Number(f.get('noticeHours')), horizonDays: Number(f.get('horizonDays')),
                    weekdays: f.getAll('weekdays').map(Number), blockedDates: String(f.get('blockedDates')).split(/[\n,]/).map(s=>s.trim()).filter(Boolean) });
                await refresh(); status.textContent = 'Availability saved. Existing bookings keep their agreed times.';
            } catch (error) { status.textContent = error.message; } finally { saving = false; button.disabled = false; }
        });
        list.addEventListener('change', async event => {
            if (!event.target.matches('[data-new-date]')) return;
            const row = event.target.closest('[data-id]'), select = row.querySelector('[data-new-slot]');
            const selectedDate = event.target.value;
            select.innerHTML = '<option value="">Loading…</option>';
            try {
                const base = String(window.TCB_CONTENT_API_CONFIG?.baseUrl || '').replace(/\/$/, '');
                const response = await fetch(`${base}/api/bookings?date=${encodeURIComponent(selectedDate)}`);
                const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Times could not load.');
                if (event.target.value !== selectedDate) return;
                select.innerHTML = data.slots.length ? data.slots.map(s=>`<option value="${escape(s.start)}">${escape(when(s.start))}</option>`).join('') : '<option value="">No times available</option>';
            } catch (e) { status.textContent = e.message; select.innerHTML = '<option value="">Try another date</option>'; }
        });
        list.addEventListener('click', async event => {
            const button = event.target.closest('[data-meeting-action]'); if (!button || saving) return;
            const row = button.closest('[data-id]'), action = button.dataset.meetingAction, id = row.dataset.id;
            if (action === 'reschedule') { row.querySelector('[data-meeting-reschedule]').hidden = false; row.querySelector('[data-new-date]').focus(); return; }
            if (action === 'cancel' && !confirm('Cancel this booking and notify the client when email is connected?')) return;
            const start = row.querySelector('[data-new-slot]')?.value;
            if (action === 'confirm-reschedule' && !start) { status.textContent = 'Choose an available time first.'; return; }
            saving = true; button.disabled = true; status.textContent = 'Updating booking…';
            try { await api(action === 'retry' ? 'retry' : action === 'cancel' ? 'admin-cancel' : 'admin-reschedule', { id, start }); await refresh(); }
            catch (e) { status.textContent = e.message; }
            finally { saving = false; button.disabled = false; }
        });
        refresh();
    };
})();
