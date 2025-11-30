document.addEventListener('DOMContentLoaded', function() {
    
    // --- Signup Form Logic ---
    const signupForm = document.getElementById('signupForm');
    const emailInput = document.getElementById('emailInput');
    const signupMessage = document.getElementById('signupMessage');

    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = emailInput.value.trim();

            if (!validateEmail(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Set loading state
            const submitButton = signupForm.querySelector('.cta-button');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span class="button-text">Processing...</span>';
            submitButton.disabled = true;
            emailInput.disabled = true;

            try {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1200));

                // Success State
                showMessage("You're on the list. We'll be in touch.", 'success');
                emailInput.value = '';
                
                // Reset button after a moment
                setTimeout(() => {
                    submitButton.innerHTML = '<span class="button-text">Joined</span>';
                    submitButton.style.backgroundColor = 'var(--accent-success)';
                }, 500);

            } catch (error) {
                showMessage('Something went wrong. Please try again.', 'error');
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                emailInput.disabled = false;
            }
        });
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showMessage(text, type) {
        if (!signupMessage) return;
        signupMessage.textContent = text;
        signupMessage.className = `signup-message ${type}`;
        
        // Simple fade in
        signupMessage.style.opacity = '0';
        signupMessage.style.display = 'block';
        setTimeout(() => {
            signupMessage.style.transition = 'opacity 0.3s ease';
            signupMessage.style.opacity = '1';
        }, 10);
    }

    // --- Chat Animation (Subtle & Smooth) ---
    const messages = document.querySelectorAll('.chat-messages .message');
    const typingIndicator = document.querySelector('.typing-indicator');
    
    if (messages.length > 0) {
        // Initial State: Hide messages
        messages.forEach(msg => {
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(10px)';
            msg.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        if (typingIndicator) {
            typingIndicator.style.opacity = '0';
            typingIndicator.style.transition = 'opacity 0.3s ease';
        }

        // Sequence
        const sequence = async () => {
            // Wait a bit after load
            await wait(1000);

            // Message 1 (AI)
            revealMessage(messages[0]);
            await wait(2000);

            // Message 2 (User)
            revealMessage(messages[1]);
            await wait(1500);

            // Message 3 (AI)
            revealMessage(messages[2]);
            await wait(2500);

            // Message 4 (User)
            revealMessage(messages[3]);
            await wait(1000);

            // Show Typing Indicator
            if (typingIndicator) typingIndicator.style.opacity = '1';
            await wait(2000);
            if (typingIndicator) typingIndicator.style.opacity = '0';

            // Message 5 (AI + Feedback)
            revealMessage(messages[4]);
        };

        // Start animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    sequence();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 });

        const chatPreview = document.querySelector('.app-preview');
        if (chatPreview) observer.observe(chatPreview);
    }

    function revealMessage(element) {
        if (!element) return;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- Dynamic Year ---
    const footerText = document.querySelector('.footer-text');
    if (footerText) {
        footerText.innerHTML = `&copy; ${new Date().getFullYear()} LingLang.`;
    }
});