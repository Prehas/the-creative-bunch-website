const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(require('node:path').join(__dirname, '..', 'main.js'), 'utf8');
const now = Date.now();
const valid = { version: 2, savedAt: now, analytics: true, booking: false };

function boot(record, storageBlocked = false) {
    const scripts = [];
    const events = [];
    const location = { href: 'https://example.test/?private=value#section', hostname: 'example.test', search: '?private=value', reload: () => reloads++ };
    const storage = new Map(record === undefined ? [] : [['tcb_cookie_consent', record]]);
    const widget = { hidden: true, replaceChildren() {} };
    const notice = { hidden: false, querySelector: () => ({ textContent: '' }) };
    let reloads = 0;
    const context = vm.createContext({
        console, URL, URLSearchParams, location, crypto: require('node:crypto'),
        fetch: (url, options) => { events.push({ url, body: JSON.parse(options.body) }); return Promise.resolve({ ok: true }); },
        document: {
            readyState: 'loading',
            addEventListener() {},
            createElement: () => ({ dataset: {}, addEventListener() {} }),
            head: { appendChild: script => scripts.push(script) },
            querySelector: selector => selector === '.calendly-inline-widget' ? widget : selector === '.booking-consent-note' ? notice : null
        },
        window: { location, TCB_CONTENT_API_CONFIG: { baseUrl: 'https://api.example.test' } },
        localStorage: {
            getItem: key => { if (storageBlocked) throw new Error('Storage unavailable'); return storage.get(key) ?? null; },
            removeItem: key => storage.delete(key)
        }
    });
    vm.runInContext(source, context);
    return { run: code => vm.runInContext(code, context), scripts, events, widget, notice, reloads: () => reloads };
}

for (const record of [undefined, 'not-json', JSON.stringify({ ...valid, version: 0 }), JSON.stringify({ ...valid, savedAt: now - 181 * 86400000 }), JSON.stringify({ ...valid, savedAt: now + 86400000 }), JSON.stringify({ ...valid, analytics: 'true' })]) {
    const page = boot(record);
    assert.equal(page.run('cookieConsent'), null, 'Invalid or absent consent must fail closed');
    page.run('applyCookieConsent(); initVercelAnalytics(); trackTcbEvent("test")');
    assert.equal(page.scripts.length, 0, 'No optional scripts before valid consent');
    assert.equal(page.widget.hidden, true);
}
assert.equal(boot(JSON.stringify(valid), true).run('cookieConsent'), null, 'Storage denial must fail closed');

const analytics = boot(JSON.stringify(valid));
analytics.run('applyCookieConsent(); applyCookieConsent()');
assert.equal(analytics.scripts.length, 1, 'Analytics is loaded only once');
assert.equal(analytics.scripts[0].src, '/_vercel/insights/script.js');
assert.equal(analytics.widget.hidden, true, 'Analytics consent must not enable booking');
assert.equal(analytics.run('window.vaq[0][1]({url: "https://example.test/?secret=123#private"}).url'), 'https://example.test/');
analytics.run('trackTcbEvent("case_study_open", { project_id: "1", email: "private@example.test", project_title: "private" })');
assert.equal(analytics.events.length, 1);
assert.equal(analytics.events[0].body.projectId, '1');
assert.equal(JSON.stringify(analytics.events).includes('private@example.test'), false, 'Interaction payload must omit private data');
analytics.run('cookieConsent = { ...cookieConsent, analytics: false };');
analytics.run('trackTcbEvent("case_study_open", { project_id: "1" })');
assert.equal(analytics.events.length, 1, 'Revoked consent blocks Supabase interactions');
assert.equal(analytics.run('window.vaq[0][1]({url: "https://example.test/"})'), null, 'Revoked consent blocks automatic events');
analytics.run('applyCookieConsent()');
assert.equal(analytics.reloads(), 1, 'Withdrawal removes running third-party listeners through reload');

const booking = boot(JSON.stringify({ ...valid, analytics: false, booking: true }));
booking.run('applyCookieConsent(); applyCookieConsent()');
assert.equal(booking.scripts.length, 0, 'Native booking must never load Calendly, even with a legacy booking flag');
console.log('Consent checks passed: default denial, invalid/expired choices, storage denial, no Calendly, idempotent analytics, URL redaction and withdrawal.');
