import { randomBytes, randomUUID, timingSafeEqual, createHash } from 'node:crypto';
import { SupabaseBookingStore } from './booking-supabase.js';

export class AdminError extends Error {
    constructor(status, message) { super(message); this.status = status; }
}
export function legacyAdmins(env = process.env) {
    let users = [];
    try { const parsed = JSON.parse(env.CONTENT_ADMIN_USERS || 'null'); if (Array.isArray(parsed)) users = parsed; } catch { /* Older deployments use individual variables. */ }
    if (!users.length) for (let index = 1; index <= 5; index++) {
        const suffix = index === 1 ? '' : `_${index}`;
        users.push({ email: env[`CONTENT_ADMIN_EMAIL${suffix}`], password: env[`CONTENT_ADMIN_PASSWORD${suffix}`] });
    }
    return users.filter(user => user?.email && user?.password).map(user => ({ email: String(user.email).trim().toLowerCase(), password: String(user.password) }));
}
export const managedAdmin = user => user?.app_metadata?.tcb_admin === true;
export const authConfigured = (env = process.env) => Boolean(env.BOOKING_SUPABASE_URL && env.BOOKING_SUPABASE_SECRET_KEY);
export function validEmail(value) {
    if (typeof value !== 'string' || value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) throw new AdminError(400, 'Enter a valid email address.');
    return value.trim().toLowerCase();
}
export function validPassword(password) {
    if (typeof password !== 'string' || password.length < 12 || password.length > 128) throw new AdminError(400, 'Use a password between 12 and 128 characters.');
}
function samePassword(a, b) {
    const first = createHash('sha256').update(String(a)).digest();
    const second = createHash('sha256').update(String(b)).digest();
    return timingSafeEqual(first, second);
}
export class AdminUsers {
    constructor(env = process.env) { this.env = env; }
    async request(route, { method = 'GET', body, token } = {}) {
        if (!authConfigured(this.env)) throw new AdminError(503, 'User management is not connected.');
        const key = this.env.BOOKING_SUPABASE_SECRET_KEY;
        const headers = { apikey: key, 'Content-Type': 'application/json' };
        if (token || !key.startsWith('sb_secret_')) headers.Authorization = `Bearer ${token || key}`;
        let response;
        try { response = await fetch(`${this.env.BOOKING_SUPABASE_URL.replace(/\/$/, '')}/auth/v1${route}`, {
            method, headers, cache: 'no-store', ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(10000)
        }); } catch { throw new AdminError(503, 'User service is temporarily unavailable. Try again.'); }
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            const error = new AdminError(response.status === 429 ? 429 : 503, response.status === 429 ? 'Too many attempts. Please wait before trying again.' : 'User service could not complete the request.');
            error.providerStatus = response.status;
            throw error;
        }
        return data;
    }
    async all() {
        const users = [];
        for (let page = 1; page <= 20; page++) {
            const data = await this.request(`/admin/users?page=${page}&per_page=100`);
            const batch = data.users || [];
            users.push(...batch);
            if (batch.length < 100) return users;
        }
        throw new AdminError(503, 'The user directory needs administrator review.');
    }
    async get(id) { return this.request(`/admin/users/${encodeURIComponent(id)}`); }
    async update(user, metadata, extra = {}) {
        return this.request(`/admin/users/${encodeURIComponent(user.id)}`, { method: 'PUT', body: {
            ...extra, app_metadata: metadata
        } });
    }
    async migrate(legacy, users) {
        let user = users.find(item => item.email?.toLowerCase() === legacy.email);
        if (managedAdmin(user)) return user;
        const app_metadata = { ...user?.app_metadata, tcb_admin: true, tcb_password_set: true,
            tcb_session_version: randomUUID(), tcb_password_changed_at: 0 };
        // One-time import of the existing account and its unchanged password.
        if (user) {
            let passwordMatches = false;
            try {
                const verified = await this.request('/token?grant_type=password', { method: 'POST', body: { email: legacy.email, password: legacy.password } });
                passwordMatches = verified.user?.id === user.id;
            } catch (error) { if (![400, 401].includes(error.providerStatus)) throw error; }
            // Supabase rejects setting the same password again. Preserve existing
            // matching credentials and import only the protected admin metadata.
            user = await this.request(`/admin/users/${encodeURIComponent(user.id)}`, { method: 'PUT',
                body: { ...(!passwordMatches ? { password: legacy.password } : {}), email_confirm: true, app_metadata } });
        }
        else user = await this.request('/admin/users', { method: 'POST', body: { email: legacy.email,
            password: legacy.password, email_confirm: true, app_metadata } });
        return user;
    }
    async login(email, password) {
        const legacy = legacyAdmins(this.env).find(user => user.email === email);
        if (!authConfigured(this.env)) return legacy && samePassword(legacy.password, password) ? { email } : null;
        const users = await this.all();
        let user = users.find(item => item.email?.toLowerCase() === email);
        if (user?.app_metadata?.tcb_admin === false) return null;
        if (!managedAdmin(user)) {
            if (!legacy || !samePassword(legacy.password, password)) return null;
            user = await this.migrate(legacy, users);
        }
        if (user.banned_until && Date.parse(user.banned_until) > Date.now()) return null;
        if (user.app_metadata.tcb_password_set === false) return null;
        let result;
        try { result = await this.request('/token?grant_type=password', { method: 'POST', body: { email, password } }); }
        catch (error) { if (error.status === 429) throw error; return null; }
        // A normal Supabase user or user-editable metadata never grants admin access.
        if (!managedAdmin(result.user)) return null;
        return { email: result.user.email, uid: result.user.id, version: result.user.app_metadata.tcb_session_version };
    }
    async list() {
        const users = await this.all();
        const result = users.filter(managedAdmin).map(user => ({ email: user.email, id: user.id,
            status: user.app_metadata.tcb_password_set === false ? 'invited' : 'active', createdAt: user.created_at,
            lastSignIn: user.last_sign_in_at || '', resetRequestedAt: user.app_metadata.tcb_reset_requested_at || '' }));
        for (const legacy of legacyAdmins(this.env)) if (!result.some(user => user.email === legacy.email) && !users.some(user => user.email?.toLowerCase() === legacy.email && user.app_metadata?.tcb_admin === false)) {
            result.push({ email: legacy.email, status: 'active', id: '', createdAt: '', lastSignIn: '', resetRequestedAt: '' });
        }
        return result.sort((a, b) => a.email.localeCompare(b.email));
    }
    async invite(email) {
        const users = await this.all();
        if (users.some(user => user.email?.toLowerCase() === email) || legacyAdmins(this.env).some(user => user.email === email)) {
            throw new AdminError(409, 'This account already exists. Use Request password change instead.');
        }
        const user = await this.request('/admin/users', { method: 'POST', body: { email,
            password: randomBytes(48).toString('base64url'), email_confirm: true,
            app_metadata: { tcb_admin: true, tcb_password_set: false, tcb_session_version: randomUUID(), tcb_password_changed_at: 0 } } });
        await this.sendPasswordLink(user, true);
    }
    async reset(email) {
        const users = await this.all();
        let user = users.find(item => item.email?.toLowerCase() === email && managedAdmin(item));
        if (!user) {
            if (users.some(item => item.email?.toLowerCase() === email && item.app_metadata?.tcb_admin === false)) throw new AdminError(404, 'Admin account not found.');
            const legacy = legacyAdmins(this.env).find(item => item.email === email);
            if (!legacy) throw new AdminError(404, 'Admin account not found.');
            user = await this.migrate(legacy, users);
        }
        if (Date.now() - Date.parse(user.app_metadata.tcb_reset_requested_at || 0) < 60000) throw new AdminError(429, 'A link was recently requested. Wait one minute before sending another.');
        await this.sendPasswordLink(user, user.app_metadata.tcb_password_set === false);
    }
    async sendPasswordLink(user, invitation) {
        const data = await this.request('/admin/generate_link', { method: 'POST', body: { type: 'recovery', email: user.email } });
        const hash = data.hashed_token || data.properties?.hashed_token;
        if (!hash) throw new AdminError(503, 'Could not generate the password link. Request a new link from the user list.');
        // Fixed canonical destination; never accept a redirect or recipient from a browser URL.
        const url = `https://www.thecreativebunch.eu/reset-password.html#token_hash=${encodeURIComponent(hash)}`;
        const title = invitation ? 'Your studio dashboard invitation' : 'Change your studio dashboard password';
        const text = `${title}\n\n${invitation ? 'You have been invited to manage The Creative Bunch website.' : 'A studio admin requested a password change for your account.'}\n\nChoose your own password: ${url}\n\nThis link works once and expires according to the studio authentication settings. If you did not expect this message, contact agency@thecreativebunch.eu. Your current password remains unchanged until you complete this step.`;
        const from = this.env.BOOKING_EMAIL_FROM || 'The Creative Bunch <agency@thecreativebunch.eu>';
        const sender = from.match(/^(.*?)\s*<([^>]+)>$/);
        if (!this.env.BREVO_API_KEY) throw new AdminError(503, 'Email service is not connected. The account is saved; request another link when email is available.');
        let response;
        try { response = await fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST',
            headers: { 'api-key': this.env.BREVO_API_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender: { name: sender?.[1].trim() || 'The Creative Bunch', email: sender?.[2] || from },
                to: [{ email: user.email }], subject: title, textContent: text,
                htmlContent: `<div style="background:#f8f4ed;padding:32px;font-family:Arial,sans-serif;color:#302535"><div style="max-width:520px;margin:auto"><p style="color:#587b7f;font-weight:700">THE CREATIVE BUNCH</p><h1 style="font-size:26px">${title}</h1><p>${invitation ? 'You have been invited to manage the studio website.' : 'A studio admin requested a password change for your account.'}</p><p style="margin:28px 0"><a href="${url}" style="display:inline-block;background:#587b7f;color:#fffdf8;padding:14px 20px;border-radius:8px;text-decoration:none">${invitation ? 'Set your password' : 'Choose a new password'}</a></p><p>This link works once and expires. Your current password stays unchanged until you finish.</p><p>If you did not expect this email, contact agency@thecreativebunch.eu.</p></div></div>` }), signal: AbortSignal.timeout(10000) });
        } catch { throw new AdminError(503, 'Email delivery is not confirmed. Check the recipient inbox before requesting another link.'); }
        if (!response.ok) throw new AdminError(503, 'The account is saved, but the email was not accepted. Request another link from the user list.');
        await this.update(user, { tcb_reset_requested_at: new Date().toISOString() });
    }
    async completeReset(hash, password) {
        validPassword(password);
        if (typeof hash !== 'string' || !/^[a-zA-Z0-9_-]{20,256}$/.test(hash)) throw new AdminError(400, 'This password link is invalid. Ask a studio admin for a new one.');
        let verified;
        try { verified = await this.request('/verify', { method: 'POST', body: { token_hash: hash, type: 'recovery' } }); }
        catch { throw new AdminError(400, 'This link is expired or already used. Ask a studio admin for a new one.'); }
        if (!managedAdmin(verified.user)) throw new AdminError(403, 'This account does not have studio access.');
        try {
            await this.update(verified.user, { tcb_password_set: true, tcb_password_changed_at: Date.now(), tcb_session_version: randomUUID() }, { password });
        } catch {
            throw new AdminError(503, 'Password was not confirmed as saved. Ask a studio admin for a new link before trying again.');
        }
        // Never return Supabase recovery/access tokens or automatically sign in.
    }
}
export async function adminRateLimit(request, namespace, maximum = 12, env = process.env) {
    if (!authConfigured(env)) return;
    const ip = request.headers['x-vercel-forwarded-for'] || request.socket?.remoteAddress || 'unknown';
    const key = createHash('sha256').update(`${namespace}:${ip}`).digest('hex');
    if (!await new SupabaseBookingStore(env).rateLimit(`auth:${key}`, maximum, 600)) throw new AdminError(429, 'Too many attempts. Please try again in a few minutes.');
}
export async function adminBody(request) {
    if (request.body) {
        const raw = typeof request.body === 'string' ? request.body : JSON.stringify(request.body);
        if (Buffer.byteLength(raw) > 6000) throw new AdminError(413, 'Request is too large.');
        return JSON.parse(raw);
    }
    let size = 0; const chunks = [];
    for await (const chunk of request) { size += chunk.length; if (size > 6000) throw new AdminError(413, 'Request is too large.'); chunks.push(chunk); }
    return JSON.parse(Buffer.concat(chunks).toString() || '{}');
}
