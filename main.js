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
        "id": 2,
        "title": "Bnei Akiva Campaign Materials",
        "category": "graphics",
        "tag": "Digital & Print Graphics",
        "description": "Complete pack of flyers, online banners, and printed brochures for the annual youth campaign.",
        "image": "assets/project_bnei.svg"
    },
    {
        "id": 3,
        "title": "Kosher Express Delivery",
        "category": "branding",
        "tag": "Brand Identity & Packaging",
        "description": "Full visual brand identity, geometric logo, and eco-friendly packaging design for a premium food delivery service.",
        "image": "assets/project_kosher.svg"
    },
    {
        "id": 5,
        "title": "Shabbat Shalom Campaign Kit",
        "category": "graphics",
        "tag": "Social Media Graphic Content",
        "description": "Graphic template kit for social networks, featuring minimalist community greeting animations and layouts.",
        "image": "assets/project_shabbat.svg"
    },
    {
        "id": 6,
        "title": "The Creative Bunch Identity",
        "category": "branding",
        "tag": "Visual Identity System",
        "description": "Our own brand identity, centered around bold geometric shapes, unique typography, and vibrant color contrasts.",
        "image": "assets/project_branding.svg"
    },
    {
        "id": 4,
        "title": "Jewish Museum Audio Guide",
        "category": "web",
        "tag": "UI/UX & Interactive Web App",
        "description": "Clean and fluid interface for the museum's web app, featuring audio playback and interactive exhibits maps.",
        "image": "assets/project_museum.svg"
    }
];

const MERKAZ_CASE_STUDY = {
    id: 1,
    title: "Merkaz Israel 76 Campaign",
    category: "Event Poster & Campaign Design",
    year: "2024",
    image: "assets/project_merkaz_thumb.webp",
    statement: "A visual campaign made for Merkaz, promoting the Israel 76 cultural event with bold typography, clean layout, and community-focused imagery.",
    tags: ["Graphic Design", "Print", "Branding"],
    overview: [
        {
            title: "The Challenge",
            text: "Create a visual identity that celebrates Israel 76 in a modern, approachable way, while staying clear enough for fast event communication."
        },
        {
            title: "The Solution",
            text: "Bold typography, national symbols, and a poster-first system that could move from print into social and community channels."
        },
        {
            title: "The Impact",
            text: "A campaign language that feels proud, legible, and memorable across event posters, digital previews, and public-facing assets."
        }
    ],
    process: ["Research", "Concept", "Sketches", "Design", "Refinement", "Final"],
    palette: ["#F5F7FB", "#0E65D8", "#0642A4", "#061A3C", "#DEFF87"]
};

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    initCursorGlow();
    initHeaderScroll();
    initScrollReveal();
    initMobileMenu();
    initHeroRotatingHeadline({ prefersReducedMotion });
    initHeroVideoBudget({ prefersReducedMotion });
    initMagneticButtons({ prefersReducedMotion, hasFinePointer });
    initBentoCardTracking({ prefersReducedMotion, hasFinePointer });
    loadProjects();
});

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
    fetch('projects.json?v=20260526-merkaz-case-study-mobile-fit')
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

            if (project.id === MERKAZ_CASE_STUDY.id) {
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
                    ${project.id === MERKAZ_CASE_STUDY.id ? '<span class="project-open-cue">Open case study <i class="fa-solid fa-arrow-right"></i></span>' : ''}
                </div>
            `;
            container.appendChild(article);
        });

        filterItems('all');
        initMerkazCaseStudy(container);
        
        // Re-run cursor tracking on the newly created project cards
        initBentoCardTracking({
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            hasFinePointer: window.matchMedia('(pointer: fine)').matches
        });
    }
}

function initMerkazCaseStudy(container) {
    if (container.dataset.caseStudyBound === 'true') return;
    container.dataset.caseStudyBound = 'true';

    container.addEventListener('click', (event) => {
        const card = event.target.closest('[data-project-id="1"]');
        if (!card) return;
        openMerkazCaseStudy(card);
    });

    container.addEventListener('keydown', (event) => {
        const card = event.target.closest('[data-project-id="1"]');
        if (!card || (event.key !== 'Enter' && event.key !== ' ')) return;
        event.preventDefault();
        openMerkazCaseStudy(card);
    });
}

function openMerkazCaseStudy(sourceCard) {
    const overlay = getOrCreateMerkazOverlay();
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

function closeMerkazCaseStudy() {
    const overlay = document.getElementById('merkaz-case-study');
    if (!overlay) return;

    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('case-study-open');

    const sourceCard = document.querySelector('[data-project-id="1"]');
    sourceCard?.focus({ preventScroll: true });
}

function getOrCreateMerkazOverlay() {
    let overlay = document.getElementById('merkaz-case-study');
    if (overlay) return overlay;

    overlay = document.createElement('aside');
    overlay.id = 'merkaz-case-study';
    overlay.className = 'case-study-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-labelledby', 'merkaz-case-study-title');

    overlay.innerHTML = `
        <div class="case-study-shell">
            <header class="case-study-topbar">
                <div class="case-study-brand">
                    <span class="case-study-mark" aria-hidden="true"></span>
                    <span>The Creative Bunch</span>
                </div>
                <div class="case-study-progress">01 / 06</div>
                <button class="case-study-close" type="button" aria-label="Close Merkaz case study">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </button>
            </header>

            <section class="case-study-hero">
                <div class="case-study-copy">
                    <p class="case-study-eyebrow">${MERKAZ_CASE_STUDY.category}</p>
                    <h2 id="merkaz-case-study-title">${MERKAZ_CASE_STUDY.title}</h2>
                    <p>${MERKAZ_CASE_STUDY.statement}</p>
                    <div class="case-study-tags">
                        ${MERKAZ_CASE_STUDY.tags.map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                </div>
                <figure class="case-study-hero-visual">
                    <img src="${MERKAZ_CASE_STUDY.image}" alt="Merkaz Israel 76 campaign poster preview" loading="eager" decoding="async">
                </figure>
            </section>

            <section class="case-study-overview" aria-label="Project overview">
                ${MERKAZ_CASE_STUDY.overview.map(item => `
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
                    <h3>Visual Direction</h3>
                    <p>We combined event clarity with symbolic movement: large type, confident blue, air, flags, and clean hierarchy that could read from a poster wall or a phone screen.</p>
                </div>
                <div class="case-study-image-stack">
                    <figure><img src="${MERKAZ_CASE_STUDY.image}" alt="Merkaz campaign layout on a dark showcase surface" loading="lazy" decoding="async"></figure>
                    <figure><img src="${MERKAZ_CASE_STUDY.image}" alt="Merkaz campaign detail crop with bold blue typography" loading="lazy" decoding="async"></figure>
                </div>
            </section>

            <section class="case-study-process">
                <div class="case-study-section-heading">
                    <p>03 / 06</p>
                    <h3>Design Process</h3>
                </div>
                <div class="case-study-timeline">
                    ${MERKAZ_CASE_STUDY.process.map((step, index) => `
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
                        <span>Typography</span>
                        <strong>Bold, condensed, readable from distance.</strong>
                    </article>
                    <article>
                        <span>Color</span>
                        <div class="case-study-palette">
                            ${MERKAZ_CASE_STUDY.palette.map(color => `<i style="background:${color}"></i>`).join('')}
                        </div>
                    </article>
                    <article>
                        <span>Graphic Language</span>
                        <strong>Flag motion, clear blocks, campaign-first hierarchy.</strong>
                    </article>
                    <article>
                        <span>Use Cases</span>
                        <strong>Poster, social preview, community announcement, event visual.</strong>
                    </article>
                </div>
            </section>

            <section class="case-study-gallery">
                <div class="case-study-section-heading">
                    <p>05 / 06</p>
                    <h3>Gallery Strip</h3>
                </div>
                <div class="case-study-gallery-track" aria-label="Merkaz gallery preview">
                    ${Array.from({ length: 5 }, (_, index) => `
                        <figure>
                            <img src="${MERKAZ_CASE_STUDY.image}" alt="Merkaz campaign gallery preview ${index + 1}" loading="lazy" decoding="async">
                        </figure>
                    `).join('')}
                </div>
            </section>

            <section class="case-study-final">
                <div>
                    <p class="case-study-section-count">06 / 06</p>
                    <h3>Final Result</h3>
                    <p>A focused campaign system for a cultural event: direct, vivid, and built to feel recognizable across every touchpoint.</p>
                </div>
                <figure>
                    <img src="${MERKAZ_CASE_STUDY.image}" alt="Final Merkaz campaign preview" loading="lazy" decoding="async">
                </figure>
            </section>
        </div>
    `;

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay || event.target.closest('.case-study-close')) {
            closeMerkazCaseStudy();
        }
    });

    overlay.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMerkazCaseStudy();
    });

    document.body.appendChild(overlay);
    return overlay;
}
