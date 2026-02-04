document.addEventListener('DOMContentLoaded', () => {
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
    const staggerContainers = document.querySelectorAll('.projects-grid, .skills-container, .activity-grid, .hero-actions, .nav-links');
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
