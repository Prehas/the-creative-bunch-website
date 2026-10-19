import { applyCors, handleOptions, sendJson, getAllowedOrigins } from '../_lib/http.js';
import { createSession, setSessionCookie } from '../_lib/auth.js';
import { AdminUsers, AdminError, adminBody, adminRateLimit, validEmail } from '../_lib/admin-users.js';

export default async function handler(request, response) {
    applyCors(request, response); response.setHeader('Cache-Control', 'no-store');
    if (handleOptions(request, response)) return;
    if (request.method !== 'POST') return sendJson(response, 405, { ok: false, message: 'Method not allowed' });
    try {
        if (request.headers.origin && !getAllowedOrigins().includes(request.headers.origin)) throw new AdminError(403, 'This origin is not allowed.');
        await adminRateLimit(request, 'login', 20);
        const { email, password } = await adminBody(request);
        if (typeof password !== 'string' || password.length > 128) throw new AdminError(400, 'Enter your email and password.');
        const identity = await new AdminUsers().login(validEmail(email), password);
        if (!identity) throw new AdminError(401, 'Invalid Content API credentials.');
        const token = createSession(identity.email, identity);
        setSessionCookie(response, token);
        sendJson(response, 200, { ok: true, email: identity.email, token });
    } catch (error) {
        sendJson(response, error instanceof AdminError ? error.status : 503, { ok: false,
            message: error instanceof AdminError ? error.message : 'Login is temporarily unavailable. Try again.' });
    }
}
