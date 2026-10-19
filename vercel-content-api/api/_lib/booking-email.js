import { bookingCalendar } from './booking-calendar.js';
const STUDIO_SITE = 'https://www.thecreativebunch.eu';

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
}

function httpsUrl(value, fallback = '') {
    try {
        const url = new URL(value);
        return url.protocol === 'https:' && !url.username && !url.password ? url.href : fallback;
    } catch { return fallback; }
}

const COPY = {
    confirmed: {
        status: 'Call confirmed', title: 'Good ideas start<br>with a conversation.',
        intro: 'Your studio call is booked. We’re looking forward to hearing what you have in mind.',
        detail: 'Your appointment', note: 'Bring an idea, a question or a work in progress. We’ll take it from there.',
        preheader: 'You’re booked in. Your call details and Zoom link are inside.'
    },
    rescheduled: {
        status: 'New time confirmed', title: 'A new time.<br>The same good company.',
        intro: 'Your studio call has been rescheduled. Here are your updated meeting details.',
        detail: 'Your new appointment', note: 'The time above replaces your previous appointment. We look forward to catching up.',
        preheader: 'Your studio call has a new time. Find the updated details inside.'
    },
    cancelled: {
        status: 'Call cancelled', title: 'Plans change.<br>Stay in touch.',
        intro: 'Your studio call has been cancelled. You don’t need to do anything else.',
        detail: 'Cancelled appointment', note: 'Whenever you’re ready to pick things up again, there’s a place for you at the studio.',
        preheader: 'Your studio call is cancelled. You can book another time whenever you’re ready.'
    }
};

/** Shared HTML + plain-text content. No provider calls or credentials belong here. */
export function renderBookingEmail({ booking, manageUrl, joinUrl, siteUrl = STUDIO_SITE, replyEmail = 'agency@thecreativebunch.eu' }) {
    const state = booking.status === 'cancelled' ? 'cancelled' : booking.action === 'reschedule' ? 'rescheduled' : 'confirmed';
    const copy = COPY[state];
    const cancelled = state === 'cancelled';
    const site = httpsUrl(siteUrl, STUDIO_SITE).replace(/\/$/, '');
    const manage = httpsUrl(manageUrl);
    const zoom = httpsUrl(joinUrl);
    const contact = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(replyEmail) ? replyEmail : 'agency@thecreativebunch.eu';
    const start = new Date(booking.start);
    const end = new Date(booking.end);
    const timezone = booking.timezone || 'Europe/Budapest';
    const date = new Intl.DateTimeFormat('en-GB', { timeZone: timezone, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(start);
    const timeFormat = new Intl.DateTimeFormat('en-GB', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    const time = `${timeFormat.format(start)}–${timeFormat.format(end)}`;
    const offset = new Intl.DateTimeFormat('en-GB', { timeZone: timezone, timeZoneName: 'shortOffset' }).formatToParts(start).find(part => part.type === 'timeZoneName')?.value || '';
    const duration = Math.round((end - start) / 60000);
    const greeting = booking.name ? `Hi ${booking.name},` : 'Hi there,';
    const primaryUrl = cancelled ? `${site}/#book-call` : zoom || manage;
    const primaryLabel = cancelled ? 'Book another time' : zoom ? 'Join Zoom meeting' : 'View booking';
    const intro = copy.intro;
    const subject = `Your studio call is ${state} | The Creative Bunch`;
    const calendar = bookingCalendar({ booking, joinUrl: zoom });
    const calendarNote = cancelled ? 'If you saved this call in your calendar, please remove that entry.' : state === 'rescheduled'
        ? 'Already saved the previous time? Update or remove that entry before adding this new time.'
        : 'Prefer another calendar app? Open the attached .ics file. Your saved calendar copy is managed by you.';
    const text = [greeting, '', intro, '', copy.detail, date, `${time} (${timezone}, ${offset})`, `${duration} minutes · Zoom`,
        ...(cancelled ? [] : [zoom ? `Join: ${zoom}` : '', manage ? `Manage booking: ${manage}` : '']),
        ...(!cancelled ? [`Add to Google Calendar: ${calendar.googleUrl}`] : []),
        calendarNote,
        '', copy.note, ...(cancelled ? [`Book another time: ${site}/#book-call`] : []),
        '', `Questions? Reply to this email or contact ${contact}.`, '', 'The Creative Bunch', site, `Booking reference: ${booking.id}`
    ].filter(line => line !== undefined).join('\n');
    const esc = escapeHtml;
    const html = `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
<title>${esc(subject)}</title>
<style>
body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}table{border-collapse:collapse}img{border:0;outline:none;text-decoration:none}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important}
@media only screen and (max-width:480px){.outer-pad{padding:16px 10px!important}.email-pad{padding-left:24px!important;padding-right:24px!important}.email-title{font-size:29px!important;line-height:35px!important}.brand-name{font-size:13px!important}.email-button{display:block!important}.email-date{font-size:20px!important}}
</style>
</head>
<body style="margin:0;padding:0;width:100%;background-color:#f0ede9;color:#200b20;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;font-size:1px;line-height:1px;color:#f0ede9;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${esc(copy.preheader)} ${esc(date)} at ${esc(time)} (${esc(timezone)}).</div>
<table role="presentation" width="100%" bgcolor="#f0ede9" style="width:100%;background-color:#f0ede9;">
<tr><td align="center" class="outer-pad" style="padding:40px 16px;">
<!--[if mso]><table role="presentation" width="620" align="center"><tr><td><![endif]-->
<table role="presentation" width="100%" style="width:100%;max-width:620px;">
<tr><td bgcolor="#200b20" class="email-pad" style="padding:30px 40px 34px;background-color:#200b20;border-radius:20px 20px 0 0;">
<table role="presentation" width="100%"><tr>
<td width="52" style="width:52px;padding-right:12px;"><img src="${STUDIO_SITE}/assets/Logo_Site-transparent.png" width="40" height="40" alt="" style="display:block;width:40px;height:40px;"></td>
<td class="brand-name" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;letter-spacing:1px;color:#e5e2ff;">THE CREATIVE BUNCH</td>
</tr></table>
<table role="presentation"><tr><td style="padding-top:34px;padding-bottom:17px;">
<span style="display:inline-block;padding:7px 12px;border:1px solid ${cancelled ? '#bca5b4' : '#e2ff9d'};border-radius:30px;color:${cancelled ? '#e5e2ff' : '#e2ff9d'};font-size:12px;line-height:16px;font-weight:700;">${copy.status}</span>
</td></tr></table>
<h1 class="email-title" style="margin:0;color:#e5e2ff;font-size:34px;line-height:40px;letter-spacing:-1px;font-weight:700;">${copy.title}</h1>
</td></tr>
<tr><td bgcolor="#fffdfa" class="email-pad" style="padding:32px 40px 12px;background-color:#fffdfa;">
<p style="margin:0 0 12px;font-size:16px;line-height:25px;font-weight:700;color:#200b20;">${esc(greeting)}</p>
<p style="margin:0;font-size:16px;line-height:25px;color:#635864;">${esc(intro)}</p>
</td></tr>
<tr><td bgcolor="#fffdfa" class="email-pad" style="padding:16px 40px 0;background-color:#fffdfa;">
<table role="presentation" width="100%" bgcolor="#f1eee9" style="width:100%;background-color:#f1eee9;border-radius:12px;">
<tr><td style="padding:24px;">
<p style="margin:0 0 10px;font-size:12px;line-height:18px;font-weight:700;letter-spacing:.5px;color:#635864;">${copy.detail.toUpperCase()}</p>
<p class="email-date" style="margin:0 0 8px;font-size:23px;line-height:30px;font-weight:700;color:#200b20;">${esc(date)}</p>
<p style="margin:0 0 5px;font-size:22px;line-height:29px;font-weight:700;color:#200b20;">${esc(time)}</p>
<p style="margin:0;font-size:14px;line-height:22px;color:#635864;">${esc(timezone)} · ${esc(offset)}</p>
<table role="presentation" width="100%"><tr><td style="padding-top:17px;"><p style="margin:0;border-top:1px solid #d9d1d5;padding-top:14px;font-size:14px;line-height:22px;color:#635864;">${duration} minutes &nbsp;·&nbsp; Online via Zoom</p></td></tr></table>
</td></tr></table>
</td></tr>
<tr><td bgcolor="#fffdfa" class="email-pad" style="padding:26px 40px 0;background-color:#fffdfa;">
${primaryUrl ? `<table role="presentation" width="100%"><tr><td align="center" bgcolor="#200b20" style="background-color:#200b20;border-radius:9px;mso-padding-alt:17px 24px;"><a class="email-button" href="${esc(primaryUrl)}" style="display:block;padding:17px 24px;border:1px solid #200b20;border-radius:9px;font-size:16px;line-height:22px;font-weight:700;text-decoration:none;color:#e2ff9d;background-color:#200b20;">${primaryLabel} &nbsp;↗</a></td></tr></table>` : ''}
${!cancelled && manage ? `<p style="margin:17px 0 0;text-align:center;font-size:14px;line-height:22px;"><a href="${esc(manage)}" style="color:#496b6f;text-decoration:underline;">Reschedule or cancel your call</a></p>` : ''}
${!cancelled ? `<p style="margin:20px 0 0;text-align:center;font-size:14px;line-height:22px;"><a href="${esc(calendar.googleUrl)}" style="display:inline-block;padding:11px 18px;border:1px solid #c8d2cc;border-radius:8px;color:#496b6f;text-decoration:none;font-weight:700;">Add to Google Calendar</a></p>` : ''}
<p style="margin:12px 0 0;font-size:12px;line-height:20px;color:#635864;${cancelled ? '' : 'text-align:center;'}">${esc(calendarNote)}</p>
<p style="margin:24px 0 0;font-size:14px;line-height:23px;color:#635864;">${esc(copy.note)}</p>
${!cancelled && zoom ? `<p style="margin:16px 0 0;font-size:12px;line-height:20px;color:#635864;overflow-wrap:anywhere;word-break:break-all;">If the button doesn’t open, copy this Zoom link:<br><a href="${esc(zoom)}" style="color:#496b6f;text-decoration:underline;">${esc(zoom)}</a></p>` : ''}
</td></tr>
<tr><td bgcolor="#fffdfa" class="email-pad" style="padding:28px 40px 32px;background-color:#fffdfa;border-radius:0 0 20px 20px;">
<table role="presentation" width="100%"><tr><td style="border-top:1px solid #e2dadd;padding-top:22px;">
<p style="margin:0 0 5px;font-size:14px;line-height:22px;color:#200b20;font-weight:700;">A question before we talk?</p>
<p style="margin:0;font-size:14px;line-height:22px;color:#635864;">Just reply to this email, or write to<br><a href="mailto:${esc(contact)}" style="color:#496b6f;text-decoration:underline;">${esc(contact)}</a>.</p>
</td></tr></table>
</td></tr>
<tr><td align="center" style="padding:23px 16px 0;">
<p style="margin:0 0 8px;font-size:12px;line-height:18px;color:#635864;"><a href="${esc(site)}" style="font-weight:700;color:#200b20;text-decoration:none;">The Creative Bunch</a> · Working internationally</p>
<p style="margin:0;font-size:11px;line-height:18px;color:#635864;">Sent about your studio appointment.<br>Booking reference: <span style="overflow-wrap:anywhere;word-break:break-all;">${esc(booking.id)}</span></p>
</td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table>
</body></html>`;
    return { state, subject, text, html, calendar };
}
