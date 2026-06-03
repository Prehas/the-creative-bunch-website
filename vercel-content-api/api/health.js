import { applyCors, handleOptions, sendJson } from './_lib/http.js';

export default async function handler(request, response) {
    applyCors(request, response);
    if (handleOptions(request, response)) return;

    sendJson(response, 200, {
        ok: true,
        service: 'the-creative-bunch-content-api',
        blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
        updatedAt: new Date().toISOString()
    });
}
