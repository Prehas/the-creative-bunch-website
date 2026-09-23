// Booking records are private. Never use the public content Blob store here.
const STATE_KEY = 'tcb:bookings:v1';
export class BookingError extends Error {
    constructor(status, message) { super(message); this.status = status; }
}
export class RedisBookingStore {
    constructor(env = process.env) {
        this.url = env.BOOKING_REDIS_REST_URL;
        this.token = env.BOOKING_REDIS_REST_TOKEN;
    }
    async command(parts) {
        if (!this.url || !this.token) throw new BookingError(503, 'Booking is not available yet. Please contact the studio by email.');
        const response = await fetch(this.url, {
            method: 'POST', headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(parts), signal: AbortSignal.timeout(8000)
        });
        if (!response.ok) throw new BookingError(503, 'The booking service is temporarily unavailable. Please try again.');
        const data = await response.json();
        if (data.error) throw new BookingError(503, 'The booking service is temporarily unavailable.');
        return data.result;
    }
    async read() { const raw = await this.command(['GET', STATE_KEY]); return raw ? JSON.parse(raw) : null; }
    async compareAndSet(version, state) {
        const script = "local raw=redis.call('GET',KEYS[1]); local v=0; if raw then v=cjson.decode(raw).version end; if v~=tonumber(ARGV[1]) then return 0 end; redis.call('SET',KEYS[1],ARGV[2]); return 1";
        return (await this.command(['EVAL', script, 1, STATE_KEY, version, JSON.stringify(state)])) === 1;
    }
    async rateLimit(key, maximum, seconds) {
        const script = "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n";
        return (await this.command(['EVAL', script, 1, 'tcb:booking-rate:' + key, seconds])) <= maximum;
    }
}
