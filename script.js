// Email signup functionality
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const emailInput = document.getElementById('emailInput');
    const signupMessage = document.getElementById('signupMessage');

    // Handle form submission
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();

        if (!validateEmail(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Disable form during submission
        emailInput.disabled = true;
        const submitButton = signupForm.querySelector('.cta-button');
        const originalButtonText = submitButton.querySelector('.button-text').textContent;
        submitButton.querySelector('.button-text').textContent = 'Signing up...';
        submitButton.disabled = true;

        try {
            // Simulate API call (replace with actual endpoint when ready)
            await simulateSignup(email);

            // Success
            showMessage('Thanks for signing up! We\'ll notify you when LingLang launches.', 'success');
            emailInput.value = '';

            // Store in localStorage (for demo purposes)
            const signups = JSON.parse(localStorage.getItem('linglang_signups') || '[]');
            signups.push({ email, date: new Date().toISOString() });
            localStorage.setItem('linglang_signups', JSON.stringify(signups));

        } catch (error) {
            showMessage('Something went wrong. Please try again later.', 'error');
        } finally {
            // Re-enable form
            emailInput.disabled = false;
            submitButton.querySelector('.button-text').textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });

    // Email validation
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Show message
    function showMessage(text, type) {
        signupMessage.textContent = text;
        signupMessage.className = `signup-message ${type}`;

        // Auto-hide message after 5 seconds
        setTimeout(() => {
            signupMessage.className = 'signup-message';
        }, 5000);
    }

    // Simulate API call (replace with actual implementation)
    function simulateSignup(email) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Email signup:', email);
                resolve();
            }, 1000);
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.animationPlayState = 'paused';
        observer.observe(card);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add parallax effect to graph nodes
    let ticking = false;
    function updateParallax() {
        const scrollY = window.pageYOffset;
        const nodes = document.querySelectorAll('.graph-node');

        nodes.forEach((node, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrollY * speed);
            node.style.transform = `translateY(${yPos}px)`;
        });

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        window.addEventListener('scroll', requestTick);
    }

    // Add keyboard navigation for accessibility
    emailInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            signupForm.dispatchEvent(new Event('submit'));
        }
    });

    // Dynamic copyright year
    const currentYear = new Date().getFullYear();
    const copyrightText = document.querySelector('.footer-text');
    if (copyrightText) {
        copyrightText.textContent = `© ${currentYear} LingLang. All rights reserved.`;
    }

    // Chat Animation - Simulate typing and messages
    function simulateChatAnimation() {
        const messages = document.querySelectorAll('.chat-messages .message');
        const typingIndicator = document.querySelector('.typing-indicator');

        // Hide all messages initially
        messages.forEach(message => {
            message.style.opacity = '0';
            message.style.transform = 'translateY(10px)';
        });

        // Hide typing indicator initially
        if (typingIndicator) {
            typingIndicator.style.opacity = '0';
        }

        // Animate messages appearing one by one
        let delay = 0;
        messages.forEach((message, index) => {
            setTimeout(() => {
                message.style.transition = 'all 0.5s ease-out';
                message.style.opacity = '1';
                message.style.transform = 'translateY(0)';

                // Show typing indicator before last message
                if (index === messages.length - 2 && typingIndicator) {
                    setTimeout(() => {
                        typingIndicator.style.opacity = '1';
                        // Hide typing indicator after 2 seconds and show last message
                        setTimeout(() => {
                            typingIndicator.style.opacity = '0';
                        }, 2000);
                    }, 1000);
                }
            }, delay);
            delay += 1500;
        });
    }

    // Phone mockup interaction
    const phoneMockup = document.querySelector('.phone-mockup');
    if (phoneMockup) {
        // Add subtle floating animation
        phoneMockup.style.animation = 'phoneFloat 6s ease-in-out infinite';

        // Start chat animation when phone is visible
        const phoneObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(simulateChatAnimation, 1000);
                    phoneObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        phoneObserver.observe(phoneMockup);
    }

    // Add click effect to feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });

    // Update button text based on form state
    function updateButtonText() {
        const button = document.querySelector('.cta-button .button-text');
        const emailInput = document.getElementById('emailInput');

        if (emailInput && button) {
            emailInput.addEventListener('input', function() {
                if (this.value.trim()) {
                    button.textContent = 'Join Waitlist';
                } else {
                    button.textContent = 'Join Waitlist';
                }
            });
        }
    }

    updateButtonText();

    // Enhanced success message
    const originalShowMessage = showMessage;
    function showMessage(text, type) {
        if (type === 'success') {
            // Add celebration effect
            createCelebrationEffect();
        }
        originalShowMessage(text, type);
    }

    function createCelebrationEffect() {
        // Simple celebration animation
        const button = document.querySelector('.cta-button');
        if (button) {
            button.style.transform = 'scale(1.1)';
            button.style.background = 'linear-gradient(135deg, #26a69a, #00897b)';
            setTimeout(() => {
                button.style.transform = '';
                button.style.background = '';
            }, 300);
        }
    }

    // Log page view (for analytics when implemented)
    console.log('LingLang Coming Soon Page Loaded');

    // Optional: Add some interactivity to the logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            const logoIcon = logo.querySelector('.logo-icon');
            logoIcon.style.animation = 'none';
            setTimeout(() => {
                logoIcon.style.animation = '';
            }, 10);
        });
    }
});