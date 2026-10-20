import { googleCalendarConfigured } from './booking-google-calendar.js';
import { calendarEventId } from './booking-calendar.js';
import { BookingError } from './booking-store.js';

// Google all-day dates are local calendar midnights, not UTC midnights.
export function calendarMidnight(date, timeZone) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new Error('Invalid calendar date');
    const target = Date.parse(date + 'T00:00:00Z');
    if (!Number.isFinite(target) || new Date(target).toISOString().slice(0, 10) !== date) throw new Error('Invalid calendar date');
    const formatter = new Intl.DateTimeFormat('en-GB', { timeZone, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hourCycle:'h23' });
    let instant = target;
    for (let i = 0; i < 4; i++) {
        const parts = Object.fromEntries(formatter.formatToParts(new Date(instant)).map(part => [part.type, part.value]));
        const wall = Date.parse(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`);
        if (wall === target) return instant;
        instant += target - wall;
    }
    throw new Error('Calendar date could not be resolved');
}
function eventTime(value, timeZone) {
    if (value?.dateTime) {
        if (!/(Z|[+-]\d{2}:\d{2})$/.test(value.dateTime)) throw new Error('Calendar offset missing');
        const time = Date.parse(value.dateTime);
        if (!Number.isFinite(time)) throw new Error('Invalid calendar time');
        return time;
    }
    return calendarMidnight(value?.date, value?.timeZone || timeZone);
}

/** Reads timing fields only, returns bookable slots only. Nothing is persisted. */
export function createCalendarAvailability(env = process.env) {
    return async ({ slots, buffer, excludeBooking = null }) => {
        if (!slots.length || !googleCalendarConfigured(env)) return slots;
        const padding = buffer * 60000;
        const timeMin = new Date(Math.min(...slots.map(slot => Date.parse(slot.start))) - padding).toISOString();
        const timeMax = new Date(Math.max(...slots.map(slot => Date.parse(slot.end))) + padding).toISOString();
        const signal = AbortSignal.timeout(12000);
        try {
            const auth = await fetch('https://oauth2.googleapis.com/token', { method:'POST',
                headers:{'Content-Type':'application/x-www-form-urlencoded'}, signal, cache:'no-store',
                body:new URLSearchParams({client_id:env.GOOGLE_CALENDAR_CLIENT_ID,client_secret:env.GOOGLE_CALENDAR_CLIENT_SECRET,
                    refresh_token:env.GOOGLE_CALENDAR_REFRESH_TOKEN,grant_type:'refresh_token'}) });
            if (!auth.ok) throw new Error('Calendar authentication failed');
            const {access_token} = await auth.json();
            if (!access_token) throw new Error('Calendar authentication failed');
            const busy = [];
            let pageToken = '';
            for (let page = 0; page < 10; page++) {
                const query = new URLSearchParams({timeMin,timeMax,singleEvents:'true',showDeleted:'false',maxResults:'250',maxAttendees:'1',
                    fields:'nextPageToken,timeZone,items(id,status,start,end,transparency,eventType,attendees(self,responseStatus),extendedProperties(private(tcbBookingId)))',
                    ...(pageToken ? {pageToken} : {})});
                const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(env.GOOGLE_CALENDAR_ID)}/events?${query}`, {
                    headers:{Authorization:`Bearer ${access_token}`},signal,cache:'no-store'});
                if (!response.ok) throw new Error('Calendar unavailable');
                const data = await response.json();
                if (!Array.isArray(data.items)) throw new Error('Calendar response incomplete');
                for (const event of data.items) {
                    if (event.status === 'cancelled' || event.transparency === 'transparent' || event.eventType === 'workingLocation' ||
                        event.attendees?.some(attendee => attendee.self && attendee.responseStatus === 'declined')) continue;
                    // Ignore only this booking's own authenticated event on reschedule.
                    if (excludeBooking?.googleCalendarId === env.GOOGLE_CALENDAR_ID && event.id === calendarEventId(excludeBooking) &&
                        event.extendedProperties?.private?.tcbBookingId === excludeBooking.id) continue;
                    const zone = data.timeZone || 'Europe/Budapest';
                    const start = eventTime(event.start, zone), end = eventTime(event.end, zone);
                    if (end <= start) throw new Error('Invalid calendar interval');
                    busy.push({start,end});
                }
                pageToken = data.nextPageToken || '';
                if (!pageToken) return slots.filter(slot => !busy.some(event =>
                    Date.parse(slot.start) < event.end + padding && Date.parse(slot.end) + padding > event.start));
            }
            throw new Error('Calendar response exceeded the safe limit');
        } catch {
            // Fail closed: an outage must never advertise unverified times as free.
            throw new BookingError(503, 'We could not verify the studio calendar. Please refresh the times or contact the studio.');
        }
    };
}
