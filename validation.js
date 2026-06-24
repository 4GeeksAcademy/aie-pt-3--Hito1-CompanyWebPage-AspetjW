const form = document.getElementById("application-form");
const statusBox = document.getElementById("form-status");
const scheduleWarning = document.getElementById("schedule-warning");
const concernCounter = document.getElementById("health-counter");
const patientIdWrapper = document.getElementById("patient-id-wrapper");

function detectLanguage() {
  const htmlLang = document.documentElement.lang.toLowerCase();
  if (htmlLang.startsWith("es")) return "es";
  const queryLang = new URLSearchParams(window.location.search).get("lang");
  if (queryLang === "es" || queryLang === "en") return queryLang;
  const savedLang = localStorage.getItem("hc_lang");
  if (savedLang === "es" || savedLang === "en") return savedLang;
  return "en";
}

const activeLang = detectLanguage();
const isSpanishPage = activeLang === "es";

const messages = {
  es: {
    first_name: "El nombre debe contener solo letras y tener al menos 2 caracteres",
    last_name: "El apellido debe contener solo letras y tener al menos 2 caracteres",
    date_of_birth: "Ingresa una fecha de nacimiento válida. El paciente debe tener entre 0 y 120 años",
    email: "Ingresa un correo electrónico válido (ejemplo: nombre@proveedor.com)",
    phone: "El teléfono debe incluir un código de país (ejemplo: +1 305 555 0191)",
    preferred_language: "Selecciona tu idioma preferido",
    preferred_clinic: "Selecciona la clínica que te gustaría visitar",
    preferred_date: "Selecciona una fecha de al menos 1 día hábil desde hoy y no más de 60 días hacia adelante",
    preferred_time: "Selecciona tu franja horaria preferida",
    service_type: "Selecciona el tipo de atención que estás buscando",
    paediatric: "Paediatric Care está disponible para pacientes menores de 18 años. Revisa la fecha de nacimiento o selecciona un servicio diferente.",
    new_patient: "Indica si esta es tu primera visita a HealthCore",
    has_insurance: "Indica si tienes seguro médico",
    insurance_provider: "Ingresa el nombre de tu aseguradora",
    insurance_member_id: "El ID de afiliado debe tener entre 6 y 20 caracteres alfanuméricos",
    patient_id: "El Patient ID debe usar el formato HC-XXXXXX (6 caracteres alfanuméricos)",
    concernMin: "Describe tu consulta médica en al menos 20 caracteres (faltan {X} caracteres)",
    concernMax: "La consulta médica no puede superar los 500 caracteres",
    contact_consent: "Debes dar tu consentimiento para ser contactado antes de enviar este formulario",
    formError: "Revisa los campos marcados antes de enviar.",
    success:
      "Gracias por contactar a HealthCore. Hemos recibido tu consulta. Un miembro de nuestro equipo de recepción se pondrá en contacto contigo dentro de 1 día hábil para confirmar los detalles de tu cita y responder cualquier pregunta. Si necesitas asistencia urgente, llama directamente a tu clínica preferida usando los números listados en nuestro sitio web. Esperamos poder atenderte pronto.",
    scheduleWarning:
      "Advertencia: la disponibilidad de Evening (5pm-8pm) puede ser limitada en esta clínica. San Antonio cierra a las 6pm y Austin North / Atlanta cierran a las 7pm."
  },
  en: {
    first_name: "First name must contain letters only and be at least 2 characters long",
    last_name: "Last name must contain letters only and be at least 2 characters long",
    date_of_birth: "Enter a valid date of birth. Patient age must be between 0 and 120",
    email: "Enter a valid email address (example: name@provider.com)",
    phone: "Phone number must include a country code (example: +1 305 555 0191)",
    preferred_language: "Select your preferred language",
    preferred_clinic: "Select the clinic you would like to visit",
    preferred_date: "Select a date at least 1 business day from today and no more than 60 days ahead",
    preferred_time: "Select your preferred time slot",
    service_type: "Select the type of care you are looking for",
    paediatric: "Paediatric Care is available for patients under 18. Review date of birth or select a different service.",
    new_patient: "Indicate whether this is your first visit to HealthCore",
    has_insurance: "Indicate whether you have health insurance",
    insurance_provider: "Enter your insurance provider name",
    insurance_member_id: "Insurance member ID must be 6 to 20 alphanumeric characters",
    patient_id: "Patient ID must use format HC-XXXXXX (6 alphanumeric characters)",
    concernMin: "Describe your medical concern in at least 20 characters ({X} characters remaining)",
    concernMax: "Medical concern cannot exceed 500 characters",
    contact_consent: "You must provide consent before submitting this form",
    formError: "Please review the highlighted fields before submitting.",
    success:
      "Thank you for contacting HealthCore. We have received your inquiry. A member of our reception team will contact you within 1 business day to confirm your appointment details and answer any questions. If you need urgent assistance, call your preferred clinic directly using the numbers listed on our website. We look forward to caring for you.",
    scheduleWarning:
      "Warning: Evening (5pm-8pm) availability may be limited at this clinic. San Antonio closes at 6pm and Austin North / Atlanta close at 7pm."
  }
};

const t = activeLang === "es" ? messages.es : messages.en;

const clinicsWithLimitedEvening = new Set(["HealthCore San Antonio", "HealthCore Austin North", "HealthCore Atlanta"]);
const letterRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]{2,50}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRegex = /^\+[0-9]{1,3}(?:\s?[0-9]){6,14}$/;
const insuranceMemberRegex = /^[A-Za-z0-9]{6,20}$/;
const patientIdRegex = /^HC-[A-Za-z0-9]{6}$/;

function getInput(name) {
  return form.elements[name];
}

function getRadioValue(name) {
  const selected = form.querySelector(`input[name="${name}"]:checked`);
  return selected ? selected.value : "";
}

function parseDateLocal(value) {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addBusinessDays(date, businessDays) {
  const result = new Date(date);
  let remaining = businessDays;
  while (remaining > 0) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  return result;
}

function getAge(dob) {
  const today = startOfToday();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDelta = today.getMonth() - dob.getMonth();
  const dayDelta = today.getDate() - dob.getDate();
  if (monthDelta < 0 || (monthDelta === 0 && dayDelta < 0)) age -= 1;
  return age;
}

function setFieldErrorById(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorNode = document.getElementById(`error-${fieldId}`);
  if (!field || !errorNode) return;

  errorNode.textContent = message;
  if (message) {
    field.setAttribute("aria-invalid", "true");
    field.classList.remove("border-slate-300");
    field.classList.add("border-rose-600", "ring-1", "ring-rose-600");
  } else {
    field.removeAttribute("aria-invalid");
    field.classList.remove("border-rose-600", "ring-1", "ring-rose-600");
    field.classList.add("border-slate-300");
  }
}

function clearFieldErrorById(fieldId) {
  const field = document.getElementById(fieldId);
  const errorNode = document.getElementById(`error-${fieldId}`);
  if (!field || !errorNode) return;

  errorNode.textContent = "";
  field.removeAttribute("aria-invalid");
  field.classList.remove("border-rose-600", "ring-1", "ring-rose-600");
  field.classList.add("border-slate-300");
}

function setRadioError(name, message) {
  const errorNode = document.getElementById(`error-${name}`);
  if (!errorNode) return;
  errorNode.textContent = message;

  const radios = form.querySelectorAll(`input[name="${name}"]`);
  radios.forEach((radio) => {
    if (message) {
      radio.setAttribute("aria-invalid", "true");
    } else {
      radio.removeAttribute("aria-invalid");
    }
  });
}

function clearRadioError(name) {
  const errorNode = document.getElementById(`error-${name}`);
  if (errorNode) errorNode.textContent = "";

  const radios = form.querySelectorAll(`input[name="${name}"]`);
  radios.forEach((radio) => {
    radio.removeAttribute("aria-invalid");
  });
}

function showStatus(message, isSuccess) {
  statusBox.textContent = message;
  statusBox.classList.remove(
    "hidden",
    "border-rose-200",
    "bg-rose-50",
    "text-rose-800",
    "border-emerald-200",
    "bg-emerald-50",
    "text-emerald-800"
  );
  if (isSuccess) {
    statusBox.classList.add("border-emerald-200", "bg-emerald-50", "text-emerald-800");
  } else {
    statusBox.classList.add("border-rose-200", "bg-rose-50", "text-rose-800");
  }
}

function clearStatus() {
  statusBox.textContent = "";
  statusBox.classList.add("hidden");
}

function updateConcernCounter() {
  const value = getInput("health_concern").value;
  if (concernCounter) {
    concernCounter.textContent = `${value.length} / 500 ${isSpanishPage ? "caracteres" : "characters"}`;
  }
}

function updateConditionalFields() {
  const isReturning = getRadioValue("new_patient") === "No";
  patientIdWrapper.classList.toggle("hidden", !isReturning);
}

function updateScheduleWarning() {
  const preferredTime = getInput("preferred_time").value;
  const preferredClinic = getInput("preferred_clinic").value;
  const shouldWarn = preferredTime === "Evening (5pm-8pm)" && clinicsWithLimitedEvening.has(preferredClinic);
  scheduleWarning.textContent = shouldWarn ? t.scheduleWarning : "";
  scheduleWarning.classList.toggle("hidden", !shouldWarn);
}

function validateFirstName() {
  const value = getInput("first_name").value.trim();
  const error = letterRegex.test(value) ? "" : t.first_name;
  setFieldErrorById("first_name", error);
  return !error;
}

function validateLastName() {
  const value = getInput("last_name").value.trim();
  const error = letterRegex.test(value) ? "" : t.last_name;
  setFieldErrorById("last_name", error);
  return !error;
}

function validateDateOfBirth() {
  const input = getInput("date_of_birth");
  const dob = parseDateLocal(input.value);
  let error = "";

  if (!dob) {
    error = t.date_of_birth;
  } else {
    const today = startOfToday();
    const age = getAge(dob);
    if (dob > today || age < 0 || age > 120) {
      error = t.date_of_birth;
    }
  }

  setFieldErrorById("date_of_birth", error);
  return !error;
}

function validateEmail() {
  const value = getInput("email").value.trim();
  const error = emailRegex.test(value) ? "" : t.email;
  setFieldErrorById("email", error);
  return !error;
}

function validatePhone() {
  const value = getInput("phone").value.trim();
  const error = phoneRegex.test(value) ? "" : t.phone;
  setFieldErrorById("phone", error);
  return !error;
}

function validatePreferredLanguage() {
  const value = getInput("preferred_language").value;
  const error = value ? "" : t.preferred_language;
  setFieldErrorById("preferred_language", error);
  return !error;
}

function validatePreferredClinic() {
  const value = getInput("preferred_clinic").value;
  const error = value ? "" : t.preferred_clinic;
  setFieldErrorById("preferred_clinic", error);
  return !error;
}

function validatePreferredDate() {
  const dateValue = getInput("preferred_date").value;
  const preferredDate = parseDateLocal(dateValue);
  let error = "";

  if (!preferredDate) {
    error = t.preferred_date;
  } else {
    const today = startOfToday();
    const minDate = addBusinessDays(today, 1);
    const maxDate = addDays(today, 60);
    if (preferredDate < minDate || preferredDate > maxDate) {
      error = t.preferred_date;
    }
  }

  setFieldErrorById("preferred_date", error);
  return !error;
}

function validatePreferredTime() {
  const value = getInput("preferred_time").value;
  const error = value ? "" : t.preferred_time;
  setFieldErrorById("preferred_time", error);
  updateScheduleWarning();
  return !error;
}

function validateServiceType() {
  const service = getInput("service_type").value;
  const dob = parseDateLocal(getInput("date_of_birth").value);
  let error = "";

  if (!service) {
    error = t.service_type;
  } else if (service === "Paediatric Care") {
    if (!dob) {
      error = t.paediatric;
    } else {
      const age = getAge(dob);
      if (age >= 18) error = t.paediatric;
    }
  }

  setFieldErrorById("service_type", error);
  return !error;
}

function validateNewPatient() {
  const value = getRadioValue("new_patient");
  const error = value ? "" : t.new_patient;
  setRadioError("new_patient", error);
  updateConditionalFields();
  return !error;
}

function validatePatientId() {
  const isReturning = getRadioValue("new_patient") === "No";
  const value = getInput("patient_id").value.trim();
  const error = isReturning && value && !patientIdRegex.test(value) ? t.patient_id : "";
  setFieldErrorById("patient_id", error);
  return !error;
}

function validateHasInsurance() {
  const value = getRadioValue("has_insurance");
  const error = value ? "" : t.has_insurance;
  setRadioError("has_insurance", error);
  return !error;
}

function validateInsuranceProvider() {
  const hasInsurance = getRadioValue("has_insurance") === "Yes";
  const value = getInput("insurance_provider").value.trim();
  const error = hasInsurance && !value ? t.insurance_provider : "";
  setFieldErrorById("insurance_provider", error);
  return !error;
}

function validateInsuranceMemberId() {
  const hasInsurance = getRadioValue("has_insurance") === "Yes";
  const value = getInput("insurance_member_id").value.trim();
  let error = "";
  if (hasInsurance) {
    if (!value || !insuranceMemberRegex.test(value)) {
      error = t.insurance_member_id;
    }
  }
  setFieldErrorById("insurance_member_id", error);
  return !error;
}

function validateHealthConcern() {
  const value = getInput("health_concern").value.trim();
  updateConcernCounter();
  let error = "";

  if (value.length < 20) {
    const missing = 20 - value.length;
    error = t.concernMin.replace("{X}", String(missing));
  } else if (value.length > 500) {
    error = t.concernMax;
  }

  setFieldErrorById("health_concern", error);
  return !error;
}

function validateContactConsent() {
  const checked = getInput("contact_consent").checked;
  const error = checked ? "" : t.contact_consent;
  setFieldErrorById("contact_consent", error);
  return !error;
}

function validateAll() {
  const validators = [
    validateFirstName,
    validateLastName,
    validateDateOfBirth,
    validateEmail,
    validatePhone,
    validatePreferredLanguage,
    validatePreferredClinic,
    validatePreferredDate,
    validatePreferredTime,
    validateServiceType,
    validateNewPatient,
    validatePatientId,
    validateHasInsurance,
    validateInsuranceProvider,
    validateInsuranceMemberId,
    validateHealthConcern,
    validateContactConsent
  ];

  let isValid = true;
  validators.forEach((fn) => {
    const result = fn();
    if (!result) isValid = false;
  });
  return isValid;
}

function clearAllErrors() {
  const fieldIds = [
    "first_name",
    "last_name",
    "date_of_birth",
    "email",
    "phone",
    "preferred_language",
    "preferred_clinic",
    "preferred_date",
    "preferred_time",
    "service_type",
    "patient_id",
    "insurance_provider",
    "insurance_member_id",
    "health_concern",
    "contact_consent"
  ];

  fieldIds.forEach((id) => clearFieldErrorById(id));
  clearRadioError("new_patient");
  clearRadioError("has_insurance");
}

function attachEvents() {
  const fieldIds = [
    "first_name",
    "last_name",
    "date_of_birth",
    "email",
    "phone",
    "preferred_language",
    "preferred_clinic",
    "preferred_date",
    "preferred_time",
    "service_type",
    "patient_id",
    "insurance_provider",
    "insurance_member_id",
    "health_concern",
    "contact_consent"
  ];

  fieldIds.forEach((id) => {
    const field = document.getElementById(id);
    if (!field) return;
    const eventName = field.tagName === "SELECT" || field.type === "checkbox" || field.type === "date" ? "change" : "input";
    field.addEventListener(eventName, () => {
      clearStatus();
      validateAll();
    });
    field.addEventListener("blur", () => {
      clearStatus();
      validateAll();
    });
  });

  ["new_patient", "has_insurance"].forEach((radioName) => {
    form.querySelectorAll(`input[name="${radioName}"]`).forEach((radio) => {
      radio.addEventListener("change", () => {
        clearStatus();
        validateAll();
      });
    });
  });
}

if (form) {
  attachEvents();
  updateConcernCounter();
  updateConditionalFields();
  updateScheduleWarning();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const valid = validateAll();

    if (!valid) {
      showStatus(t.formError, false);
      const firstInvalid = form.querySelector("[aria-invalid='true']");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    showStatus(t.success, true);
    form.reset();
    updateConcernCounter();
    updateConditionalFields();
    updateScheduleWarning();
    clearAllErrors();
  });

  form.addEventListener("reset", () => {
    setTimeout(() => {
      clearStatus();
      updateConcernCounter();
      updateConditionalFields();
      updateScheduleWarning();
      clearAllErrors();
    }, 0);
  });
}
