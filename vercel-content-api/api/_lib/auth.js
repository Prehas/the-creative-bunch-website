import crypto from 'crypto';
import { AdminUsers, authConfigured, legacyAdmins, managedAdmin } from './admin-users.js';

const COOKIE_NAME = 'tcb_content_session';

function getSecret() {
    return process.env.CONTENT_API_SECRET || '';
}

function sign(value) {
    return crypto.createHmac('sha256', getSecret()).update(value).digest('base64url');
}

export function createSession(email, identity = {}) {
    const expires = Date.now() + 1000 * 60 * 60 * 12;
    const payload = Buffer.from(JSON.stringify({ email, expires, issuedAt: Date.now(),
        ...(identity.uid ? { uid: identity.uid, version: identity.version } : {}) })).toString('base64url');
    return `${payload}.${sign(payload)}`;
}

export function getCookie(request, name) {
    const header = request.headers.cookie || '';
    return header
        .split(';')
        .map(item => item.trim())
        .find(item => item.startsWith(`${name}=`))
        ?.slice(name.length + 1);
}

export function readSession(request) {
    const bearerToken = String(request.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
    const token = bearerToken || getCookie(request, COOKIE_NAME);
    if (!token || !getSecret()) return false;
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [payload, signature] = parts;
    let session;
    try {
        session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    } catch {
        return false;
    }
    if (!session || typeof session !== 'object') return false;
    const expires = Number(session.expires);
    if (!expires || Date.now() > expires) return false;
    const expected = sign(payload);
    const incomingBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (incomingBuffer.length !== expectedBuffer.length) return false;
    if (!crypto.timingSafeEqual(incomingBuffer, expectedBuffer) || typeof session.email !== 'string') return false;
    return session;
}

export function verifySession(request) { return Boolean(readSession(request)); }

export function setSessionCookie(response, token) {
    response.setHeader('Set-Cookie', `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=43200`);
}

export function clearSessionCookie(response) {
    response.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0`);
}

export async function requireAuth(request, response) {
    const session = readSession(request);
    if (session) {
        try {
            if (!authConfigured()) {
                if (legacyAdmins().some(user => user.email === session.email)) { request.adminSession = session; return true; }
            } else {
                const directory = new AdminUsers();
                const user = session.uid ? await directory.get(session.uid) : (await directory.all()).find(item => item.email?.toLowerCase() === session.email);
                const legacy = !session.uid && legacyAdmins().some(item => item.email === session.email);
                const banned = user?.banned_until && Date.parse(user.banned_until) > Date.now();
                const changedAt = Number(user?.app_metadata?.tcb_password_changed_at || 0);
                const issuedAt = Number(session.issuedAt || Number(session.expires) - 43200000);
                const validManaged = managedAdmin(user) && user.email?.toLowerCase() === session.email && !banned && user.app_metadata.tcb_password_set !== false &&
                    (session.uid ? session.version === user.app_metadata.tcb_session_version : legacy && issuedAt > changedAt);
                if (validManaged || legacy && !banned && !Object.hasOwn(user?.app_metadata || {}, 'tcb_admin')) { request.adminSession = session; return true; }
            }
        } catch {
            response.status(503).json({ ok: false, message: 'Admin access could not be verified. Please try again.' }); return false;
        }
    }
    response.status(401).json({ ok: false, message: 'Content API admin session required.' });
    return false;
}
