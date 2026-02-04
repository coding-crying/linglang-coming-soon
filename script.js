document.addEventListener('DOMContentLoaded', function() {

    // --- Scenario Configuration (Witty "Hard vs Hardly" Theme) ---
    const scenario = [
        { 
            role: 'ai', 
            text: "You look like you've fought a bear." 
        },
        { 
            role: 'user', 
            text: "I feel like it. I have been working ",
            typeSpeed: 30
        },
        {
            role: 'user',
            text: "hardly",
            isKeyword: true,
            keywordId: 'hardly', // Maps to node-hardly
            typeSpeed: 80 
        },
        {
            role: 'user',
            text: " all day.",
            typeSpeed: 30
        },
        {
            role: 'ai',
            text: "If you were working 'hardly', the bear would have won.",
            typeSpeed: 30,
            delay: 1200
        },
        { 
            role: 'ai', 
            text: " You mean working hard.", // Fixed spacing
            typeSpeed: 30,
            delay: 300
        },
        {
            role: 'user',
            text: "Ha. Yes. I am absolutely ",
            typeSpeed: 30,
            delay: 800
        },
        {
            role: 'user',
            text: "exhausted",
            isKeyword: true,
            keywordId: 'exhausted', // Maps to node-exhausted
            typeSpeed: 80
        },
        {
            role: 'user',
            text: ".",
            typeSpeed: 30
        },
        {
            role: 'ai',
            text: "Then rest, warrior. The bear can wait.",
            typeSpeed: 30,
            delay: 800
        }
    ];

    const heroChat = document.getElementById('heroChat');
    
    // --- Typewriter Logic ---
    async function runScenario() {
        let currentBubble = null;
        let currentTextContainer = null;

        for (let segment of scenario) {
            const isNewBubble = !currentBubble || currentBubble.dataset.role !== segment.role;

            if (segment.delay) {
                await wait(segment.delay);
            }

            if (isNewBubble) {
                currentBubble = document.createElement('div');
                currentBubble.className = `chat-bubble ${segment.role} visible`;
                currentBubble.dataset.role = segment.role;
                
                heroChat.appendChild(currentBubble);
                currentTextContainer = document.createElement('span');
                currentBubble.appendChild(currentTextContainer);
            }

            if (segment.isKeyword) {
                const span = document.createElement('span');
                span.className = 'vocab-highlight';
                currentTextContainer.appendChild(span);
                
                await typeText(span, segment.text, segment.typeSpeed || 50);
                activateGraphNode(segment.keywordId);
                span.classList.add('active');

            } else {
                const span = document.createElement('span');
                currentTextContainer.appendChild(span);
                await typeText(span, segment.text, segment.typeSpeed || 30);
            }
        }
    }

    function typeText(element, text, speed) {
        return new Promise(resolve => {
            let i = 0;
            function type() {
                if (i < text.length) {
                    element.innerText += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            }
            type();
        });
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- Knowledge Graph Logic ---
    function activateGraphNode(keywordId) {
        const triggerNode = document.getElementById(`node-${keywordId}`);
        if (!triggerNode) return;

        // Reveal Trigger Node
        triggerNode.style.opacity = '1';
        triggerNode.style.transform = 'translate(-50%, -50%) scale(1.1)';
        
        // If it's the "due" word (exhausted in this scenario for demo), hide the due badge
        if (keywordId === 'exhausted') {
            triggerNode.classList.remove('due');
        }

        setTimeout(() => {
            triggerNode.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 300);

        // Reveal Connections, Leaves, and Memory Node
        if (keywordId === 'exhausted') {
            revealConnection('line-exhausted-root');
            setTimeout(() => { revealLeaf('node-fatigue', 'line-fatigue-exhausted'); }, 400);
            setTimeout(() => { revealLeaf('node-sleep', 'line-sleep-exhausted'); }, 800);
            setTimeout(() => { revealLeaf('mem-exhausted', 'line-mem-exhausted'); }, 600);
        }
        else if (keywordId === 'hardly') {
            revealConnection('line-hardly-root');
            setTimeout(() => { revealLeaf('node-grammar', 'line-grammar-hardly'); }, 400);
            setTimeout(() => { revealLeaf('node-nuance', 'line-nuance-hardly'); }, 800);
            setTimeout(() => { revealLeaf('mem-hardly', 'line-mem-hardly'); }, 600);
        }
    }

    function revealConnection(lineId) {
        const line = document.getElementById(lineId);
        if (line) line.setAttribute('stroke-opacity', '1');
    }

    function revealLeaf(nodeId, lineId) {
        const node = document.getElementById(nodeId);
        const line = document.getElementById(lineId);
        if (line) line.setAttribute('stroke-opacity', '1');
        if (node) node.style.opacity = '1';
    }

    // --- Initialization ---
    setTimeout(() => {
        runScenario();
    }, 1000);

});