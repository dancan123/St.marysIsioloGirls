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
    const navItems = document.querySelectorAll('.nav-item');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // Handle Dropdowns on Mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-item');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 991) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    // Close mobile menu when clicking a link (but not if it's a dropdown toggle)
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.parentElement.classList.contains('dropdown') && window.innerWidth <= 991) {
                // Let the dropdown toggle handle it
                return;
            }

            navLinks.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) icon.classList.replace('fa-times', 'fa-bars');
        });
    });

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

});
