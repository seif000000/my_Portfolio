document.addEventListener('DOMContentLoaded', () => {
    // Typing Effect
    const typedTextSpan = document.getElementById("typed-text");
    const textArray = ["Seif Nady.", "a Developer.", "an Automation Expert.", "a Problem Solver."];
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

    if (textArray.length) setTimeout(type, newTextDelay + 250);

    // Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / totalHeight) * 100;
        scrollProgress.style.width = progress + '%';
    });

    // Reveal sections on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');

                // If it's a grid/container, stagger children
                const staggeredChildren = entry.target.querySelectorAll('.staggered-child');
                staggeredChildren.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('reveal-active');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Add reveal class to sections and elements
    const revealElements = document.querySelectorAll('section, .automation-showcase, .timeline-group');
    revealElements.forEach(el => {
        el.classList.add('reveal-hidden');
        revealObserver.observe(el);
    });

    // Stagger items in grids
    const staggerContainers = document.querySelectorAll('.projects-grid, .certificates-grid, .skills-container, .activity-grid, .hero-actions, .nav-links');
    staggerContainers.forEach(container => {
        const children = container.children;
        Array.from(children).forEach(child => {
            child.classList.add('reveal-hidden', 'staggered-child');
        });
        revealObserver.observe(container);
    });

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '1rem 0';
            header.style.background = 'rgba(10, 12, 16, 0.95)';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        } else {
            header.style.padding = '1.5rem 0';
            header.style.background = 'rgba(10, 12, 16, 0.8)';
            header.style.boxShadow = 'none';
        }
    });

    // Lightbox Functionality
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeBtn = document.querySelector(".lightbox-close");
    const certImages = document.querySelectorAll(".certificate-image img");

    certImages.forEach(img => {
        img.addEventListener("click", () => {
            lightbox.style.display = "block";
            lightboxImg.src = img.src;
            lightboxCaption.textContent = img.alt;
            document.body.style.overflow = "hidden"; // Prevent scrolling
        });
    });

    const closeLightbox = () => {
        lightbox.style.display = "none";
        document.body.style.overflow = "auto";
    };

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox.style.display === "block") {
            closeLightbox();
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('is-active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll'); // Optional: prevent scrolling when menu is open
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('is-active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
});
