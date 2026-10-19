import { createHash } from 'node:crypto';
import { renderBookingEmail } from './booking-email.js';
import { googleCalendarConfigured, syncGoogleCalendar } from './booking-google-calendar.js';
const ZOOM_API = 'https://api.zoom.us/v2';
export function integrationStatus(env = process.env) {
    return {
        zoom: Boolean(env.ZOOM_ACCOUNT_ID && env.ZOOM_CLIENT_ID && env.ZOOM_CLIENT_SECRET && env.ZOOM_HOST_ID),
        email: Boolean((env.BOOKING_EMAIL_PROVIDER === 'brevo' ? env.BREVO_API_KEY : env.RESEND_API_KEY) && env.BOOKING_EMAIL_FROM && env.BOOKING_NOTIFY_EMAIL),
        storage: Boolean(env.BOOKING_SUPABASE_URL && env.BOOKING_SUPABASE_SECRET_KEY),
        googleCalendar: googleCalendarConfigured(env)
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
        Object.assign(patch, await syncGoogleCalendar({ ...booking, ...patch }, env));
        if (!status.email) return { ...patch, delivery: 'not-configured', integrationMessage: 'Email service is not connected. The Zoom meeting is saved.' };
        const brevo = env.BOOKING_EMAIL_PROVIDER === 'brevo';
        if (!brevo && /resend\.dev>?$/i.test(env.BOOKING_EMAIL_FROM.trim()) && booking.email.toLowerCase() !== env.BOOKING_NOTIFY_EMAIL.toLowerCase()) {
            return { ...patch, delivery: 'not-configured', integrationMessage: 'Email is in studio-only test mode until a sending domain is verified.' };
        }
        if (booking.delivery === 'sent') return patch;
        const key = `${booking.id}-${booking.revision}`;
        const base = (env.BOOKING_SITE_URL || 'https://the-creative-bunch-website.vercel.app').replace(/\/$/, '');
        const manage = `${base}/#booking=${booking.id}.${manageToken}`;
        const email = renderBookingEmail({ booking, manageUrl: manage, joinUrl: patch.joinUrl || booking.joinUrl,
            siteUrl: base, replyEmail: env.BOOKING_NOTIFY_EMAIL });
        // A stored first attempt bounds safe retries to the provider's 24-hour deduplication window.
        const attemptAt = booking.emailAttemptAt || new Date().toISOString();
        const retryWindow = brevo ? 10 * 60000 : 23 * 3600000;
        if (booking.emailAttemptAt && Date.now() - Date.parse(booking.emailAttemptAt) >= retryWindow) return { ...patch, delivery: 'review', integrationMessage: 'Email delivery is uncertain and the retry window expired. Check the email provider before sending again.' };
        try {
            if (brevo) {
                const sender = env.BOOKING_EMAIL_FROM.match(/^(.*?)\s*<([^>]+)>$/);
                const hash = createHash('sha256').update(`tcb-booking-${key}`).digest('hex');
                const idempotencyKey = `${hash.slice(0,8)}-${hash.slice(8,12)}-4${hash.slice(13,16)}-a${hash.slice(17,20)}-${hash.slice(20,32)}`;
                const result = await fetch('https://api.brevo.com/v3/smtp/email', {
                    method: 'POST', headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
                    body: JSON.stringify({ sender: { name: sender?.[1].trim() || 'The Creative Bunch', email: sender?.[2] || env.BOOKING_EMAIL_FROM.trim() },
                        to: [{ email: booking.email }], ...(booking.email.toLowerCase() !== env.BOOKING_NOTIFY_EMAIL.toLowerCase() ? { bcc: [{ email: env.BOOKING_NOTIFY_EMAIL }] } : {}),
                        replyTo: { email: env.BOOKING_NOTIFY_EMAIL }, subject: email.subject, textContent: email.text, htmlContent: email.html,
                        attachment: [{ name: email.calendar.filename, content: Buffer.from(email.calendar.content).toString('base64') }], headers: { idempotencyKey } }),
                    signal: AbortSignal.timeout(10000)
                });
                const data = await result.json().catch(() => ({}));
                if (result.ok && data.messageId) return { ...patch, emailAttemptAt: attemptAt, delivery: 'sent', integrationMessage: '' };
                return { ...patch, emailAttemptAt: attemptAt, delivery: result.status >= 500 || result.ok ? 'review' : 'failed', integrationMessage: `Brevo returned ${result.status}. Check email logs before retrying.` };
            }
            const result = await fetch('https://api.resend.com/emails', {
                method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `tcb-booking-${key}` },
                body: JSON.stringify({ from: env.BOOKING_EMAIL_FROM, to: [booking.email], bcc: [env.BOOKING_NOTIFY_EMAIL],
                    reply_to: env.BOOKING_NOTIFY_EMAIL, subject: email.subject, text: email.text, html: email.html,
                    attachments: [{ filename: email.calendar.filename, content: Buffer.from(email.calendar.content).toString('base64') }] }), signal: AbortSignal.timeout(10000)
            });
            return { ...patch, emailAttemptAt: attemptAt, delivery: result.ok ? 'sent' : 'failed', integrationMessage: result.ok ? '' : `Email returned ${result.status}. Check the sender and retry.` };
        } catch { return { ...patch, emailAttemptAt: attemptAt, delivery: brevo ? 'review' : 'failed', integrationMessage: 'Email delivery is not confirmed. Retry after checking the email service.' }; }
    };
}

