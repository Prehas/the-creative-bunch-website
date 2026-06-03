// Project Data Fallback (in case of CORS issues running locally on file://)
const fallbackProjects = [
    {
        "id": 1,
        "title": "Merkaz Israel 76 Campaign",
        "category": "graphics",
        "tag": "Event Poster & Campaign Design",
        "description": "Visual campaign materials for Merkaz, promoting the Israel 76 cultural event with bold typography, clean layout, and community-focused imagery.",
        "image": "assets/project_merkaz_thumb.webp"
    },
    {
        "id": 7,
        "title": "Infinik Logo",
        "category": "branding",
        "tag": "Logo Design & Brand Mark",
        "description": "Futuristic identity mark for Infinik, pairing a geometric infinity symbol with a sharp, digital wordmark system.",
        "image": "assets/project_infinik_logo_thumb.webp"
    },
    {
        "id": 10,
        "title": "Every Idea Has a Form",
        "category": "branding",
        "tag": "Print & Object Branding",
        "description": "Every idea deserves a form. We transform it into print - on paper, fabric, or objects. The format does not matter. What matters is your vision.",
        "image": "assets/project_every_idea_form_thumb.webp"
    },
    {
        "id": 9,
        "title": "JCC Brochure",
        "category": "graphics",
        "tag": "Brochure & Community Campaign",
        "description": "High-energy brochure cover for JCC Bucharest, combining cultural photography, bold typography, and event-led visual storytelling.",
        "image": "assets/project_jcc_brochure_thumb.webp"
    },
    {
        "id": 8,
        "title": "Creative Alex Website",
        "category": "web",
        "tag": "Portfolio Website Design",
        "description": "Website direction and visual presentation for creativealex.eu, built around bold portfolio thumbnails and a clean creator-first experience.",
        "image": "assets/project_creativealex_website_thumb.webp"
    },
    {
        "id": 101,
        "title": "Cultural Identity Sprint",
        "category": "branding",
        "tag": "Demo Brand System",
        "description": "A fictional identity sprint used to test how extra work cards flow into the second Selected Work page.",
        "image": ""
    },
    {
        "id": 102,
        "title": "Social Launch Kit",
        "category": "graphics",
        "tag": "Demo Campaign Content",
        "description": "A fictional social content kit used to preview pagination, filters, and case-study placeholders.",
        "image": ""
    }
];

const CASE_STUDIES = {
    1: {
        id: 1,
        title: "Merkaz Israel 76 Campaign",
        category: "Event Poster & Campaign Design",
        year: "2024",
        image: "assets/project_merkaz_thumb.webp",
        statement: "A visual campaign made for Merkaz, promoting the Israel 76 cultural event with bold typography, clean layout, and community-focused imagery.",
        tags: ["Graphic Design", "Print", "Branding"],
        overview: [
            { title: "The Challenge", text: "Create a visual identity that celebrates Israel 76 in a modern, approachable way, while staying clear enough for fast event communication." },
            { title: "The Solution", text: "Bold typography, national symbols, and a poster-first system that could move from print into social and community channels." },
            { title: "The Impact", text: "A campaign language that feels proud, legible, and memorable across event posters, digital previews, and public-facing assets." }
        ],
        visualTitle: "Visual Direction",
        visualText: "We combined event clarity with symbolic movement: large type, confident blue, air, flags, and clean hierarchy that could read from a poster wall or a phone screen.",
        process: ["Research", "Concept", "Sketches", "Design", "Refinement", "Final"],
        palette: ["#F5F7FB", "#0E65D8", "#0642A4", "#061A3C", "#DEFF87"],
        system: ["Bold, condensed, readable from distance.", "Flag motion, clear blocks, campaign-first hierarchy.", "Poster, social preview, community announcement, event visual."],
        gallery: ["assets/project_merkaz_thumb.webp", "assets/project_merkaz_thumb.webp", "assets/project_merkaz_thumb.webp"],
        finalText: "A focused campaign system for a cultural event: direct, vivid, and built to feel recognizable across every touchpoint."
    },
    7: {
        id: 7,
        title: "Infinik Logo",
        category: "Logo Design & Brand Mark",
        year: "2025",
        image: "assets/project_infinik_logo_thumb.webp",
        statement: "A futuristic identity mark built around a geometric infinity symbol, neon contrast, and a digital wordmark system.",
        tags: ["Branding", "Logo", "Digital Identity"],
        overview: [
            { title: "The Challenge", text: "Give a tech-forward name a visual mark that feels sharp, scalable, and memorable without becoming generic." },
            { title: "The Solution", text: "A continuous angular form paired with a precise wordmark, using electric teal and magenta as a small but recognizable accent system." },
            { title: "The Impact", text: "A compact identity that works as a dark-mode logo, social mark, presentation header, and product-style brand symbol." }
        ],
        visualTitle: "Identity Logic",
        visualText: "The symbol leans into continuity and motion, while the wordmark keeps the system grounded in a clean digital language.",
        process: ["Direction", "Symbol", "Wordmark", "Contrast", "Lockup", "Final"],
        palette: ["#001016", "#08C7A9", "#FF1493", "#F4F7F8", "#0A2730"],
        system: ["Angular infinity symbol with high recognizability.", "Dark-first palette with a controlled neon accent.", "Logo lockup suited for decks, avatars, and product surfaces."],
        gallery: ["assets/project_infinik_logo_thumb.webp", "assets/project_infinik_logo_thumb.webp", "assets/project_infinik_logo_thumb.webp"],
        finalText: "A clean, futuristic logo system with enough personality to stand alone and enough restraint to scale."
    },
    10: {
        id: 10,
        title: "Every Idea Has a Form",
        category: "Print & Object Branding",
        year: "2025",
        image: "assets/project_every_idea_form_thumb.webp",
        statement: "A print and object branding concept about turning ideas into physical formats: paper, fabric, objects, and whatever the message needs.",
        tags: ["Branding", "Print", "Objects"],
        overview: [
            { title: "The Challenge", text: "Show that a visual idea can move beyond a screen and become something tactile, useful, and giftable." },
            { title: "The Solution", text: "A simple black illustration system applied to physical objects, keeping the focus on form, surface, and craft." },
            { title: "The Impact", text: "A flexible identity direction that can become merchandise, packaging, event objects, or custom print material." }
        ],
        visualTitle: "Object System",
        visualText: "The mockup treats the object as the hero. Minimal color, strong contrast, and a physical surface make the idea feel concrete.",
        process: ["Idea", "Surface", "Illustration", "Mockup", "Material", "Final"],
        palette: ["#F4F2EE", "#101010", "#D9D5CD", "#FFFFFF", "#6E6A64"],
        system: ["Monochrome illustration that can sit on many materials.", "Object-first layout for strong tactile storytelling.", "Flexible print logic for paper, fabric, mugs, and campaign objects."],
        gallery: ["assets/project_every_idea_form_thumb.webp", "assets/project_every_idea_form_thumb.webp", "assets/project_every_idea_form_thumb.webp"],
        finalText: "A small object campaign that says the studio can take a visual idea and make it feel real."
    },
    9: {
        id: 9,
        title: "JCC Brochure",
        category: "Brochure & Community Campaign",
        year: "2026",
        image: "assets/project_jcc_brochure_thumb.webp",
        statement: "A high-energy brochure direction for JCC Bucharest, built around cultural photography, bold typography, and event-led visual storytelling.",
        tags: ["Graphics", "Brochure", "Community"],
        overview: [
            { title: "The Challenge", text: "Present a broad cultural program in a way that feels energetic, readable, and inviting for different audiences." },
            { title: "The Solution", text: "A collage-led cover, strong Romanian headlines, and color-coded event tags that make the brochure easy to scan." },
            { title: "The Impact", text: "A community-facing piece that can work as a printed brochure, a digital PDF, and a campaign preview." }
        ],
        visualTitle: "Brochure Experience",
        visualText: "The cover uses scale, color, and cultural photography to make the program feel active before the reader opens the PDF.",
        process: ["Content", "Hierarchy", "Cover", "PDF", "Review", "Final"],
        palette: ["#079FB0", "#FFFFFF", "#006BC8", "#F6D735", "#E93ACB"],
        system: ["Big Romanian headline hierarchy.", "Color-coded activity labels for fast scanning.", "PDF-ready layout for sharing and printing."],
        gallery: ["assets/project_jcc_brochure_thumb.webp", "assets/project_jcc_brochure_thumb.webp", "assets/project_jcc_brochure_thumb.webp"],
        pdf: "assets/jcc_brochure.pdf",
        finalText: "A brochure system with a strong cover, clear community message, and direct access to the full PDF."
    },
    8: {
        id: 8,
        title: "Creative Alex Website",
        category: "Portfolio Website Design",
        year: "2025",
        image: "assets/project_creativealex_website_thumb.webp",
        statement: "Website direction and visual presentation for creativealex.eu, centered on a Marketing Designer & 3D Artist portfolio with bold project previews.",
        tags: ["Website", "Portfolio", "3D"],
        overview: [
            { title: "The Challenge", text: "Present a multidisciplinary creator without flattening the work into a generic portfolio grid." },
            { title: "The Solution", text: "A cinematic hero, high-contrast purple energy, and project thumbnails that make 3D, product, and graphic work feel connected." },
            { title: "The Impact", text: "A creator-first web presence that quickly communicates skill range and gives visitors a clear path into the projects." }
        ],
        visualTitle: "Website Language",
        visualText: "The site leans on dark surfaces, purple light, and strong thumbnails. The result feels like a digital portfolio, not a static resume.",
        process: ["Audit", "Hero", "Projects", "Interaction", "Responsive", "Launch"],
        palette: ["#05050B", "#D148FF", "#FFFFFF", "#7A35FF", "#161126"],
        system: ["Hero message: Marketing Designer & 3D Artist at your service.", "Project thumbnails from YOCU, PlayGG, 3D, and graphic design surfaces.", "Clear navigation across Home, Projects, About Me, and Let's Talk."],
        gallery: ["assets/project_creativealex_website_thumb.webp", "assets/creativealex_yocu.webp", "assets/creativealex_playgg.webp", "assets/creativealex_3d.webp", "assets/creativealex_graphic.webp"],
        finalText: "A bold portfolio website that gives the work an immediate stage and makes the creator's range easy to understand."
    },
    101: {
        id: 101,
        title: "Cultural Identity Sprint",
        category: "Demo Brand System",
        year: "2026",
        image: "",
        statement: "A fictional identity sprint created to test the Selected Work pagination and popup preview experience.",
        tags: ["Branding", "Demo", "System"],
        overview: [
            { title: "The Challenge", text: "Test how additional projects behave once the first five cards fill the primary layout." },
            { title: "The Solution", text: "Use a clean demo project with no required imagery, relying on placeholders and clear hierarchy." },
            { title: "The Impact", text: "The portfolio can scale without breaking the premium five-card presentation." }
        ],
        visualTitle: "Visual Direction",
        visualText: "Placeholder-led identity direction with enough structure to validate the case-study layout.",
        process: ["Research", "Concept", "System", "Preview"],
        palette: ["#E2FF9D", "#200B20", "#E5E2FF"],
        system: ["Demo logo logic.", "Cultural visual cues.", "Reusable identity blocks."],
        gallery: [],
        finalText: "A scalable placeholder case study for frontend testing."
    },
    102: {
        id: 102,
        title: "Social Launch Kit",
        category: "Demo Campaign Content",
        year: "2026",
        image: "",
        statement: "A fictional launch kit created to test page two of the Selected Work carousel.",
        tags: ["Graphics", "Social", "Demo"],
        overview: [
            { title: "The Challenge", text: "Show that the portfolio can paginate beyond the first five selected projects." },
            { title: "The Solution", text: "Add a demo campaign card that uses the same case-study architecture." },
            { title: "The Impact", text: "Extra projects remain accessible without making the landing page feel crowded." }
        ],
        visualTitle: "Campaign Logic",
        visualText: "A placeholder campaign system for validating animation, pagination, and popup behavior.",
        process: ["Brief", "Content Map", "Design", "Launch"],
        palette: ["#DEFF87", "#261025", "#A39DBE"],
        system: ["Post templates.", "Launch messaging.", "Reusable social rhythm."],
        gallery: [],
        finalText: "A demo social launch page for stress-testing the Selected Work section."
    }
};

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

function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = String(value || '');
    return div.innerHTML;
}

function initVercelAnalytics() {
    if (window.__tcbVercelAnalyticsLoaded) return;
    window.__tcbVercelAnalyticsLoaded = true;
    window.va = window.va || function va() {
        (window.vaq = window.vaq || []).push(arguments);
    };

    const script = document.createElement('script');
    script.defer = true;
    script.src = '/_vercel/insights/script.js';
    document.head.appendChild(script);
}

function trackTcbEvent(name, params = {}) {
    if (typeof window.va !== 'function') return;
    window.va('event', name, params);
}

let contentApiCaseStudies = {};

function getContentApiBase() {
    return String(window.TCB_CONTENT_API_CONFIG?.baseUrl || '').replace(/\/$/, '');
}

function isContentApiEnabled() {
    return Boolean(getContentApiBase());
}

async function fetchContentApi(path, options = {}) {
    if (!isContentApiEnabled()) return null;
    const response = await fetch(`${getContentApiBase()}${path}`, {
        credentials: 'include',
        cache: 'no-store',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    });
    if (!response.ok) throw new Error(`Content API ${path} failed with ${response.status}`);
    return response.json();
}

async function loadContentBootstrap(stage = 'published') {
    try {
        return await fetchContentApi(`/api/bootstrap?stage=${encodeURIComponent(stage)}`);
    } catch (error) {
        console.warn('Content API unavailable. Using local/static content fallback.', error);
        return null;
    }
}

function initAnalyticsEventTracking() {
    document.addEventListener('click', event => {
        const createProjectLink = event.target.closest('a[href="#book-call"]');
        if (createProjectLink) {
            const pricingCard = createProjectLink.closest('[data-pricing-card]');
            if (pricingCard) {
                trackTcbEvent('pricing_cta_click', {
                    pricing_tier: pricingCard.querySelector('.pricing-tier')?.textContent?.trim() || 'unknown'
                });
            }
            trackTcbEvent('create_project_click', {
                link_text: createProjectLink.textContent.trim(),
                link_location: createProjectLink.closest('.main-header') ? 'navigation' : 'page'
            });
        }

        const viewWorkLink = event.target.closest('a[href="#portfolio"]');
        if (viewWorkLink) {
            trackTcbEvent('view_work_click', {
                link_location: viewWorkLink.closest('.hero') ? 'hero' : 'page'
            });
        }

        const filterButton = event.target.closest('.filter-btn');
        if (filterButton) {
            trackTcbEvent('portfolio_filter_click', {
                filter_name: filterButton.dataset.filter || filterButton.textContent.trim()
            });
        }
    });
}

function renderImagePlaceholder(label = 'Image coming soon') {
    return `
        <div class="case-study-image-placeholder" aria-label="${label}">
            <i class="fa-regular fa-image" aria-hidden="true"></i>
            <span>${label}</span>
        </div>
    `;
}

function renderProjectThumbnail(project) {
    if (project.image) {
        return `<img src="${project.image}" alt="${project.title}" class="project-img" loading="lazy" decoding="async" fetchpriority="low">`;
    }

    return `
        <div class="project-img project-img-placeholder" aria-label="${project.title} thumbnail placeholder">
            <i class="fa-regular fa-image" aria-hidden="true"></i>
            <span>Image coming soon</span>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    initVercelAnalytics();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    initPerformanceFallback({ prefersReducedMotion });
    initCursorGlow();
    initHeaderScroll();
    initSiteAuthState();
    initScrollReveal();
    initMobileMenu();
    initHeroRotatingHeadline({ prefersReducedMotion });
    initHeroVideoBudget({ prefersReducedMotion });
    initMagneticButtons({ prefersReducedMotion, hasFinePointer });
    initBentoCardTracking({ prefersReducedMotion, hasFinePointer });
    renderPricingSection();
    initAdminPreviewModes();
    anchorDynamicHashTarget();
    initPricingCards();
    loadProjects();
    initAnalyticsEventTracking();
});

function initPerformanceFallback({ prefersReducedMotion }) {
    const ua = navigator.userAgent || '';
    const isChrome = /Chrome|CriOS/.test(ua) && !/Edg|OPR|Opera/.test(ua);
    const saveData = navigator.connection && navigator.connection.saveData;
    const mobileViewport = window.matchMedia('(max-width: 768px), (max-height: 620px)').matches;
    const lowCoreDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

    if (isChrome) {
        document.body.classList.add('chrome-engine');
    }

    if (prefersReducedMotion || saveData || mobileViewport || (isChrome && lowCoreDevice)) {
        document.body.classList.add('performance-fallback');
    }
}

/* 1. Custom Background Cursor Glow */
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) {
        glow.style.display = 'none';
        return;
    }

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    // Smooth lerp animation for the glow ball
    function animateGlow() {
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;
        glow.style.left = `${currentX}px`;
        glow.style.top = `${currentY}px`;
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

/* 2. Header Scroll Effect */
function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initSiteAuthState() {
    const authContainer = document.querySelector('[data-site-auth]');
    const mobileAuthItem = document.querySelector('[data-mobile-auth]');
    const sessionKey = 'tcb_admin_session';

    if (!authContainer && !mobileAuthItem) return;

    let session = null;
    try {
        session = JSON.parse(localStorage.getItem(sessionKey) || 'null');
    } catch (error) {
        session = null;
    }

    const logout = () => {
        localStorage.removeItem(sessionKey);
        window.location.href = 'index.html';
    };

    if (!session?.email) {
        return;
    }

    const shortName = session.email.split('@')[0];

    if (authContainer) {
        authContainer.classList.add('is-logged-in');
        authContainer.innerHTML = `
            <a href="admin.html" class="site-user-pill" aria-label="Open admin dashboard">
                <span class="site-user-avatar">${shortName.charAt(0).toUpperCase()}</span>
                <span class="site-user-meta">
                    <strong>${shortName}</strong>
                    <em>Admin</em>
                </span>
            </a>
            <button class="site-logout-btn" type="button" data-site-logout aria-label="Log out">
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
        `;
        authContainer.querySelector('[data-site-logout]')?.addEventListener('click', logout);
    }

    if (mobileAuthItem) {
        mobileAuthItem.innerHTML = `
            <a href="admin.html" class="mobile-link mobile-user-link">
                Logged in: ${shortName}
            </a>
            <button class="mobile-link mobile-logout-btn" type="button" data-mobile-logout>Log out</button>
        `;
        mobileAuthItem.querySelector('[data-mobile-logout]')?.addEventListener('click', logout);
    }
}

/* 2b. Hero Rotating Headline */
function initHeroRotatingHeadline({ prefersReducedMotion }) {
    const wordElement = document.querySelector('.hero-title-word');
    if (!wordElement) return;

    const words = (wordElement.dataset.words || '')
        .split('|')
        .map(word => word.trim())
        .filter(Boolean);

    if (!words.length) return;

    if (prefersReducedMotion) {
        wordElement.textContent = words[0];
        return;
    }

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeDelay = 74;
    const deleteDelay = 38;
    const holdDelay = 1320;
    const switchDelay = 180;

    function tick() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            charIndex = Math.max(0, charIndex - 1);
        } else {
            charIndex = Math.min(currentWord.length, charIndex + 1);
        }

        wordElement.textContent = currentWord.slice(0, charIndex);

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            window.setTimeout(tick, holdDelay);
            return;
        }

        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            window.setTimeout(tick, switchDelay);
            return;
        }

        window.setTimeout(tick, isDeleting ? deleteDelay : typeDelay);
    }

    wordElement.textContent = '';
    window.setTimeout(tick, 280);
}

/* 2c. Hero Video Performance Budget */
function initHeroVideoBudget({ prefersReducedMotion }) {
    const video = document.querySelector('.hero-video-loop');
    const hero = document.querySelector('.hero-section');
    if (!video || !hero) return;

    const source = video.querySelector('source');
    const saveData = navigator.connection && navigator.connection.saveData;
    const lowPowerViewport = window.matchMedia('(max-width: 768px), (max-height: 620px)').matches;

    if (prefersReducedMotion || saveData || lowPowerViewport) {
        video.removeAttribute('autoplay');
        video.pause();
        video.closest('.hero-video-stage')?.classList.add('is-disabled');
        return;
    }

    if (source && !source.src && source.dataset.src) {
        source.src = source.dataset.src;
        video.load();
    }

    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    }, { threshold: 0.18 });

    observer.observe(hero);
}

/* 3. Scroll Reveal Animations */
function initScrollReveal() {
    const revealElements = Array.from(document.querySelectorAll('.scroll-reveal, .fade-in'));
    const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;
    const fastMobileReveal = isMobileViewport ? document.querySelector('#portfolio.scroll-reveal') : null;
    const defaultRevealElements = fastMobileReveal
        ? revealElements.filter(el => el !== fastMobileReveal)
        : revealElements;

    const revealOnce = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    };

    const observer = new IntersectionObserver(revealOnce, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    defaultRevealElements.forEach(el => observer.observe(el));

    if (fastMobileReveal) {
        const fastObserver = new IntersectionObserver(revealOnce, {
            threshold: 0.01,
            rootMargin: '220px 0px 120px 0px'
        });

        fastObserver.observe(fastMobileReveal);
    }
}

/* 4. Mobile Menu Overlay Toggle */
function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const links = document.querySelectorAll('.mobile-link');

    if (!toggleBtn || !overlay) return;

    const toggleMenu = () => {
        toggleBtn.classList.toggle('open');
        overlay.classList.toggle('open');
        document.body.classList.toggle('lock-scroll');
    };

    toggleBtn.addEventListener('click', toggleMenu);
    
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (overlay.classList.contains('open')) {
                toggleMenu();
            }
        });
    });
}

/* 5. Premium Magnetic Buttons */
function initMagneticButtons({ prefersReducedMotion = false, hasFinePointer = true } = {}) {
    if (prefersReducedMotion || !hasFinePointer) return;

    const magneticBtns = document.querySelectorAll('.btn-magnetic');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            // Mouse coordinate relative to the button center
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Translate the button slightly (max 15px)
            btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            // Smoothly snap back to origin
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}

/* 6. Mouse Tracking for Bento Cards (Custom lighting path) */
function initBentoCardTracking({ prefersReducedMotion = false, hasFinePointer = true } = {}) {
    if (prefersReducedMotion || !hasFinePointer) return;

    const cards = document.querySelectorAll('.card-glow');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Expose mouse coordinates to CSS variables for dynamic linear-gradient mapping
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* 7. Dynamic Project Portfolio Generation & Filter */
function loadProjects() {
    const container = document.getElementById('projects-container');
    const pagination = document.getElementById('projects-pagination');
    const portfolioSection = document.getElementById('portfolio');
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!container) return;

    const locallyManagedProjects = getLocallyManagedProjects();
    if (locallyManagedProjects) {
        renderProjects(locallyManagedProjects);
        return;
    }

    if (isContentApiEnabled()) {
        loadContentBootstrap('published')
            .then(snapshot => {
                if (snapshot?.caseStudies && typeof snapshot.caseStudies === 'object') {
                    contentApiCaseStudies = snapshot.caseStudies;
                }
                if (snapshot?.pricing) {
                    renderPricingSection(snapshot.pricing);
                    initPricingCards();
                }
                if (Array.isArray(snapshot?.projects) && snapshot.projects.length) {
                    renderProjects(snapshot.projects);
                    return;
                }
                loadStaticProjectsFallback();
            })
            .catch(err => {
                console.warn('Content API projects failed. Using static project fallback.', err);
                loadStaticProjectsFallback();
            });
        return;
    }

    // Load function using JSON fetch with fallback
    loadStaticProjectsFallback();

    function loadStaticProjectsFallback() {
        fetch('projects.json?v=20260526-admin-local-mvp')
        .then(response => {
            if (!response.ok) throw new Error('Network error loading JSON');
            return response.json();
        })
        .then(data => renderProjects(data))
        .catch(err => {
            console.warn('Projects JSON load failed (likely local file:// CORS). Using backup data.', err);
            renderProjects(fallbackProjects);
        });
    }

    function withDemoProjects(projects) {
        const demoProjects = fallbackProjects.filter(project => Number(project.id) >= 101);
        const existingIds = new Set(projects.map(project => String(project.id)));
        return [
            ...projects,
            ...demoProjects.filter(project => !existingIds.has(String(project.id)))
        ];
    }

    function renderProjects(projects) {
        const portfolioProjects = withDemoProjects(projects);
        const state = {
            filter: 'all',
            page: 1,
            isAnimating: false,
            direction: 'next'
        };

        const getFilteredProjects = () => portfolioProjects.filter(project => state.filter === 'all' || project.category === state.filter);
        const getPageCount = () => Math.max(1, Math.ceil(getFilteredProjects().length / 5));

        // Filter Click Handlers
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (state.isAnimating) return;
                filterButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
                
                state.filter = btn.getAttribute('data-filter');
                goToPage(1, 'filter', true);
            });
        });

        function renderVisibleProjects() {
            const filteredProjects = getFilteredProjects();
            const pageCount = getPageCount();
            state.page = Math.min(Math.max(1, state.page), pageCount);
            const visibleProjects = filteredProjects.slice((state.page - 1) * 5, state.page * 5);

            container.innerHTML = '';
            visibleProjects.forEach((project, index) => {
                const article = document.createElement('article');
                article.className = `project-card card-glow${index === 0 ? ' project-featured' : ''}`;
                article.style.setProperty('--reveal-index', index);
                article.setAttribute('data-category', project.category);
                article.setAttribute('data-project-id', project.id);

                if (getCaseStudyForProject(project.id)) {
                    article.classList.add('project-card-clickable');
                    article.setAttribute('role', 'button');
                    article.setAttribute('tabindex', '0');
                    article.setAttribute('aria-label', `Open case study for ${project.title}`);
                }

                article.innerHTML = `
                    <div class="project-img-wrapper">
                        ${renderProjectThumbnail(project)}
                    </div>
                    <div class="project-details">
                        <div>
                            <div class="project-tag">${project.tag}</div>
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                        </div>
                        ${getCaseStudyForProject(project.id) ? '<span class="project-open-cue" aria-hidden="true"><i class="fa-solid fa-arrow-right"></i></span>' : ''}
                    </div>
                `;
                container.appendChild(article);
            });

            renderPagination();
            initBentoCardTracking({
                prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
                hasFinePointer: window.matchMedia('(pointer: fine)').matches
            });
        }

        function renderPagination() {
            if (!pagination) return;
            const pageCount = getPageCount();
            const pageButtons = Array.from({ length: pageCount }, (_, index) => {
                const page = index + 1;
                return `<button type="button" class="portfolio-page-dot${page === state.page ? ' is-active' : ''}" data-page="${page}" aria-label="Open project page ${page}" aria-current="${page === state.page ? 'page' : 'false'}">${page}</button>`;
            }).join('');

            pagination.hidden = pageCount <= 1;
            pagination.innerHTML = `
                <button type="button" class="portfolio-page-arrow" data-page-direction="prev" aria-label="Previous project page" ${state.page === 1 ? 'disabled' : ''}>
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <div class="portfolio-page-dots">${pageButtons}</div>
                <button type="button" class="portfolio-page-arrow" data-page-direction="next" aria-label="Next project page" ${state.page === pageCount ? 'disabled' : ''}>
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            `;
        }

        function goToPage(nextPage, direction = 'next', force = false) {
            const pageCount = getPageCount();
            const targetPage = Math.min(Math.max(1, nextPage), pageCount);
            if (state.isAnimating || (targetPage === state.page && !force)) return;

            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            state.direction = direction === 'prev' ? 'prev' : 'next';

            if (prefersReducedMotion) {
                state.page = targetPage;
                renderVisibleProjects();
                keepPortfolioAnchored();
                return;
            }

            state.isAnimating = true;
            container.classList.remove('portfolio-grid-entering', 'portfolio-grid-leaving');
            container.classList.add('portfolio-grid-leaving');

            window.setTimeout(() => {
                state.page = targetPage;
                renderVisibleProjects();
                container.classList.remove('portfolio-grid-leaving');
                container.classList.add('portfolio-grid-entering');
                keepPortfolioAnchored();
                window.setTimeout(() => {
                    container.classList.remove('portfolio-grid-entering');
                    state.isAnimating = false;
                }, 520);
            }, 240);
        }

        function keepPortfolioAnchored() {
            if (!portfolioSection) return;
            const headerOffset = document.querySelector('.main-header')?.offsetHeight || 0;
            const top = portfolioSection.getBoundingClientRect().top + window.scrollY - headerOffset - 18;
            window.scrollTo({
                top: Math.max(0, top),
                behavior: 'smooth'
            });
        }

        pagination?.addEventListener('click', event => {
            if (state.isAnimating) return;
            const directionButton = event.target.closest('[data-page-direction]');
            const pageButton = event.target.closest('[data-page]');

            if (directionButton) {
                const direction = directionButton.dataset.pageDirection;
                goToPage(state.page + (direction === 'next' ? 1 : -1), direction);
                return;
            }

            if (pageButton) {
                const page = Number(pageButton.dataset.page);
                goToPage(page, page > state.page ? 'next' : 'prev');
            }
        });

        renderVisibleProjects();
        initProjectCaseStudies(container);
    }
}

function getLocallyManagedProjects() {
    try {
        const isAdminPreview = new URLSearchParams(window.location.search).has('adminPreview');
        const rawProjects = localStorage.getItem(isAdminPreview ? 'tcb_projects_draft_admin' : 'tcb_projects_admin');
        if (!rawProjects) return null;

        const projects = JSON.parse(rawProjects);
        if (!Array.isArray(projects) || projects.length === 0) return null;

        return projects;
    } catch (error) {
        console.warn('Local project database is invalid. Falling back to projects.json.', error);
        return null;
    }
}

function getLocallyManagedCaseStudies() {
    try {
        const isAdminPreview = new URLSearchParams(window.location.search).has('adminPreview');
        const rawCaseStudies = localStorage.getItem(isAdminPreview ? 'tcb_case_studies_draft_admin' : 'tcb_case_studies_admin');
        if (!rawCaseStudies) return {};

        const caseStudies = JSON.parse(rawCaseStudies);
        if (!caseStudies || typeof caseStudies !== 'object' || Array.isArray(caseStudies)) return {};

        return caseStudies;
    } catch (error) {
        console.warn('Local case study database is invalid. Falling back to built-in case studies.', error);
        return {};
    }
}

function getCaseStudyForProject(projectId) {
    const localCaseStudies = getLocallyManagedCaseStudies();
    return localCaseStudies[String(projectId)] || contentApiCaseStudies[String(projectId)] || CASE_STUDIES[projectId] || null;
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
    const fallback = JSON.parse(JSON.stringify(DEFAULT_PRICING));
    const incoming = data && typeof data === 'object' ? data : {};
    const tiers = Array.isArray(incoming.tiers) && incoming.tiers.length ? incoming.tiers : fallback.tiers;

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
                id: tier.id || defaultTier.id,
                name: tier.name || defaultTier.name,
                symbol: tier.symbol || defaultTier.symbol,
                ctaLabel: tier.ctaLabel || defaultTier.ctaLabel || incoming.ctaLabel || fallback.ctaLabel,
                description: tier.description || defaultTier.description,
                badge: tier.badge || '',
                features: Array.isArray(tier.features)
                    ? tier.features.map(normalizePricingFeature).filter(feature => feature.text)
                    : defaultTier.features.map(normalizePricingFeature)
            };
        })
    };
}

function getLocallyManagedPricing() {
    try {
        const isAdminPreview = new URLSearchParams(window.location.search).has('adminPreview');
        const key = isAdminPreview ? 'tcb_pricing_draft_admin' : 'tcb_pricing_admin';
        const rawPricing = localStorage.getItem(key);
        if (!rawPricing) return normalizePricingData(DEFAULT_PRICING);
        return normalizePricingData(JSON.parse(rawPricing));
    } catch (error) {
        console.warn('Local pricing database is invalid. Falling back to default pricing.', error);
        return normalizePricingData(DEFAULT_PRICING);
    }
}

function renderPricingSection(pricingOverride = null) {
    const pricingSection = document.getElementById('pricing');
    if (!pricingSection) return;

    const container = pricingSection.querySelector('.container');
    if (!container) return;

    const pricing = normalizePricingData(pricingOverride || getLocallyManagedPricing());
    const ctaHref = escapeHtml(pricing.ctaHref || '#book-call');

    container.innerHTML = `
        <div class="section-header text-center">
            <span class="section-subtitle">${escapeHtml(pricing.eyebrow)}</span>
            <h2 class="section-title">${escapeHtml(pricing.title)}</h2>
            <p class="section-desc-center">${escapeHtml(pricing.description)}</p>
        </div>

        <div class="pricing-grid has-selected" aria-label="Creative service tiers">
            ${pricing.tiers.map(tier => {
                const isSelected = tier.id === pricing.recommendedId;
                const badge = isSelected ? 'Recommended' : '';
                return `
                    <article class="pricing-card card-glow${isSelected ? ' is-selected is-recommended' : ''}" data-pricing-card tabindex="0" aria-label="Select ${escapeHtml(tier.name)} pricing tier">
                        ${badge ? `<div class="pricing-badge">${escapeHtml(badge)}</div>` : ''}
                        <div class="pricing-card-top">
                            <span class="pricing-tier">${escapeHtml(tier.name)}</span>
                            <strong class="pricing-symbol">${escapeHtml(tier.symbol)}</strong>
                            <p>${escapeHtml(tier.description)}</p>
                        </div>
                        <ul class="pricing-features">
                            ${tier.features.map(feature => `<li><i class="${escapeHtml(feature.icon)}"></i> ${escapeHtml(feature.text)}</li>`).join('')}
                        </ul>
                        <a href="${ctaHref}" class="pricing-cta">${escapeHtml(tier.ctaLabel || pricing.ctaLabel || 'Select')} <i class="fa-solid fa-arrow-right"></i></a>
                    </article>
                `;
            }).join('')}
        </div>
    `;
}

function anchorDynamicHashTarget() {
    const targetId = window.location.hash === '#pricing' ? 'pricing' : null;
    if (!targetId) return;

    window.setTimeout(() => {
        const target = document.getElementById(targetId);
        if (!target) return;
        const headerOffset = document.querySelector('.main-header')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 18;
        window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
    }, 80);
}

function initAdminPreviewModes() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('pricingPreview')) return;

    document.body.classList.add('pricing-preview-mode');
    const pricing = document.getElementById('pricing');
    if (pricing) {
        pricing.classList.remove('scroll-reveal', 'revealed');
        window.requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: 'auto' });
        });
    }
}

function initPricingCards() {
    const pricingGrid = document.querySelector('.pricing-grid');
    const cards = document.querySelectorAll('[data-pricing-card]');
    if (!pricingGrid || !cards.length) return;

    const selectCard = (selectedCard) => {
        pricingGrid.classList.add('has-selected');
        cards.forEach(card => {
            const isSelected = card === selectedCard;
            card.classList.toggle('is-selected', isSelected);
            card.setAttribute('aria-pressed', String(isSelected));
        });
        const tier = selectedCard.querySelector('.pricing-tier')?.textContent?.trim() || 'unknown';
        trackTcbEvent('pricing_select', { pricing_tier: tier });
    };

    cards.forEach(card => {
        card.setAttribute('role', 'button');
        card.setAttribute('aria-pressed', card.classList.contains('is-selected') ? 'true' : 'false');

        card.addEventListener('click', (event) => {
            if (event.target.closest('a')) return;
            selectCard(card);
        });

        card.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            selectCard(card);
        });
    });
}

function initProjectCaseStudies(container) {
    if (container.dataset.caseStudyBound === 'true') return;
    container.dataset.caseStudyBound = 'true';

    container.addEventListener('click', (event) => {
        const card = event.target.closest('[data-project-id]');
        if (!card) return;
        const caseStudy = getCaseStudyForProject(card.dataset.projectId);
        if (!caseStudy) return;
        openProjectCaseStudy(card, caseStudy);
    });

    container.addEventListener('keydown', (event) => {
        const card = event.target.closest('[data-project-id]');
        if (!card || (event.key !== 'Enter' && event.key !== ' ')) return;
        const caseStudy = getCaseStudyForProject(card.dataset.projectId);
        if (!caseStudy) return;
        event.preventDefault();
        openProjectCaseStudy(card, caseStudy);
    });

    openRequestedCaseStudyPreview(container);
}

function openProjectCaseStudy(sourceCard, caseStudy) {
    const overlay = getOrCreateCaseStudyOverlay();

    overlay.dataset.activeProjectId = String(caseStudy.id);
    renderCaseStudyOverlay(overlay, caseStudy);
    trackTcbEvent('case_study_open', {
        project_id: String(caseStudy.id),
        project_title: caseStudy.title,
        project_category: caseStudy.category
    });
    const closeButton = overlay.querySelector('.case-study-close');
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    overlay.scrollTop = 0;
    document.body.classList.add('case-study-open');
    sourceCard?.classList.add('project-card-expanding');

    window.setTimeout(() => {
        sourceCard?.classList.remove('project-card-expanding');
        closeButton?.focus({ preventScroll: true });
    }, 420);
}

function openRequestedCaseStudyPreview(container) {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('caseStudyPreview');
    if (!params.has('adminPreview') || !projectId) return;

    const card = Array.from(container.querySelectorAll('[data-project-id]'))
        .find(item => String(item.dataset.projectId) === String(projectId));
    const caseStudy = getCaseStudyForProject(projectId);
    if (!caseStudy) return;

    document.body.classList.add('case-study-preview-mode');
    window.setTimeout(() => {
        openProjectCaseStudy(card, caseStudy);
    }, 80);
}

function closeProjectCaseStudy() {
    const overlay = document.getElementById('project-case-study');
    if (!overlay) return;

    const activeProjectId = overlay.dataset.activeProjectId;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('case-study-open');

    const sourceCard = activeProjectId ? document.querySelector(`[data-project-id="${activeProjectId}"]`) : null;
    sourceCard?.focus({ preventScroll: true });
}

function getOrCreateCaseStudyOverlay() {
    let overlay = document.getElementById('project-case-study');
    if (overlay) return overlay;

    overlay = document.createElement('aside');
    overlay.id = 'project-case-study';
    overlay.className = 'case-study-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-labelledby', 'project-case-study-title');

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay || event.target.closest('.case-study-close')) {
            closeProjectCaseStudy();
        }
    });

    overlay.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeProjectCaseStudy();
    });

    document.body.appendChild(overlay);
    return overlay;
}

function renderCaseStudyOverlay(overlay, caseStudy) {
    overlay.innerHTML = `
        <div class="case-study-shell">
            <header class="case-study-topbar">
                <div class="case-study-brand">
                    <span class="case-study-mark" aria-hidden="true"></span>
                    <span>The Creative Bunch</span>
                </div>
                <div class="case-study-progress">01 / 06</div>
                <button class="case-study-close" type="button" aria-label="Close ${caseStudy.title} case study">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </button>
            </header>

            <section class="case-study-hero">
                <div class="case-study-copy">
                    <p class="case-study-eyebrow">${caseStudy.category}</p>
                    <h2 id="project-case-study-title">${caseStudy.title}</h2>
                    <p>${caseStudy.statement}</p>
                    <div class="case-study-tags">
                        ${caseStudy.tags.map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                </div>
                <figure class="case-study-hero-visual">
                    ${caseStudy.image
                        ? `<img src="${caseStudy.image}" alt="${caseStudy.title} preview" loading="eager" decoding="async">`
                        : renderImagePlaceholder('Hero image not added yet')}
                </figure>
            </section>

            <section class="case-study-overview" aria-label="Project overview">
                ${caseStudy.overview.map(item => `
                    <article>
                        <span aria-hidden="true"></span>
                        <h3>${item.title}</h3>
                        <p>${item.text}</p>
                    </article>
                `).join('')}
            </section>

            <section class="case-study-split">
                <div class="case-study-sticky">
                    <p class="case-study-section-count">02 / 06</p>
                    <h3>${caseStudy.visualTitle}</h3>
                    <p>${caseStudy.visualText}</p>
                </div>
                <div class="case-study-image-stack">
                    <figure>
                        ${caseStudy.visualImage
                            ? `<img src="${caseStudy.visualImage}" alt="${caseStudy.title} visual direction" loading="lazy" decoding="async">`
                            : renderImagePlaceholder('Visual image not added yet')}
                    </figure>
                </div>
            </section>

            <section class="case-study-process">
                <div class="case-study-section-heading">
                    <p>03 / 06</p>
                    <h3>${caseStudy.processTitle || 'Design Process'}</h3>
                </div>
                <div class="case-study-timeline">
                    ${caseStudy.process.map((step, index) => `
                        <article>
                            <span>${String(index + 1).padStart(2, '0')}</span>
                            <strong>${step}</strong>
                        </article>
                    `).join('')}
                </div>
                ${caseStudy.processImage ? `<figure class="case-study-process-image"><img src="${caseStudy.processImage}" alt="${caseStudy.title} design process" loading="lazy" decoding="async"></figure>` : ''}
            </section>

            <section class="case-study-brand-system">
                <div class="case-study-section-heading">
                    <p>04 / 06</p>
                    <h3>${caseStudy.brandTitle || 'Assets & Brand System'}</h3>
                </div>
                <div class="case-study-system-grid">
                    <article>
                        <span>Core System</span>
                        <strong>${caseStudy.system[0]}</strong>
                    </article>
                    <article>
                        <span>Color</span>
                        <div class="case-study-palette">
                            ${caseStudy.palette.map(color => `<i style="background:${color}"></i>`).join('')}
                        </div>
                    </article>
                    <article>
                        <span>Visual Language</span>
                        <strong>${caseStudy.system[1]}</strong>
                    </article>
                    <article>
                        <span>Use Cases</span>
                        <strong>${caseStudy.system[2]}</strong>
                    </article>
                    ${caseStudy.brandImage ? `<article class="case-study-system-visual"><img src="${caseStudy.brandImage}" alt="${caseStudy.title} brand assets" loading="lazy" decoding="async"></article>` : ''}
                </div>
            </section>

            ${caseStudy.pdf ? renderPdfPreview(caseStudy) : ''}

            <section class="case-study-gallery">
                <div class="case-study-section-heading">
                    <p>05 / 06</p>
                    <h3>Gallery Strip</h3>
                </div>
                <div class="case-study-gallery-track" aria-label="${caseStudy.title} gallery preview">
                    ${caseStudy.gallery?.length ? caseStudy.gallery.slice(0, 5).map((image, index) => `
                        <figure>
                            <img src="${image}" alt="${caseStudy.title} gallery preview ${index + 1}" loading="lazy" decoding="async">
                        </figure>
                    `).join('') : `<figure>${renderImagePlaceholder('Gallery images not added yet')}</figure>`}
                </div>
            </section>

            <section class="case-study-final">
                <div>
                    <p class="case-study-section-count">06 / 06</p>
                    <h3>Final Result</h3>
                    <p>${caseStudy.finalText}</p>
                </div>
                <figure>
                    ${caseStudy.finalImage
                        ? `<img src="${caseStudy.finalImage}" alt="${caseStudy.title} final preview" loading="lazy" decoding="async">`
                        : renderImagePlaceholder('Final image not added yet')}
                </figure>
            </section>
        </div>
    `;
}

function renderPdfPreview(caseStudy) {
    return `
        <section class="case-study-pdf">
            <div class="case-study-section-heading">
                <p>PDF</p>
                <h3>Full Brochure</h3>
            </div>
            <div class="brochure-flip" aria-label="JCC brochure PDF preview">
                <div class="brochure-page brochure-page-cover">
                    ${caseStudy.image
                        ? `<img src="${caseStudy.image}" alt="${caseStudy.title} cover preview" loading="lazy" decoding="async">`
                        : renderImagePlaceholder('Brochure cover not added yet')}
                </div>
                <div class="brochure-page brochure-page-info">
                    <span>Digital brochure</span>
                    <strong>Open the full PDF to browse every page.</strong>
                    <a href="${caseStudy.pdf}" target="_blank" rel="noopener">Open brochure PDF <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </div>
            <iframe class="case-study-pdf-frame" src="${caseStudy.pdf}#toolbar=0&navpanes=0" title="${caseStudy.title} PDF"></iframe>
        </section>
    `;
}
