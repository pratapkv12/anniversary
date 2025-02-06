let highestZ = 1;
let viewedCards = 0;
const totalCards = document.querySelectorAll('.paper').length;

class Paper {
    holdingPaper = false;
    touchStartX = 0;
    touchStartY = 0;
    touchMoveX = 0;
    touchMoveY = 0;
    touchEndX = 0;
    touchEndY = 0;
    prevTouchX = 0;
    prevTouchY = 0;
    velX = 0;
    velY = 0;
    rotation = Math.random() * 30 - 15;
    currentPaperX = 0;
    currentPaperY = 0;
    rotating = false;

    init(paper) {
        paper.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!this.rotating) {
                this.touchMoveX = e.touches[0].clientX;
                this.touchMoveY = e.touches[0].clientY;

                this.velX = this.touchMoveX - this.prevTouchX;
                this.velY = this.touchMoveY - this.prevTouchY;
            }

            const dirX = e.touches[0].clientX - this.touchStartX;
            const dirY = e.touches[0].clientY - this.touchStartY;
            const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
            const dirNormalizedX = dirX / dirLength;
            const dirNormalizedY = dirY / dirLength;

            const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
            let degrees = (360 + Math.round((180 * angle) / Math.PI)) % 360;

            if (this.rotating) {
                this.rotation = degrees;
            }

            if (this.holdingPaper) {
                if (!this.rotating) {
                    this.currentPaperX += this.velX;
                    this.currentPaperY += this.velY;
                }
                this.prevTouchX = this.touchMoveX;
                this.prevTouchY = this.touchMoveY;

                paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
            }
        });

        paper.addEventListener('touchstart', (e) => {
            if (this.holdingPaper) return;
            this.holdingPaper = true;

            paper.style.zIndex = highestZ++;
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.prevTouchX = this.touchStartX;
            this.prevTouchY = this.touchStartY;

            if (!paper.classList.contains("viewed")) {
                paper.classList.add("viewed");
                viewedCards++;

                if (viewedCards === totalCards) {
                    triggerConfetti();
                }
            }
        });

        paper.addEventListener('touchend', () => {
            this.holdingPaper = false;
            this.rotating = false;
        });

        paper.addEventListener('gesturestart', (e) => {
            e.preventDefault();
            this.rotating = true;
        });

        paper.addEventListener('gestureend', () => {
            this.rotating = false;
        });
    }
}

// Initialize papers for both touch and desktop interactions
const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
    const p = new Paper();
    p.init(paper);

    let currentX = 0, currentY = 0, holding = false, startX, startY;

    paper.addEventListener('mousedown', (e) => {
        holding = true;
        startX = e.clientX - currentX;
        startY = e.clientY - currentY;
        paper.style.zIndex = highestZ++;
        paper.style.transition = 'none';

        if (!paper.classList.contains("viewed")) {
            paper.classList.add("viewed");
            viewedCards++;

            if (viewedCards === totalCards) {
                triggerConfetti();
            }
        }
    });

    window.addEventListener('mouseup', () => (holding = false));

    window.addEventListener('mousemove', (e) => {
        if (!holding) return;
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;
        paper.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${Math.sin(currentX * 0.02) * 5}deg)`;
    });
});

function triggerConfetti() {
    const confettiCanvas = document.createElement("canvas");
    confettiCanvas.classList.add("confetti-canvas");
    document.body.appendChild(confettiCanvas);

    const confettiSettings = {
        target: confettiCanvas,
        max: 200,
        size: 1.2,
        colors: [[255, 215, 0], [220, 20, 60], [255, 255, 255], [0, 0, 0]], // Gold, Red, White, Black
        speed: 5
    };

    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();

    setTimeout(() => {
        confetti.clear();
        document.body.removeChild(confettiCanvas);
    }, 5000);
}
