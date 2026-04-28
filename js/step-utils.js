export async function renderStepContent(stepNumber, container) {
  const response = await fetch(`./data/step${stepNumber}.json`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Impossible de charger data/step${stepNumber}.json`);
  }

  const data = await response.json();

  container.innerHTML = `
        <article class="step-detail">
            <div class="step-detail__header">
                <div>
                    <p class="eyebrow">Étape ${String(stepNumber).padStart(2, "0")}</p>
                    <h2 class="step-detail__title">${data.title}</h2>
                </div>
                <div class="step-detail__meta">${data.skills.length} compétences</div>
            </div>

            <p class="step-detail__description">${data.description}</p>

            <div class="skills-grid" aria-label="Compétences associées">
                ${data.skills
                  .map(
                    (skill) => `
                            <button class="skill-card" type="button" aria-pressed="false">
                                <span class="skill-card__inner">
                                    <span class="skill-card__face skill-card__front">
                                        <strong>${skill.title}</strong>
                                    </span>
                                    <span class="skill-card__face skill-card__back">${skill.description}</span>
                                </span>
                            </button>
                        `,
                  )
                  .join("")}
            </div>

        </article>
    `;

  container.querySelectorAll(".skill-card").forEach((card) => {
    card.addEventListener("click", () => {
      const isFlipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(isFlipped));
    });
  });
}
