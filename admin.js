const TCB_ADMIN_SESSION_KEY = 'tcb_admin_session';
const TCB_PROJECTS_KEY = 'tcb_projects_draft_admin';
const TCB_PROJECTS_PUBLISHED_KEY = 'tcb_projects_admin';
const TCB_CASE_STUDIES_KEY = 'tcb_case_studies_draft_admin';
const TCB_CASE_STUDIES_PUBLISHED_KEY = 'tcb_case_studies_admin';
const TCB_PRICING_KEY = 'tcb_pricing_draft_admin';
const TCB_PRICING_PUBLISHED_KEY = 'tcb_pricing_admin';
const TCB_CONTENT_API_TOKEN_KEY = 'tcb_content_api_token';
const EDITOR_HISTORY_LIMIT = 60;

let editorUndoStack = [];
let editorRedoStack = [];
let editorHistoryTimer = null;
let isRestoringEditorState = false;
let editorInitialState = null;
let isSavingProject = false;
let pricingUndoStack = [];
let pricingRedoStack = [];
let pricingHistoryTimer = null;
let isRestoringPricingState = false;

const DEFAULT_PROJECTS = [
    {
        id: 1,
        title: 'Merkaz Israel 76 Campaign',
        category: 'graphics',
        tag: 'Event Poster & Campaign Design',
        description: 'Visual campaign materials for Merkaz, promoting the Israel 76 cultural event with bold typography, clean layout, and community-focused imagery.',
        image: 'assets/project_merkaz_thumb.webp'
    },
    {
        id: 7,
        title: 'Infinik Logo',
        category: 'branding',
        tag: 'Logo Design & Brand Mark',
        description: 'Futuristic identity mark for Infinik, pairing a geometric infinity symbol with a sharp, digital wordmark system.',
        image: 'assets/project_infinik_logo_thumb.webp'
    },
    {
        id: 10,
        title: 'Every Idea Has a Form',
        category: 'branding',
        tag: 'Print & Object Branding',
        description: 'Every idea deserves a form. We transform it into print - on paper, fabric, or objects. The format does not matter. What matters is your vision.',
        image: 'assets/project_every_idea_form_thumb.webp'
    },
    {
        id: 9,
        title: 'JCC Brochure',
        category: 'graphics',
        tag: 'Brochure & Community Campaign',
        description: 'High-energy brochure cover for JCC Bucharest, combining cultural photography, bold typography, and event-led visual storytelling.',
        image: 'assets/project_jcc_brochure_thumb.webp'
    },
    {
        id: 8,
        title: 'Creative Alex Website',
        category: 'web',
        tag: 'Portfolio Website Design',
        description: 'Website direction and visual presentation for creativealex.eu, built around bold portfolio thumbnails and a clean creator-first experience.',
        image: 'assets/project_creativealex_website_thumb.webp'
    }
];

const DEFAULT_PRICING = {
    eyebrow: 'Pricing',
    title: 'Choose the creative depth your project needs.',
    description: 'No fixed public price before we understand the scope. Use these tiers to choose the level of design support, then book a call and we will map the right path.',
    recommendedId: 'plus',
    ctaLabel: 'Select',
    ctaHref: '#book-call',
    tiers: [
        {
            id: 'basic',
            name: 'Basic',
            symbol: '$',
            ctaLabel: 'Select',
            description: 'For focused visual tasks and small campaigns that need clean execution.',
            badge: '',
            features: [
                { icon: 'fa-solid fa-check', text: 'Graphic design essentials' },
                { icon: 'fa-solid fa-check', text: 'Posters, flyers, banners' },
                { icon: 'fa-solid fa-check', text: 'Social media content starter pack' },
                { icon: 'fa-solid fa-check', text: 'Basic brand cleanup' },
                { icon: 'fa-solid fa-check', text: 'One focused revision round' }
            ]
        },
        {
            id: 'plus',
            name: 'Plus',
            symbol: '$$',
            ctaLabel: 'Select',
            description: 'For brands, campaigns, and launches that need a stronger visual system.',
            badge: 'Recommended',
            features: [
                { icon: 'fa-solid fa-check', text: 'Everything in Basic' },
                { icon: 'fa-solid fa-check', text: 'Graphic content system' },
                { icon: 'fa-solid fa-check', text: 'Branding direction' },
                { icon: 'fa-solid fa-check', text: 'Social media content kit' },
                { icon: 'fa-solid fa-check', text: 'Web design direction' },
                { icon: 'fa-solid fa-check', text: 'UX/UI wireframes' },
                { icon: 'fa-solid fa-check', text: 'Merch branding concept' }
            ]
        },
        {
            id: 'pro',
            name: 'Pro',
            symbol: '$$$',
            ctaLabel: 'Select',
            description: 'For complete identity, web, and campaign ecosystems with end-to-end execution.',
            badge: '',
            features: [
                { icon: 'fa-solid fa-check', text: 'Everything in Plus' },
                { icon: 'fa-solid fa-check', text: 'Full brand identity system' },
                { icon: 'fa-solid fa-check', text: 'UX/UI design system' },
                { icon: 'fa-solid fa-check', text: 'Web design & web development' },
                { icon: 'fa-solid fa-check', text: 'Campaign visual system' },
                { icon: 'fa-solid fa-check', text: 'Illustrations & custom assets' },
                { icon: 'fa-solid fa-check', text: 'Merch, print, and launch collateral' }
            ]
        }
    ]
};

const DASHBOARD_DATA = {
    metrics: [
        { label: 'Site visitors', value: '4,862', delta: '+18.4%', icon: 'fa-user-group' },
        { label: 'Project opens', value: '1,247', delta: '+32.1%', icon: 'fa-arrow-up-right-from-square' },
        { label: 'Booked calls', value: '26', delta: '+9.6%', icon: 'fa-calendar-check' },
        { label: 'Lead value', value: '$$$', delta: 'Plus tier focus', icon: 'fa-wand-magic-sparkles' }
    ],
    countries: [
        { name: 'Romania', value: 82 },
        { name: 'Israel', value: 64 },
        { name: 'United Kingdom', value: 48 },
        { name: 'United States', value: 31 }
    ],
    meetings: [
        { person: 'David Cohen', label: 'Brand identity call', time: 'Today, 15:30' },
        { person: 'Maya Studio', label: 'Website discovery', time: 'Tomorrow, 11:00' },
        { person: 'JCC Follow-up', label: 'Campaign review', time: 'Friday, 09:45' }
    ],
    activities: [
        { event: 'Merkaz case study opened', source: 'Portfolio', status: 'Hot' },
        { event: 'Create project clicked', source: 'Hero CTA', status: 'Lead' },
        { event: 'Pricing Plus selected', source: 'Pricing', status: 'Qualified' },
        { event: 'Creative Alex viewed', source: 'Selected Work', status: 'Warm' }
    ],
    chart: [24, 34, 29, 48, 52, 47, 61, 74, 68, 86, 81, 92]
};

const ANALYTICS_FALLBACK_DATA = {
    connected: false,
    source: 'Vercel Web Analytics',
    updatedAt: new Date().toISOString(),
    metrics: [
        { label: 'Active users', value: '4,862', delta: '+18.4%', icon: 'fa-user-group' },
        { label: 'Project opens', value: '1,247', delta: '+32.1%', icon: 'fa-arrow-up-right-from-square' },
        { label: 'CTA clicks', value: '316', delta: '+12.8%', icon: 'fa-bullseye' },
        { label: 'Engagement', value: '02:48', delta: '+9.6%', icon: 'fa-chart-simple' }
    ],
    timelineLabels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],
    timeline: [34, 41, 38, 52, 58, 64, 61, 72, 78, 83, 88, 94],
    realtime: {
        activeUsers: 7,
        events: [
            { name: 'case_study_open', count: 4 },
            { name: 'create_project_click', count: 2 },
            { name: 'pricing_select', count: 1 }
        ]
    },
    countries: [
        { name: 'Romania', value: 82, users: 2486 },
        { name: 'Israel', value: 64, users: 1192 },
        { name: 'United Kingdom', value: 48, users: 748 },
        { name: 'United States', value: 31, users: 436 }
    ],
    sources: [
        { name: 'Organic Search', value: 58, sessions: 1848 },
        { name: 'Direct', value: 31, sessions: 986 },
        { name: 'Social', value: 22, sessions: 612 },
        { name: 'Referral', value: 14, sessions: 348 }
    ],
    devices: [
        { name: 'Mobile', value: 68, users: 3124, icon: 'fa-mobile-screen' },
        { name: 'Desktop', value: 27, users: 1189, icon: 'fa-desktop' },
        { name: 'Tablet', value: 5, users: 224, icon: 'fa-tablet-screen-button' }
    ],
    pages: [
        { title: 'Home', path: '/', views: 4218, detail: 'Main landing page' },
        { title: 'Selected Work', path: '/#portfolio', views: 1892, detail: 'Project browsing' },
        { title: 'Pricing', path: '/#pricing', views: 1046, detail: 'Tier comparison' },
        { title: 'Create project', path: '/#book-call', views: 642, detail: 'Lead intent' }
    ],
    events: [
        { name: 'project_card_open', count: 1247, detail: 'Selected Work card opened' },
        { name: 'case_study_open', count: 812, detail: 'Fullscreen case study' },
        { name: 'pricing_select', count: 316, detail: 'Pricing card selected' },
        { name: 'create_project_click', count: 204, detail: 'Calendly CTA clicked' }
    ]
};

let analyticsLoaded = false;
const WEBSITE_EDITOR_DESKTOP_QUERY = '(min-width: 901px)';

function getContentApiBase() {
    return String(window.TCB_CONTENT_API_CONFIG?.baseUrl || '').replace(/\/$/, '');
}

function isContentApiEnabled() {
    return Boolean(getContentApiBase());
}

async function contentApiRequest(path, options = {}) {
    if (!isContentApiEnabled()) return null;
    const token = localStorage.getItem(TCB_CONTENT_API_TOKEN_KEY);
    const response = await fetch(`${getContentApiBase()}${path}`, {
        credentials: 'include',
        cache: 'no-store',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {})
        }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || `Content API ${path} failed with ${response.status}`);
    return data;
}

async function loginContentApi(email, password) {
    if (!isContentApiEnabled()) return null;
    const session = await contentApiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
    if (session?.token) localStorage.setItem(TCB_CONTENT_API_TOKEN_KEY, session.token);
    return session;
}

async function logoutContentApi() {
    if (!isContentApiEnabled()) return null;
    try {
        return await contentApiRequest('/api/auth/logout', { method: 'POST' });
    } finally {
        localStorage.removeItem(TCB_CONTENT_API_TOKEN_KEY);
    }
}

async function loadContentApiSnapshot(stage = 'draft') {
    if (!isContentApiEnabled()) return null;
    try {
        return await contentApiRequest(`/api/bootstrap?stage=${encodeURIComponent(stage)}`);
    } catch (error) {
        console.warn('Content API snapshot unavailable. Using local fallback.', error);
        return null;
    }
}

async function saveContentApiDraft(partial = {}) {
    if (!isContentApiEnabled()) return null;
    try {
        return await contentApiRequest('/api/bootstrap', {
            method: 'POST',
            body: JSON.stringify({
                stage: 'draft',
                projects: partial.projects || getStoredProjects(),
                caseStudies: partial.caseStudies || getStoredCaseStudies(),
                pricing: partial.pricing || getStoredPricing()
            })
        });
    } catch (error) {
        console.warn('Content API draft save failed. Local fallback preserved.', error);
        return null;
    }
}

async function publishContentApiSnapshot(partial = {}) {
    if (!isContentApiEnabled()) return null;
    return contentApiRequest('/api/publish', {
        method: 'POST',
        body: JSON.stringify({
            projects: partial.projects || getStoredProjects(),
            caseStudies: partial.caseStudies || getStoredCaseStudies(),
            pricing: partial.pricing || getStoredPricing()
        })
    });
}

async function uploadContentApiAsset(fileName, dataUrl) {
    if (!isContentApiEnabled()) return null;
    try {
        return await contentApiRequest('/api/upload', {
            method: 'POST',
            body: JSON.stringify({ fileName, dataUrl })
        });
    } catch (error) {
        console.warn('Content API upload failed. Keeping local data URL fallback.', error);
        return null;
    }
}

function setLocalSession(email) {
    localStorage.setItem(TCB_ADMIN_SESSION_KEY, JSON.stringify({
        email,
        role: 'admin',
        createdAt: new Date().toISOString()
    }));
}

function getLocalSession() {
    try {
        return JSON.parse(localStorage.getItem(TCB_ADMIN_SESSION_KEY) || 'null');
    } catch {
        return null;
    }
}

function getSessionEmail() {
    return getLocalSession()?.email || 'Signed in admin';
}

function clearLocalSession() {
    localStorage.removeItem(TCB_ADMIN_SESSION_KEY);
    localStorage.removeItem(TCB_CONTENT_API_TOKEN_KEY);
}

function getStoredProjects() {
    try {
        const raw = localStorage.getItem(TCB_PROJECTS_KEY);
        const stored = JSON.parse(raw || 'null');
        if (Array.isArray(stored) && stored.length) return stored;
        return getPublishedProjects() || [...DEFAULT_PROJECTS];
    } catch {
        return getPublishedProjects() || [...DEFAULT_PROJECTS];
    }
}

function saveStoredProjects(projects) {
    localStorage.setItem(TCB_PROJECTS_KEY, JSON.stringify(projects));
}

function getPublishedProjects() {
    try {
        const stored = JSON.parse(localStorage.getItem(TCB_PROJECTS_PUBLISHED_KEY) || 'null');
        return Array.isArray(stored) && stored.length ? stored : null;
    } catch {
        return null;
    }
}

function clonePricingData(data = DEFAULT_PRICING) {
    return JSON.parse(JSON.stringify(data));
}

function normalizePricingFeature(feature) {
    if (typeof feature === 'string') {
        return { icon: 'fa-solid fa-check', text: feature };
    }

    if (feature && typeof feature === 'object') {
        return {
            icon: feature.icon || 'fa-solid fa-check',
            text: feature.text || ''
        };
    }

    return { icon: 'fa-solid fa-check', text: '' };
}

function normalizePricingData(data) {
    const fallback = clonePricingData(DEFAULT_PRICING);
    const incoming = data && typeof data === 'object' ? data : {};
    const tiers = Array.isArray(incoming.tiers) && incoming.tiers.length
        ? incoming.tiers
        : fallback.tiers;

    return {
        eyebrow: incoming.eyebrow || fallback.eyebrow,
        title: incoming.title || fallback.title,
        description: incoming.description || fallback.description,
        recommendedId: incoming.recommendedId || fallback.recommendedId,
        ctaLabel: incoming.ctaLabel || fallback.ctaLabel,
        ctaHref: incoming.ctaHref || fallback.ctaHref,
        tiers: tiers.map((tier, index) => {
            const defaultTier = fallback.tiers[index] || fallback.tiers[0];
            return {
                id: tier.id || defaultTier.id || `tier-${index + 1}`,
                name: tier.name || defaultTier.name || `Tier ${index + 1}`,
                symbol: tier.symbol || defaultTier.symbol || '$',
                ctaLabel: tier.ctaLabel || defaultTier.ctaLabel || incoming.ctaLabel || fallback.ctaLabel,
                description: tier.description || defaultTier.description || '',
                badge: '',
                features: Array.isArray(tier.features)
                    ? tier.features.map(normalizePricingFeature).filter(feature => feature.text)
                    : (Array.isArray(defaultTier.features)
                        ? defaultTier.features.map(normalizePricingFeature)
                        : splitList(tier.features || defaultTier.features).map(normalizePricingFeature))
            };
        })
    };
}

function getStoredPricing() {
    try {
        const stored = JSON.parse(localStorage.getItem(TCB_PRICING_KEY) || 'null');
        if (stored && typeof stored === 'object') return normalizePricingData(stored);
        return getPublishedPricing() || clonePricingData(DEFAULT_PRICING);
    } catch {
        return getPublishedPricing() || clonePricingData(DEFAULT_PRICING);
    }
}

function saveStoredPricing(pricing) {
    localStorage.setItem(TCB_PRICING_KEY, JSON.stringify(normalizePricingData(pricing)));
}

function getPublishedPricing() {
    try {
        const stored = JSON.parse(localStorage.getItem(TCB_PRICING_PUBLISHED_KEY) || 'null');
        return stored && typeof stored === 'object' ? normalizePricingData(stored) : null;
    } catch {
        return null;
    }
}

function publishDraftPricing() {
    const pricing = getStoredPricing();
    localStorage.setItem(TCB_PRICING_PUBLISHED_KEY, JSON.stringify(pricing));
    return pricing;
}

function escapeAdminHtml(value) {
    const div = document.createElement('div');
    div.textContent = String(value || '');
    return div.innerHTML;
}

function setStatus(element, message, tone = 'neutral') {
    if (!element) return;
    element.textContent = message;
    element.dataset.tone = tone;
}

function showAdminToast(message, tone = 'success', options = {}) {
    let toast = document.getElementById('admin-action-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'admin-action-toast';
        toast.className = 'admin-action-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
    }

    toast.className = 'admin-action-toast';
    if (options.variant) toast.classList.add(`admin-action-toast-${options.variant}`);
    toast.innerHTML = options.icon
        ? `<i class="${escapeAdminHtml(options.icon)}" aria-hidden="true"></i><span>${escapeAdminHtml(message)}</span>`
        : `<span>${escapeAdminHtml(message)}</span>`;
    toast.dataset.tone = tone;
    toast.classList.remove('is-visible');
    window.requestAnimationFrame(() => toast.classList.add('is-visible'));
    window.clearTimeout(showAdminToast.timer);
    showAdminToast.timer = window.setTimeout(() => {
        toast.classList.remove('is-visible');
    }, 3200);
}

async function handleLoginPage() {
    const form = document.getElementById('login-form');
    if (!form) return;

    const status = document.getElementById('auth-status');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const email = String(formData.get('email') || '').trim().toLowerCase();
        const password = String(formData.get('password') || '');

        if (!isContentApiEnabled()) {
            setStatus(status, 'Content API is not configured. Please connect the Vercel content database first.', 'error');
            return;
        }

        try {
            const session = await loginContentApi(email, password);
            setLocalSession(session?.email || email);
        } catch (error) {
            setStatus(status, error.message || 'Content API login failed.', 'error');
            return;
        }

        setStatus(status, 'Login successful. Opening dashboard...', 'success');
        window.location.href = 'admin.html';
    });
}

async function ensureDashboardAccess() {
    if (!document.body.classList.contains('admin-page')) return true;

    if (getLocalSession()?.email && localStorage.getItem(TCB_CONTENT_API_TOKEN_KEY)) {
        return true;
    }

    window.location.href = 'login.html';
    return false;
}

function initNavigation() {
    const buttons = document.querySelectorAll('[data-admin-panel]');
    const panels = document.querySelectorAll('[data-admin-panel-content]');
    const websiteEditorGroup = document.querySelector('[data-website-editor-nav]');
    const websiteEditorSummary = websiteEditorGroup?.querySelector('summary');
    const websiteEditorSubmenu = websiteEditorGroup?.querySelector('.dashboard-nav-submenu');
    const desktopEditorMedia = window.matchMedia(WEBSITE_EDITOR_DESKTOP_QUERY);
    const restrictedPanels = new Set(['projects', 'pricing']);

    const showMobileEditorError = () => {
        showAdminToast(
            'Website Editor is desktop-only. Open the dashboard on a desktop screen to edit Projects or Pricing.',
            'error',
            { variant: 'mobile-lock', icon: 'fa-solid fa-mobile-screen-button' }
        );
    };

    const syncWebsiteEditorState = () => {
        const desktopAllowed = desktopEditorMedia.matches;
        websiteEditorGroup?.classList.toggle('is-mobile-locked', !desktopAllowed);
        if (!desktopAllowed && websiteEditorGroup?.open) {
            websiteEditorGroup.classList.remove('is-closing');
            websiteEditorGroup.removeAttribute('open');
            websiteEditorSummary?.setAttribute('aria-expanded', 'false');
        }
    };

    const toggleWebsiteEditorGroup = (open) => {
        if (!websiteEditorGroup || !websiteEditorSubmenu || !websiteEditorSummary) return;
        const shouldOpen = typeof open === 'boolean' ? open : !websiteEditorGroup.open;
        websiteEditorGroup.style.setProperty('--website-editor-menu-height', `${websiteEditorSubmenu.scrollHeight + 18}px`);

        if (shouldOpen) {
            websiteEditorGroup.classList.remove('is-closing');
            websiteEditorGroup.setAttribute('open', '');
            websiteEditorSummary.setAttribute('aria-expanded', 'true');
            return;
        }

        websiteEditorGroup.classList.add('is-closing');
        websiteEditorSummary.setAttribute('aria-expanded', 'false');
        window.setTimeout(() => {
            websiteEditorGroup.removeAttribute('open');
            websiteEditorGroup.classList.remove('is-closing');
        }, 360);
    };

    websiteEditorSummary?.addEventListener('click', event => {
        event.preventDefault();
        if (!desktopEditorMedia.matches) {
            showMobileEditorError();
            syncWebsiteEditorState();
            return;
        }
        toggleWebsiteEditorGroup();
    });

    desktopEditorMedia.addEventListener?.('change', syncWebsiteEditorState);
    syncWebsiteEditorState();

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.adminPanel;
            if (restrictedPanels.has(target) && !desktopEditorMedia.matches) {
                showMobileEditorError();
                syncWebsiteEditorState();
                return;
            }
            buttons.forEach(item => item.classList.toggle('is-active', item === button));
            panels.forEach(panel => panel.classList.toggle('is-active', panel.dataset.adminPanelContent === target));
            if (target === 'pricing') {
                refreshPricingPreview();
            }
            if (target === 'analytics') {
                loadAnalyticsPanel();
            }
        });
    });
}

function renderMetrics() {
    const grid = document.getElementById('metric-grid');
    if (!grid) return;

    grid.innerHTML = DASHBOARD_DATA.metrics.map(metric => `
        <article class="metric-card">
            <span class="metric-icon"><i class="fa-solid ${metric.icon}"></i></span>
            <p>${metric.label}</p>
            <strong>${metric.value}</strong>
            <span class="metric-delta">${metric.delta}</span>
        </article>
    `).join('');
}

function drawVisitorsChart() {
    const canvas = document.getElementById('visitors-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 38;
    const values = DASHBOARD_DATA.chart;
    const max = Math.max(...values) + 8;
    const min = Math.min(...values) - 8;

    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(226, 255, 157, 0.26)');
    gradient.addColorStop(1, 'rgba(226, 255, 157, 0.02)');

    ctx.strokeStyle = 'rgba(229, 226, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i += 1) {
        const y = padding + (i * (height - padding * 2)) / 4;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    const points = values.map((value, index) => {
        const x = padding + (index * (width - padding * 2)) / (values.length - 1);
        const y = height - padding - ((value - min) / (max - min)) * (height - padding * 2);
        return { x, y };
    });

    ctx.beginPath();
    points.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.lineTo(points[0].x, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    points.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
    });
    ctx.strokeStyle = '#e2ff9d';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#200b20';
        ctx.fill();
        ctx.strokeStyle = '#e2ff9d';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

function renderCountryList() {
    const list = document.getElementById('country-list');
    if (!list) return;

    list.innerHTML = DASHBOARD_DATA.countries.map(country => `
        <div class="country-row">
            <div class="country-meta"><span></span><strong>${country.name}</strong></div>
            <em>${country.value}%</em>
            <div class="country-track"><span style="width: ${country.value}%"></span></div>
        </div>
    `).join('');
}

function renderMeetings() {
    const list = document.getElementById('meeting-list');
    const panelList = document.getElementById('meetings-panel-list');
    const markup = DASHBOARD_DATA.meetings.map(meeting => `
        <article class="meeting-item">
            <span><i class="fa-regular fa-calendar"></i></span>
            <div>
                <strong>${meeting.person}</strong>
                <p>${meeting.label}</p>
            </div>
            <em>${meeting.time}</em>
        </article>
    `).join('');

    if (list) list.innerHTML = markup;
    if (panelList) panelList.innerHTML = markup;
}

function renderActivity() {
    const table = document.getElementById('activity-table');
    if (!table) return;

    table.innerHTML = DASHBOARD_DATA.activities.map(activity => `
        <div class="activity-row">
            <strong>${activity.event}</strong>
            <span>${activity.source}</span>
            <em>${activity.status}</em>
        </div>
    `).join('');
}

function getAnalyticsFallback(range = '30d') {
    const data = JSON.parse(JSON.stringify(ANALYTICS_FALLBACK_DATA));
    data.range = range;
    data.updatedAt = new Date().toISOString();
    return data;
}

function setAnalyticsStatus(data, message) {
    const status = document.getElementById('analytics-status-bar');
    if (!status) return;
    const isLive = Boolean(data?.connected);
    status.classList.toggle('is-live', isLive);
    status.innerHTML = `
        <span>
            <i class="fa-solid ${isLive ? 'fa-satellite-dish' : 'fa-circle-info'}"></i>
            ${escapeAdminHtml(message || (isLive ? 'Vercel Web Analytics tracking is active.' : 'Vercel Web Analytics tracking is ready.'))}
        </span>
    `;
}

async function fetchAnalyticsData(range = '30d') {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4200);

    try {
        const response = await fetch(`/api/analytics/summary?range=${encodeURIComponent(range)}`, {
            signal: controller.signal,
            cache: 'no-store'
        });
        if (!response.ok) throw new Error(`Analytics endpoint returned ${response.status}`);
        const data = await response.json();
        return data && typeof data === 'object' ? data : getAnalyticsFallback(range);
    } catch (error) {
        console.warn('Analytics API unavailable. Using Vercel analytics fallback.', error);
        return getAnalyticsFallback(range);
    } finally {
        window.clearTimeout(timeout);
    }
}

function drawAnalyticsTrafficChart(values = [], labels = []) {
    const canvas = document.getElementById('analytics-traffic-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 42;
    const safeValues = values.length ? values : ANALYTICS_FALLBACK_DATA.timeline;
    const max = Math.max(...safeValues, 1) + 8;
    const min = Math.max(0, Math.min(...safeValues) - 8);

    ctx.clearRect(0, 0, width, height);

    const background = ctx.createLinearGradient(0, 0, 0, height);
    background.addColorStop(0, 'rgba(226, 255, 157, 0.3)');
    background.addColorStop(1, 'rgba(226, 255, 157, 0.015)');

    ctx.strokeStyle = 'rgba(229, 226, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let index = 0; index < 5; index += 1) {
        const y = padding + (index * (height - padding * 2)) / 4;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    const points = safeValues.map((value, index) => {
        const divisor = Math.max(safeValues.length - 1, 1);
        const x = padding + (index * (width - padding * 2)) / divisor;
        const y = height - padding - ((value - min) / Math.max(max - min, 1)) * (height - padding * 2);
        return { x, y, value };
    });

    ctx.beginPath();
    points.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.lineTo(points[0].x, height - padding);
    ctx.closePath();
    ctx.fillStyle = background;
    ctx.fill();

    ctx.beginPath();
    points.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
    });
    ctx.strokeStyle = '#e2ff9d';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    points.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, index === points.length - 1 ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = '#200b20';
        ctx.fill();
        ctx.strokeStyle = '#e2ff9d';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    const chartLabels = labels.length ? labels : ANALYTICS_FALLBACK_DATA.timelineLabels;
    ctx.fillStyle = 'rgba(229, 226, 255, 0.58)';
    ctx.font = '700 12px Plus Jakarta Sans, sans-serif';
    chartLabels.filter((_, index) => index % Math.ceil(chartLabels.length / 6) === 0).forEach(label => {
        const sourceIndex = chartLabels.indexOf(label);
        const point = points[sourceIndex] || points[0];
        ctx.fillText(label, point.x - 10, height - 12);
    });
}

function renderAnalyticsMetrics(metrics = []) {
    const grid = document.getElementById('analytics-metric-grid');
    if (!grid) return;

    grid.innerHTML = metrics.map(metric => `
        <article class="metric-card">
            <span class="metric-icon"><i class="fa-solid ${escapeAdminHtml(metric.icon || 'fa-chart-line')}"></i></span>
            <p>${escapeAdminHtml(metric.label)}</p>
            <strong>${escapeAdminHtml(metric.value)}</strong>
            <span class="metric-delta">${escapeAdminHtml(metric.delta || 'Stable')}</span>
        </article>
    `).join('');
}

function renderAnalyticsList(id, rows = [], valueKey = 'value', labelKey = 'name', countKey = 'users') {
    const list = document.getElementById(id);
    if (!list) return;

    list.innerHTML = rows.map(row => {
        const value = Number(row[valueKey] || 0);
        return `
            <div class="analytics-list-row">
                <strong>${escapeAdminHtml(row[labelKey])}</strong>
                <em>${escapeAdminHtml(row[countKey] || value)}${countKey === valueKey ? '%' : ''}</em>
                <div class="analytics-mini-track"><span style="width: ${Math.min(Math.max(value, 3), 100)}%"></span></div>
            </div>
        `;
    }).join('');
}

function renderAnalyticsTable(id, rows = [], primaryKey = 'title', secondaryKey = 'path', countKey = 'views') {
    const table = document.getElementById(id);
    if (!table) return;

    table.innerHTML = rows.map(row => `
        <div class="analytics-table-row">
            <div>
                <strong>${escapeAdminHtml(row[primaryKey])}</strong>
                <span>${escapeAdminHtml(row[secondaryKey] || row.detail || '')}</span>
            </div>
            <em>${escapeAdminHtml(row[countKey] || row.count || 0)}</em>
            <span>${escapeAdminHtml(row.detail || row.path || '')}</span>
        </div>
    `).join('');
}

function renderRealtimeAnalytics(realtime = {}) {
    const active = document.getElementById('analytics-realtime-users');
    const events = document.getElementById('analytics-realtime-events');
    if (active) active.textContent = realtime.activeUsers ?? 0;
    if (!events) return;

    const rows = Array.isArray(realtime.events) && realtime.events.length
        ? realtime.events
        : [{ name: 'waiting_for_live_events', count: 0 }];

    events.innerHTML = rows.map(event => `
        <div class="realtime-event-pill">
            <strong>${escapeAdminHtml(event.name)}</strong>
            <span>${escapeAdminHtml(event.count || 0)}</span>
        </div>
    `).join('');
}

function renderAnalyticsPanel(data) {
    const fallback = getAnalyticsFallback(document.getElementById('analytics-date-range')?.value || '30d');
    const safeData = {
        ...fallback,
        ...(data || {}),
        metrics: data?.metrics || fallback.metrics,
        timelineLabels: data?.timelineLabels || fallback.timelineLabels,
        timeline: data?.timeline || fallback.timeline,
        realtime: data?.realtime || fallback.realtime,
        countries: data?.countries || fallback.countries,
        sources: data?.sources || fallback.sources,
        devices: data?.devices || fallback.devices,
        pages: data?.pages || fallback.pages,
        events: data?.events || fallback.events
    };
    const updatedAt = document.getElementById('analytics-updated-at');
    if (updatedAt) {
        const date = safeData.updatedAt ? new Date(safeData.updatedAt) : new Date();
        updatedAt.textContent = `Updated ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    renderAnalyticsMetrics(safeData.metrics || []);
    drawAnalyticsTrafficChart(safeData.timeline || [], safeData.timelineLabels || []);
    renderRealtimeAnalytics(safeData.realtime || {});
    renderAnalyticsList('analytics-countries', safeData.countries || [], 'value', 'name', 'users');
    renderAnalyticsList('analytics-sources', safeData.sources || [], 'value', 'name', 'sessions');
    renderAnalyticsList('analytics-devices', safeData.devices || [], 'value', 'name', 'users');
    renderAnalyticsTable('analytics-pages', safeData.pages || [], 'title', 'path', 'views');
    renderAnalyticsTable('analytics-events', safeData.events || [], 'name', 'detail', 'count');
    setAnalyticsStatus(safeData, safeData.connected
        ? 'Vercel Web Analytics tracking is active for the production site.'
        : (safeData.message || 'Vercel Web Analytics tracking is ready.'));
}

async function loadAnalyticsPanel(force = false) {
    if (analyticsLoaded && !force) return;
    const range = document.getElementById('analytics-date-range')?.value || '30d';
    setAnalyticsStatus(null, 'Loading analytics...');
    const data = await fetchAnalyticsData(range);
    renderAnalyticsPanel(data);
    analyticsLoaded = true;
}

function initAnalyticsPanel() {
    renderAnalyticsPanel(getAnalyticsFallback('30d'));

    document.getElementById('refresh-analytics-btn')?.addEventListener('click', () => {
        analyticsLoaded = false;
        loadAnalyticsPanel(true);
    });

    document.getElementById('analytics-date-range')?.addEventListener('change', () => {
        analyticsLoaded = false;
        loadAnalyticsPanel(true);
    });
}

function renderSecondaryPanels() {
    const analytics = document.getElementById('analytics-deep-grid');
    const sales = document.getElementById('sales-board');

    if (analytics) {
        analytics.innerHTML = [
            ['Project clicks', '1,247', 'Merkaz leads this week'],
            ['CTA conversion', '10.7%', 'Hero and pricing are strongest'],
            ['Mobile sessions', '68%', 'Keep admin edits image-light'],
            ['Avg. engagement', '02:48', 'Case studies drive depth']
        ].map(item => `<article class="insight-card"><span>${item[0]}</span><strong>${item[1]}</strong><p>${item[2]}</p></article>`).join('');
    }

    if (sales) {
        sales.innerHTML = ['New lead', 'Discovery call', 'Proposal', 'Won'].map((stage, index) => `
            <article class="sales-column">
                <h3>${stage}</h3>
                <div class="sales-ticket">
                    <strong>${['Brand refresh', 'Website rebuild', 'Social kit', 'Campaign system'][index]}</strong>
                    <p>${['Basic', 'Plus', 'Plus', 'Pro'][index]} tier</p>
                </div>
            </article>
        `).join('');
    }
}

const CATEGORY_DEFAULT_TAGS = {
    graphics: 'Graphic Design & Campaign System',
    branding: 'Brand Identity & Visual System',
    web: 'Website Design & Digital Experience'
};

function getStoredCaseStudies() {
    try {
        const raw = localStorage.getItem(TCB_CASE_STUDIES_KEY);
        const stored = JSON.parse(raw || '{}');
        if (raw !== null && stored && typeof stored === 'object' && !Array.isArray(stored)) return stored;
        return getPublishedCaseStudies();
    } catch {
        return getPublishedCaseStudies();
    }
}

function saveStoredCaseStudies(caseStudies) {
    localStorage.setItem(TCB_CASE_STUDIES_KEY, JSON.stringify(caseStudies));
}

function getPublishedCaseStudies() {
    try {
        const stored = JSON.parse(localStorage.getItem(TCB_CASE_STUDIES_PUBLISHED_KEY) || '{}');
        return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
    } catch {
        return {};
    }
}

function getDefaultCaseStudies() {
    return window.TCB_DEFAULT_CASE_STUDIES || {};
}

function splitList(value) {
    return String(value || '')
        .split(/[\n,]+/)
        .map(item => item.trim())
        .filter(Boolean);
}

function joinList(items) {
    return Array.isArray(items) ? items.join('\n') : '';
}

function splitGalleryImages(value) {
    const text = String(value || '').trim();
    if (!text) return [];

    return text.split(/\n+/).map(item => item.trim()).filter(Boolean);
}

function joinGalleryImages(items) {
    return Array.isArray(items) ? items.join('\n') : '';
}

function defaultCaseStudyForProject(project) {
    const gallery = [project.image].filter(Boolean);
    const categoryLabel = CATEGORY_DEFAULT_TAGS[project.category] || project.tag || 'Creative Project';

    return {
        id: project.id,
        title: project.title,
        category: project.tag || categoryLabel,
        year: new Date().getFullYear().toString(),
        image: project.image,
        statement: project.description,
        tags: [project.category, 'Design', 'The Creative Bunch'],
        overview: [
            { title: 'The Challenge', text: 'Define the creative problem clearly and make the project easy to understand at a glance.' },
            { title: 'The Solution', text: 'Build a focused visual system with strong hierarchy, memorable assets, and flexible execution.' },
            { title: 'The Impact', text: 'Create a project presence that feels polished, useful, and ready for real audiences.' }
        ],
        visualTitle: 'Visual Direction',
        visualText: 'A focused visual language built around clarity, rhythm, and a recognizable creative point of view.',
        visualImage: project.image,
        processTitle: 'Design Process',
        process: ['Research', 'Concept', 'Design', 'Refinement', 'Final'],
        processImage: '',
        brandTitle: 'Assets & Brand System',
        palette: ['#E2FF9D', '#200B20', '#E5E2FF', '#A39DBE'],
        system: [
            'Core design logic, typography, and layout rules for the project.',
            'Visual language built around contrast, consistency, and recognizable details.',
            'Reusable across digital, print, campaign, and presentation touchpoints.'
        ],
        brandImage: '',
        gallery,
        pdf: '',
        finalText: 'A complete creative direction prepared to work across the touchpoints that matter.',
        finalImage: project.image
    };
}

function getCaseStudyForAdmin(project) {
    const caseStudies = getStoredCaseStudies();
    return caseStudies[String(project.id)] || getDefaultCaseStudies()[String(project.id)] || defaultCaseStudyForProject(project);
}

async function loadProjectsFromSource() {
    const contentSnapshot = await loadContentApiSnapshot('draft');
    if (contentSnapshot) {
        if (Array.isArray(contentSnapshot.projects) && contentSnapshot.projects.length) {
            saveStoredProjects(contentSnapshot.projects);
        }
        if (contentSnapshot.caseStudies && typeof contentSnapshot.caseStudies === 'object') {
            saveStoredCaseStudies(contentSnapshot.caseStudies);
        }
        if (contentSnapshot.pricing && typeof contentSnapshot.pricing === 'object') {
            saveStoredPricing(contentSnapshot.pricing);
        }
        if (Array.isArray(contentSnapshot.projects) && contentSnapshot.projects.length) {
            return contentSnapshot.projects;
        }
    }

    return getStoredProjects();
}

async function persistProject(project, caseStudy) {
    const projects = getStoredProjects();
    const existingIndex = projects.findIndex(item => String(item.id) === String(project.id));

    if (existingIndex >= 0) {
        projects[existingIndex] = project;
    } else {
        projects.unshift(project);
    }

    saveStoredProjects(projects);

    const caseStudies = getStoredCaseStudies();
    caseStudies[String(project.id)] = caseStudy;
    saveStoredCaseStudies(caseStudies);
    await saveContentApiDraft({ projects, caseStudies });

    return projects;
}

async function publishDraftProjects() {
    const projects = getStoredProjects();
    const caseStudies = getStoredCaseStudies();

    localStorage.setItem(TCB_PROJECTS_PUBLISHED_KEY, JSON.stringify(projects));
    localStorage.setItem(TCB_CASE_STUDIES_PUBLISHED_KEY, JSON.stringify(caseStudies));
    await publishContentApiSnapshot({ projects, caseStudies, pricing: getStoredPricing() });

    return { projects, caseStudies };
}

async function deleteProject(projectId) {
    const projects = getStoredProjects().filter(project => String(project.id) !== String(projectId));
    saveStoredProjects(projects);

    const caseStudies = getStoredCaseStudies();
    delete caseStudies[String(projectId)];
    saveStoredCaseStudies(caseStudies);
    await saveContentApiDraft({ projects, caseStudies });

    return projects;
}

function setFieldValue(id, value) {
    const field = document.getElementById(id);
    if (field) field.value = value || '';
    refreshImagePicker(id);
    if (id === 'gallery-images') refreshGalleryPicker();
    if (id === 'brand-palette') refreshPaletteEditor();
}

function getFieldValue(id) {
    return document.getElementById(id)?.value.trim() || '';
}

function getEditorFields() {
    const form = document.getElementById('project-form');
    if (!form) return [];
    return Array.from(form.querySelectorAll('input, textarea, select'))
        .filter(field => field.id && field.type !== 'file');
}

function getEditorState() {
    return getEditorFields().reduce((state, field) => {
        state[field.id] = field.value;
        return state;
    }, {});
}

function applyEditorState(state) {
    isRestoringEditorState = true;
    Object.entries(state || {}).forEach(([id, value]) => setFieldValue(id, value));
    refreshAllImagePickers();
    refreshGalleryPicker();
    refreshPaletteEditor();
    isRestoringEditorState = false;
}

function resetEditorHistory({ captureInitial = true } = {}) {
    if (captureInitial) {
        editorInitialState = getEditorState();
    }
    editorUndoStack = [getEditorState()];
    editorRedoStack = [];
    updateHistoryButtons();
}

function pushEditorHistory() {
    if (isRestoringEditorState) return;
    const nextState = getEditorState();
    const lastState = editorUndoStack[editorUndoStack.length - 1];
    if (JSON.stringify(nextState) === JSON.stringify(lastState)) return;

    editorUndoStack.push(nextState);
    if (editorUndoStack.length > EDITOR_HISTORY_LIMIT) editorUndoStack.shift();
    editorRedoStack = [];
    updateHistoryButtons();
}

function scheduleEditorHistory() {
    if (isRestoringEditorState) return;
    window.clearTimeout(editorHistoryTimer);
    editorHistoryTimer = window.setTimeout(pushEditorHistory, 260);
}

function updateHistoryButtons() {
    const undoButton = document.getElementById('undo-project-edit');
    const redoButton = document.getElementById('redo-project-edit');
    if (undoButton) undoButton.disabled = editorUndoStack.length <= 1;
    if (redoButton) redoButton.disabled = editorRedoStack.length === 0;
}

function undoEditorChange() {
    if (editorUndoStack.length <= 1) return;
    const current = editorUndoStack.pop();
    editorRedoStack.push(current);
    applyEditorState(editorUndoStack[editorUndoStack.length - 1]);
    updateHistoryButtons();
}

function redoEditorChange() {
    if (!editorRedoStack.length) return;
    const next = editorRedoStack.pop();
    editorUndoStack.push(next);
    applyEditorState(next);
    updateHistoryButtons();
}

function restoreEditorDefault() {
    if (!editorInitialState) return;
    const confirmed = window.confirm('Are you sure you would like to restore to default? This will reset the editor to the state from when you first opened this project.');
    if (!confirmed) return;
    applyEditorState(editorInitialState);
    resetEditorHistory({ captureInitial: false });
    showAdminToast('Restored to the original edit session.', 'success');
}

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function readImageAsOptimizedDataUrl(file) {
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
        const dataUrl = await readFileAsDataUrl(file);
        const uploaded = await uploadContentApiAsset(file.name, dataUrl);
        return uploaded?.url || dataUrl;
    }

    const rawDataUrl = await readFileAsDataUrl(file);

    const optimizedDataUrl = await new Promise(resolve => {
        const image = new Image();
        image.onload = () => {
            const maxSide = 1600;
            const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
            const width = Math.max(1, Math.round(image.width * scale));
            const height = Math.max(1, Math.round(image.height * scale));
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            if (!context) {
                resolve(rawDataUrl);
                return;
            }

            canvas.width = width;
            canvas.height = height;
            context.drawImage(image, 0, 0, width, height);

            try {
                resolve(canvas.toDataURL('image/webp', 0.82));
            } catch {
                resolve(rawDataUrl);
            }
        };
        image.onerror = () => resolve(rawDataUrl);
        image.src = rawDataUrl;
    });

    const uploaded = await uploadContentApiAsset(file.name.replace(/\.[^.]+$/, '.webp'), optimizedDataUrl);
    return uploaded?.url || optimizedDataUrl;
}

function refreshImagePicker(targetId) {
    const target = document.getElementById(targetId);
    const picker = document.querySelector(`[data-image-picker][data-target="${targetId}"]`);
    if (!target || !picker) return;

    const image = picker.querySelector('[data-image-preview]');
    const empty = picker.querySelector('[data-image-empty]');
    const value = target.value;

    if (value) {
        image.src = value;
        image.hidden = false;
        empty.hidden = true;
        picker.classList.add('has-image');
    } else {
        image.removeAttribute('src');
        image.hidden = true;
        empty.hidden = false;
        picker.classList.remove('has-image');
    }
}

function normalizeHexColor(value) {
    const color = String(value || '').trim();
    if (/^#[0-9a-f]{6}$/i.test(color)) return color.toUpperCase();
    if (/^#[0-9a-f]{3}$/i.test(color)) {
        return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`.toUpperCase();
    }
    return '#E2FF9D';
}

function refreshPaletteEditor() {
    const paletteInput = document.getElementById('brand-palette');
    const editor = document.getElementById('palette-editor');
    if (!paletteInput || !editor) return;

    const colors = splitList(paletteInput.value).length
        ? splitList(paletteInput.value).map(normalizeHexColor)
        : ['#E2FF9D', '#200B20', '#E5E2FF'];

    paletteInput.value = colors.join(', ');
    editor.innerHTML = colors.map((color, index) => `
        <div class="palette-color-control" title="${color}">
            <button type="button" class="palette-remove-color" data-palette-remove="${index}" aria-label="Remove palette color ${index + 1}">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <label class="palette-swatch-control" aria-label="Choose palette color ${index + 1}">
                <span style="background:${color}"></span>
                <input type="color" value="${color}" data-palette-index="${index}" aria-label="Palette color ${index + 1}">
            </label>
            <em>HEX</em>
            <input type="text" value="${color}" maxlength="7" data-palette-hex-index="${index}" aria-label="Palette HEX value ${index + 1}">
        </div>
    `).join('') + `
        <button type="button" class="palette-add-color" data-palette-add>
            <i class="fa-solid fa-plus"></i> Add color
        </button>
    `;

    editor.querySelectorAll('[data-palette-index]').forEach(input => {
        input.addEventListener('click', event => event.stopPropagation());
        input.addEventListener('pointerdown', event => event.stopPropagation());
        input.addEventListener('input', () => {
            const nextColors = splitList(paletteInput.value).map(normalizeHexColor);
            const color = input.value.toUpperCase();
            nextColors[Number(input.dataset.paletteIndex)] = color;
            paletteInput.value = nextColors.join(', ');
            const control = input.closest('.palette-color-control');
            const swatch = control?.querySelector('span');
            const hexField = control?.querySelector('[data-palette-hex-index]');
            if (control) control.title = color;
            if (swatch) swatch.style.background = color;
            if (hexField) hexField.value = color;
            scheduleEditorHistory();
        });
        input.addEventListener('change', () => {
            pushEditorHistory();
        });
    });

    editor.querySelectorAll('[data-palette-hex-index]').forEach(input => {
        input.addEventListener('click', event => event.stopPropagation());
        input.addEventListener('pointerdown', event => event.stopPropagation());
        input.addEventListener('input', () => {
            const rawColor = input.value.trim();
            if (!/^#[0-9a-f]{0,6}$/i.test(rawColor)) return;
            const normalized = normalizeHexColor(rawColor);
            const canApply = /^#[0-9a-f]{3}$/i.test(rawColor) || /^#[0-9a-f]{6}$/i.test(rawColor);
            if (!canApply) return;

            const nextColors = splitList(paletteInput.value).map(normalizeHexColor);
            const index = Number(input.dataset.paletteHexIndex);
            nextColors[index] = normalized;
            paletteInput.value = nextColors.join(', ');

            const control = input.closest('.palette-color-control');
            const swatch = control?.querySelector('span');
            const colorInput = control?.querySelector('[data-palette-index]');
            if (control) control.title = normalized;
            if (swatch) swatch.style.background = normalized;
            if (colorInput) colorInput.value = normalized;
            scheduleEditorHistory();
        });
        input.addEventListener('change', () => {
            const normalized = normalizeHexColor(input.value);
            const nextColors = splitList(paletteInput.value).map(normalizeHexColor);
            const index = Number(input.dataset.paletteHexIndex);
            nextColors[index] = normalized;
            paletteInput.value = nextColors.join(', ');
            input.value = normalized;

            const control = input.closest('.palette-color-control');
            const swatch = control?.querySelector('span');
            const colorInput = control?.querySelector('[data-palette-index]');
            if (control) control.title = normalized;
            if (swatch) swatch.style.background = normalized;
            if (colorInput) colorInput.value = normalized;
            pushEditorHistory();
        });
    });

    editor.querySelectorAll('[data-palette-remove]').forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            const nextColors = splitList(paletteInput.value).map(normalizeHexColor);
            nextColors.splice(Number(button.dataset.paletteRemove), 1);
            paletteInput.value = nextColors.join(', ');
            refreshPaletteEditor();
            scheduleEditorHistory();
        });
    });

    editor.querySelector('[data-palette-add]')?.addEventListener('click', () => {
        const nextColors = splitList(paletteInput.value).map(normalizeHexColor);
        nextColors.push('#E2FF9D');
        paletteInput.value = nextColors.join(', ');
        refreshPaletteEditor();
        scheduleEditorHistory();
    });
}

function refreshAllImagePickers() {
    document.querySelectorAll('[data-image-picker]').forEach(picker => {
        refreshImagePicker(picker.dataset.target);
    });
}

function refreshGalleryPicker() {
    const textarea = document.getElementById('gallery-images');
    const preview = document.querySelector('[data-gallery-preview]');
    if (!textarea || !preview) return;

    const images = splitGalleryImages(textarea.value);
    preview.innerHTML = images.length
        ? images.map((image, index) => `
            <figure class="gallery-preview-item">
                <img src="${image}" alt="Gallery image ${index + 1}">
                <button type="button" data-remove-gallery-image="${index}" aria-label="Remove gallery image ${index + 1}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </figure>
        `).join('')
        : '<div class="gallery-empty-state">No gallery images selected yet.</div>';

    preview.querySelectorAll('[data-remove-gallery-image]').forEach(button => {
        button.addEventListener('click', () => {
            const nextImages = splitGalleryImages(textarea.value).filter((_, index) => index !== Number(button.dataset.removeGalleryImage));
            textarea.value = joinGalleryImages(nextImages);
            refreshGalleryPicker();
            scheduleEditorHistory();
        });
    });
}

function initImagePickers() {
    document.querySelectorAll('[data-image-picker]').forEach(picker => {
        if (picker.dataset.pickerBound === 'true') return;
        picker.dataset.pickerBound = 'true';
        const target = document.getElementById(picker.dataset.target);
        const fileInput = picker.querySelector('[data-image-file]');
        const trigger = picker.querySelector('[data-image-trigger]');
        const remove = picker.querySelector('[data-image-remove]');
        if (!target || !fileInput || !trigger) return;

        const openFileDialog = () => fileInput.click();
        picker.addEventListener('click', (event) => {
            if (event.target.closest('[data-image-trigger]') || event.target.closest('[data-image-remove]')) return;
            openFileDialog();
        });
        picker.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            openFileDialog();
        });
        trigger.addEventListener('click', (event) => {
            event.stopPropagation();
            openFileDialog();
        });
        remove?.addEventListener('click', (event) => {
            event.stopPropagation();
            target.value = '';
            refreshImagePicker(target.id);
            scheduleEditorHistory();
        });
        fileInput.addEventListener('change', async () => {
            const file = fileInput.files?.[0];
            if (!file) return;
            target.value = await readImageAsOptimizedDataUrl(file);
            refreshImagePicker(target.id);
            scheduleEditorHistory();
            fileInput.value = '';
        });
    });

    const galleryPicker = document.querySelector('[data-gallery-picker]');
    const galleryFile = galleryPicker?.querySelector('[data-gallery-file]');
    const galleryTrigger = galleryPicker?.querySelector('[data-gallery-trigger]');
    const galleryTextarea = document.getElementById('gallery-images');

    if (galleryPicker && galleryFile && galleryTrigger && galleryTextarea) {
        if (galleryPicker.dataset.pickerBound === 'true') return;
        galleryPicker.dataset.pickerBound = 'true';
        galleryTrigger.addEventListener('click', (event) => {
            event.stopPropagation();
            galleryFile.click();
        });
        galleryFile.addEventListener('change', async () => {
            if (galleryFile.dataset.uploading === 'true') return;
            const files = Array.from(galleryFile.files || []);
            if (!files.length) return;
            galleryFile.dataset.uploading = 'true';

            try {
                const existing = splitGalleryImages(galleryTextarea.value);
                const uploaded = await Promise.all(files.map(readImageAsOptimizedDataUrl));
                galleryTextarea.value = joinGalleryImages(Array.from(new Set([...existing, ...uploaded])));
                refreshGalleryPicker();
                scheduleEditorHistory();
            } finally {
                galleryFile.value = '';
                galleryFile.dataset.uploading = 'false';
            }
        });
    }
}

function showProjectListView() {
    const listView = document.getElementById('project-list-view');
    const editorView = document.getElementById('project-editor-view');
    if (listView) listView.hidden = false;
    if (editorView) editorView.hidden = true;
}

function showProjectEditorView(mode = 'edit') {
    const listView = document.getElementById('project-list-view');
    const editorView = document.getElementById('project-editor-view');
    const title = document.getElementById('project-editor-title');
    if (listView) listView.hidden = true;
    if (editorView) editorView.hidden = false;
    if (title) title.textContent = mode === 'create' ? 'Create project' : 'Edit project';
    refreshProjectLivePreview();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function refreshProjectLivePreview() {
    const frame = document.getElementById('project-live-preview-frame');
    if (!frame) return;
    const projectId = getFieldValue('project-id');
    const previewParams = new URLSearchParams({
        adminPreview: String(Date.now())
    });
    if (projectId) previewParams.set('caseStudyPreview', projectId);
    frame.src = `index.html?${previewParams.toString()}#work`;
}

async function pushDraftLive(status) {
    try {
        await publishDraftProjects();
        refreshProjectLivePreview();
        setStatus(status, 'Draft pushed live locally. The public site now uses this version.', 'success');
        showAdminToast('Draft pushed live.', 'success');
    } catch (error) {
        console.error('Push live failed:', error);
        const message = `Push live failed: ${error?.message || 'Unknown error'}`;
        setStatus(status, message, 'error');
        showAdminToast(message, 'error');
    }
}

function fillProjectForm(project) {
    const caseStudy = getCaseStudyForAdmin(project);
    const overview = Array.isArray(caseStudy.overview) ? caseStudy.overview : [];
    const system = Array.isArray(caseStudy.system) ? caseStudy.system : [];

    setFieldValue('project-id', project.id);
    setFieldValue('project-title', project.title);
    setFieldValue('project-category', project.category);
    setFieldValue('project-tag', project.tag || CATEGORY_DEFAULT_TAGS[project.category]);
    setFieldValue('project-image', project.image);
    setFieldValue('project-description', project.description);
    setFieldValue('case-year', caseStudy.year);
    setFieldValue('case-tags', Array.isArray(caseStudy.tags) ? caseStudy.tags.join(', ') : '');
    setFieldValue('case-statement', caseStudy.statement);
    setFieldValue('case-hero-image', caseStudy.image);
    setFieldValue('overview-challenge-title', overview[0]?.title || 'The Challenge');
    setFieldValue('overview-challenge-text', overview[0]?.text || '');
    setFieldValue('overview-solution-title', overview[1]?.title || 'The Solution');
    setFieldValue('overview-solution-text', overview[1]?.text || '');
    setFieldValue('overview-impact-title', overview[2]?.title || 'The Impact');
    setFieldValue('overview-impact-text', overview[2]?.text || '');
    setFieldValue('visual-title', caseStudy.visualTitle || 'Visual Direction');
    setFieldValue('visual-text', caseStudy.visualText);
    setFieldValue('visual-image', caseStudy.visualImage);
    setFieldValue('process-title', caseStudy.processTitle || 'Design Process');
    setFieldValue('process-steps', Array.isArray(caseStudy.process) ? caseStudy.process.join(', ') : '');
    setFieldValue('process-image', caseStudy.processImage);
    setFieldValue('brand-title', caseStudy.brandTitle || 'Assets & Brand System');
    setFieldValue('brand-system-core', system[0] || '');
    setFieldValue('brand-palette', Array.isArray(caseStudy.palette) ? caseStudy.palette.join(', ') : '');
    setFieldValue('brand-system-language', system[1] || '');
    setFieldValue('brand-system-use', system[2] || '');
    setFieldValue('brand-image', caseStudy.brandImage);
    setFieldValue('gallery-images', joinGalleryImages(caseStudy.gallery));
    setFieldValue('final-text', caseStudy.finalText);
    setFieldValue('final-image', caseStudy.finalImage);
    setFieldValue('case-pdf', caseStudy.pdf);
    refreshAllImagePickers();
    refreshGalleryPicker();
    refreshPaletteEditor();
    resetEditorHistory();
    document.getElementById('project-title').focus();
}

function clearProjectForm() {
    document.getElementById('project-form').reset();
    setFieldValue('project-id', '');
    const category = document.getElementById('project-category')?.value || 'graphics';
    setFieldValue('project-tag', CATEGORY_DEFAULT_TAGS[category]);
    refreshAllImagePickers();
    refreshGalleryPicker();
    refreshPaletteEditor();
    resetEditorHistory();
}

function buildProjectAndCaseStudyFromForm() {
    const existingId = getFieldValue('project-id');
    const project = {
        id: existingId || Date.now(),
        title: getFieldValue('project-title'),
        category: getFieldValue('project-category'),
        tag: getFieldValue('project-tag') || CATEGORY_DEFAULT_TAGS[getFieldValue('project-category')],
        image: getFieldValue('project-image'),
        description: getFieldValue('project-description')
    };

    const heroImage = getFieldValue('case-hero-image');
    const gallery = splitGalleryImages(getFieldValue('gallery-images'));

    const caseStudy = {
        id: project.id,
        title: project.title,
        category: project.tag,
        year: getFieldValue('case-year') || new Date().getFullYear().toString(),
        image: heroImage,
        statement: getFieldValue('case-statement') || project.description,
        tags: splitList(getFieldValue('case-tags')).length ? splitList(getFieldValue('case-tags')) : [project.category, 'Design'],
        overview: [
            { title: getFieldValue('overview-challenge-title') || 'The Challenge', text: getFieldValue('overview-challenge-text') },
            { title: getFieldValue('overview-solution-title') || 'The Solution', text: getFieldValue('overview-solution-text') },
            { title: getFieldValue('overview-impact-title') || 'The Impact', text: getFieldValue('overview-impact-text') }
        ],
        visualTitle: getFieldValue('visual-title') || 'Visual Direction',
        visualText: getFieldValue('visual-text'),
        visualImage: getFieldValue('visual-image'),
        processTitle: getFieldValue('process-title') || 'Design Process',
        process: splitList(getFieldValue('process-steps')).length ? splitList(getFieldValue('process-steps')) : ['Research', 'Concept', 'Design', 'Final'],
        processImage: getFieldValue('process-image'),
        brandTitle: getFieldValue('brand-title') || 'Assets & Brand System',
        palette: splitList(getFieldValue('brand-palette')).length ? splitList(getFieldValue('brand-palette')) : ['#E2FF9D', '#200B20', '#E5E2FF'],
        system: [
            getFieldValue('brand-system-core'),
            getFieldValue('brand-system-language'),
            getFieldValue('brand-system-use')
        ],
        brandImage: getFieldValue('brand-image'),
        gallery,
        pdf: getFieldValue('case-pdf'),
        finalText: getFieldValue('final-text'),
        finalImage: getFieldValue('final-image')
    };

    return { project, caseStudy };
}

function renderProjectAdminList(projects) {
    const list = document.getElementById('project-admin-list');
    if (!list) return;

    list.innerHTML = projects.map(project => `
        <article class="project-admin-item project-admin-card">
            ${project.image
                ? `<img src="${project.image}" alt="${project.title}">`
                : '<div class="project-admin-image-placeholder"><i class="fa-regular fa-image"></i><span>No image</span></div>'}
            <div class="project-admin-card-body">
                <span>${project.category}</span>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <small>${project.tag}</small>
            </div>
            <div class="project-admin-actions">
                <button type="button" data-edit-project="${project.id}">Edit</button>
                <button type="button" class="danger-action" data-delete-project="${project.id}">Delete</button>
            </div>
        </article>
    `).join('') + `
        <button type="button" class="project-create-card" id="create-project-card">
            <span><i class="fa-solid fa-plus"></i></span>
            <strong>Create project</strong>
            <p>Add a new Selected Work card and build its case study popup.</p>
        </button>
    `;

    list.querySelectorAll('[data-edit-project]').forEach(button => {
        button.addEventListener('click', () => {
            const project = projects.find(item => String(item.id) === String(button.dataset.editProject));
            if (project) {
                fillProjectForm(project);
                showProjectEditorView('edit');
            }
        });
    });

    list.querySelectorAll('[data-delete-project]').forEach(button => {
        button.addEventListener('click', async () => {
            const project = projects.find(item => String(item.id) === String(button.dataset.deleteProject));
            const confirmed = window.confirm(`Delete ${project?.title || 'this project'}? This will also remove its local case study content.`);
            if (!confirmed) return;

            const nextProjects = await deleteProject(button.dataset.deleteProject);
            renderProjectAdminList(nextProjects);
        });
    });

    list.querySelector('#create-project-card')?.addEventListener('click', () => {
        clearProjectForm();
        showProjectEditorView('create');
    });
}

async function initProjectEditor() {
    const form = document.getElementById('project-form');
    if (!form) return;

    const status = document.getElementById('project-form-status');
    const saveButton = document.getElementById('save-project-btn');
    const pushLiveButton = document.getElementById('push-live-btn');
    const categoryField = document.getElementById('project-category');
    const tagField = document.getElementById('project-tag');
    const createButton = document.getElementById('create-project-btn');
    const backButton = document.getElementById('back-to-projects-btn');
    const cancelButton = document.getElementById('cancel-project-edit');
    const undoButton = document.getElementById('undo-project-edit');
    const redoButton = document.getElementById('redo-project-edit');
    const restoreButton = document.getElementById('restore-project-default');
    const projects = await loadProjectsFromSource();
    saveStoredProjects(projects);
    renderProjectAdminList(projects);
    initImagePickers();
    showProjectListView();

    categoryField?.addEventListener('change', () => {
        const nextDefault = CATEGORY_DEFAULT_TAGS[categoryField.value] || '';
        if (!tagField.value || Object.values(CATEGORY_DEFAULT_TAGS).includes(tagField.value)) {
            tagField.value = nextDefault;
        }
    });

    const saveCurrentProject = async () => {
        if (isSavingProject) return;
        isSavingProject = true;
        if (saveButton) {
            saveButton.disabled = true;
            saveButton.dataset.originalText = saveButton.textContent;
            saveButton.textContent = 'Saving...';
        }

        try {
            const { project, caseStudy } = buildProjectAndCaseStudyFromForm();

            if (!project.title || !project.category || !project.tag || !project.description) {
                setStatus(status, 'Please complete the project title, category, tag, and short description before saving.', 'error');
                showAdminToast('Please complete the required project fields first.', 'error');
                return;
            }

            const nextProjects = await persistProject(project, caseStudy);
            renderProjectAdminList(nextProjects);
            setFieldValue('project-id', project.id);
            resetEditorHistory({ captureInitial: false });
            refreshProjectLivePreview();
            setStatus(status, 'Your project draft has been successfully saved. Preview updated only.', 'success');
            showAdminToast('Draft saved. Preview updated.', 'success');
        } catch (error) {
            console.error('Project save failed:', error);
            const message = error?.name === 'QuotaExceededError'
                ? 'Save failed because browser storage is full. Try removing unused uploaded images or use smaller WebP files.'
                : `Save failed: ${error?.message || 'Unknown error'}`;
            setStatus(status, message, 'error');
            showAdminToast(message, 'error');
        } finally {
            isSavingProject = false;
            if (saveButton) {
                saveButton.disabled = false;
                saveButton.textContent = saveButton.dataset.originalText || 'Save project';
            }
        }
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        await saveCurrentProject();
    });
    saveButton?.addEventListener('click', saveCurrentProject);
    pushLiveButton?.addEventListener('click', async () => {
        pushLiveButton.disabled = true;
        pushLiveButton.dataset.originalText = pushLiveButton.textContent;
        pushLiveButton.textContent = 'Pushing...';
        await pushDraftLive(status);
        pushLiveButton.disabled = false;
        pushLiveButton.textContent = pushLiveButton.dataset.originalText || 'Push live';
    });

    document.getElementById('clear-project-form')?.addEventListener('click', () => {
        clearProjectForm();
        setStatus(status, 'Editor cleared. You can create a fresh project now.', 'success');
    });
    form.addEventListener('input', (event) => {
        if (event.target.id === 'brand-palette') {
            refreshPaletteEditor();
        }
        scheduleEditorHistory();
    });
    form.addEventListener('change', scheduleEditorHistory);
    undoButton?.addEventListener('click', undoEditorChange);
    redoButton?.addEventListener('click', redoEditorChange);
    restoreButton?.addEventListener('click', restoreEditorDefault);
    document.getElementById('refresh-preview-btn')?.addEventListener('click', refreshProjectLivePreview);
    createButton?.addEventListener('click', () => {
        clearProjectForm();
        showProjectEditorView('create');
    });
    backButton?.addEventListener('click', showProjectListView);
    cancelButton?.addEventListener('click', showProjectListView);
    document.getElementById('reset-projects-btn')?.addEventListener('click', () => {
        saveStoredProjects(DEFAULT_PROJECTS);
        saveStoredCaseStudies({});
        renderProjectAdminList(DEFAULT_PROJECTS);
        clearProjectForm();
        showProjectListView();
        setStatus(status, 'Default project data and case studies restored.', 'success');
    });

    clearProjectForm();
}

function renderPricingTierEditors(pricing) {
    const grid = document.getElementById('pricing-tier-editor-grid');
    if (!grid) return;

    grid.innerHTML = pricing.tiers.map((tier, index) => `
        <article class="pricing-tier-editor-card" data-pricing-tier="${escapeAdminHtml(tier.id)}">
            <div class="pricing-tier-editor-heading">
                <span>${String(index + 1).padStart(2, '0')}</span>
                <div>
                    <h3>${escapeAdminHtml(tier.name)}</h3>
                    <p>${escapeAdminHtml(tier.symbol)} tier block</p>
                </div>
            </div>
            <input type="hidden" id="pricing-tier-${index}-id" value="${escapeAdminHtml(tier.id)}">
            <label for="pricing-tier-${index}-name">Tier name</label>
            <input id="pricing-tier-${index}-name" type="text" value="${escapeAdminHtml(tier.name)}">
            <div class="form-grid-2">
                <div>
                    <label for="pricing-tier-${index}-symbol">Symbol</label>
                    <input id="pricing-tier-${index}-symbol" type="text" value="${escapeAdminHtml(tier.symbol)}" placeholder="$">
                </div>
                <div>
                    <label for="pricing-tier-${index}-cta">Button text</label>
                    <input id="pricing-tier-${index}-cta" type="text" value="${escapeAdminHtml(tier.ctaLabel || 'Select')}" placeholder="Select">
                </div>
            </div>
            <label for="pricing-tier-${index}-description">Description</label>
            <textarea id="pricing-tier-${index}-description" rows="3">${escapeAdminHtml(tier.description || '')}</textarea>
            <div class="pricing-feature-builder" data-pricing-feature-builder="${index}">
                <div class="pricing-feature-builder-heading">
                    <label>Features</label>
                    <button type="button" class="admin-secondary-btn pricing-feature-add" data-pricing-feature-add="${index}">
                        <i class="fa-solid fa-plus"></i> Add feature
                    </button>
                </div>
                <div class="pricing-feature-list">
                    ${tier.features.map((feature, featureIndex) => renderPricingFeatureRow(index, feature, featureIndex)).join('')}
                </div>
            </div>
        </article>
    `).join('');

    bindPricingFeatureControls();
}

function renderPricingFeatureRow(tierIndex, feature = {}, featureIndex = 0) {
    const normalized = normalizePricingFeature(feature);
    return `
        <div class="pricing-feature-row" data-pricing-feature-row="${tierIndex}">
            <span class="pricing-feature-preview"><i class="${escapeAdminHtml(normalized.icon)}"></i></span>
            <div>
                <label>Feature text</label>
                <input type="text" data-pricing-feature-text value="${escapeAdminHtml(normalized.text)}" placeholder="Graphic design essentials">
            </div>
            <div>
                <label>Icon class</label>
                <input type="text" data-pricing-feature-icon value="${escapeAdminHtml(normalized.icon)}" placeholder="fa-solid fa-check">
            </div>
            <button type="button" class="pricing-feature-remove" data-pricing-feature-remove aria-label="Remove feature ${featureIndex + 1}">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `;
}

function bindPricingFeatureControls() {
    document.querySelectorAll('[data-pricing-feature-add]').forEach(button => {
        if (button.dataset.featureControlBound === 'true') return;
        button.dataset.featureControlBound = 'true';
        button.addEventListener('click', () => {
            const tierIndex = Number(button.dataset.pricingFeatureAdd);
            const builder = document.querySelector(`[data-pricing-feature-builder="${tierIndex}"] .pricing-feature-list`);
            if (!builder) return;
            builder.insertAdjacentHTML('beforeend', renderPricingFeatureRow(tierIndex, { icon: 'fa-solid fa-check', text: '' }, builder.children.length));
            bindPricingFeatureControls();
            pushPricingHistory();
        });
    });

    document.querySelectorAll('[data-pricing-feature-remove]').forEach(button => {
        if (button.dataset.featureControlBound === 'true') return;
        button.dataset.featureControlBound = 'true';
        button.addEventListener('click', () => {
            button.closest('[data-pricing-feature-row]')?.remove();
            pushPricingHistory();
        });
    });

    document.querySelectorAll('[data-pricing-feature-icon]').forEach(input => {
        if (input.dataset.featureControlBound === 'true') return;
        input.dataset.featureControlBound = 'true';
        input.addEventListener('input', () => {
            const preview = input.closest('[data-pricing-feature-row]')?.querySelector('.pricing-feature-preview i');
            if (preview) preview.className = input.value.trim() || 'fa-solid fa-check';
            schedulePricingHistory();
        });
    });

    document.querySelectorAll('[data-pricing-feature-text]').forEach(input => {
        if (input.dataset.featureControlBound === 'true') return;
        input.dataset.featureControlBound = 'true';
        input.addEventListener('input', schedulePricingHistory);
    });
}

function getPricingEditorState() {
    return buildPricingFromForm();
}

function applyPricingEditorState(state) {
    isRestoringPricingState = true;
    fillPricingForm(state);
    isRestoringPricingState = false;
}

function resetPricingHistory() {
    pricingUndoStack = [getPricingEditorState()];
    pricingRedoStack = [];
    updatePricingHistoryButtons();
}

function updatePricingHistoryButtons() {
    const undoButton = document.getElementById('undo-pricing-edit');
    const redoButton = document.getElementById('redo-pricing-edit');
    if (undoButton) undoButton.disabled = pricingUndoStack.length <= 1;
    if (redoButton) redoButton.disabled = pricingRedoStack.length === 0;
}

function pushPricingHistory() {
    if (isRestoringPricingState) return;
    const nextState = getPricingEditorState();
    const lastState = pricingUndoStack[pricingUndoStack.length - 1];
    if (JSON.stringify(nextState) === JSON.stringify(lastState)) return;

    pricingUndoStack.push(nextState);
    if (pricingUndoStack.length > EDITOR_HISTORY_LIMIT) pricingUndoStack.shift();
    pricingRedoStack = [];
    updatePricingHistoryButtons();
}

function schedulePricingHistory() {
    if (isRestoringPricingState) return;
    window.clearTimeout(pricingHistoryTimer);
    pricingHistoryTimer = window.setTimeout(pushPricingHistory, 260);
}

function undoPricingChange() {
    if (pricingUndoStack.length <= 1) return;
    const current = pricingUndoStack.pop();
    pricingRedoStack.push(current);
    applyPricingEditorState(pricingUndoStack[pricingUndoStack.length - 1]);
    updatePricingHistoryButtons();
}

function redoPricingChange() {
    if (!pricingRedoStack.length) return;
    const next = pricingRedoStack.pop();
    pricingUndoStack.push(next);
    applyPricingEditorState(next);
    updatePricingHistoryButtons();
}

function fillPricingForm(pricing = getStoredPricing()) {
    const normalized = normalizePricingData(pricing);
    setFieldValue('pricing-eyebrow', normalized.eyebrow);
    setFieldValue('pricing-title', normalized.title);
    setFieldValue('pricing-description', normalized.description);
    setFieldValue('pricing-recommended', normalized.recommendedId);
    renderPricingTierEditors(normalized);
}

function buildPricingFromForm() {
    const current = normalizePricingData(getStoredPricing());
    const tiers = current.tiers.map((tier, index) => ({
        id: getFieldValue(`pricing-tier-${index}-id`) || tier.id,
        name: getFieldValue(`pricing-tier-${index}-name`) || tier.name,
        symbol: getFieldValue(`pricing-tier-${index}-symbol`) || tier.symbol,
        ctaLabel: getFieldValue(`pricing-tier-${index}-cta`) || 'Select',
        badge: '',
        description: getFieldValue(`pricing-tier-${index}-description`),
        features: Array.from(document.querySelectorAll(`[data-pricing-feature-row="${index}"]`))
            .map(row => ({
                icon: row.querySelector('[data-pricing-feature-icon]')?.value.trim() || 'fa-solid fa-check',
                text: row.querySelector('[data-pricing-feature-text]')?.value.trim() || ''
            }))
            .filter(feature => feature.text)
    }));

    return normalizePricingData({
        eyebrow: getFieldValue('pricing-eyebrow'),
        title: getFieldValue('pricing-title'),
        description: getFieldValue('pricing-description'),
        recommendedId: getFieldValue('pricing-recommended'),
        ctaLabel: current.ctaLabel,
        ctaHref: current.ctaHref,
        tiers
    });
}

function refreshPricingPreview() {
    const frame = document.getElementById('pricing-live-preview-frame');
    if (!frame) return;
    const previewParams = new URLSearchParams({
        adminPreview: String(Date.now()),
        pricingPreview: '1'
    });
    frame.src = `index.html?${previewParams.toString()}#pricing`;
}

async function savePricingDraft(status) {
    const pricing = buildPricingFromForm();
    if (!pricing.title || !pricing.description || !pricing.tiers.every(tier => tier.name && tier.symbol && tier.description)) {
        setStatus(status, 'Please complete the pricing title, description, and all tier name/symbol/description fields.', 'error');
        showAdminToast('Please complete the required pricing fields first.', 'error');
        return;
    }

    saveStoredPricing(pricing);
    await saveContentApiDraft({ pricing });
    fillPricingForm(pricing);
    resetPricingHistory();
    refreshPricingPreview();
    setStatus(status, 'Pricing draft saved. Preview updated only.', 'success');
    showAdminToast('Pricing draft saved.', 'success');
}

async function pushPricingLive(status) {
    try {
        saveStoredPricing(buildPricingFromForm());
        const pricing = publishDraftPricing();
        await publishContentApiSnapshot({ projects: getStoredProjects(), caseStudies: getStoredCaseStudies(), pricing });
        refreshPricingPreview();
        setStatus(status, 'Pricing draft pushed live locally. The public site now uses this pricing version.', 'success');
        showAdminToast('Pricing pushed live.', 'success');
    } catch (error) {
        const message = `Pricing push failed: ${error?.message || 'Unknown error'}`;
        setStatus(status, message, 'error');
        showAdminToast(message, 'error');
    }
}

function initPricingEditor() {
    const form = document.getElementById('pricing-form');
    if (!form) return;

    const status = document.getElementById('pricing-form-status');
    fillPricingForm(getStoredPricing());
    resetPricingHistory();
    refreshPricingPreview();

    const saveDraft = () => savePricingDraft(status);
    document.getElementById('save-pricing-btn')?.addEventListener('click', saveDraft);
    document.getElementById('save-pricing-btn-bottom')?.addEventListener('click', saveDraft);
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        saveDraft();
    });

    const refresh = () => {
        saveStoredPricing(buildPricingFromForm());
        refreshPricingPreview();
        setStatus(status, 'Pricing preview refreshed from the current draft fields.', 'success');
    };
    document.getElementById('refresh-pricing-preview-btn')?.addEventListener('click', refresh);
    document.getElementById('refresh-pricing-preview-btn-top')?.addEventListener('click', refresh);

    document.getElementById('push-pricing-live-btn')?.addEventListener('click', () => pushPricingLive(status));
    document.getElementById('undo-pricing-edit')?.addEventListener('click', undoPricingChange);
    document.getElementById('redo-pricing-edit')?.addEventListener('click', redoPricingChange);
    form.addEventListener('input', (event) => {
        if (event.target.closest('[data-pricing-feature-row]')) return;
        schedulePricingHistory();
    });
    form.addEventListener('change', (event) => {
        if (event.target.closest('[data-pricing-feature-row]')) return;
        schedulePricingHistory();
    });
    document.getElementById('reset-pricing-btn')?.addEventListener('click', () => {
        const confirmed = window.confirm('Reset pricing editor to the default three pricing cards?');
        if (!confirmed) return;
        const defaults = clonePricingData(DEFAULT_PRICING);
        saveStoredPricing(defaults);
        fillPricingForm(defaults);
        resetPricingHistory();
        refreshPricingPreview();
        setStatus(status, 'Pricing defaults restored in draft mode.', 'success');
        showAdminToast('Pricing defaults restored.', 'success');
    });
    document.getElementById('clear-pricing-form')?.addEventListener('click', () => {
        form.querySelectorAll('input:not([type="hidden"]), textarea').forEach(field => {
            field.value = '';
        });
        const recommended = document.getElementById('pricing-recommended');
        if (recommended) recommended.value = 'plus';
        pushPricingHistory();
        setStatus(status, 'Pricing fields cleared. Fill them in and save a new draft.', 'success');
    });
}

function initSettings() {
    const email = document.getElementById('settings-admin-email');
    const authMode = document.getElementById('settings-auth-mode');
    const source = document.getElementById('settings-project-source');
    const pricingSource = document.getElementById('settings-pricing-source');

    if (email) email.textContent = getSessionEmail();
    if (authMode) authMode.textContent = 'Vercel Content API auth';
    if (source) source.textContent = 'Vercel Content API draft/public';
    if (pricingSource) pricingSource.textContent = 'Vercel Content API pricing draft/public';
}

async function clearAdminCache() {
    [
        TCB_PROJECTS_KEY,
        TCB_PROJECTS_PUBLISHED_KEY,
        TCB_CASE_STUDIES_KEY,
        TCB_CASE_STUDIES_PUBLISHED_KEY,
        TCB_PRICING_KEY,
        TCB_PRICING_PUBLISHED_KEY
    ].forEach(key => localStorage.removeItem(key));

    if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
    }

    showAdminToast('Cache cleared. Reloading fresh content from Vercel.', 'success', { icon: 'fa-solid fa-broom' });
    window.setTimeout(() => {
        window.location.reload();
    }, 850);
}

function initClearCacheButton() {
    const button = document.getElementById('clear-cache-btn');
    if (!button) return;

    button.addEventListener('click', async () => {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Clearing';
        try {
            await clearAdminCache();
        } catch (error) {
            console.warn('Cache clear failed.', error);
            showAdminToast('Could not clear every cache, but local content cache was reset.', 'error', { icon: 'fa-solid fa-triangle-exclamation' });
            button.disabled = false;
            button.innerHTML = button.dataset.originalText || '<i class="fa-solid fa-broom"></i> Clear cache';
        }
    });
}

async function initLogout() {
    const button = document.getElementById('logout-btn');
    if (!button) return;

    button.addEventListener('click', async () => {
        try {
            await logoutContentApi();
        } catch (error) {
            console.warn('Remote logout failed. Clearing local session anyway.', error);
        }
        clearLocalSession();
        window.location.href = 'login.html';
    });
}

async function initDashboard() {
    if (!document.body.classList.contains('admin-page')) return;
    const allowed = await ensureDashboardAccess();
    if (!allowed) return;

    initNavigation();
    renderMetrics();
    drawVisitorsChart();
    renderCountryList();
    renderMeetings();
    renderActivity();
    renderSecondaryPanels();
    initAnalyticsPanel();
    initProjectEditor();
    initPricingEditor();
    initSettings();
    initClearCacheButton();
    initLogout();
}

document.addEventListener('DOMContentLoaded', () => {
    handleLoginPage();
    initDashboard();
});



