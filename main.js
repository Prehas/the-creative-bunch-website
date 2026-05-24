// Project Data Fallback (in case of CORS issues running locally on file://)
const fallbackProjects = [
    {
        "id": 1,
        "title": "Merkaz Israel 76 Campaign",
        "category": "graphics",
        "tag": "Event Poster & Campaign Design",
        "description": "Visual campaign materials for Merkaz, promoting the Israel 76 cultural event with bold typography, clean layout, and community-focused imagery.",
        "image": "assets/project_merkaz.jpg"
    },
    {
        "id": 7,
        "title": "Infinik Logo",
        "category": "branding",
        "tag": "Logo Design & Brand Mark",
        "description": "Futuristic identity mark for Infinik, pairing a geometric infinity symbol with a sharp, digital wordmark system.",
        "image": "assets/project_infinik_logo.jpg"
    },
    {
        "id": 10,
        "title": "Every Idea Has a Form",
        "category": "branding",
        "tag": "Print & Object Branding",
        "description": "Every idea deserves a form. We transform it into print - on paper, fabric, or objects. The format does not matter. What matters is your vision.",
        "image": "assets/project_every_idea_form.png"
    },
    {
        "id": 9,
        "title": "JCC Brochure",
        "category": "graphics",
        "tag": "Brochure & Community Campaign",
        "description": "High-energy brochure cover for JCC Bucharest, combining cultural photography, bold typography, and event-led visual storytelling.",
        "image": "assets/project_jcc_brochure_exact.png"
    },
    {
        "id": 8,
        "title": "Creative Alex Website",
        "category": "web",
        "tag": "Portfolio Website Design",
        "description": "Website direction and visual presentation for creativealex.eu, built around bold portfolio thumbnails and a clean creator-first experience.",
        "image": "assets/project_creativealex_website_exact.png"
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

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    initCursorGlow();
    initHeaderScroll();
    initScrollReveal();
    initMobileMenu();
    initHeroRotatingHeadline({ prefersReducedMotion });
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

/* 3. Scroll Reveal Animations */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal, .fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
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
    fetch('projects.json?v=20260524-every-idea-form')
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
            
            article.innerHTML = `
                <div class="project-img-wrapper">
                    <img src="${project.image}" alt="${project.title}" class="project-img" loading="lazy">
                </div>
                <div class="project-details">
                    <div>
                        <div class="project-tag">${project.tag}</div>
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                    </div>
                </div>
            `;
            container.appendChild(article);
        });

        filterItems('all');
        
        // Re-run cursor tracking on the newly created project cards
        initBentoCardTracking({
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            hasFinePointer: window.matchMedia('(pointer: fine)').matches
        });
    }
}
