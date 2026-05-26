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
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    initPerformanceFallback({ prefersReducedMotion });
    initCursorGlow();
    initHeaderScroll();
    initScrollReveal();
    initMobileMenu();
    initHeroRotatingHeadline({ prefersReducedMotion });
    initHeroVideoBudget({ prefersReducedMotion });
    initMagneticButtons({ prefersReducedMotion, hasFinePointer });
    initBentoCardTracking({ prefersReducedMotion, hasFinePointer });
    initPricingCards();
    loadProjects();
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
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!container) return;

    // Load function using JSON fetch with fallback
    fetch('projects.json?v=20260526-all-case-studies')
        .then(response => {
            if (!response.ok) throw new Error('Network error loading JSON');
            return response.json();
        })
        .then(data => renderProjects(data))
        .catch(err => {
            console.warn('Projects JSON load failed (likely local file:// CORS). Using backup data.', err);
            renderProjects(fallbackProjects);
        });

    function renderProjects(projects) {
        // Filter Click Handlers
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
                
                const filterValue = btn.getAttribute('data-filter');
                filterItems(filterValue);
            });
        });

        function filterItems(category) {
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach(card => {
                const itemCategory = card.getAttribute('data-category');
                
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95) translateY(10px)';
                
                setTimeout(() => {
                    if (category === 'all' || itemCategory === category) {
                        card.style.display = '';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        }

        // Populating DOM
        container.innerHTML = '';
        projects.forEach(project => {
            const article = document.createElement('article');
            article.className = `project-card card-glow${project.id === 1 ? ' project-featured' : ''}`;
            article.setAttribute('data-category', project.category);
            article.setAttribute('data-project-id', project.id);

            if (CASE_STUDIES[project.id]) {
                article.classList.add('project-card-clickable');
                article.setAttribute('role', 'button');
                article.setAttribute('tabindex', '0');
                article.setAttribute('aria-label', `Open case study for ${project.title}`);
            }
            
            article.innerHTML = `
                <div class="project-img-wrapper">
                    <img src="${project.image}" alt="${project.title}" class="project-img" loading="lazy" decoding="async" fetchpriority="low">
                </div>
                <div class="project-details">
                    <div>
                        <div class="project-tag">${project.tag}</div>
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                    </div>
                    ${CASE_STUDIES[project.id] ? '<span class="project-open-cue" aria-hidden="true"><i class="fa-solid fa-arrow-right"></i></span>' : ''}
                </div>
            `;
            container.appendChild(article);
        });

        filterItems('all');
        initProjectCaseStudies(container);
        
        // Re-run cursor tracking on the newly created project cards
        initBentoCardTracking({
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            hasFinePointer: window.matchMedia('(pointer: fine)').matches
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
        const caseStudy = CASE_STUDIES[card.dataset.projectId];
        if (!caseStudy) return;
        openProjectCaseStudy(card, caseStudy);
    });

    container.addEventListener('keydown', (event) => {
        const card = event.target.closest('[data-project-id]');
        if (!card || (event.key !== 'Enter' && event.key !== ' ')) return;
        const caseStudy = CASE_STUDIES[card.dataset.projectId];
        if (!caseStudy) return;
        event.preventDefault();
        openProjectCaseStudy(card, caseStudy);
    });
}

function openProjectCaseStudy(sourceCard, caseStudy) {
    const overlay = getOrCreateCaseStudyOverlay();

    overlay.dataset.activeProjectId = String(caseStudy.id);
    renderCaseStudyOverlay(overlay, caseStudy);
    const closeButton = overlay.querySelector('.case-study-close');
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    overlay.scrollTop = 0;
    document.body.classList.add('case-study-open');
    sourceCard.classList.add('project-card-expanding');

    window.setTimeout(() => {
        sourceCard.classList.remove('project-card-expanding');
        closeButton?.focus({ preventScroll: true });
    }, 420);
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
                    <img src="${caseStudy.image}" alt="${caseStudy.title} preview" loading="eager" decoding="async">
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
                    <figure><img src="${caseStudy.gallery[0] || caseStudy.image}" alt="${caseStudy.title} visual direction" loading="lazy" decoding="async"></figure>
                </div>
            </section>

            <section class="case-study-process">
                <div class="case-study-section-heading">
                    <p>03 / 06</p>
                    <h3>Design Process</h3>
                </div>
                <div class="case-study-timeline">
                    ${caseStudy.process.map((step, index) => `
                        <article>
                            <span>${String(index + 1).padStart(2, '0')}</span>
                            <strong>${step}</strong>
                        </article>
                    `).join('')}
                </div>
            </section>

            <section class="case-study-brand-system">
                <div class="case-study-section-heading">
                    <p>04 / 06</p>
                    <h3>Assets & Brand System</h3>
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
                </div>
            </section>

            ${caseStudy.pdf ? renderPdfPreview(caseStudy) : ''}

            <section class="case-study-gallery">
                <div class="case-study-section-heading">
                    <p>05 / 06</p>
                    <h3>Gallery Strip</h3>
                </div>
                <div class="case-study-gallery-track" aria-label="${caseStudy.title} gallery preview">
                    ${caseStudy.gallery.slice(0, 5).map((image, index) => `
                        <figure>
                            <img src="${image}" alt="${caseStudy.title} gallery preview ${index + 1}" loading="lazy" decoding="async">
                        </figure>
                    `).join('')}
                </div>
            </section>

            <section class="case-study-final">
                <div>
                    <p class="case-study-section-count">06 / 06</p>
                    <h3>Final Result</h3>
                    <p>${caseStudy.finalText}</p>
                </div>
                <figure>
                    <img src="${caseStudy.image}" alt="${caseStudy.title} final preview" loading="lazy" decoding="async">
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
                    <img src="${caseStudy.image}" alt="${caseStudy.title} cover preview" loading="lazy" decoding="async">
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
