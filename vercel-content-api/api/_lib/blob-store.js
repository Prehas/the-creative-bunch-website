import { list, put } from '@vercel/blob';

const CONTENT_TYPES = new Set(['projects', 'case-studies', 'pricing']);
const STAGES = new Set(['draft', 'published']);

export function normalizeStage(stage) {
    return STAGES.has(stage) ? stage : 'published';
}

export function contentPath(stage, type) {
    if (!CONTENT_TYPES.has(type)) throw new Error(`Unsupported content type: ${type}`);
    return `content/${normalizeStage(stage)}/${type}.json`;
}

export async function readJsonDocument(stage, type, fallback) {
    const pathname = contentPath(stage, type);
    const result = await list({ prefix: pathname, limit: 1 });
    const blob = result.blobs.find(item => item.pathname === pathname) || result.blobs[0];
    if (!blob?.url) return fallback;

    const response = await fetch(`${blob.url}?v=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) return fallback;
    return response.json();
}

export async function writeJsonDocument(stage, type, value) {
    const pathname = contentPath(stage, type);
    const body = JSON.stringify(value, null, 2);
    const blob = await put(pathname, body, {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: true
    });
    return blob;
}

export async function readSnapshot(stage = 'published') {
    const normalizedStage = normalizeStage(stage);
    const [projects, caseStudies, pricing] = await Promise.all([
        readJsonDocument(normalizedStage, 'projects', null),
        readJsonDocument(normalizedStage, 'case-studies', null),
        readJsonDocument(normalizedStage, 'pricing', null)
    ]);

    return {
        stage: normalizedStage,
        connected: true,
        updatedAt: new Date().toISOString(),
        projects,
        caseStudies,
        pricing
    };
}

export async function writeSnapshot(stage, snapshot = {}) {
    const normalizedStage = normalizeStage(stage);
    const writes = [];
    if (Array.isArray(snapshot.projects)) writes.push(writeJsonDocument(normalizedStage, 'projects', snapshot.projects));
    if (snapshot.caseStudies && typeof snapshot.caseStudies === 'object') writes.push(writeJsonDocument(normalizedStage, 'case-studies', snapshot.caseStudies));
    if (snapshot.pricing && typeof snapshot.pricing === 'object') writes.push(writeJsonDocument(normalizedStage, 'pricing', snapshot.pricing));
    await Promise.all(writes);
    return readSnapshot(normalizedStage);
}
