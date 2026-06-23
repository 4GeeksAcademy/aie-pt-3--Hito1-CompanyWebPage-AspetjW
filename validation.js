const form = document.getElementById("application-form");
const statusBox = document.getElementById("form-status");

const validators = {
  firstName: (value) => {
    if (!value.trim()) return "El nombre es obligatorio.";
    if (value.trim().length < 2) return "El nombre debe tener al menos 2 caracteres.";
    return "";
  },
  lastName: (value) => {
    if (!value.trim()) return "Los apellidos son obligatorios.";
    if (value.trim().length < 2) return "Los apellidos deben tener al menos 2 caracteres.";
    return "";
  },
  email: (value) => {
    if (!value.trim()) return "El correo corporativo es obligatorio.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(value.trim())) return "Introduce un correo valido (ejemplo@empresa.com).";
    return "";
  },
  phone: (value) => {
    if (!value.trim()) return "El telefono es obligatorio.";
    const e164Regex = /^\+[1-9]\d{7,14}$/;
    if (!e164Regex.test(value.trim())) return "Usa formato internacional E.164, por ejemplo +34600111222.";
    return "";
  },
  country: (value) => (!value ? "Selecciona un pais." : ""),
  organization: (value) => {
    if (!value.trim()) return "La organizacion es obligatoria.";
    if (value.trim().length < 2) return "La organizacion debe tener al menos 2 caracteres.";
    return "";
  },
  orgSize: (value) => (!value ? "Selecciona el tamano de organizacion." : ""),
  role: (value) => (!value ? "Selecciona tu rol." : ""),
  interestArea: (value) => (!value ? "Selecciona un area de interes." : ""),
  mainChallenge: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "Describe tu reto principal.";
    if (trimmed.length < 20) return "El reto principal debe tener al menos 20 caracteres.";
    return "";
  },
  consent: (checked) => (!checked ? "Debes aceptar el consentimiento para continuar." : "")
};

function getFieldValue(field) {
  return field.type === "checkbox" ? field.checked : field.value;
}

function setFieldState(field, errorMessage) {
  const errorNode = document.getElementById(`error-${field.id}`);
  if (!errorNode) return;

  errorNode.textContent = errorMessage;

  if (errorMessage) {
    field.setAttribute("aria-invalid", "true");
    field.classList.remove("border-slate-300");
    field.classList.add("border-rose-600", "ring-1", "ring-rose-600");
  } else {
    field.removeAttribute("aria-invalid");
    field.classList.remove("border-rose-600", "ring-1", "ring-rose-600");
    field.classList.add("border-slate-300");
  }
}

function validateField(field) {
  const validator = validators[field.name];
  if (!validator) return true;

  const errorMessage = validator(getFieldValue(field));
  setFieldState(field, errorMessage);
  return !errorMessage;
}

function showStatus(message, isSuccess) {
  statusBox.classList.remove("hidden", "border-rose-200", "bg-rose-50", "text-rose-800", "border-emerald-200", "bg-emerald-50", "text-emerald-800");
  statusBox.textContent = message;

  if (isSuccess) {
    statusBox.classList.add("border-emerald-200", "bg-emerald-50", "text-emerald-800");
  } else {
    statusBox.classList.add("border-rose-200", "bg-rose-50", "text-rose-800");
  }
}

function clearStatus() {
  statusBox.classList.add("hidden");
  statusBox.textContent = "";
}

function validateForm() {
  const fields = Array.from(form.elements).filter((element) => element.name && validators[element.name]);
  let isFormValid = true;

  fields.forEach((field) => {
    const valid = validateField(field);
    if (!valid) isFormValid = false;
  });

  return isFormValid;
}

if (form) {
  const watchedFields = Array.from(form.elements).filter((element) => element.name && validators[element.name]);

  watchedFields.forEach((field) => {
    const eventName = field.type === "checkbox" || field.tagName === "SELECT" ? "change" : "input";
    field.addEventListener(eventName, () => {
      validateField(field);
      clearStatus();
    });

    field.addEventListener("blur", () => {
      validateField(field);
      clearStatus();
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const valid = validateForm();

    if (!valid) {
      showStatus("Revisa los campos marcados antes de enviar.", false);
      const firstInvalid = form.querySelector("[aria-invalid='true']");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    showStatus("Aplicacion enviada correctamente. Nuestro equipo te contactara pronto.", true);
    form.reset();
    watchedFields.forEach((field) => setFieldState(field, ""));
  });

  form.addEventListener("reset", () => {
    watchedFields.forEach((field) => setFieldState(field, ""));
    clearStatus();
  });
}
