const stepLoaders = {
  1: () => import("./js/step1.js"),
  2: () => import("./js/step2.js"),
  3: () => import("./js/step3.js"),
  4: () => import("./js/step4.js"),
  5: () => import("./js/step5.js"),
};

const stageButtons = Array.from(document.querySelectorAll("[data-step]"));
const stepPanel = document.querySelector("#step-panel");
const menuToggle = document.querySelector("#menu-toggle");
const contactDrawer = document.querySelector("#contact-drawer");

function setActiveStep(stepNumber) {
  stageButtons.forEach((button) => {
    button.classList.toggle(
      "is-active",
      button.dataset.step === String(stepNumber),
    );
  });
}

function toggleContactDrawer(forceOpen) {
  const shouldOpen =
    typeof forceOpen === "boolean"
      ? forceOpen
      : !contactDrawer.classList.contains("is-open");
  contactDrawer.classList.toggle("is-open", shouldOpen);
  menuToggle.setAttribute("aria-expanded", String(shouldOpen));
}

async function renderStep(stepNumber) {
  const loader = stepLoaders[stepNumber];

  if (!loader) {
    return;
  }

  setActiveStep(stepNumber);
  stepPanel.innerHTML = `
        <div class="step-panel__loading">
            <p class="eyebrow">Étape ${String(stepNumber).padStart(2, "0")}</p>
            <h2>Chargement…</h2>
            <p>Le contenu de l'étape arrive depuis son module dédié.</p>
        </div>
    `;

  try {
    const module = await loader();
    await module.renderStep(stepPanel);
  } catch (error) {
    stepPanel.innerHTML = `
            <div class="step-panel__loading">
                <p class="eyebrow">Erreur de chargement</p>
                <h2>Impossible d'afficher cette étape.</h2>
                <p>${error instanceof Error ? error.message : "Une erreur inattendue est survenue."}</p>
            </div>
        `;
  }
}

stageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const stepNumber = Number(button.dataset.step);
    renderStep(stepNumber);
  });
});

menuToggle?.addEventListener("click", () => {
  toggleContactDrawer();
});

document.addEventListener("click", (event) => {
  if (
    !contactDrawer.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    toggleContactDrawer(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    toggleContactDrawer(false);
  }
});

await renderStep(5);
