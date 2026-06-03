const DEFAULT_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'null',
    'https://the-creative-bunch-website.vercel.app'
];

export function getAllowedOrigins() {
    const configured = (process.env.CONTENT_ALLOWED_ORIGINS || '')
        .split(',')
        .map(origin => origin.trim())
        .filter(Boolean);
    return configured.length ? configured : DEFAULT_ALLOWED_ORIGINS;
}

export function applyCors(request, response) {
    const origin = request.headers.origin;
    const allowed = getAllowedOrigins();
    if (origin && allowed.includes(origin)) {
        response.setHeader('Access-Control-Allow-Origin', origin);
        response.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function handleOptions(request, response) {
    applyCors(request, response);
    if (request.method === 'OPTIONS') {
        response.status(204).end();
        return true;
    }
    return false;
}

export function sendJson(response, status, payload) {
    response.status(status).json(payload);
}

export async function readJsonBody(request) {
    if (request.body && typeof request.body === 'object') return request.body;

    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString('utf8');
    if (!raw) return {};
    return JSON.parse(raw);
}
