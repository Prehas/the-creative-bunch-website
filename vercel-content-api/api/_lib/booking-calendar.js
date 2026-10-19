import { createHash } from 'node:crypto';

const utc = value => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
const escapeIcs = value => String(value ?? '').replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
export const calendarEventId = booking => 'tcb' + createHash('sha256').update(String(booking.id)).digest('hex');

function safeZoom(value) {
    try {
        const url = new URL(value);
        return url.protocol === 'https:' && /(^|\.)zoom\.us$/i.test(url.hostname) && !url.username && !url.password ? url.href : '';
    } catch { return ''; }
}

// RFC 5545: physical lines must not exceed 75 UTF-8 octets, including continuation space.
function foldLine(value) {
    const lines = []; let line = '';
    for (const character of value) {
        if (Buffer.byteLength(line + character, 'utf8') > 75) { lines.push(line); line = ' '; }
        line += character;
    }
    return [...lines, line].join('\r\n');
}

/** Optional client-owned calendar copy. It is not an automatic invitation. */
export function bookingCalendar({ booking, joinUrl }) {
    const cancelled = booking.status === 'cancelled';
    const zoom = cancelled ? '' : safeZoom(joinUrl);
    const title = 'Studio call with The Creative Bunch';
    const details = ['A conversation about your next creative project.', zoom ? `Join Zoom: ${zoom}` : '',
        'Booking changes are managed through your studio booking email.'].filter(Boolean).join('\n\n');
    const parameters = new URLSearchParams({ action: 'TEMPLATE', text: title,
        dates: `${utc(booking.start)}/${utc(booking.end)}`, ctz: booking.timezone || 'Europe/Budapest', details, location: zoom || 'Online via Zoom' });
    const googleUrl = cancelled ? '' : `https://calendar.google.com/calendar/render?${parameters}`;
    const sequence = Number.isSafeInteger(booking.revision) && booking.revision >= 0 ? booking.revision : 0;
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//The Creative Bunch//Studio Bookings//EN',
        'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
        `UID:${calendarEventId(booking)}@thecreativebunch.eu`, `SEQUENCE:${sequence}`,
        `DTSTAMP:${utc(booking.updatedAt || booking.createdAt || new Date())}`,
        `DTSTART:${utc(booking.start)}`, `DTEND:${utc(booking.end)}`, `SUMMARY:${escapeIcs(title)}`,
        `STATUS:${cancelled ? 'CANCELLED' : 'CONFIRMED'}`, 'CLASS:PRIVATE', 'TRANSP:OPAQUE',
        `DESCRIPTION:${escapeIcs(cancelled ? 'This studio call has been cancelled. Remove any copy you saved in your calendar.' : details)}`,
        ...(cancelled ? [] : [`LOCATION:${escapeIcs(zoom || 'Online via Zoom')}`]), 'END:VEVENT', 'END:VCALENDAR'];
    return { googleUrl, filename: cancelled ? 'studio-call-cancelled.ics' : 'studio-call.ics',
        content: lines.map(foldLine).join('\r\n') + '\r\n' };
}
