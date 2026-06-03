const crypto = require('crypto');

const DATA_API_BASE = 'https://analyticsdata.googleapis.com/v1beta';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];

function sendJson(response, status, payload) {
    response.status(status).json(payload);
}

function base64Url(input) {
    return Buffer.from(input)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function getPrivateKey() {
    return (process.env.GA_PRIVATE_KEY || '').replace(/\\n/g, '\n');
}

function getRange(value = '30d') {
    const ranges = {
        '7d': { startDate: '7daysAgo', endDate: 'today' },
        '30d': { startDate: '30daysAgo', endDate: 'today' },
        '90d': { startDate: '90daysAgo', endDate: 'today' }
    };
    return ranges[value] || ranges['30d'];
}

function isConfigured() {
    return Boolean(process.env.GA4_PROPERTY_ID && process.env.GA_CLIENT_EMAIL && process.env.GA_PRIVATE_KEY);
}

function createServiceAccountJwt() {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = {
        iss: process.env.GA_CLIENT_EMAIL,
        scope: SCOPES.join(' '),
        aud: TOKEN_URL,
        exp: now + 3600,
        iat: now
    };
    const unsignedToken = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}`;
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(unsignedToken);
    signer.end();
    const signature = signer.sign(getPrivateKey(), 'base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    return `${unsignedToken}.${signature}`;
}

async function getAccessToken() {
    const jwt = createServiceAccountJwt();
    const body = new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
    });
    const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    });
    const data = await response.json();
    if (!response.ok || !data.access_token) {
        throw new Error(data.error_description || data.error || 'Google token request failed');
    }
    return data.access_token;
}

async function runGaReport(token, method, body) {
    const propertyId = process.env.GA4_PROPERTY_ID;
    const response = await fetch(`${DATA_API_BASE}/properties/${propertyId}:${method}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error?.message || `${method} failed`);
    }
    return data;
}

function metricValue(row, index = 0) {
    return Number(row?.metricValues?.[index]?.value || 0);
}

function dimensionValue(row, index = 0) {
    return row?.dimensionValues?.[index]?.value || '';
}

function rowsToBars(rows, labelIndex, metricIndex, limit = 6) {
    const max = Math.max(...rows.map(row => metricValue(row, metricIndex)), 1);
    return rows.slice(0, limit).map(row => {
        const count = metricValue(row, metricIndex);
        return {
            name: dimensionValue(row, labelIndex) || 'Unknown',
            value: Math.round((count / max) * 100),
            users: count,
            sessions: count
        };
    });
}

function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(Math.round(Number(value || 0)));
}

function formatSeconds(value) {
    const seconds = Math.round(Number(value || 0));
    const minutes = Math.floor(seconds / 60);
    const rest = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${rest}`;
}

function transformReports({ overview, timeline, countries, sources, devices, pages, events, realtime }) {
    const overviewRow = overview.rows?.[0] || {};
    const activeUsers = metricValue(overviewRow, 0);
    const sessions = metricValue(overviewRow, 1);
    const pageViews = metricValue(overviewRow, 2);
    const eventCount = metricValue(overviewRow, 3);
    const engagement = metricValue(overviewRow, 4);

    return {
        connected: true,
        source: 'Google Analytics 4',
        updatedAt: new Date().toISOString(),
        metrics: [
            { label: 'Active users', value: formatNumber(activeUsers), delta: 'GA4 live', icon: 'fa-user-group' },
            { label: 'Sessions', value: formatNumber(sessions), delta: 'Selected range', icon: 'fa-chart-line' },
            { label: 'Page views', value: formatNumber(pageViews), delta: 'All pages', icon: 'fa-eye' },
            { label: 'Engagement', value: formatSeconds(engagement), delta: 'Avg. session', icon: 'fa-clock' }
        ],
        timelineLabels: (timeline.rows || []).map(row => dimensionValue(row, 0).slice(4)),
        timeline: (timeline.rows || []).map(row => metricValue(row, 0)),
        realtime: {
            activeUsers: metricValue(realtime.rows?.[0], 0),
            events: (realtime.rows || []).slice(0, 4).map(row => ({
                name: dimensionValue(row, 0) || 'active_users',
                count: metricValue(row, 1)
            }))
        },
        countries: rowsToBars(countries.rows || [], 0, 0, 6),
        sources: rowsToBars(sources.rows || [], 0, 0, 6),
        devices: (devices.rows || []).slice(0, 4).map(row => {
            const name = dimensionValue(row, 0) || 'unknown';
            const users = metricValue(row, 0);
            const max = Math.max(...(devices.rows || []).map(item => metricValue(item, 0)), 1);
            return {
                name: name.charAt(0).toUpperCase() + name.slice(1),
                value: Math.round((users / max) * 100),
                users,
                icon: name === 'mobile' ? 'fa-mobile-screen' : name === 'desktop' ? 'fa-desktop' : 'fa-tablet-screen-button'
            };
        }),
        pages: (pages.rows || []).slice(0, 8).map(row => ({
            title: dimensionValue(row, 1) || dimensionValue(row, 0) || 'Untitled',
            path: dimensionValue(row, 0) || '/',
            views: metricValue(row, 0),
            detail: `${formatNumber(metricValue(row, 1))} active users`
        })),
        events: (events.rows || []).slice(0, 8).map(row => ({
            name: dimensionValue(row, 0) || 'event',
            count: metricValue(row, 0),
            detail: 'GA4 event'
        }))
    };
}

module.exports = async function handler(request, response) {
    response.setHeader('Cache-Control', 'no-store, max-age=0');

    if (!isConfigured()) {
        sendJson(response, 200, {
            connected: false,
            message: 'GA4 env vars are not configured yet.'
        });
        return;
    }

    try {
        const range = getRange(request.query?.range);
        const token = await getAccessToken();
        const dateRanges = [range];
        const [overview, timeline, countries, sources, devices, pages, events, realtime] = await Promise.all([
            runGaReport(token, 'runReport', {
                dateRanges,
                metrics: [
                    { name: 'activeUsers' },
                    { name: 'sessions' },
                    { name: 'screenPageViews' },
                    { name: 'eventCount' },
                    { name: 'averageSessionDuration' }
                ]
            }),
            runGaReport(token, 'runReport', {
                dateRanges,
                dimensions: [{ name: 'date' }],
                metrics: [{ name: 'activeUsers' }],
                orderBys: [{ dimension: { dimensionName: 'date' } }]
            }),
            runGaReport(token, 'runReport', {
                dateRanges,
                dimensions: [{ name: 'country' }],
                metrics: [{ name: 'activeUsers' }],
                orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
                limit: 8
            }),
            runGaReport(token, 'runReport', {
                dateRanges,
                dimensions: [{ name: 'sessionDefaultChannelGroup' }],
                metrics: [{ name: 'sessions' }],
                orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
                limit: 8
            }),
            runGaReport(token, 'runReport', {
                dateRanges,
                dimensions: [{ name: 'deviceCategory' }],
                metrics: [{ name: 'activeUsers' }],
                orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }]
            }),
            runGaReport(token, 'runReport', {
                dateRanges,
                dimensions: [{ name: 'pagePathPlusQueryString' }, { name: 'pageTitle' }],
                metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
                orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
                limit: 10
            }),
            runGaReport(token, 'runReport', {
                dateRanges,
                dimensions: [{ name: 'eventName' }],
                metrics: [{ name: 'eventCount' }],
                orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
                limit: 10
            }),
            runGaReport(token, 'runRealtimeReport', {
                dimensions: [{ name: 'eventName' }],
                metrics: [{ name: 'activeUsers' }, { name: 'eventCount' }],
                limit: 10
            })
        ]);

        sendJson(response, 200, transformReports({ overview, timeline, countries, sources, devices, pages, events, realtime }));
    } catch (error) {
        sendJson(response, 500, {
            connected: false,
            message: error.message || 'Analytics request failed'
        });
    }
};
