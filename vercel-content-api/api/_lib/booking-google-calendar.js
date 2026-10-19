import { calendarEventId } from './booking-calendar.js';

const GOOGLE_API = 'https://www.googleapis.com/calendar/v3/calendars/';
const descriptionText = value => String(value ?? '').replace(/[&<>]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[character]);
export function googleCalendarConfigured(env = process.env) {
    return Boolean(env.GOOGLE_CALENDAR_CLIENT_ID && env.GOOGLE_CALENDAR_CLIENT_SECRET && env.GOOGLE_CALENDAR_REFRESH_TOKEN && env.GOOGLE_CALENDAR_ID);
}

/** Only writes the studio's own private event; no attendees or extra Google emails. */
export async function syncGoogleCalendar(booking, env = process.env) {
    if (!googleCalendarConfigured(env)) return { calendarSync: 'not-configured', calendarMessage: '' };
    const calendarId = env.GOOGLE_CALENDAR_ID;
    if (booking.googleCalendarId && booking.googleCalendarId !== calendarId) {
        return { calendarSync: 'failed', calendarMessage: 'Calendar changed. Review the existing event before syncing to another calendar.' };
    }
    const eventId = calendarEventId(booking);
    const patch = { googleCalendarId: calendarId, googleCalendarEventId: eventId };
    try {
        const auth = await fetch('https://oauth2.googleapis.com/token', { method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ client_id: env.GOOGLE_CALENDAR_CLIENT_ID, client_secret: env.GOOGLE_CALENDAR_CLIENT_SECRET,
                refresh_token: env.GOOGLE_CALENDAR_REFRESH_TOKEN, grant_type: 'refresh_token' }), signal: AbortSignal.timeout(8000) });
        if (!auth.ok) throw new Error('Google authorization failed. Reconnect the studio calendar.');
        const { access_token } = await auth.json();
        if (!access_token) throw new Error('Google authorization failed. Reconnect the studio calendar.');
        const headers = { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' };
        const collection = GOOGLE_API + encodeURIComponent(calendarId) + '/events';
        const item = `${collection}/${eventId}`;
        const existing = await fetch(item, { headers, signal: AbortSignal.timeout(8000) });
        const missing = existing.status === 404 || existing.status === 410;
        if (!missing && !existing.ok) throw new Error(`Google Calendar returned ${existing.status}. Retry calendar sync.`);
        const current = existing.ok ? await existing.json() : null;
        const ownDeletedEvent = booking.status === 'cancelled' && current?.status === 'cancelled' && current.id === eventId && booking.googleCalendarEventId === eventId;
        if (current && !ownDeletedEvent && current.extendedProperties?.private?.tcbBookingId !== booking.id) {
            throw new Error('The calendar event does not match this booking. Review it before syncing.');
        }
        if (booking.status === 'cancelled') {
            if (!missing && current.status !== 'cancelled') {
                const result = await fetch(`${item}?sendUpdates=none`, { method: 'DELETE',
                    headers: { ...headers, ...(current.etag ? { 'If-Match': current.etag } : {}) }, signal: AbortSignal.timeout(8000) });
                if (!result.ok && ![404, 410].includes(result.status)) throw new Error(`Google Calendar returned ${result.status}. Retry calendar sync.`);
            }
        } else {
            if (current?.status === 'cancelled') throw new Error('This event was deleted in Google Calendar. Review it before restoring the booking.');
            const event = { summary: `Studio call · ${booking.name || 'Client'}`,
                description: [`Client: ${booking.name || ''}`, `Email: ${booking.email || ''}`, `Service: ${booking.service || ''}`,
                    booking.joinUrl ? `Join Zoom: ${booking.joinUrl}` : '', `Booking reference: ${booking.id}`].filter(Boolean).map(descriptionText).join('\n'),
                location: booking.joinUrl || 'Online via Zoom', visibility: 'private',
                start: { dateTime: booking.start, timeZone: 'Europe/Budapest' }, end: { dateTime: booking.end, timeZone: 'Europe/Budapest' },
                extendedProperties: { private: { tcbBookingId: booking.id, tcbRevision: String(booking.revision) } } };
            const result = await fetch(`${missing ? collection : item}?sendUpdates=none`, { method: missing ? 'POST' : 'PATCH',
                headers: { ...headers, ...(!missing && current.etag ? { 'If-Match': current.etag } : {}) },
                body: JSON.stringify({ ...event, ...(missing ? { id: eventId } : {}) }), signal: AbortSignal.timeout(8000) });
            if (!result.ok) throw new Error(`Google Calendar returned ${result.status}. Retry calendar sync.`);
        }
        return { ...patch, calendarSync: 'ready', calendarRevision: booking.revision, calendarMessage: '' };
    } catch (error) {
        // Fixed messages only; never include provider payloads, tokens or guest details in errors.
        const message = /^(Google |The calendar event |This event )/.test(error.message || '') ? error.message : 'Google Calendar did not confirm the result. Retry calendar sync; the same event ID will be reused.';
        return { ...patch, calendarSync: 'failed', calendarMessage: message };
    }
}
