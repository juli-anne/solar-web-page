/* global document, window, setInterval, clearInterval, setTimeout, clearTimeout, IntersectionObserver */

"use strict";

document.addEventListener('DOMContentLoaded', function () {
    initHeroSlider();
    initAnimatedStats();
    initMobileMenu();
    initDropdownMenus();
    initSmoothScrolling();
    initLazyLoading();
    initFormValidation();
    initScrollToTop();
});

function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length === 0) return;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopSlideShow();
            startSlideShow();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopSlideShow();
            startSlideShow();
        });
    }

    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', stopSlideShow);
        heroSlider.addEventListener('mouseleave', startSlideShow);
    }
    startSlideShow();
}

function initAnimatedStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    function animateNumber(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            if (target >= 1000000) {
                element.textContent = (current / 1000000).toFixed(1) + 'M';
            } else if (target >= 1000) {
                element.textContent = (current / 1000).toFixed(0) + 'K';
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    function startStatsAnimation() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            animateNumber(stat, target);
        });
    }

    const statsSection = document.querySelector('.statistics');
    if (statsSection && statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startStatsAnimation();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }
}

function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (!mobileMenuBtn || !navMenu) return;

    mobileMenuBtn.addEventListener('click', function () {
        const isExpanded = navMenu.classList.contains('active');

        navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');

        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);

        document.body.classList.toggle('menu-open', !isExpanded);
    });

    document.addEventListener('click', function (e) {
        if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        }
    });
}

function initDropdownMenus() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const dropdownContent = dropdown.querySelector('.dropdown-content');

        if (!dropdownContent) return;

        dropdown.addEventListener('mouseenter', function () {
            dropdownContent.style.display = 'block';
            dropdownContent.style.opacity = '1';
        });

        dropdown.addEventListener('mouseleave', function () {
            dropdownContent.style.display = 'none';
            dropdownContent.style.opacity = '0';
        });

        dropdown.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const isVisible = dropdownContent.style.display === 'block';
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        const otherContent = otherDropdown.querySelector('.dropdown-content');
                        if (otherContent) otherContent.style.display = 'none';
                    }
                });
                dropdownContent.style.display = isVisible ? 'none' : 'block';
            }
        });
    });
}

function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window && images.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }
}

function initFormValidation() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validateContactForm()) {
            showSuccessMessage();
        }
    });
}

function validateContactForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let isValid = true;

    clearErrors();

    if (!name.value.trim()) {
        showError(name, 'Ime je obavezno');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showError(name, 'Ime mora imati najmanje 2 znaka');
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showError(email, 'Email je obavezan');
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        showError(email, 'Unesite valjan email');
        isValid = false;
    }

    if (!message.value.trim()) {
        showError(message, 'Poruka je obavezna');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showError(message, 'Poruka mora imati najmanje 10 znakova');
        isValid = false;
    }

    return isValid;
}

function showError(input, message) {
    input.classList.add('input-error');
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    input.parentNode.appendChild(error);
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    document.querySelectorAll('.input-error').forEach(input =>
        input.classList.remove('input-error')
    );
}

function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = 'Poruka je uspješno poslana!';

    const form = document.getElementById('contact-form');
    form.insertBefore(successDiv, form.firstChild);

    setTimeout(() => {
        successDiv.remove();
        form.reset();
    }, 5000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.setAttribute('aria-label', 'Vrati se na vrh');
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', debounce(() => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }, 100));

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}