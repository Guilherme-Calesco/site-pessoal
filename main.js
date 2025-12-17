/* ==========================================================================
   Calesco Landing Page - JavaScript
   Funcionalidades: Scroll suave, Navbar, FAQ Accordion, Form Validation
   ========================================================================== */

(function() {
    'use strict';

    /* ==========================================================================
       DOM Elements
       ========================================================================== */
    const header = document.getElementById('header');
    const nav = document.getElementById('nav-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelectorAll('.nav-link');
    const faqItems = document.querySelectorAll('.faq-item');
    const contactForm = document.getElementById('contact-form');
    const toast = document.getElementById('toast');

    /* ==========================================================================
       Smooth Scroll
       ========================================================================== */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Skip if it's just "#" or empty
                if (href === '#' || href === '') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                // Close mobile menu if open
                if (nav.classList.contains('active')) {
                    closeMobileMenu();
                }

                // Scroll to target
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without triggering scroll
                history.pushState(null, null, href);
            });
        });
    }

    /* ==========================================================================
       Header Scroll Effect
       ========================================================================== */
    function initHeaderScroll() {
        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateHeader() {
            const scrollY = window.scrollY;

            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScrollY = scrollY;
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });

        // Initial check
        updateHeader();
    }

    /* ==========================================================================
       Active Section Highlighting
       ========================================================================== */
    function initActiveSection() {
        const sections = document.querySelectorAll('section[id]');

        if (!sections.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    updateActiveLink(id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    function updateActiveLink(sectionId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    /* ==========================================================================
       Mobile Menu
       ========================================================================== */
    function initMobileMenu() {
        if (!mobileMenuBtn || !nav) return;

        mobileMenuBtn.addEventListener('click', toggleMobileMenu);

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('active') &&
                !nav.contains(e.target) &&
                !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                closeMobileMenu();
                mobileMenuBtn.focus();
            }
        });
    }

    function toggleMobileMenu() {
        const isOpen = nav.classList.contains('active');

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        nav.classList.add('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        mobileMenuBtn.setAttribute('aria-label', 'Fechar menu');
    }

    function closeMobileMenu() {
        nav.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Abrir menu');
    }

    /* ==========================================================================
       FAQ Accordion
       ========================================================================== */
    function initFaqAccordion() {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            if (!question) return;

            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');

                // Close all items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    if (otherQuestion) {
                        otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                }
            });

            // Keyboard support
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
    }

    /* ==========================================================================
       Form Validation
       ========================================================================== */
    function initFormValidation() {
        if (!contactForm) return;

        const fields = {
            name: {
                element: document.getElementById('name'),
                error: document.getElementById('name-error'),
                validate: (value) => {
                    if (!value.trim()) return 'Por favor, informe seu nome.';
                    if (value.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres.';
                    return '';
                }
            },
            email: {
                element: document.getElementById('email'),
                error: document.getElementById('email-error'),
                validate: (value) => {
                    if (!value.trim()) return 'Por favor, informe seu email.';
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) return 'Por favor, informe um email válido.';
                    return '';
                }
            },
            company: {
                element: document.getElementById('company'),
                error: document.getElementById('company-error'),
                validate: (value) => {
                    if (!value.trim()) return 'Por favor, informe sua empresa.';
                    return '';
                }
            },
            challenge: {
                element: document.getElementById('challenge'),
                error: document.getElementById('challenge-error'),
                validate: (value) => {
                    if (!value.trim()) return 'Por favor, descreva seu desafio ou objetivo.';
                    if (value.trim().length < 10) return 'Por favor, forneça mais detalhes (mínimo 10 caracteres).';
                    return '';
                }
            }
        };

        // Real-time validation on blur
        Object.keys(fields).forEach(key => {
            const field = fields[key];
            if (!field.element) return;

            field.element.addEventListener('blur', function() {
                validateField(field);
            });

            field.element.addEventListener('input', function() {
                // Clear error on input if field was in error state
                if (field.element.classList.contains('error')) {
                    validateField(field);
                }
            });
        });

        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;

            // Validate all fields
            Object.keys(fields).forEach(key => {
                const field = fields[key];
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            if (isValid) {
                submitForm(fields);
            } else {
                // Focus first invalid field
                const firstInvalid = contactForm.querySelector('.form-input.error');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
        });
    }

    function validateField(field) {
        if (!field.element) return true;

        const value = field.element.value;
        const errorMessage = field.validate(value);

        if (errorMessage) {
            field.element.classList.add('error');
            if (field.error) {
                field.error.textContent = errorMessage;
            }
            return false;
        } else {
            field.element.classList.remove('error');
            if (field.error) {
                field.error.textContent = '';
            }
            return true;
        }
    }

    function submitForm(fields) {
        // Collect form data
        const name = fields.name.element.value.trim();
        const email = fields.email.element.value.trim();
        const company = fields.company.element.value.trim();
        const challenge = fields.challenge.element.value.trim();
        const budget = document.getElementById('budget')?.value || 'Não informado';

        // Build mailto URL as fallback
        const subject = encodeURIComponent(`[Calesco] Contato de ${name} - ${company}`);
        const body = encodeURIComponent(
            `Nome: ${name}\n` +
            `Email: ${email}\n` +
            `Empresa: ${company}\n` +
            `Faixa de Investimento: ${budget}\n\n` +
            `Desafio/Objetivo:\n${challenge}`
        );

        const mailtoUrl = `mailto:guilherme.carod@gmail.com?subject=${subject}&body=${body}`;

        // Try to open mailto
        window.location.href = mailtoUrl;

        // Show success message
        showToast('Redirecionando para seu cliente de email...', 'success');

        // Reset form after short delay
        setTimeout(() => {
            contactForm.reset();
        }, 1000);
    }

    /* ==========================================================================
       Toast Notifications
       ========================================================================== */
    function showToast(message, type = 'success') {
        if (!toast) return;

        const toastMessage = toast.querySelector('.toast-message');
        if (toastMessage) {
            toastMessage.textContent = message;
        }

        // Remove existing classes
        toast.classList.remove('show', 'success', 'error');

        // Add new classes
        toast.classList.add(type);

        // Force reflow
        void toast.offsetWidth;

        // Show toast
        toast.classList.add('show');

        // Hide after delay
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    /* ==========================================================================
       Initialize
       ========================================================================== */
    function init() {
        initSmoothScroll();
        initHeaderScroll();
        initActiveSection();
        initMobileMenu();
        initFaqAccordion();
        initFormValidation();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
