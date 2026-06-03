import { applyCors, handleOptions, readJsonBody, sendJson } from '../_lib/http.js';
import { createSession, setSessionCookie } from '../_lib/auth.js';

export default async function handler(request, response) {
    applyCors(request, response);
    if (handleOptions(request, response)) return;
    if (request.method !== 'POST') return sendJson(response, 405, { ok: false, message: 'Method not allowed' });

    const { email, password } = await readJsonBody(request);
    const expectedEmail = process.env.CONTENT_ADMIN_EMAIL || 'raduniculescu22@gmail.com';
    const expectedPassword = process.env.CONTENT_ADMIN_PASSWORD || '';

    if (!expectedPassword) return sendJson(response, 503, { ok: false, message: 'Content API password is not configured.' });
    if (String(email || '').toLowerCase() !== expectedEmail.toLowerCase() || String(password || '') !== expectedPassword) {
        return sendJson(response, 401, { ok: false, message: 'Invalid Content API credentials.' });
    }

    const token = createSession(expectedEmail);
    setSessionCookie(response, token);
    sendJson(response, 200, { ok: true, email: expectedEmail, token });
}
