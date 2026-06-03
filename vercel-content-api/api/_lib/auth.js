import crypto from 'crypto';

const COOKIE_NAME = 'tcb_content_session';

function getSecret() {
    return process.env.CONTENT_API_SECRET || '';
}

function sign(value) {
    return crypto.createHmac('sha256', getSecret()).update(value).digest('base64url');
}

export function createSession(email) {
    const expires = Date.now() + 1000 * 60 * 60 * 12;
    const payload = Buffer.from(JSON.stringify({ email, expires })).toString('base64url');
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

export function verifySession(request) {
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
    const expires = Number(session.expires);
    if (!expires || Date.now() > expires) return false;
    const expected = sign(payload);
    const incomingBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (incomingBuffer.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(incomingBuffer, expectedBuffer);
}

export function setSessionCookie(response, token) {
    response.setHeader('Set-Cookie', `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=43200`);
}

export function clearSessionCookie(response) {
    response.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0`);
}

export function requireAuth(request, response) {
    if (verifySession(request)) return true;
    response.status(401).json({ ok: false, message: 'Content API admin session required.' });
    return false;
}
