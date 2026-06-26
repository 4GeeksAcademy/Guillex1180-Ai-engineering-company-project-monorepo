// =========================
// Referencias
// =========================

const form = document.getElementById("talentForm");
const successMessage = document.getElementById("successMessage");
const comments = document.getElementById("comments");
const commentsCounter = document.getElementById("commentsCounter");

// =========================
// Mensajes de error
// =========================

const errorMessages = {
    fullName: "El nombre debe contener al menos nombre y apellido",
    email: "Ingresa un email válido (ejemplo: nombre@empresa.com)",
    phone: "El teléfono debe incluir código de país (ejemplo: +34 612 345 678)",
    country: "Selecciona tu país de residencia",
    experience: "Los años de experiencia deben estar entre 0 y 50",
    sector: "Selecciona el sector de tu interés",
    englishLevel: "Indica tu nivel de inglés",
    availability: "Selecciona tu disponibilidad",
    linkedin: "Si incluyes LinkedIn, debe ser una URL válida",
    comments: "Los comentarios no pueden exceder 500 caracteres",
    dataPolicy: "Debes aceptar la política de tratamiento de datos para continuar"
};

// =========================
// Funciones auxiliares
// =========================

function showError(field, message) {
    const errorElement = document.getElementById(field + "Error");
    if (errorElement) {
        errorElement.textContent = message;
    }

    const input = document.getElementById(field);
    if (input) {
        input.classList.add("border-red-500");
    }
}

function clearError(field) {
    const errorElement = document.getElementById(field + "Error");
    if (errorElement) {
        errorElement.textContent = "";
    }

    const input = document.getElementById(field);
    if (input) {
        input.classList.remove("border-red-500");
    }
}

function clearAllErrors() {
    Object.keys(errorMessages).forEach(clearError);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^\+\d{1,3}\s\d[\d\s]{6,}$/.test(phone);
}

function isValidURL(url) {
    return /^https?:\/\/.+/i.test(url);
}

// =========================
// Contador de comentarios
// =========================

comments.addEventListener("input", () => {

    const length = comments.value.length;

    commentsCounter.textContent = `${length} / 500`;

    if (length > 500) {

        const remaining = 500 - length;

        showError(
            "comments",
            `Los comentarios no pueden exceder 500 caracteres (quedan ${remaining})`
        );

    } else {

        clearError("comments");

    }

});

// =========================
// Validación del formulario
// =========================

form.addEventListener("submit", function (event) {

    event.preventDefault();

    clearAllErrors();

    let valid = true;

    const fullName = form.fullName.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const country = form.country.value;
    const experience = Number(form.experience.value);
    const sector = form.sector.value;
    const englishLevel = form.englishLevel.value;
    const availability = document.querySelector("input[name='availability']:checked");
    const linkedin = form.linkedin.value.trim();
    const commentsValue = comments.value.trim();
    const dataPolicy = form.dataPolicy.checked;

    // Nombre completo

    if (fullName === "" || fullName.split(/\s+/).length < 2) {
        showError("fullName", errorMessages.fullName);
        valid = false;
    }

    // Email

    if (email === "" || !isValidEmail(email)) {
        showError("email", errorMessages.email);
        valid = false;
    }

    // Teléfono

    if (phone === "" || !isValidPhone(phone)) {
        showError("phone", errorMessages.phone);
        valid = false;
    }

    // País

    if (country === "") {
        showError("country", errorMessages.country);
        valid = false;
    }

    // Experiencia

    if (
        form.experience.value === "" ||
        experience < 0 ||
        experience > 50
    ) {

        showError("experience", errorMessages.experience);
        valid = false;

    }

    // Sector

    if (sector === "") {
        showError("sector", errorMessages.sector);
        valid = false;
    }

    // Inglés

    if (englishLevel === "") {
        showError("englishLevel", errorMessages.englishLevel);
        valid = false;
    }

    // Disponibilidad

    if (!availability) {
        showError("availability", errorMessages.availability);
        valid = false;
    }

    // LinkedIn

    if (linkedin !== "" && !isValidURL(linkedin)) {
        showError("linkedin", errorMessages.linkedin);
        valid = false;
    }

    // Comentarios

    if (commentsValue.length > 500) {

        const remaining = 500 - commentsValue.length;

        showError(
            "comments",
            `Los comentarios no pueden exceder 500 caracteres (quedan ${remaining})`
        );

        valid = false;

    }

    // Política de datos

    if (!dataPolicy) {
        showError("dataPolicy", errorMessages.dataPolicy);
        valid = false;
    }

    // Si todo es válido

    if (valid) {

        form.reset();

        commentsCounter.textContent = "0 / 500";

        successMessage.classList.remove("hidden");

        successMessage.scrollIntoView({
            behavior: "smooth"
        });

    }

});