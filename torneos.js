// FILTRO DE CATEGORÍAS
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".tournament-card");

filters.forEach(filter => {
  filter.addEventListener("click", () => {
    filters.forEach(button => button.classList.remove("active"));
    filter.classList.add("active");

    const category = filter.dataset.category;

    cards.forEach(card => {
      if (category === "todos" || card.dataset.category === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// MODAL DE INSCRIPCIÓN
const modal = document.getElementById("registrationModal");
const closeModal = document.getElementById("closeModal");
const registerButtons = document.querySelectorAll(".register-btn");

const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalCategory = document.getElementById("modalCategory");
const modalSlots = document.getElementById("modalSlots");

registerButtons.forEach(button => {
  button.addEventListener("click", () => {
    modalTitle.textContent = button.dataset.torneo;
    modalDate.textContent = button.dataset.fecha;
    modalCategory.textContent = button.dataset.categoria;
    modalSlots.textContent = button.dataset.cupos;

    document.getElementById("registrationForm").style.display = "flex";
    document.getElementById("successMessage").classList.remove("show");

    modal.classList.add("show");
  });
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
});

modal.addEventListener("click", event => {
  if (event.target === modal) {
    modal.classList.remove("show");
  }
});

// SIMULACIÓN DE INSCRIPCIÓN
document.getElementById("registrationForm").addEventListener("submit", event => {
  event.preventDefault();

  document.getElementById("registrationForm").style.display = "none";
  document.getElementById("successMessage").classList.add("show");
});

// ESC PARA CERRAR EL MODAL
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    modal.classList.remove("show");
  }
});
