import { applyCors, handleOptions, sendJson } from '../_lib/http.js';
import { clearSessionCookie } from '../_lib/auth.js';

export default async function handler(request, response) {
    applyCors(request, response);
    if (handleOptions(request, response)) return;
    clearSessionCookie(response);
    sendJson(response, 200, { ok: true });
}
