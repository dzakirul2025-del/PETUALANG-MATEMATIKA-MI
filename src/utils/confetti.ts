import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  try {
    // Left burst
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.7 },
      colors: ['#38bdf8', '#34d399', '#facc15', '#f43f5e', '#a855f7'],
    });

    // Right burst
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.7 },
      colors: ['#38bdf8', '#34d399', '#facc15', '#f43f5e', '#a855f7'],
    });
  } catch {
    // fallback if canvas not available
  }
}

export function fireGrandCelebration() {
  try {
    const end = Date.now() + 1200;
    const colors = ['#f43f5e', '#38bdf8', '#fbbf24', '#34d399', '#c084fc'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {
    // fallback
  }
}
