export function playConfetti({ layerEl }) {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  layerEl.appendChild(canvas);

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    // Fail safe: remove canvas if canvas context is unavailable.
    canvas.remove();
    return () => {};
  }

  let w = Math.max(1, layerEl.clientWidth);
  let h = Math.max(1, layerEl.clientHeight);
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const colors = [
    "rgba(124, 58, 237, 0.95)",
    "rgba(34, 197, 94, 0.95)",
    "rgba(59, 130, 246, 0.95)",
    "rgba(236, 72, 153, 0.95)",
    "rgba(245, 158, 11, 0.95)",
    "rgba(99, 102, 241, 0.95)",
  ];

  const originX = w * (0.5 + (Math.random() - 0.5) * 0.08);
  const originY = h * 0.18;

  const pieceCount = 160;
  const pieces = new Array(pieceCount).fill(0).map(() => {
    const angle = (Math.random() * Math.PI) / 1.25 + Math.PI * 0.6; // outward-ish
    const speed = 5 + Math.random() * 11;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const bw = 4 + Math.random() * 6;
    const bh = 7 + Math.random() * 12;
    return {
      x: originX + (Math.random() - 0.5) * 20,
      y: originY + (Math.random() - 0.5) * 8,
      vx,
      vy,
      w: bw,
      h: bh,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
      drag: 0.985 + Math.random() * 0.01,
    };
  });

  let rafId = 0;
  let timeoutId = 0;
  let stopped = false;
  const durationMs = 980;
  const startedAt = performance.now();
  let lastT = startedAt;

  const resize = () => {
    // Keep canvas resolution in sync with the layer size.
    w = Math.max(1, layerEl.clientWidth);
    h = Math.max(1, layerEl.clientHeight);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  window.addEventListener("resize", resize);

  const cleanup = () => {
    if (stopped) return;
    stopped = true;
    window.removeEventListener("resize", resize);
    if (rafId) cancelAnimationFrame(rafId);
    if (timeoutId) window.clearTimeout(timeoutId);
    if (canvas.isConnected) canvas.remove();
  };

  // Safety net to ensure we clear even if RAF gets throttled.
  timeoutId = window.setTimeout(() => {
    if (!stopped) cleanup();
  }, durationMs + 140);

  const draw = (now) => {
    if (stopped) return;
    if (!canvas.isConnected || !layerEl.contains(canvas)) return;

    const elapsed = now - startedAt;
    if (elapsed >= durationMs) {
      cleanup();
      return;
    }

    const dt = Math.max(0.2, Math.min(2.2, (now - lastT) / 16.666));
    lastT = now;

    ctx.clearRect(0, 0, w, h);

    // Subtle trail fade for depth.
    ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
    ctx.fillRect(0, 0, w, h);

    const gravity = 0.64;
    for (let i = 0; i < pieces.length; i += 1) {
      const p = pieces[i];
      p.vy += gravity * dt;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;

      if (p.y > h + 60 || p.x < -60 || p.x > w + 60) continue;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - elapsed / durationMs);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    rafId = requestAnimationFrame(draw);
  };

  rafId = requestAnimationFrame(draw);
  return cleanup;
}

