import { put } from '@vercel/blob';
import { applyCors, handleOptions, readJsonBody, sendJson } from './_lib/http.js';
import { requireAuth } from './_lib/auth.js';

function dataUrlToBuffer(dataUrl) {
    const match = String(dataUrl || '').match(/^data:([^;]+);base64,(.+)$/);
    if (!match) throw new Error('Invalid dataUrl upload payload.');
    return {
        contentType: match[1],
        buffer: Buffer.from(match[2], 'base64')
    };
}

function safeFileName(value = 'asset.webp') {
    return String(value)
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        || 'asset.webp';
}

export default async function handler(request, response) {
    applyCors(request, response);
    if (handleOptions(request, response)) return;
    if (request.method !== 'POST') return sendJson(response, 405, { ok: false, message: 'Method not allowed' });
    if (!requireAuth(request, response)) return;

    const body = await readJsonBody(request);
    const { buffer, contentType } = dataUrlToBuffer(body.dataUrl);
    const fileName = safeFileName(body.fileName);
    const blob = await put(`uploads/${Date.now()}-${fileName}`, buffer, {
        access: 'public',
        contentType,
        addRandomSuffix: true
    });

    sendJson(response, 200, { ok: true, url: blob.url, pathname: blob.pathname });
}
