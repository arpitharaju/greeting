import { playConfetti } from "./confetti.js";
import { playPartyPopper } from "./partyPopper.js";
import { playGlowingBurst } from "./glowingBurst.js";

export function createAnimationManager(layerEl) {
  let runId = 0;
  let cleanup = null;

  const hardClear = () => {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
    while (layerEl.firstChild) layerEl.removeChild(layerEl.firstChild);
  };

  const playRandom = () => {
    runId += 1;
    const thisRun = runId;

    // Clear before starting the next one to prevent overlap.
    hardClear();

    const pick = Math.floor(Math.random() * 3);
    const runners = [playConfetti, playPartyPopper, playGlowingBurst];
    const runner = runners[pick];

    cleanup = runner({
      layerEl,
      runId: thisRun,
    });
  };

  return {
    playRandom,
    clear: hardClear,
  };
}

