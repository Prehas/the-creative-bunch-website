import { applyCors, handleOptions, getAllowedOrigins } from '../_lib/http.js';
import { requireAuth } from '../_lib/auth.js';
import { AdminUsers, AdminError, adminBody, adminRateLimit, validEmail } from '../_lib/admin-users.js';

export function createUsersHandler({ directory = new AdminUsers(), authorize = requireAuth, limit = adminRateLimit } = {}) {
    return async function handler(request, response) {
        applyCors(request, response); response.setHeader('Cache-Control', 'no-store');
        if (handleOptions(request, response)) return;
        if (!['GET', 'POST'].includes(request.method)) return response.status(405).json({ ok: false, message: 'Method not allowed.' });
        try {
            if (!await authorize(request, response)) return;
            if (request.method === 'GET') return response.status(200).json({ users: await directory.list() });
            if (request.headers.origin && !getAllowedOrigins().includes(request.headers.origin)) throw new AdminError(403, 'This origin is not allowed.');
            await limit(request, 'users', 10);
            const body = await adminBody(request);
            const email = validEmail(body.email);
            if (body.action === 'invite') await directory.invite(email);
            else if (body.action === 'reset') await directory.reset(email);
            else throw new AdminError(400, 'Unknown user action.');
            response.status(200).json({ ok: true, message: 'Email accepted for sending. Ask the recipient to check their inbox and spam folder.' });
        } catch (error) {
            response.status(error instanceof AdminError ? error.status : 503).json({ ok: false,
                message: error instanceof AdminError ? error.message : 'User management is temporarily unavailable. Try again.' });
        }
    };
}
export default createUsersHandler();
