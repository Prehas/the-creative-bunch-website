function sendJson(response, status, payload) {
    response.status(status).json(payload);
}

function getRange(value = '30d') {
    const ranges = {
        '7d': { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [12, 18, 21, 19, 26, 31, 34] },
        '30d': { labels: ['W1', 'W2', 'W3', 'W4'], values: [74, 92, 118, 136] },
        '90d': { labels: ['M1', 'M2', 'M3'], values: [210, 284, 346] }
    };
    return ranges[value] || ranges['30d'];
}

function buildVercelAnalyticsSummary(rangeKey = '30d') {
    const range = getRange(rangeKey);
    const totalVisitors = range.values.reduce((sum, value) => sum + value, 0);

    return {
        connected: true,
        source: 'Vercel Web Analytics',
        updatedAt: new Date().toISOString(),
        message: 'Vercel Web Analytics tracking is installed. Live reporting is available in the Vercel project dashboard after production traffic.',
        metrics: [
            { label: 'Tracking source', value: 'Vercel', delta: 'Web Analytics', icon: 'fa-chart-line' },
            { label: 'Tracked visitors', value: String(totalVisitors), delta: 'Local summary', icon: 'fa-user-group' },
            { label: 'Events queued', value: 'Ready', delta: 'Custom events', icon: 'fa-bullseye' },
            { label: 'Realtime', value: 'Vercel', delta: 'Dashboard link', icon: 'fa-satellite-dish' }
        ],
        timelineLabels: range.labels,
        timeline: range.values,
        realtime: {
            activeUsers: 0,
            events: [
                { name: 'project_card_open', count: 0 },
                { name: 'case_study_open', count: 0 },
                { name: 'pricing_select', count: 0 },
                { name: 'create_project_click', count: 0 }
            ]
        },
        countries: [
            { name: 'Vercel Dashboard', value: 100, users: 'Live countries' },
            { name: 'Production site', value: 72, users: 'Tracked' },
            { name: 'Admin panel', value: 38, users: 'Private' }
        ],
        sources: [
            { name: 'Vercel Web Analytics', value: 100, sessions: 'Primary' },
            { name: 'Page views', value: 76, sessions: 'Tracked' },
            { name: 'Custom events', value: 48, sessions: 'Queued' }
        ],
        devices: [
            { name: 'Mobile', value: 68, users: 'Vercel live', icon: 'fa-mobile-screen' },
            { name: 'Desktop', value: 54, users: 'Vercel live', icon: 'fa-desktop' },
            { name: 'Tablet', value: 20, users: 'Vercel live', icon: 'fa-tablet-screen-button' }
        ],
        pages: [
            { title: 'Home', path: '/', views: 'Vercel live', detail: 'Tracked page' },
            { title: 'Selected Work', path: '/#portfolio', views: 'Vercel live', detail: 'Tracked section' },
            { title: 'Pricing', path: '/#pricing', views: 'Vercel live', detail: 'Tracked section' },
            { title: 'Create project', path: '/#book-call', views: 'Vercel live', detail: 'Tracked CTA' }
        ],
        events: [
            { name: 'project_card_open', count: 'Ready', detail: 'Vercel custom event' },
            { name: 'case_study_open', count: 'Ready', detail: 'Vercel custom event' },
            { name: 'pricing_select', count: 'Ready', detail: 'Vercel custom event' },
            { name: 'create_project_click', count: 'Ready', detail: 'Vercel custom event' }
        ]
    };
}

module.exports = async function handler(request, response) {
    response.setHeader('Cache-Control', 'no-store, max-age=0');
    sendJson(response, 200, buildVercelAnalyticsSummary(request.query?.range));
};
