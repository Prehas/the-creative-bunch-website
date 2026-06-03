import { applyCors, handleOptions, readJsonBody, sendJson } from './_lib/http.js';
import { requireAuth } from './_lib/auth.js';
import { readSnapshot, writeSnapshot } from './_lib/blob-store.js';

export default async function handler(request, response) {
    applyCors(request, response);
    response.setHeader('Cache-Control', 'no-store, max-age=0');
    if (handleOptions(request, response)) return;
    if (request.method !== 'POST') return sendJson(response, 405, { ok: false, message: 'Method not allowed' });
    if (!requireAuth(request, response)) return;

    const body = await readJsonBody(request);
    const draft = await readSnapshot('draft');
    const snapshot = {
        projects: Array.isArray(body.projects) ? body.projects : draft.projects,
        caseStudies: body.caseStudies && typeof body.caseStudies === 'object' ? body.caseStudies : draft.caseStudies,
        pricing: body.pricing && typeof body.pricing === 'object' ? body.pricing : draft.pricing
    };

    sendJson(response, 200, await writeSnapshot('published', snapshot));
}
