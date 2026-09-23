// Server-only Supabase adapter. No browser-accessible database credentials.
import { BookingError } from './booking-store.js';
export class SupabaseBookingStore {
    constructor(env = process.env) {
        this.url = String(env.BOOKING_SUPABASE_URL || '').replace(/\/$/, '');
        this.key = env.BOOKING_SUPABASE_SECRET_KEY;
    }
    async rpc(name, body = {}) {
        if (!this.url || !this.key) throw new BookingError(503, 'Booking is not available yet. Please contact the studio by email.');
        try {
            const headers = { apikey: this.key, 'Content-Type': 'application/json' };
            // Legacy service_role JWTs need Authorization; modern secret keys use apikey.
            if (!this.key.startsWith('sb_secret_')) headers.Authorization = `Bearer ${this.key}`;
            const response = await fetch(`${this.url}/rest/v1/rpc/${name}`, {
                method: 'POST', headers, body: JSON.stringify(body), signal: AbortSignal.timeout(8000)
            });
            if (!response.ok) throw new Error('Database request failed');
            return await response.json();
        } catch { throw new BookingError(503, 'The booking service is temporarily unavailable. Please try again.'); }
    }
    read() { return this.rpc('tcb_booking_read'); }
    compareAndSet(version, state) { return this.rpc('tcb_booking_commit', { expected_version: version, next_state: state }); }
    rateLimit(key, maximum, seconds) { return this.rpc('tcb_booking_rate_limit', { rate_key: key, max_requests: maximum, window_seconds: seconds }); }
}
