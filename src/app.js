import { createAnimationManager } from "./animations/animationManager.js";

export function createGreetingApp() {
  const animationLayer = document.getElementById("animation-layer");
  const nameInput = document.getElementById("nameInput");
  const greetBtn = document.getElementById("greetBtn");
  const greetingEl = document.getElementById("greeting");

  if (!animationLayer || !nameInput || !greetBtn || !greetingEl) {
    // If markup changes, fail loudly rather than silently.
    throw new Error("Greeting app: required DOM elements not found.");
  }

  const anim = createAnimationManager(animationLayer);

  const setGreeting = (name) => {
    // Requirement: always display exactly "Hello" below the button.
    greetingEl.textContent = "Hello";
  };

  const onGreet = () => {
    setGreeting(nameInput.value);
    anim.playRandom();
  };

  greetBtn.addEventListener("click", onGreet);
  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") onGreet();
  });
}

