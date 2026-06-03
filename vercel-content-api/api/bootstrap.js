import { applyCors, handleOptions, readJsonBody, sendJson } from './_lib/http.js';
import { requireAuth } from './_lib/auth.js';
import { readSnapshot, writeSnapshot } from './_lib/blob-store.js';

export default async function handler(request, response) {
    applyCors(request, response);
    response.setHeader('Cache-Control', 'no-store, max-age=0');
    if (handleOptions(request, response)) return;

    if (request.method === 'GET') {
        const stage = request.query?.stage || 'published';
        return sendJson(response, 200, await readSnapshot(stage));
    }

    if (request.method === 'POST') {
        if (!requireAuth(request, response)) return;
        const body = await readJsonBody(request);
        return sendJson(response, 200, await writeSnapshot(body.stage || 'draft', body));
    }

    sendJson(response, 405, { ok: false, message: 'Method not allowed' });
}
