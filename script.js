/* 
  St. Mary's Senior Girls School - Script
  Interactivity and Micro-animations
*/

const fadeOutPreloader = () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 600);
    }
};

window.addEventListener('load', fadeOutPreloader);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header Logic
    const header = document.getElementById('main-header');

    const handleScroll = () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // 2. Hero Slider
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const slideInterval = 6000;

        const nextSlide = () => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        };

        setInterval(nextSlide, slideInterval);
    }

    // 3. Stats Counter Animation
    const counters = document.querySelectorAll('.counter');
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = 0;
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps

            let currentCount = 0;
            const timer = setInterval(() => {
                currentCount += increment;
                if (currentCount >= target) {
                    counter.innerText = target + (target > 50 ? '+' : '');
                    clearInterval(timer);
                } else {
                    counter.innerText = Math.floor(currentCount) + (target > 50 ? '+' : '');
                }
            }, 16);
        });
    };

    // 4. Reveal Animations on Scroll
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // If it's a stats section, trigger counters
                if (entry.target.classList.contains('stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, section, .feature-card, .news-card, .stat-item').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // 5. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.getElementById('nav-overlay');

    const openMobileMenu = () => {
        navLinks.classList.add('active');
        if (navOverlay) navOverlay.classList.add('active');
        if (mobileToggle) {
            mobileToggle.classList.add('menu-open');
            const icon = mobileToggle.querySelector('i');
            if (icon) icon.classList.replace('fa-bars', 'fa-times');
        }
        document.body.style.overflow = 'hidden';
    };

    const closeMobileMenu = () => {
        navLinks.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        if (mobileToggle) {
            mobileToggle.classList.remove('menu-open');
            const icon = mobileToggle.querySelector('i');
            if (icon) icon.classList.replace('fa-times', 'fa-bars');
        }
        document.body.style.overflow = 'auto';
    };

    if (mobileToggle) {
        console.log("Mobile toggle button found and listener attached.");
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log("Mobile toggle clicked. Current state:", navLinks.classList.contains('active') ? "Open" : "Closed");
            if (navLinks.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    } else {
        console.warn("Mobile toggle button (.mobile-menu-btn) not found!");
    }

    // Close menu when tapping the overlay backdrop
    if (navOverlay) {
        navOverlay.addEventListener('click', (e) => {
            console.log("Overlay clicked, closing menu.");
            closeMobileMenu();
        });
    }

    // Handle Dropdowns on Mobile — only toggle submenu, don't block navigation
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const chevron = dropdown.querySelector('.fa-chevron-down');
        if (chevron) {
            // Clicking the chevron icon toggles the dropdown on mobile
            chevron.parentElement.addEventListener('click', (e) => {
                if (window.innerWidth <= 991) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // Close mobile menu when any nav link is clicked, then let the browser navigate
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 991) {
                // If this link is a dropdown toggle (has a sibling menu), don't close the main menu
                if (link.nextElementSibling && link.nextElementSibling.classList.contains('dropdown-menu')) {
                    return;
                }

                // Otherwise (Home, About, or a Dropdown Item), close the menu
                closeMobileMenu();
            }
        });
    });

    // Handle Hash Navigation Visibility
    // If user navigates to a section via #hash, make it active immediately
    const handleHashReveal = () => {
        const hash = window.location.hash;

        // Remove active-anchor from everything
        document.querySelectorAll('.active-anchor').forEach(el => el.classList.remove('active-anchor'));

        if (hash) {
            const target = document.querySelector(hash);
            if (target) {
                target.classList.add('active');
                target.classList.add('active-anchor');

                // Also activate parent sections if they are reveal
                let parent = target.parentElement;
                while (parent) {
                    if (parent.classList.contains('reveal')) {
                        parent.classList.add('active');
                    }
                    parent = parent.parentElement;
                }

                // Smooth scroll with offset if needed (though scroll-padding-top handles it)
            }
        }
    };

    window.addEventListener('hashchange', handleHashReveal);
    handleHashReveal(); // Run on load

    // 6. Form Handling (Simple validation & feedback)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
                btn.classList.add('btn-success');
                form.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.opacity = '1';
                    btn.disabled = false;
                }, 3000);
            }, 2000);
        });
    });

    // 8. Back to Top Button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.className = 'back-to-top';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 9. Awards Modal Logic
    const awardsBtn = document.getElementById('view-awards-btn');
    const awardsModal = document.getElementById('awards-modal');
    const closeModal = document.getElementById('close-modal');

    if (awardsBtn && awardsModal) {
        awardsBtn.addEventListener('click', () => {
            awardsModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                awardsModal.classList.remove('active');
                document.body.style.overflow = 'auto'; // Restore scroll
            });
        }

        // Close on clicking overlay
        awardsModal.addEventListener('click', (e) => {
            if (e.target === awardsModal) {
                awardsModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && awardsModal.classList.contains('active')) {
                awardsModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});
