import { handleOptions } from './_lib/http.js';
import { requireAuth } from './_lib/auth.js';
import { SupabaseBookingStore } from './_lib/booking-supabase.js';
const cache=new Map();
export async function buildAnalyticsSummary({range='30d',env=process.env,store=new SupabaseBookingStore(),fetcher=fetch,now=new Date()}={}) {
  const days=range==='7d'?7:range==='90d'?90:30;
  const since=new Date(now); since.setUTCHours(0,0,0,0); since.setUTCDate(since.getUTCDate()-days+1);
  const until=new Date(now.getTime()+1);
  const issues=[];
  async function query(by) {
    if (!env.TCB_VERCEL_ANALYTICS_TOKEN || !env.TCB_VERCEL_PROJECT_ID) throw Error('Vercel reporting is not connected.');
    const params=new URLSearchParams({projectId:env.TCB_VERCEL_PROJECT_ID,teamId:env.TCB_VERCEL_TEAM_ID || '',by,since:since.toISOString(),until:now.toISOString(),limit:'100'});
    const r=await fetcher('https://api.vercel.com/v1/query/web-analytics/visits/aggregate?'+params,{headers:{Authorization:'Bearer '+env.TCB_VERCEL_ANALYTICS_TOKEN},signal:AbortSignal.timeout(12000)});
    if (!r.ok) throw Error('Vercel reporting unavailable ('+r.status+').');
    const d=await r.json(); if (!Array.isArray(d.data)) throw Error('Invalid Vercel report.'); return d.data;
  }
  const results=await Promise.allSettled([query('environment'),query('day'),query('country'),query('deviceType'),query('referrerHostname'),query('requestPath'),store.rpc('tcb_analytics_summary',{since_at:since.toISOString(),until_at:until.toISOString()}),store.read()]);
  const get=(i,fallback)=>results[i].status==='fulfilled'?results[i].value:fallback;
  if(results[0].status==='rejected') issues.push(results[0].reason.message);
  if(results[6].status==='rejected') issues.push('Interaction reporting is unavailable.');
  if(results[7].status==='rejected') issues.push('Booking reporting is unavailable.');
  const total=get(0,null),timeline=get(1,[]),interactions=get(6,null),state=get(7,null);
  const sum=(rows,key)=>rows?.reduce((n,row)=>n+Number(row[key] || 0),0);
  const events=interactions?.events || [];
  const count=name=>interactions?events.find(e=>e.name===name)?.count || 0:null;
  const bookings=state?.bookings.filter(b=>Date.parse(b.createdAt)>=since.getTime() && Date.parse(b.createdAt)<until.getTime() && b.status!=='cancelled');
  const metric=(label,value,delta,icon)=>({label,value:value==null?'—':String(value),delta,icon});
  const lists=(i,key)=>{const rows=get(i,[]),total=sum(rows,'visitors');return rows.map(row=>({name:row[key] || (key==='referrerHostname'?'Direct':'Unknown'),users:row.visitors,sessions:row.visitors,value:total?Math.round(100*row.visitors/total):0}));};
  return {connected:total!==null,source:'Vercel + Supabase',range,updatedAt:now.toISOString(),message:issues.join(' ') || 'Measured production traffic (Vercel) and interactions (Supabase). Visits require analytics consent; reports may be delayed.',
    metrics:[metric('Site visitors',sum(total,'visitors'),'Vercel · selected period','fa-user-group'),metric('Project opens',count('case_study_open'),'Supabase · selected period','fa-arrow-up-right-from-square'),metric('Booked calls',bookings?.length,'Confirmed · created in period','fa-calendar-check'),metric('Book a call clicks',count('create_project_click'),'Supabase · selected period','fa-bullseye')],
    timeline:timeline.map(r=>r.visitors),timelineLabels:timeline.map(r=>r.timestamp?.slice(5,10) || ''),realtime:{activeUsers:null,events:[]},
    countries:lists(2,'country'),devices:lists(3,'deviceType'),sources:lists(4,'referrerHostname'),pages:get(5,[]).map(r=>({title:r.requestPath || '/',path:r.requestPath || '/',views:r.pageviews,detail:'Vercel page views'})),events:events.map(e=>({...e,detail:'Measured interactions · Supabase'})),projects:interactions?.projects || [],issues};
}
export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');res.setHeader('Vary','Origin');
  if(handleOptions(req,res))return;
  if(!requireAuth(req,res))return;
  if(req.method!=='GET')return res.status(405).json({message:'Method not allowed.'});
  const range=new URL(req.url,'https://internal.invalid').searchParams.get('range') || '30d';
  if(!['7d','30d','90d'].includes(range))return res.status(400).json({message:'Invalid reporting period.'});
  const cached=cache.get(range);if(cached && cached.expires>Date.now())return res.status(200).json(cached.data);
  const data=await buildAnalyticsSummary({range});cache.set(range,{data,expires:Date.now()+60000});return res.status(200).json(data);
}
