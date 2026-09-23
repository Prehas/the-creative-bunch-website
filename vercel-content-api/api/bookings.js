import { createHash, timingSafeEqual } from 'node:crypto';
import { applyCors, handleOptions, getAllowedOrigins } from './_lib/http.js';
import { requireAuth } from './_lib/auth.js';
import { BookingError } from './_lib/booking-store.js';
import { SupabaseBookingStore } from './_lib/booking-supabase.js';
import { BookingService } from './_lib/booking-core.js';
import { createIntegrations, integrationStatus } from './_lib/booking-integrations.js';

async function boundedBody(request) {
    if (request.body) {
        const raw = typeof request.body === 'string' ? request.body : JSON.stringify(request.body);
        if (Buffer.byteLength(raw) > 10000) throw new BookingError(413, 'Request is too large.');
        return JSON.parse(raw);
    }
    let size = 0; const parts = [];
    for await (const part of request) { size += part.length; if (size > 10000) throw new BookingError(413, 'Request is too large.'); parts.push(part); }
    return JSON.parse(Buffer.concat(parts).toString() || '{}');
}
export function createBookingHandler({ store = new SupabaseBookingStore(), secret = process.env.BOOKING_SECRET,
    integrations = createIntegrations(), preview = false, authorizeAdmin = requireAuth, allowedOrigins = getAllowedOrigins() } = {}) {
    const service = new BookingService(store, { secret, integrations, preview });
    return async function handler(request, response) {
        applyCors(request, response); response.setHeader('Cache-Control', 'no-store');
        response.setHeader('Vary', 'Origin');
        if (handleOptions(request, response)) return;
        try {
            if (!['GET', 'POST'].includes(request.method)) throw new BookingError(405, 'Method not allowed.');
            const url = new URL(request.url, 'https://booking.invalid');
            const action = url.searchParams.get('action') || (request.method === 'GET' ? 'availability' : 'book');
            if (action === 'cleanup') {
                const expected = Buffer.from(`Bearer ${process.env.CRON_SECRET || ''}`);
                const supplied = Buffer.from(String(request.headers.authorization || ''));
                if (!process.env.CRON_SECRET || expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) throw new BookingError(401, 'Unauthorized.');
                await service.mutate(() => null);
                return response.status(200).json({ ok: true });
            }
            const admin = ['admin', 'settings', 'admin-cancel', 'admin-reschedule', 'retry'].includes(action);
            if (admin && !authorizeAdmin(request, response)) return;
            if (request.method === 'POST' && request.headers.origin && !allowedOrigins.includes(request.headers.origin)) throw new BookingError(403, 'This origin is not allowed.');
            if (!admin) {
                const ip = request.headers['x-vercel-forwarded-for'] || request.socket?.remoteAddress || 'unknown';
                const hash = createHash('sha256').update(String(ip)).digest('hex').slice(0, 24);
                if (!await store.rateLimit(`${request.method}:${hash}`, request.method === 'GET' ? 150 : 12, 600)) throw new BookingError(429, 'Too many requests. Please try again in a few minutes.');
            }
            if (request.method === 'GET') {
                if (action === 'availability') return response.status(200).json(await service.availability(url.searchParams.get('date')));
                if (action === 'admin') {
                    const state = await service.read();
                    return response.status(200).json({ ...state, bookings: state.bookings.filter(b => Date.parse(b.end) > Date.now() - 180 * 86400000).sort((a, b) => b.start.localeCompare(a.start)),
                        connections: integrationStatus(), preview });
                }
                throw new BookingError(400, 'Unknown action.');
            }
            const body = await boundedBody(request);
            if (!body || Array.isArray(body) || typeof body !== 'object') throw new BookingError(400, 'Invalid request.');
            let result;
            if (action === 'book') result = await service.book(body);
            else if (action === 'settings') result = await service.settings(body);
            else if (action === 'retry') {
                const b = (await service.read()).bookings.find(b => b.id === body.id);
                if (!b) throw new BookingError(404, 'Booking not found.');
                await service.fulfill(body.id); result = { ok: true };
            } else if (['manage', 'cancel', 'reschedule', 'admin-cancel', 'admin-reschedule'].includes(action)) {
                if (!admin) service.authorize(body.id, body.manageToken);
                if (action === 'manage') {
                    const b = (await service.read()).bookings.find(b => b.id === body.id);
                    if (!b) throw new BookingError(404, 'Booking not found.');
                    result = service.publicBooking(b);
                } else result = await service.change(body.id, action.replace('admin-', ''), body.start);
            } else throw new BookingError(400, 'Unknown action.');
            response.status(200).json(result);
        } catch (error) {
            const status = error instanceof BookingError ? error.status : error instanceof SyntaxError ? 400 : 503;
            response.status(status).json({ ok: false, message: error instanceof BookingError ? error.message : status === 400 ? 'Invalid request.' : 'Booking could not be completed. Please retry using the same form or contact the studio.' });
        }
    };
}
export default createBookingHandler();

