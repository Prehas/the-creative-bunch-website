import { randomUUID, createHmac, timingSafeEqual } from 'node:crypto';
import { BookingError } from './booking-store.js';

export const DEFAULT_BOOKING_SETTINGS = {
    enabled: true, timezone: 'Europe/Budapest', weekdays: [1, 2, 3, 4, 5],
    start: '10:00', end: '17:00', duration: 30, buffer: 15, noticeHours: 24, horizonDays: 60, blockedDates: []
};
const formatters = new Map();
function localParts(date, timezone) {
    if (!formatters.has(timezone)) formatters.set(timezone, new Intl.DateTimeFormat('en-GB', {
        timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }));
    return Object.fromEntries(formatters.get(timezone).formatToParts(date).map(p => [p.type, p.value]));
}
export function localDate(date, timezone) {
    const p = localParts(date, timezone); return `${p.year}-${p.month}-${p.day}`;
}
function minuteOfDay(time) { const [h, m] = time.split(':').map(Number); return h * 60 + m; }
function validDate(value) {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().startsWith(value);
}
export function validateSettings(input) {
    const s = { ...DEFAULT_BOOKING_SETTINGS, ...input };
    if (typeof s.enabled !== 'boolean' || s.timezone !== 'Europe/Budapest') throw new BookingError(400, 'Use the Europe/Budapest time zone.');
    if (!Array.isArray(s.weekdays) || !s.weekdays.length || s.weekdays.some(d => !Number.isInteger(d) || d < 0 || d > 6)) throw new BookingError(400, 'Choose at least one valid weekday.');
    for (const name of ['start', 'end']) if (typeof s[name] !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(s[name])) throw new BookingError(400, 'Enter a valid opening and closing time.');
    for (const [key, min, max] of [['duration', 15, 120], ['buffer', 0, 60], ['noticeHours', 1, 168], ['horizonDays', 1, 90]]) {
        if (!Number.isInteger(s[key]) || s[key] < min || s[key] > max) throw new BookingError(400, `Invalid ${key}.`);
    }
    if (minuteOfDay(s.start) + s.duration > minuteOfDay(s.end)) throw new BookingError(400, 'Opening hours must allow at least one appointment.');
    if (!Array.isArray(s.blockedDates) || s.blockedDates.length > 180 || s.blockedDates.some(d => !validDate(d))) throw new BookingError(400, 'Use YYYY-MM-DD for closed dates.');
    return Object.fromEntries(Object.keys(DEFAULT_BOOKING_SETTINGS).map(key => [key, s[key]]));
}
function overlaps(start, end, b) {
    return b.status !== 'cancelled' && start < Date.parse(b.end) + b.buffer * 60000 && end > Date.parse(b.start);
}
export function availableSlots(state, date, now = Date.now(), excludeId = '') {
    if (!validDate(date)) throw new BookingError(400, 'Choose a valid date.');
    const s = state.settings;
    if (!s.enabled || s.blockedDates.includes(date) || !s.weekdays.includes(new Date(date + 'T12:00:00Z').getUTCDay())) return [];
    const first = Date.parse(date + 'T00:00:00Z') - 14 * 3600000;
    const today = localDate(new Date(now), s.timezone);
    const horizon = new Date(Date.parse(today) + s.horizonDays * 86400000).toISOString().slice(0, 10);
    if (date < today || date > horizon) return [];
    const slots = [];
    // Iterate UTC minutes so ambiguous / missing daylight-saving times stay correct.
    for (let t = first; t < first + 48 * 3600000; t += 60000) {
        if (t < now + s.noticeHours * 3600000) continue;
        const p = localParts(new Date(t), s.timezone);
        if (`${p.year}-${p.month}-${p.day}` !== date) continue;
        const minute = Number(p.hour) * 60 + Number(p.minute);
        if (minute < minuteOfDay(s.start) || minute + s.duration > minuteOfDay(s.end) || (minute - minuteOfDay(s.start)) % (s.duration + s.buffer)) continue;
        const end = t + (s.duration + s.buffer) * 60000;
        if (state.bookings.some(b => b.id !== excludeId && overlaps(t, end, b))) continue;
        slots.push({ start: new Date(t).toISOString(), end: new Date(t + s.duration * 60000).toISOString() });
    }
    return slots;
}
export function validateGuest(input) {
    const guest = {};
    for (const [field, max] of [['name', 100], ['email', 254], ['notes', 1200], ['service', 100], ['timezone', 80]]) {
        if (input[field] != null && typeof input[field] !== 'string') throw new BookingError(400, 'Invalid contact details.');
        guest[field] = String(input[field] || '').trim();
        if (guest[field].length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(guest[field])) throw new BookingError(400, 'Please shorten your contact details.');
    }
    guest.email = guest.email.toLowerCase();
    if (!guest.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email) || input.privacy !== true || input.website) throw new BookingError(400, 'Enter your name and email and acknowledge the booking privacy notice.');
    try { new Intl.DateTimeFormat('en', { timeZone: guest.timezone }); } catch { throw new BookingError(400, 'Choose a valid time zone.'); }
    return guest;
}
export class BookingService {
    constructor(store, { secret, now = () => Date.now(), integrations = null, preview = false } = {}) {
        this.store = store; this.secret = secret; this.now = now; this.integrations = integrations; this.preview = preview;
    }
    async read() { return await this.store.read() || { version: 0, settings: structuredClone(DEFAULT_BOOKING_SETTINGS), bookings: [] }; }
    async mutate(fn) {
        for (let attempt = 0; attempt < 15; attempt++) {
            const state = await this.read(); const version = state.version;
            // Retain operational booking records for 180 days after the scheduled call.
            state.bookings = state.bookings.filter(b => Date.parse(b.end) > this.now() - 180 * 86400000);
            const result = fn(state);
            state.version = version + 1;
            if (await this.store.compareAndSet(version, state)) return structuredClone(result);
        }
        throw new BookingError(409, 'The calendar changed. Please refresh and try again.');
    }
    token(id) {
        if (!this.secret) throw new BookingError(503, 'Booking is not configured yet.');
        return createHmac('sha256', this.secret).update('booking:' + id).digest('base64url');
    }
    authorize(id, token) {
        const a = Buffer.from(this.token(id)), b = Buffer.from(String(token || ''));
        if (a.length !== b.length || !timingSafeEqual(a, b)) throw new BookingError(403, 'This booking link is invalid.');
    }
    publicBooking(b) {
        return { id: b.id, start: b.start, end: b.end, timezone: b.timezone, status: b.status,
            joinUrl: b.status === 'cancelled' ? '' : b.joinUrl || '', delivery: b.delivery || 'pending',
            integration: b.integration || 'pending', preview: this.preview, manageToken: this.token(b.id) };
    }
    async availability(date, excludeId = '') {
        const state = await this.read();
        return { settings: state.settings, slots: availableSlots(state, date, this.now(), excludeId), preview: this.preview };
    }
    async book(input) {
        const guest = validateGuest(input);
        if (!/^[a-zA-Z0-9-]{20,80}$/.test(input.requestId || '')) throw new BookingError(400, 'Reload the booking form and try again.');
        this.token('configuration-check');
        const booking = await this.mutate(state => {
            const existing = state.bookings.find(b => b.requestId === input.requestId);
            if (existing) {
                if (existing.email !== guest.email || existing.start !== input.start) throw new BookingError(409, 'This request was already used. Refresh the form.');
                return existing;
            }
            if (state.bookings.length >= 5000) throw new BookingError(503, 'Please contact the studio to book.');
            const date = Number.isFinite(Date.parse(input.start)) ? localDate(new Date(input.start), state.settings.timezone) : '';
            const slot = availableSlots(state, date, this.now()).find(s => s.start === input.start);
            if (!slot) throw new BookingError(409, 'That time is no longer available. Please choose another slot.');
            if (state.bookings.filter(b => b.email === guest.email && b.status !== 'cancelled' && Date.parse(b.end) > this.now()).length >= 3) throw new BookingError(429, 'You already have several upcoming bookings. Please contact the studio.');
            const record = { id: randomUUID(), requestId: input.requestId, ...guest, ...slot,
                buffer: state.settings.buffer, status: 'confirmed', revision: 1, createdAt: new Date(this.now()).toISOString(),
                integration: 'pending', delivery: 'pending', action: 'created', job: null };
            state.bookings.push(record); return record;
        });
        await this.fulfill(booking.id);
        return this.publicBooking((await this.read()).bookings.find(b => b.id === booking.id));
    }
    async change(id, action, start) {
        await this.mutate(state => {
            const b = state.bookings.find(b => b.id === id);
            if (!b) throw new BookingError(404, 'Booking not found.');
            if (b.job) throw new BookingError(409, 'This booking has an integration task in progress. Contact the studio if it remains stuck.');
            if (b.integration === 'review') throw new BookingError(409, 'The meeting provider needs review before this booking can be changed. Please contact the studio.');
            if (b.status === 'cancelled') { if (action === 'cancel') return b; throw new BookingError(409, 'This booking is cancelled.'); }
            if (Date.parse(b.start) <= this.now()) throw new BookingError(409, 'Past bookings cannot be changed.');
            if (action === 'cancel') b.status = 'cancelled';
            else if (action === 'reschedule') {
                const date = Number.isFinite(Date.parse(start)) ? localDate(new Date(start), state.settings.timezone) : '';
                const slot = availableSlots(state, date, this.now(), id).find(s => s.start === start);
                if (!slot) throw new BookingError(409, 'That time is no longer available.');
                Object.assign(b, slot, { buffer: state.settings.buffer });
            } else throw new BookingError(400, 'Unknown booking action.');
            b.action = action; b.revision++; b.delivery = 'pending'; b.integration = 'pending';
            delete b.emailAttemptAt;
            b.updatedAt = new Date(this.now()).toISOString(); return b;
        });
        await this.fulfill(id);
        return this.publicBooking((await this.read()).bookings.find(b => b.id === id));
    }
    async settings(input) { return this.mutate(state => { state.settings = validateSettings(input); return state.settings; }); }
    async fulfill(id) {
        if (!this.integrations) return;
        const jobId = randomUUID();
        const b = await this.mutate(state => {
            const b = state.bookings.find(b => b.id === id);
            if (!b || b.job || (b.delivery === 'sent' && b.integration === 'ready')) return null;
            b.job = { id: jobId, startedAt: new Date(this.now()).toISOString() }; return b;
        });
        if (!b) return;
        let patch;
        try { patch = await this.integrations(b, this.token(id)); }
        catch { patch = { integration: 'review', delivery: 'pending', integrationMessage: 'Integration interrupted. Review the provider before retrying to avoid duplicates.' }; }
        await this.mutate(state => {
            const current = state.bookings.find(item => item.id === id);
            if (current?.job?.id === jobId) Object.assign(current, patch, { job: null });
            return null;
        });
    }
}
