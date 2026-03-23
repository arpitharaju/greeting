const PIECE_COUNT = 30;

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export function playPartyPopper({ layerEl }) {
  const pieces = [];
  const maxDurationMs = 820;

  const hueBase = Math.floor(Math.random() * 360);
  const originX = "50%";
  const originY = "35%";

  for (let i = 0; i < PIECE_COUNT; i += 1) {
    const span = document.createElement("span");
    span.className = "popper-piece";

    const angle = (Math.PI * 2 * i) / PIECE_COUNT + (Math.random() - 0.5) * 0.25;
    const dist = 90 + Math.random() * 130;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist * 0.95;

    const hue = (hueBase + i * 7 + Math.random() * 30) % 360;
    const rot = randomInt(-220, 220);
    const duration = randomInt(560, maxDurationMs);
    const delay = randomInt(0, 70);

    span.style.setProperty("--x0", originX);
    span.style.setProperty("--y0", originY);
    span.style.setProperty("--dx", `${dx.toFixed(1)}px`);
    span.style.setProperty("--dy", `${dy.toFixed(1)}px`);
    span.style.setProperty("--rot", `${rot}deg`);
    span.style.setProperty("--hue", hue);
    span.style.setProperty("--duration", `${duration}ms`);
    span.style.setProperty("--delay", `${delay}ms`);

    // Vary piece size slightly for a more "paper confetti" look.
    const w = randomInt(6, 10);
    const h = randomInt(10, 18);
    span.style.width = `${w}px`;
    span.style.height = `${h}px`;

    layerEl.appendChild(span);
    pieces.push(span);
  }

  let timeoutId = window.setTimeout(() => {
    cleanup();
  }, maxDurationMs + 150);

  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    if (timeoutId) window.clearTimeout(timeoutId);
    for (const p of pieces) p.remove();
  };

  return cleanup;
}

