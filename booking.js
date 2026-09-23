(() => {
    const root = document.getElementById('native-booking');
    if (!root) return;
    const base = String(window.TCB_CONTENT_API_CONFIG?.baseUrl || '').replace(/\/$/, '');
    const form = root.querySelector('form');
    const date = root.querySelector('#booking-date');
    const zone = root.querySelector('#booking-timezone');
    const slots = root.querySelector('#booking-slots');
    const status = root.querySelector('#booking-status');
    const summary = root.querySelector('#booking-selection');
    const submit = root.querySelector('[type="submit"]');
    const result = root.querySelector('#booking-result');
    const dateStep = root.querySelector('#booking-date-step');
    const detailsStep = root.querySelector('#booking-details-step');
    const contactFields = root.querySelector('#booking-contact-fields');
    const continueButton = root.querySelector('[data-booking-continue]');
    const days = root.querySelector('#booking-days');
    const escape = value => String(value || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    let chosen = '', requestId = crypto.randomUUID(), requestVersion = 0, settings, busy = false, management = null;
    const localDate = (instant, timezone) => {
        const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(instant).map(p => [p.type, p.value]));
        return `${p.year}-${p.month}-${p.day}`;
    };
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Budapest';
    const zones = [...new Set([detected, 'Europe/Budapest', 'Europe/Bucharest', 'Europe/London', 'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Asia/Dubai', 'Asia/Singapore', 'Australia/Sydney', 'UTC'])];
    zone.innerHTML = zones.map(z => `<option value="${escape(z)}">${escape(z.split('/').pop().replaceAll('_', ' '))}${z === detected ? ' (your time)' : ''}</option>`).join('');
    date.min = localDate(new Date(), 'Europe/Budapest'); date.value = date.min;
    let month = date.min.slice(0, 7), initialDateResolved = false;
    function eligible(day) {
        if (!settings || !settings.enabled || day < date.min || day > date.max) return false;
        const earliest = localDate(new Date(Date.now() + settings.noticeHours * 3600000), settings.timezone);
        return day >= earliest && settings.weekdays.includes(new Date(day + 'T12:00:00Z').getUTCDay()) && !settings.blockedDates.includes(day);
    }
    function renderCalendar() {
        const first = new Date(month + '-01T12:00:00Z');
        const count = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
        root.querySelector('#booking-month').textContent = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone:'UTC' }).format(first);
        days.replaceChildren();
        for (let i = 0; i < (first.getUTCDay() + 6) % 7; i++) { const blank = document.createElement('span'); blank.setAttribute('aria-hidden','true'); days.append(blank); }
        for (let n = 1; n <= count; n++) {
            const day = `${month}-${String(n).padStart(2, '0')}`;
            const button = document.createElement('button'); button.type = 'button'; button.className = 'booking-day'; button.textContent = n;
            button.dataset.date = day; button.disabled = !eligible(day);
            button.setAttribute('aria-pressed', String(day === date.value));
            button.setAttribute('aria-label', new Intl.DateTimeFormat('en-GB',{ dateStyle:'full',timeZone:'UTC' }).format(new Date(day + 'T12:00:00Z')));
            if (day === date.min) button.setAttribute('aria-current', 'date');
            button.addEventListener('click', () => { date.value = day; renderCalendar(); load(); days.querySelector(`[data-date="${day}"]`)?.focus({preventScroll:true}); });
            days.append(button);
        }
        root.querySelector('[data-month-prev]').disabled = month <= date.min.slice(0,7);
        root.querySelector('[data-month-next]').disabled = !date.max || month >= date.max.slice(0,7);
        root.querySelector('#booking-chosen-day').textContent = date.value ? new Intl.DateTimeFormat('en-GB',{ month:'short',day:'numeric',timeZone:'UTC' }).format(new Date(date.value + 'T12:00:00Z')) : 'Choose a day';
    }
    function showDateStep() {
        dateStep.hidden = false; detailsStep.hidden = true; contactFields.disabled = true;
    }
    function showDetailsStep() {
        if (!chosen || busy) return;
        dateStep.hidden = true; detailsStep.hidden = false; contactFields.hidden = Boolean(management); contactFields.disabled = Boolean(management);
        detailsStep.querySelector('h3').textContent = management ? 'Confirm your new time' : 'Your details';
        (management ? submit : contactFields.querySelector('input[name="name"]')).focus({preventScroll:true});
    }
    for (const [selector,delta] of [['[data-month-prev]',-1],['[data-month-next]',1]]) root.querySelector(selector).addEventListener('click',()=>{
        const next = new Date(month+'-01T12:00:00Z'); next.setUTCMonth(next.getUTCMonth()+delta); month=next.toISOString().slice(0,7);
        date.value = ''; requestVersion++; slots.removeAttribute('aria-busy'); renderSlots([]); status.textContent = 'Choose a date to see available times.'; renderCalendar();
    });
    days.addEventListener('keydown', event => {
        if (!event.target.matches('button')) return;
        const offset = {ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[event.key];
        if (!offset) return;
        event.preventDefault();
        let target = new Date(event.target.dataset.date+'T12:00:00Z');
        for (let i=0;i<31;i++) { target.setUTCDate(target.getUTCDate()+offset); const day=target.toISOString().slice(0,10); if(day.slice(0,7)!==month)break; const button=days.querySelector(`[data-date="${day}"]`); if(button&&!button.disabled){button.focus();break;} }
    });
    continueButton.addEventListener('click',showDetailsStep);
    root.querySelector('[data-booking-back]').addEventListener('click',()=>{showDateStep(); days.querySelector('[aria-pressed="true"]')?.focus({preventScroll:true});});
    renderCalendar();
    async function api(action, body, query = '') {
        if (!base) throw new Error('Booking is not available yet. Please email the studio.');
        const response = await fetch(`${base}/api/bookings?action=${action}${query}`, {
            method: body ? 'POST' : 'GET', cache: 'no-store', ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(45000)
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) { const e = new Error(data.message || 'The calendar could not load. Please try again.'); e.status = response.status; throw e; }
        return data;
    }
    function describe(start, end) {
        const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: zone.value, dateStyle: 'medium', timeStyle: 'short' });
        return `${fmt.format(new Date(start))}–${new Intl.DateTimeFormat('en-GB', { timeZone: zone.value, timeStyle: 'short' }).format(new Date(end))} (${zone.value})`;
    }
    function renderSlots(items) {
        chosen = ''; submit.disabled = true; continueButton.disabled = true; summary.textContent = 'Choose an available time to continue.';
        slots.replaceChildren();
        for (const slot of items) {
            const button = document.createElement('button'); button.type = 'button'; button.className = 'booking-slot';
            button.textContent = new Intl.DateTimeFormat('en-GB', { timeZone: zone.value, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(slot.start));
            button.setAttribute('aria-label', describe(slot.start, slot.end)); button.setAttribute('aria-pressed', 'false');
            button.addEventListener('click', () => {
                chosen = slot.start; requestId = crypto.randomUUID();
                slots.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
                summary.textContent = describe(slot.start, slot.end); submit.disabled = false; continueButton.disabled = false;
            }); slots.append(button);
        }
    }
    async function load() {
        const version = ++requestVersion;
        if (!date.value) return;
        status.textContent = 'Checking available times…'; slots.setAttribute('aria-busy', 'true');
        renderSlots([]);
        try {
            const data = await api('availability', null, '&date=' + encodeURIComponent(date.value));
            if (version !== requestVersion) return;
            settings = data.settings;
            date.max = new Date(Date.parse(date.min) + settings.horizonDays * 86400000).toISOString().slice(0, 10);
            root.querySelector('#booking-duration').textContent = `${settings.duration} minutes`;
            root.querySelector('#booking-hours').textContent = `Calendar dates follow Hungary time. Times above use your selected time zone.`;
            root.querySelector('#booking-preview-note').hidden = !data.preview;
            if (!initialDateResolved) {
                initialDateResolved = true;
                if (!eligible(date.value)) {
                    let candidate = date.min;
                    while (candidate <= date.max && !eligible(candidate)) candidate = new Date(Date.parse(candidate)+86400000).toISOString().slice(0,10);
                    if (candidate <= date.max) { date.value = candidate; month = candidate.slice(0,7); renderCalendar(); return load(); }
                }
            }
            renderCalendar();
            renderSlots(data.slots);
            status.textContent = data.slots.length ? `${data.slots.length} available times.` : 'No times available on this date. Please choose another day.';
        } catch (error) { if (version === requestVersion) { status.textContent = error.message; renderCalendar(); } }
        finally { if (version === requestVersion) slots.removeAttribute('aria-busy'); }
    }
    function showResult(data) {
        status.textContent = '';
        management = { id: data.id, manageToken: data.manageToken }; form.hidden = true; result.hidden = false;
        result.innerHTML = `<span class="booking-step">${data.preview ? 'LOCAL PREVIEW' : 'YOUR BOOKING'}</span><h3>${data.status === 'cancelled' ? 'Your call is cancelled.' : 'Your time is reserved.'}</h3><p>${escape(describe(data.start, data.end))}</p>
            <p>${data.preview ? 'This is a local test. No email or real Zoom meeting was created.' : data.delivery === 'sent' ? 'Your confirmation was sent by email.' : 'Email confirmation has not been sent. Save the booking link below; the studio can see your reservation.'}</p>
            ${data.joinUrl && data.status !== 'cancelled' ? `<a class="booking-button" href="${escape(data.joinUrl)}" target="_blank" rel="noopener noreferrer">Join Zoom meeting ↗</a>` : data.status !== 'cancelled' ? '<p>Your meeting link is not ready yet. The studio will arrange it with you.</p>' : ''}
            <div class="booking-result-actions"><button type="button" data-copy-booking>Copy booking link</button>${data.status !== 'cancelled' ? '<button type="button" data-booking-calendar>Add to calendar</button><button type="button" data-booking-reschedule>Change time</button><button type="button" data-booking-cancel>Cancel booking</button>' : ''}</div><p data-result-status role="status"></p>`;
        result.focus({ preventScroll: true });
        const link = `${location.origin}${location.pathname}#booking=${data.id}.${data.manageToken}`;
        result.querySelector('[data-copy-booking]').addEventListener('click', async () => {
            try { await navigator.clipboard.writeText(link); result.querySelector('[data-result-status]').textContent = 'Booking link copied. Keep it private; it allows changes to your booking.'; }
            catch { result.querySelector('[data-result-status]').textContent = 'Save this private booking link: ' + link; }
        });
        result.querySelector('[data-booking-calendar]')?.addEventListener('click', () => {
            const stamp = value => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
            const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//The Creative Bunch//Bookings//EN','BEGIN:VEVENT',`UID:${data.id}@thecreativebunch`, `DTSTAMP:${stamp(Date.now())}`, `DTSTART:${stamp(data.start)}`, `DTEND:${stamp(data.end)}`, 'SUMMARY:Studio call with The Creative Bunch', `URL:${data.joinUrl || link}`, 'END:VEVENT','END:VCALENDAR',''].join('\r\n');
            const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); const a = document.createElement('a'); a.href = url; a.download = 'studio-call.ics'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
        });
        result.querySelector('[data-booking-cancel]')?.addEventListener('click', async () => {
            if (busy || !confirm('Cancel this booking? The time will become available to other visitors.')) return;
            busy = true;
            try { showResult(await api('cancel', management)); } catch (e) { result.querySelector('[data-result-status]').textContent = e.message; } finally { busy = false; }
        });
        result.querySelector('[data-booking-reschedule]')?.addEventListener('click', () => {
            result.hidden = true; form.hidden = false;
            showDateStep(); contactFields.hidden = true;
            submit.textContent = 'Confirm new time';
            if (!date.value) date.value = date.min;
            load();
        });
    }
    date.addEventListener('change', load); zone.addEventListener('change', load);
    root.querySelector('[data-booking-refresh]').addEventListener('click', () => {
        if (!date.value) {
            const candidate = [...days.querySelectorAll('button')].find(button => !button.disabled);
            if (!candidate) { status.textContent = 'No bookable dates in this month. Please choose another month.'; return; }
            date.value = candidate.dataset.date;
            renderCalendar();
        }
        load();
    });
    form.addEventListener('submit', async event => {
        event.preventDefault(); if (busy || !chosen) return;
        busy = true; submit.disabled = true; status.textContent = 'Reserving your time…';
        try {
            const fields = Object.fromEntries(new FormData(form));
            const body = management ? { ...management, start: chosen } : { ...fields, start: chosen, timezone: zone.value, requestId, privacy: fields.privacy === 'on' };
            showResult(await api(management ? 'reschedule' : 'book', body));
        } catch (error) { status.textContent = error.message; if (error.status === 409) { chosen = ''; requestId = crypto.randomUUID(); showDateStep(); await load(); status.textContent = error.message; } }
        finally { busy = false; submit.disabled = !chosen; }
    });
    async function openManagement() {
        const match = location.hash.match(/^#booking=([a-zA-Z0-9-]+)\.([a-zA-Z0-9_-]+)$/);
        if (!match) return false;
        root.scrollIntoView({ behavior: 'smooth', block: 'start' });
        try { showResult(await api('manage', { id: match[1], manageToken: match[2] })); }
        catch (error) { status.textContent = error.message; }
        return true;
    }
    window.addEventListener('hashchange', openManagement);
    openManagement().then(managed => { if (!managed) load(); });
})();
