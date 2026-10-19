import { applyCors, handleOptions, getAllowedOrigins } from '../_lib/http.js';
import { AdminUsers, AdminError, adminBody, adminRateLimit } from '../_lib/admin-users.js';

export function createResetHandler({ directory = new AdminUsers(), limit = adminRateLimit } = {}) {
    return async function handler(request, response) {
        applyCors(request, response); response.setHeader('Cache-Control', 'no-store');
        if (handleOptions(request, response)) return;
        if (request.method !== 'POST') return response.status(405).json({ ok: false, message: 'Method not allowed.' });
        try {
            if (request.headers.origin && !getAllowedOrigins().includes(request.headers.origin)) throw new AdminError(403, 'This origin is not allowed.');
            await limit(request, 'reset', 12);
            const { tokenHash, password } = await adminBody(request);
            await directory.completeReset(tokenHash, password);
            response.status(200).json({ ok: true, message: 'Password saved. Sign in with your new password.' });
        } catch (error) {
            response.status(error instanceof AdminError ? error.status : 503).json({ ok: false,
                message: error instanceof AdminError ? error.message : 'Password could not be saved. Request a new link if this one was already used.' });
        }
    };
}
export default createResetHandler();
