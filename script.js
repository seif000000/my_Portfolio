document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // ------------------------------------------------------------------
    // Typing Effect
    // ------------------------------------------------------------------
    const typedTextSpan = document.getElementById('typed-text');
    if (typedTextSpan) {
        const textArray = ['Seif Nady.', 'a Developer.', 'an Automation Expert.', 'a Problem Solver.'];
        const typingDelay = 100;
        const erasingDelay = 50;
        const newTextDelay = 2000;
        let textArrayIndex = 0;
        let charIndex = 0;

        function type() {
            if (charIndex < textArray[textArrayIndex].length) {
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                setTimeout(erase, newTextDelay);
            }
        }

        function erase() {
            if (charIndex > 0) {
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } else {
                textArrayIndex++;
                if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, typingDelay + 1100);
            }
        }

        if (textArray.length) setTimeout(type, prefersReducedMotion ? 0 : newTextDelay + 250);

        if (prefersReducedMotion) {
            typedTextSpan.textContent = textArray[0];
        }
    }

    // ------------------------------------------------------------------
    // Scroll: progress bar + header state (single rAF-throttled listener)
    // ------------------------------------------------------------------
    const scrollProgress = document.getElementById('scroll-progress');
    const header = document.querySelector('header');
    let ticking = false;

    function onScroll() {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollProgress) {
            const progress = totalHeight > 0 ? (window.pageYOffset / totalHeight) * 100 : 0;
            scrollProgress.style.width = progress + '%';
        }
        if (header) {
            header.classList.toggle('is-scrolled', window.scrollY > 50);
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(onScroll);
        }
    }, { passive: true });

    onScroll();

    // ------------------------------------------------------------------
    // Reveal sections on scroll
    // ------------------------------------------------------------------
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');

                const staggeredChildren = entry.target.querySelectorAll('.staggered-child');
                staggeredChildren.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('reveal-active');
                    }, prefersReducedMotion ? 0 : index * 90);
                });

                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    const revealElements = document.querySelectorAll(
        'section, .automation-showcase, .timeline-group, .about-text'
    );
    revealElements.forEach((el, index) => {
        if (index % 3 === 0) {
            el.classList.add('reveal-slide-left');
        } else if (index % 3 === 1) {
            el.classList.add('reveal-slide-right');
        } else {
            el.classList.add('reveal-scale');
        }
        revealObserver.observe(el);
    });

    // Stagger items in grids
    const staggerContainers = document.querySelectorAll(
        '.projects-grid, .certificates-grid, .skills-container, .activity-grid, .case-list, .case-metrics, .hero-metrics'
    );
    staggerContainers.forEach(container => {
        Array.from(container.children).forEach(child => {
            child.classList.add('reveal-hidden', 'staggered-child');
        });
        revealObserver.observe(container);
    });

    // ------------------------------------------------------------------
    // Active nav link highlighting
    // ------------------------------------------------------------------
    const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
    const navSections = navAnchors
        .map(a => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    if (navSections.length) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navAnchors.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        navSections.forEach(s => navObserver.observe(s));
    }

    // ------------------------------------------------------------------
    // Lightbox Functionality
    // ------------------------------------------------------------------
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    let lastFocused = null;

    const openLightbox = (img) => {
        lastFocused = document.activeElement;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = img.alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (closeBtn) closeBtn.focus();
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        lightboxImg.src = '';
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    };

    document.querySelectorAll('.certificate-image img').forEach(img => {
        img.addEventListener('click', () => openLightbox(img));
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
        closeBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closeLightbox();
            }
        });
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) {
            closeLightbox();
        }
    });

    // ------------------------------------------------------------------
    // Mobile Menu Toggle
    // ------------------------------------------------------------------
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    const closeMenu = () => {
        menuToggle.classList.remove('is-active');
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
    };

    menuToggle.addEventListener('click', () => {
        const open = navMenu.classList.toggle('active');
        menuToggle.classList.toggle('is-active', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('no-scroll', open);
    });

    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
            menuToggle.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // ------------------------------------------------------------------
    // Vanilla-Tilt (3D hover) — pointer devices only, respects reduced motion
    // ------------------------------------------------------------------
    if (typeof VanillaTilt !== 'undefined' && finePointer && !prefersReducedMotion) {
        VanillaTilt.init(
            document.querySelectorAll('.project-card, .certificate-card, .skill-category, .tilt-effect, .about-image'),
            { max: 5, speed: 400, glare: true, 'max-glare': 0.12 }
        );
    }

    // ------------------------------------------------------------------
    // Project card spotlight (mouse-tracked radial highlight)
    // ------------------------------------------------------------------
    if (finePointer) {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
                card.style.setProperty('--my', `${e.clientY - rect.top}px`);
            });
        });
    }

    // ------------------------------------------------------------------
    // Cursor Glow Effect (desktop, motion-friendly only)
    // ------------------------------------------------------------------
    if (finePointer && !prefersReducedMotion) {
        const cursorGlow = document.createElement('div');
        cursorGlow.classList.add('cursor-glow');
        document.body.appendChild(cursorGlow);

        let glowFrame = false;
        let glowX = 0;
        let glowY = 0;

        document.addEventListener('mousemove', (e) => {
            glowX = e.clientX;
            glowY = e.clientY;
            cursorGlow.classList.add('visible');
            if (!glowFrame) {
                glowFrame = true;
                requestAnimationFrame(() => {
                    cursorGlow.style.transform = `translate(${glowX - 300}px, ${glowY - 300}px)`;
                    glowFrame = false;
                });
            }
        }, { passive: true });

        document.addEventListener('mouseleave', () => cursorGlow.classList.remove('visible'));

        document.querySelectorAll('a, button, .project-card, .certificate-card, .case, .timeline-content, .activity-item')
            .forEach(el => {
                el.addEventListener('mouseenter', () => cursorGlow.classList.add('active'));
                el.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
            });
    }
});