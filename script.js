document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
      document.querySelector(".overlay").style.opacity = "0";
      setTimeout(() => {
          document.querySelector(".overlay").style.display = "none";
      }, 1500);
  }, 2500);
});

// Draggable Cards
let highestZ = 1;
let cards = document.querySelectorAll('.card');
let viewedCards = new Set();

cards.forEach(card => {
  let currentX = 0, currentY = 0;
  let holding = false;
  let startX, startY;

  card.addEventListener('mousedown', (e) => {
      holding = true;
      startX = e.clientX - currentX;
      startY = e.clientY - currentY;
      card.style.zIndex = highestZ++;
      card.style.transition = 'none';
      viewedCards.add(card); // Mark card as viewed

      // If all cards have been viewed, trigger confetti
      if (viewedCards.size === cards.length) {
          triggerConfetti();
      }
  });

  window.addEventListener('mouseup', () => holding = false);

  window.addEventListener('mousemove', (e) => {
      if (!holding) return;
      currentX = e.clientX - startX;
      currentY = e.clientY - startY;
      card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${Math.sin(currentX * 0.02) * 2}deg)`;
  });
});

// 🎊 Confetti Effect
function triggerConfetti() {
  let confettiContainer = document.createElement("div");
  confettiContainer.classList.add("confetti-container");
  document.body.appendChild(confettiContainer);

  for (let i = 0; i < 100; i++) {
      let confetti = document.createElement("div");
      confetti.classList.add("confetti");
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.animationDuration = `${Math.random() * 2 + 3}s`;
      confettiContainer.appendChild(confetti);
  }

  setTimeout(() => confettiContainer.remove(), 5000); // Remove after animation
}