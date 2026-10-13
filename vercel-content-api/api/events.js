import { createHash } from 'node:crypto';
import { handleOptions, getAllowedOrigins } from './_lib/http.js';
import { SupabaseBookingStore } from './_lib/booking-supabase.js';
const names = new Set(['case_study_open','pricing_cta_click','create_project_click','view_work_click','portfolio_filter_click']);
export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  if (handleOptions(req,res)) return;
  if (req.method !== 'POST') return res.status(405).json({ok:false});
  if (!getAllowedOrigins().includes(req.headers.origin)) return res.status(403).json({ok:false});
  try {
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    if (Buffer.byteLength(raw)>600) return res.status(413).json({ok:false});
    const body=JSON.parse(raw);
    if (body.consent !== true || !names.has(body.name) || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.id || '') || !/^[a-zA-Z0-9_-]{0,80}$/.test(body.projectId || '')) return res.status(400).json({ok:false});
    const store=new SupabaseBookingStore();
    const rateKey=createHash('sha256').update('analytics:'+String(req.headers['x-vercel-forwarded-for'] || req.socket?.remoteAddress || 'unknown')).digest('hex');
    if (!await store.rateLimit(rateKey,90,60)) return res.status(429).json({ok:false});
    await store.rpc('tcb_analytics_record',{event_id:body.id,event_name:body.name,project_id:body.projectId || ''});
    return res.status(200).json({ok:true});
  } catch { return res.status(503).json({ok:false}); }
}
