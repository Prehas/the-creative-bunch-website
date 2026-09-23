const ZOOM_API = 'https://api.zoom.us/v2';
export function integrationStatus(env = process.env) {
    return {
        zoom: Boolean(env.ZOOM_ACCOUNT_ID && env.ZOOM_CLIENT_ID && env.ZOOM_CLIENT_SECRET && env.ZOOM_HOST_ID),
        email: Boolean(env.RESEND_API_KEY && env.BOOKING_EMAIL_FROM && env.BOOKING_NOTIFY_EMAIL),
        storage: Boolean(env.BOOKING_SUPABASE_URL && env.BOOKING_SUPABASE_SECRET_KEY)
    };
}
async function zoomToken(env) {
    const response = await fetch('https://zoom.us/oauth/token', {
        method: 'POST', headers: { Authorization: 'Basic ' + Buffer.from(`${env.ZOOM_CLIENT_ID}:${env.ZOOM_CLIENT_SECRET}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ grant_type: 'account_credentials', account_id: env.ZOOM_ACCOUNT_ID }), signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error('Zoom authentication failed. Check the account configuration.');
    return (await response.json()).access_token;
}
export function createIntegrations(env = process.env) {
    return async (booking, manageToken) => {
        const status = integrationStatus(env);
        const patch = {};
        if (!status.zoom) return { integration: 'not-configured', delivery: 'not-configured', integrationMessage: 'Connect a Zoom account and email service to send the meeting invitation.' };
        if (booking.integration === 'review') return { integration: 'review', delivery: booking.delivery, integrationMessage: 'Review the Zoom account for an existing meeting before taking any further action.' };
        let token;
        try { token = await zoomToken(env); }
        catch { return { integration: 'failed', delivery: booking.delivery, integrationMessage: 'Zoom authentication failed. Check the connection and retry.' }; }
        const meeting = { topic: `The Creative Bunch · ${booking.id.slice(0, 8)}`, type: 2, start_time: booking.start,
            duration: Math.round((Date.parse(booking.end) - Date.parse(booking.start)) / 60000), timezone: 'Europe/Budapest',
            settings: { waiting_room: true, join_before_host: false, meeting_authentication: false, auto_recording: 'none' } };
        if (booking.integration !== 'ready') {
            const cancelling = booking.status === 'cancelled';
            if (!cancelling || booking.zoomId) {
                const method = cancelling ? 'DELETE' : booking.zoomId ? 'PATCH' : 'POST';
                const url = booking.zoomId ? `${ZOOM_API}/meetings/${encodeURIComponent(booking.zoomId)}` : `${ZOOM_API}/users/${encodeURIComponent(env.ZOOM_HOST_ID)}/meetings`;
                let response;
                try {
                    response = await fetch(url, { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                        ...(method !== 'DELETE' ? { body: JSON.stringify(meeting) } : {}), signal: AbortSignal.timeout(10000) });
                } catch {
                    return { integration: 'review', delivery: booking.delivery, integrationMessage: 'Zoom did not return a result. Check Zoom before creating another meeting.' };
                }
                if (!response.ok && !(cancelling && response.status === 404)) {
                    return { integration: method === 'POST' && response.status >= 500 ? 'review' : 'failed', delivery: booking.delivery,
                        integrationMessage: `Zoom returned ${response.status}. Check the connection in Zoom.` };
                }
                if (method === 'POST') {
                    const data = await response.json();
                    if (!data.id || !/^https:\/\/[a-z0-9.-]*zoom\.us\//i.test(data.join_url || '')) return { integration: 'review', delivery: 'pending', integrationMessage: 'Zoom response needs review.' };
                    // Never persist or send Zoom's host start_url to visitors.
                    patch.zoomId = String(data.id); patch.joinUrl = data.join_url;
                }
            }
            patch.integration = 'ready'; patch.integrationMessage = '';
        }
        if (!status.email) return { ...patch, delivery: 'not-configured', integrationMessage: 'Email service is not connected. The Zoom meeting is saved.' };
        if (/resend\.dev>?$/i.test(env.BOOKING_EMAIL_FROM.trim()) && booking.email.toLowerCase() !== env.BOOKING_NOTIFY_EMAIL.toLowerCase()) {
            return { ...patch, delivery: 'not-configured', integrationMessage: 'Email is in studio-only test mode until a sending domain is verified.' };
        }
        if (booking.delivery === 'sent') return patch;
        const key = `${booking.id}-${booking.revision}`;
        const label = booking.status === 'cancelled' ? 'cancelled' : booking.action === 'reschedule' ? 'rescheduled' : 'confirmed';
        const when = new Intl.DateTimeFormat('en-GB', { timeZone: booking.timezone, dateStyle: 'full', timeStyle: 'short' }).format(new Date(booking.start));
        const base = (env.BOOKING_SITE_URL || 'https://the-creative-bunch-website.vercel.app').replace(/\/$/, '');
        const manage = `${base}/#booking=${booking.id}.${manageToken}`;
        const text = `Your meeting with The Creative Bunch is ${label}.\n\n${when} (${booking.timezone})\n${booking.status !== 'cancelled' ? `Join: ${patch.joinUrl || booking.joinUrl}\nManage booking: ${manage}\n` : ''}\nBooking reference: ${booking.id}\n`;
        // A stored first attempt bounds safe retries to the provider's 24-hour deduplication window.
        const attemptAt = booking.emailAttemptAt || new Date().toISOString();
        if (booking.emailAttemptAt && Date.now() - Date.parse(booking.emailAttemptAt) >= 23 * 3600000) return { ...patch, delivery: 'review', integrationMessage: 'Email delivery is uncertain and the retry window expired. Check Resend before sending again.' };
        try {
            const result = await fetch('https://api.resend.com/emails', {
                method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `tcb-booking-${key}` },
                body: JSON.stringify({ from: env.BOOKING_EMAIL_FROM, to: [booking.email], bcc: [env.BOOKING_NOTIFY_EMAIL],
                    reply_to: env.BOOKING_NOTIFY_EMAIL, subject: `Your studio call is ${label}`, text }), signal: AbortSignal.timeout(10000)
            });
            return { ...patch, emailAttemptAt: attemptAt, delivery: result.ok ? 'sent' : 'failed', integrationMessage: result.ok ? '' : `Email returned ${result.status}. Check the sender and retry.` };
        } catch { return { ...patch, emailAttemptAt: attemptAt, delivery: 'failed', integrationMessage: 'Email delivery is not confirmed. Retry after checking the email service.' }; }
    };
}

