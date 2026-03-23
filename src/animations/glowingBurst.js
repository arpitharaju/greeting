export function playGlowingBurst({ layerEl }) {
  const hue = Math.floor(Math.random() * 360);

  const burst = document.createElement("div");
  burst.className = "glow-burst";

  // Inline background so the burst feels different each time.
  burst.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), hsla(${hue}, 95%, 60%, 0.65) 22%, hsla(${(hue + 120) % 360}, 95%, 60%, 0.45) 46%, rgba(0, 0, 0, 0) 72%)`;
  burst.style.filter = `drop-shadow(0 0 18px hsla(${hue}, 95%, 60%, 0.55))`;

  layerEl.appendChild(burst);

  let cleaned = false;
  let timeoutId = 0;

  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    if (timeoutId) window.clearTimeout(timeoutId);
    if (burst.isConnected) burst.remove();
  };

  burst.addEventListener("animationend", cleanup, { once: true });

  // Safety net in case animationend doesn't fire.
  timeoutId = window.setTimeout(() => cleanup(), 900);

  return cleanup;
}

