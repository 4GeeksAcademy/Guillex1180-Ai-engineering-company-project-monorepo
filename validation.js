const form = document.getElementById("applicationForm");
const successMessage = document.getElementById("successMessage");
const comments = document.getElementById("comments");
const commentsCounter = document.getElementById("commentsCounter");
const clearFormButton = document.getElementById("clearFormButton");
const volumeWarning = document.getElementById("volumeWarning");

const errorMessages = {
    companyName: "El nombre de la empresa debe tener al menos 2 caracteres",
    contactName: "Ingresa nombre y apellido del contacto",
    workEmail: "Ingresa un email corporativo valido (ejemplo: nombre@empresa.com)",
    phone: "El telefono debe incluir codigo de pais (ejemplo: +1 213 555 0147)",
    companyWebsite: "Si incluyes sitio web, debe ser una URL valida",
    country: "Selecciona el pais de operacion principal",
    productType: "Selecciona el tipo de producto que manejas",
    monthlyVolume: "Selecciona el volumen mensual estimado",
    services: "Selecciona al menos un servicio de interes",
    current3pl: "Indica si actualmente trabajas con otro proveedor logistico",
    privacyConsent: "Debes aceptar la politica de privacidad para continuar"
};

function showError(field, message) {
    const errorNode = document.getElementById(`${field}Error`);
    if (errorNode) {
        errorNode.textContent = message;
    }

    const input = document.getElementById(field);
    if (input) {
        input.classList.add("border-red-500", "ring-2", "ring-red-200");
        input.setAttribute("aria-invalid", "true");
    }
}

function clearError(field) {
    const errorNode = document.getElementById(`${field}Error`);
    if (errorNode) {
        errorNode.textContent = "";
    }

    const input = document.getElementById(field);
    if (input) {
        input.classList.remove("border-red-500", "ring-2", "ring-red-200");
        input.removeAttribute("aria-invalid");
    }
}

function updateCommentsCounter() {
    const remaining = 500 - comments.value.length;
    commentsCounter.textContent = `Quedan ${Math.max(0, remaining)} caracteres`;
}

function hasTwoWords(value) {
    return value.trim().split(/\s+/).filter(Boolean).length >= 2;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^\+\d{1,3}[\s\-]?\d[\d\s\-]{6,}$/.test(phone);
}

function isValidWebsite(url) {
    if (!url) {
        return true;
    }

    try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch {
        return false;
    }
}

function updateVolumeWarning() {
    const shouldShow = form.monthlyVolume.value === "0-100" && Boolean(form.productType.value);
    volumeWarning.classList.toggle("hidden", !shouldShow);
}

function validateField(fieldName) {
    switch (fieldName) {
        case "companyName": {
            const value = form.companyName.value.trim();
            if (value.length < 2) {
                showError("companyName", errorMessages.companyName);
                return false;
            }
            clearError("companyName");
            return true;
        }
        case "contactName": {
            const value = form.contactName.value.trim();
            if (!hasTwoWords(value)) {
                showError("contactName", errorMessages.contactName);
                return false;
            }
            clearError("contactName");
            return true;
        }
        case "workEmail": {
            const value = form.workEmail.value.trim();
            if (!isValidEmail(value)) {
                showError("workEmail", errorMessages.workEmail);
                return false;
            }
            clearError("workEmail");
            return true;
        }
        case "phone": {
            const value = form.phone.value.trim();
            if (!isValidPhone(value)) {
                showError("phone", errorMessages.phone);
                return false;
            }
            clearError("phone");
            return true;
        }
        case "companyWebsite": {
            const value = form.companyWebsite.value.trim();
            if (!isValidWebsite(value)) {
                showError("companyWebsite", errorMessages.companyWebsite);
                return false;
            }
            clearError("companyWebsite");
            return true;
        }
        case "country": {
            if (!form.country.value) {
                showError("country", errorMessages.country);
                return false;
            }
            clearError("country");
            return true;
        }
        case "productType": {
            if (!form.productType.value) {
                showError("productType", errorMessages.productType);
                return false;
            }
            clearError("productType");
            return true;
        }
        case "monthlyVolume": {
            if (!form.monthlyVolume.value) {
                showError("monthlyVolume", errorMessages.monthlyVolume);
                return false;
            }
            clearError("monthlyVolume");
            return true;
        }
        case "services": {
            const selectedServices = document.querySelectorAll("input[name='services']:checked");
            const servicesError = document.getElementById("servicesError");
            if (selectedServices.length === 0) {
                servicesError.textContent = errorMessages.services;
                return false;
            }
            servicesError.textContent = "";
            return true;
        }
        case "current3pl": {
            const current3pl = document.querySelector("input[name='current3pl']:checked");
            const current3plError = document.getElementById("current3plError");
            if (!current3pl) {
                current3plError.textContent = errorMessages.current3pl;
                return false;
            }
            current3plError.textContent = "";
            return true;
        }
        case "comments": {
            const remaining = 500 - form.comments.value.length;
            if (remaining < 0) {
                showError("comments", `Los comentarios no pueden exceder 500 caracteres (quedan ${Math.max(0, remaining)})`);
                return false;
            }
            clearError("comments");
            return true;
        }
        case "privacyConsent": {
            if (!form.privacyConsent.checked) {
                showError("privacyConsent", errorMessages.privacyConsent);
                return false;
            }
            clearError("privacyConsent");
            return true;
        }
        default:
            return true;
    }
}

[
    "companyName",
    "contactName",
    "workEmail",
    "phone",
    "companyWebsite",
    "country",
    "productType",
    "monthlyVolume",
    "comments",
    "privacyConsent"
].forEach((fieldName) => {
    const field = document.getElementById(fieldName);
    const eventName = ["country", "productType", "monthlyVolume", "privacyConsent"].includes(fieldName) ? "change" : "input";

    field.addEventListener(eventName, () => {
        validateField(fieldName);
        if (fieldName === "productType" || fieldName === "monthlyVolume") {
            updateVolumeWarning();
        }
    });

    field.addEventListener("blur", () => {
        validateField(fieldName);
    });
});

document.querySelectorAll("input[name='services']").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        validateField("services");
    });
});

document.querySelectorAll("input[name='current3pl']").forEach((radio) => {
    radio.addEventListener("change", () => {
        validateField("current3pl");
    });
});

comments.addEventListener("input", () => {
    updateCommentsCounter();
    validateField("comments");
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = [
        "companyName",
        "contactName",
        "workEmail",
        "phone",
        "companyWebsite",
        "country",
        "productType",
        "monthlyVolume",
        "services",
        "current3pl",
        "comments",
        "privacyConsent"
    ].every((fieldName) => validateField(fieldName));

    if (!isValid) {
        return;
    }

    form.reset();
    updateCommentsCounter();
    updateVolumeWarning();
    clearError("companyName");
    clearError("contactName");
    clearError("workEmail");
    clearError("phone");
    clearError("companyWebsite");
    clearError("country");
    clearError("productType");
    clearError("monthlyVolume");
    clearError("comments");
    clearError("privacyConsent");
    document.getElementById("servicesError").textContent = "";
    document.getElementById("current3plError").textContent = "";
    successMessage.classList.remove("hidden");
    successMessage.scrollIntoView({ behavior: "smooth", block: "start" });
});

clearFormButton.addEventListener("click", () => {
    form.reset();
    updateCommentsCounter();
    updateVolumeWarning();
    clearError("companyName");
    clearError("contactName");
    clearError("workEmail");
    clearError("phone");
    clearError("companyWebsite");
    clearError("country");
    clearError("productType");
    clearError("monthlyVolume");
    clearError("comments");
    clearError("privacyConsent");
    document.getElementById("servicesError").textContent = "";
    document.getElementById("current3plError").textContent = "";
    successMessage.classList.add("hidden");
});

updateCommentsCounter();
updateVolumeWarning();
