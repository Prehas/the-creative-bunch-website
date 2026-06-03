import { applyCors, handleOptions, readJsonBody, sendJson } from '../_lib/http.js';
import { createSession, setSessionCookie } from '../_lib/auth.js';

function getAdminUsers() {
    const configuredUsers = process.env.CONTENT_ADMIN_USERS;
    if (configuredUsers) {
        try {
            const parsed = JSON.parse(configuredUsers);
            if (Array.isArray(parsed) && parsed.length) {
                return parsed
                    .filter(user => user?.email && user?.password)
                    .map(user => ({
                        email: String(user.email).toLowerCase(),
                        password: String(user.password)
                    }));
            }
        } catch {
            // Fall through to the single-account env format.
        }
    }

    const users = [];
    if (process.env.CONTENT_ADMIN_EMAIL && process.env.CONTENT_ADMIN_PASSWORD) {
        users.push({
            email: process.env.CONTENT_ADMIN_EMAIL,
            password: process.env.CONTENT_ADMIN_PASSWORD
        });
    }

    for (let index = 2; index <= 5; index += 1) {
        const email = process.env[`CONTENT_ADMIN_EMAIL_${index}`];
        const password = process.env[`CONTENT_ADMIN_PASSWORD_${index}`];
        if (email && password) users.push({ email, password });
    }

    return users.map(user => ({
        email: String(user.email).toLowerCase(),
        password: String(user.password)
    }));
}

export default async function handler(request, response) {
    applyCors(request, response);
    if (handleOptions(request, response)) return;
    if (request.method !== 'POST') return sendJson(response, 405, { ok: false, message: 'Method not allowed' });

    const { email, password } = await readJsonBody(request);
    const normalizedEmail = String(email || '').toLowerCase();
    const matchedUser = getAdminUsers().find(user => user.email === normalizedEmail && user.password === String(password || ''));

    if (!matchedUser) {
        return sendJson(response, 401, { ok: false, message: 'Invalid Content API credentials.' });
    }

    const token = createSession(matchedUser.email);
    setSessionCookie(response, token);
    sendJson(response, 200, { ok: true, email: matchedUser.email, token });
}
