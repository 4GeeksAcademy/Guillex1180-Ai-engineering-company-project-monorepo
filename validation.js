const form = document.getElementById("applicationForm");
const successMessage = document.getElementById("successMessage");
const operationNotes = document.getElementById("operationNotes");
const operationNotesCounter = document.getElementById("operationNotesCounter");
const clearFormButton = document.getElementById("clearFormButton");

const errorMessages = {
    companyName: "Ingresa el nombre de tu empresa.",
    contactName: "Ingresa nombre y apellido del contacto.",
    workEmail: "Usa un correo corporativo valido (evita dominios personales).",
    phone: "El telefono debe incluir codigo de pais, por ejemplo +52 55 1234 5678.",
    country: "Selecciona el pais de operacion principal.",
    monthlyOrders: "Ingresa un volumen entre 100 y 1,000,000 pedidos mensuales.",
    serviceType: "Selecciona al menos un servicio principal.",
    goLive: "La fecha objetivo debe ser hoy o una fecha futura.",
    needs: "Selecciona al menos una necesidad operativa.",
    operationNotes: "Describe tu operacion en al menos 30 caracteres y maximo 600.",
    privacyConsent: "Debes aceptar el tratamiento de datos para continuar."
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

function clearAllErrors() {
    Object.keys(errorMessages).forEach(clearError);
    const needsError = document.getElementById("needsError");
    if (needsError) {
        needsError.textContent = "";
    }
}

function isCorporateEmail(email) {
    const corporateEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const personalDomains = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "icloud.com"];

    if (!corporateEmailRegex.test(email)) {
        return false;
    }

    const domain = email.split("@")[1].toLowerCase();
    return !personalDomains.includes(domain);
}

function isValidPhone(phone) {
    return /^\+\d{1,3}[\s\-]?\d[\d\s\-]{7,}$/.test(phone);
}

function hasTwoWords(value) {
    return value.trim().split(/\s+/).length >= 2;
}

function isFutureOrToday(dateValue) {
    if (!dateValue) {
        return false;
    }

    const selectedDate = new Date(`${dateValue}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
}

operationNotes.addEventListener("input", () => {
    const count = operationNotes.value.length;
    operationNotesCounter.textContent = `${count} / 600`;

    if (count > 600) {
        showError("operationNotes", "No superes los 600 caracteres.");
    } else if (count > 0 && count < 30) {
        showError("operationNotes", "Agrega mas detalle. Minimo 30 caracteres.");
    } else {
        clearError("operationNotes");
    }
});

function validateField(fieldName) {
    switch (fieldName) {
        case "companyName": {
            const value = form.companyName.value.trim();
            if (!value) {
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
            if (!isCorporateEmail(value)) {
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
        case "country": {
            if (!form.country.value) {
                showError("country", errorMessages.country);
                return false;
            }
            clearError("country");
            return true;
        }
        case "monthlyOrders": {
            const raw = form.monthlyOrders.value;
            const value = Number(raw);
            if (!raw || value < 100 || value > 1000000) {
                showError("monthlyOrders", errorMessages.monthlyOrders);
                return false;
            }
            clearError("monthlyOrders");
            return true;
        }
        case "serviceType": {
            if (!form.serviceType.value) {
                showError("serviceType", errorMessages.serviceType);
                return false;
            }
            clearError("serviceType");
            return true;
        }
        case "goLive": {
            if (!isFutureOrToday(form.goLive.value)) {
                showError("goLive", errorMessages.goLive);
                return false;
            }
            clearError("goLive");
            return true;
        }
        case "operationNotes": {
            const notes = form.operationNotes.value.trim();
            if (notes.length < 30 || notes.length > 600) {
                showError("operationNotes", errorMessages.operationNotes);
                return false;
            }
            clearError("operationNotes");
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
        case "needs": {
            const selectedNeeds = document.querySelectorAll("input[name='needs']:checked");
            const needsError = document.getElementById("needsError");
            if (selectedNeeds.length === 0) {
                needsError.textContent = errorMessages.needs;
                return false;
            }
            needsError.textContent = "";
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
    "country",
    "monthlyOrders",
    "serviceType",
    "goLive",
    "operationNotes",
    "privacyConsent"
].forEach((fieldName) => {
    const field = document.getElementById(fieldName);
    const eventName = fieldName === "country" || fieldName === "serviceType" || fieldName === "privacyConsent" ? "change" : "input";

    field.addEventListener(eventName, () => {
        validateField(fieldName);
    });

    field.addEventListener("blur", () => {
        validateField(fieldName);
    });
});

document.querySelectorAll("input[name='needs']").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        validateField("needs");
    });
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearAllErrors();

    const isValid = [
        "companyName",
        "contactName",
        "workEmail",
        "phone",
        "country",
        "monthlyOrders",
        "serviceType",
        "goLive",
        "needs",
        "operationNotes",
        "privacyConsent"
    ].every((fieldName) => validateField(fieldName));

    if (!isValid) {
        return;
    }

    form.reset();
    clearAllErrors();
    operationNotesCounter.textContent = "0 / 600";
    successMessage.classList.remove("hidden");
    successMessage.scrollIntoView({ behavior: "smooth", block: "start" });
});

clearFormButton.addEventListener("click", () => {
    form.reset();
    clearAllErrors();
    operationNotesCounter.textContent = "0 / 600";
    successMessage.classList.add("hidden");
});
