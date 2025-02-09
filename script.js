document.addEventListener("DOMContentLoaded", function () {
    // Intro Animation with Confetti
    setTimeout(() => {
        document.getElementById("intro").style.display = "none";
        showConfetti();
    }, 4000);
});

// Confetti Effect
function showConfetti() {
    const confettiContainer = document.createElement("div");
    confettiContainer.classList.add("confetti-container");
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 100; i++) {
        let confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confetti.style.backgroundColor = getRandomColor();
        confettiContainer.appendChild(confetti);
    }

    // Remove confetti after animation
    setTimeout(() => confettiContainer.remove(), 5000);
}

// Generate random confetti colors
function getRandomColor() {
    const colors = ["#ff0a54", "#ff477e", "#ff7096", "#ff85a1", "#ffa3b8", "#ffccd5", "#d63384"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Dragging Functionality
let highestZ = 1;
let draggedCount = 0;
const totalCards = document.querySelectorAll(".paper").length;

class Paper {
    constructor(paper) {
        this.paper = paper;
        this.paper.style.transform = `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) rotate(${Math.random() * 10 - 5}deg)`;
        this.dragging = false;
        this.init();
    }

    init() {
        this.paper.addEventListener("mousedown", (e) => this.startDrag(e));
        this.paper.addEventListener("touchstart", (e) => this.startDrag(e.touches[0]));
        document.addEventListener("mousemove", (e) => this.drag(e));
        document.addEventListener("touchmove", (e) => this.drag(e.touches[0]));
        document.addEventListener("mouseup", () => this.endDrag());
        document.addEventListener("touchend", () => this.endDrag());
    }

    startDrag(e) {
        this.dragging = true;
        this.offsetX = e.clientX - this.paper.offsetLeft;
        this.offsetY = e.clientY - this.paper.offsetTop;
        this.paper.style.zIndex = highestZ++;
    }

    drag(e) {
        if (!this.dragging) return;
        this.paper.style.left = `${e.clientX - this.offsetX}px`;
        this.paper.style.top = `${e.clientY - this.offsetY}px`;
    }

    endDrag() {
        this.dragging = false;
        draggedCount++;

        // Show confetti when all cards have been moved at least once
        if (draggedCount === totalCards) {
            showConfetti();
        }
    }
}

// Initialize Papers
document.querySelectorAll(".paper").forEach((paper) => new Paper(paper));
