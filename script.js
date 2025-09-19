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