/**
 * Utilidades de Validación
 * Funciones para validar modelos de datos según reglas de negocio
 */
// ==================== UTILIDADES DE VALIDACIÓN ====================
/**
 * Valida formato de correo electrónico
 * @param correo - Correo a validar
 * @returns true si es válido
 */
function esCorreoValido(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}
/**
 * Valida que un valor sea un número positivo
 * @param valor - Valor a validar
 * @returns true si es número positivo
 */
function esNumeroPositivo(valor) {
    return typeof valor === "number" && valor >= 0 && isFinite(valor);
}
/**
 * Valida que una fecha sea válida y no en el futuro
 * @param fecha - Fecha a validar
 * @param puedeSerFutura - Si se permite fecha futura
 * @returns true si es válida
 */
function esFechaValida(fecha, puedeSerFutura = false) {
    if (!(fecha instanceof Date))
        return false;
    if (isNaN(fecha.getTime()))
        return false;
    if (!puedeSerFutura && fecha > new Date()) {
        return false;
    }
    return true;
}
/**
 * Valida que una cadena sea no vacía
 * @param valor - Valor a validar
 * @param longitudMinima - Longitud mínima requerida
 * @returns true si es válido
 */
function esStringValido(valor, longitudMinima = 1) {
    return typeof valor === "string" && valor.trim().length >= longitudMinima;
}
// ==================== VALIDACIÓN DE RECLAMACIONES ====================
/**
 * Valida una reclamación completa según reglas de negocio
 * Complejidad temporal: O(n) donde n es cantidad de razones de rechazo
 *
 * @param reclamacion - Reclamación a validar
 * @returns Resultado de validación con lista de errores
 */
export function validarReclamacion(reclamacion) {
    const errores = [];
    if (!reclamacion) {
        return { esValido: false, errores: ["Reclamación no definida"] };
    }
    // ID y número de reclamación
    if (!esStringValido(reclamacion.id)) {
        errores.push("ID de reclamación inválido");
    }
    if (!esStringValido(reclamacion.numeroReclamacion)) {
        errores.push("Número de reclamación inválido");
    }
    // IDs de referencia
    if (!esStringValido(reclamacion.idPaciente)) {
        errores.push("ID de paciente inválido");
    }
    if (!esStringValido(reclamacion.idProveedor)) {
        errores.push("ID de proveedor inválido");
    }
    // Validar montos
    if (!esNumeroPositivo(reclamacion.montoReclamacion)) {
        errores.push("Monto de reclamación debe ser positivo");
    }
    if (!esNumeroPositivo(reclamacion.montoAprobado)) {
        errores.push("Monto aprobado no puede ser negativo");
    }
    if (!esNumeroPositivo(reclamacion.montoDenegado)) {
        errores.push("Monto denegado no puede ser negativo");
    }
    // Validar coherencia de montos
    const montoReclamacion = Number(reclamacion.montoReclamacion) || 0;
    const montoAprobado = Number(reclamacion.montoAprobado) || 0;
    const montoDenegado = Number(reclamacion.montoDenegado) || 0;
    const tolerancia = 0.01;
    if (montoAprobado + montoDenegado > montoReclamacion + tolerancia) {
        errores.push("Suma de montos aprobado y denegado excede el monto de reclamación");
    }
    // Validar coherencia de estado
    if (reclamacion.estado === "DENEGADA" &&
        montoAprobado > 0) {
        errores.push("Una reclamación denegada no puede tener monto aprobado");
    }
    if (reclamacion.estado === "APROBADA" &&
        montoDenegado > 0) {
        errores.push("Una reclamación aprobada no puede tener monto denegado");
    }
    // Validar fechas
    if (!esFechaValida(reclamacion.fechaServicio)) {
        errores.push("Fecha de servicio inválida");
    }
    if (!esFechaValida(reclamacion.fechaEnvio)) {
        errores.push("Fecha de envío inválida");
    }
    if (!esFechaValida(reclamacion.fechaActualizacion)) {
        errores.push("Fecha de actualización inválida");
    }
    // Coherencia de fechas: servicio <= envío <= actualización
    if (reclamacion.fechaServicio > reclamacion.fechaEnvio) {
        errores.push("Fecha de servicio no puede ser posterior a fecha de envío");
    }
    if (reclamacion.fechaEnvio > reclamacion.fechaActualizacion) {
        errores.push("Fecha de envío no puede ser posterior a fecha de actualización");
    }
    // Validar región
    if (!["US", "UK"].includes(reclamacion.region)) {
        errores.push("Región debe ser US o UK");
    }
    // Validar prioridad
    if (!["BAJA", "MEDIA", "ALTA"].includes(reclamacion.prioridad)) {
        errores.push("Prioridad debe ser BAJA, MEDIA o ALTA");
    }
    // Validar estado
    const estadosValidos = ["ENVIADA", "EN_REVISION", "APROBADA", "PARCIALMENTE_APROBADA", "DENEGADA", "APELADA"];
    if (!estadosValidos.includes(reclamacion.estado)) {
        errores.push("Estado de reclamación inválido");
    }
    // Validar razones de rechazo
    if (Array.isArray(reclamacion.razonesRechazo)) {
        const razonesUnicas = new Set(reclamacion.razonesRechazo);
        if (razonesUnicas.size !== reclamacion.razonesRechazo.length) {
            errores.push("Razones de rechazo contienen duplicados");
        }
        for (const razon of reclamacion.razonesRechazo) {
            if (!esStringValido(razon)) {
                errores.push("Razón de rechazo no puede estar vacía");
                break;
            }
        }
    }
    else {
        errores.push("Razones de rechazo debe ser un array");
    }
    // Validar notas
    if (typeof reclamacion.notas !== "string") {
        errores.push("Notas debe ser texto");
    }
    return {
        esValido: errores.length === 0,
        errores,
    };
}
// ==================== VALIDACIÓN DE PACIENTES ====================
/**
 * Valida un paciente completo según reglas de negocio
 * Complejidad temporal: O(1)
 *
 * @param paciente - Paciente a validar
 * @returns Resultado de validación
 */
export function validarPaciente(paciente) {
    const errores = [];
    if (!paciente) {
        return { esValido: false, errores: ["Paciente no definido"] };
    }
    // ID
    if (!esStringValido(paciente.id)) {
        errores.push("ID de paciente inválido");
    }
    // Nombre y apellido
    if (!esStringValido(paciente.nombre)) {
        errores.push("Nombre del paciente es obligatorio");
    }
    if (!esStringValido(paciente.apellido)) {
        errores.push("Apellido del paciente es obligatorio");
    }
    // Fecha de nacimiento
    if (!esFechaValida(paciente.fechaNacimiento)) {
        errores.push("Fecha de nacimiento inválida");
    }
    else {
        // Validar edad mínima (18 años)
        const hoy = new Date();
        const edad = hoy.getFullYear() - paciente.fechaNacimiento.getFullYear();
        if (edad < 18) {
            errores.push("Paciente debe tener al menos 18 años");
        }
    }
    // Correo
    if (!esStringValido(paciente.correo)) {
        errores.push("Correo del paciente es obligatorio");
    }
    else if (!esCorreoValido(paciente.correo)) {
        errores.push("Formato de correo inválido");
    }
    // Teléfono
    if (!esStringValido(paciente.telefonoContacto)) {
        errores.push("Teléfono de contacto es obligatorio");
    }
    else {
        const telefonoNumeros = paciente.telefonoContacto.replace(/\D/g, "");
        if (telefonoNumeros.length < 10) {
            errores.push("Teléfono debe tener al menos 10 dígitos");
        }
    }
    // Fecha de registro
    if (!esFechaValida(paciente.fechaRegistro)) {
        errores.push("Fecha de registro inválida");
    }
    // Citas y faltas
    if (!esNumeroPositivo(paciente.totalCitas)) {
        errores.push("Total de citas debe ser no negativo");
    }
    if (!esNumeroPositivo(paciente.citasFaltadas)) {
        errores.push("Citas faltadas debe ser no negativa");
    }
    // Coherencia: citas faltadas no puede exceder total
    if (paciente.citasFaltadas > paciente.totalCitas) {
        errores.push("Citas faltadas no puede exceder total de citas");
    }
    // Última visita
    if (paciente.fechaUltimaVisita !== null) {
        if (!esFechaValida(paciente.fechaUltimaVisita)) {
            errores.push("Fecha de última visita inválida");
        }
    }
    // Puntuación de riesgo
    if (typeof paciente.puntuacionRiesgo !== "number" ||
        paciente.puntuacionRiesgo < 0 ||
        paciente.puntuacionRiesgo > 100) {
        errores.push("Puntuación de riesgo debe estar entre 0 y 100");
    }
    // Región
    if (!["US", "UK"].includes(paciente.region)) {
        errores.push("Región debe ser US o UK");
    }
    return {
        esValido: errores.length === 0,
        errores,
    };
}
// ==================== VALIDACIÓN DE PROVEEDORES ====================
/**
 * Valida un proveedor completo según reglas de negocio
 * Complejidad temporal: O(1)
 *
 * @param proveedor - Proveedor a validar
 * @returns Resultado de validación
 */
export function validarProveedor(proveedor) {
    const errores = [];
    if (!proveedor) {
        return { esValido: false, errores: ["Proveedor no definido"] };
    }
    // ID
    if (!esStringValido(proveedor.id)) {
        errores.push("ID de proveedor inválido");
    }
    // Nombre
    if (!esStringValido(proveedor.nombre)) {
        errores.push("Nombre del proveedor es obligatorio");
    }
    // Tipo de proveedor
    const tiposValidos = ["HOSPITAL", "CLINICA", "LABORATORIO", "CENTRO_IMAGENES", "ESPECIALISTA"];
    if (!tiposValidos.includes(proveedor.tipoProveedor)) {
        errores.push("Tipo de proveedor inválido");
    }
    // NPI
    if (!esStringValido(proveedor.npi)) {
        errores.push("NPI del proveedor es obligatorio");
    }
    else if (proveedor.npi.length < 10 || !/^\d+$/.test(proveedor.npi)) {
        errores.push("NPI debe tener al menos 10 caracteres numéricos");
    }
    // Reclamaciones y tasa de denegación
    if (!esNumeroPositivo(proveedor.reclamacionesEnviadas)) {
        errores.push("Reclamaciones enviadas debe ser no negativa");
    }
    if (typeof proveedor.tasaDenegacion !== "number" ||
        proveedor.tasaDenegacion < 0 ||
        proveedor.tasaDenegacion > 100) {
        errores.push("Tasa de denegación debe estar entre 0 y 100");
    }
    // Monto promedio
    if (!esNumeroPositivo(proveedor.montoPromedioCita)) {
        errores.push("Monto promedio de cita debe ser no negativo");
    }
    // Región
    if (!["US", "UK"].includes(proveedor.region)) {
        errores.push("Región debe ser US o UK");
    }
    // Especialidades
    if (!Array.isArray(proveedor.especialidades)) {
        errores.push("Especialidades debe ser un array");
    }
    else {
        for (const especialidad of proveedor.especialidades) {
            if (!esStringValido(especialidad)) {
                errores.push("Especialidad no puede estar vacía");
                break;
            }
        }
    }
    return {
        esValido: errores.length === 0,
        errores,
    };
}
// ==================== VALIDACIÓN DE NOTAS CLÍNICAS ====================
/**
 * Valida una nota clínica completa según reglas de negocio
 * Complejidad temporal: O(n) donde n es cantidad de palabras clave
 *
 * @param nota - Nota clínica a validar
 * @returns Resultado de validación
 */
export function validarNotaClinica(nota) {
    const errores = [];
    if (!nota) {
        return { esValido: false, errores: ["Nota clínica no definida"] };
    }
    // ID
    if (!esStringValido(nota.id)) {
        errores.push("ID de nota clínica inválido");
    }
    // IDs de referencia
    if (!esStringValido(nota.idPaciente)) {
        errores.push("ID de paciente inválido");
    }
    if (!esStringValido(nota.idProveedor)) {
        errores.push("ID de proveedor inválido");
    }
    // Fecha de creación
    if (!esFechaValida(nota.fechaCreacion)) {
        errores.push("Fecha de creación inválida");
    }
    // Tipo de documento
    const tiposValidos = ["NOTA_EVOLUCION", "RESUMEN_ALTA", "RESULTADO_LABORATORIO", "REPORTE_IMAGENES", "RECETA"];
    if (!tiposValidos.includes(nota.tipoDocumento)) {
        errores.push("Tipo de documento inválido");
    }
    // Contenido
    if (!esStringValido(nota.contenido, 10)) {
        errores.push("Contenido debe tener al menos 10 caracteres");
    }
    // Cantidad de palabras
    if (!esNumeroPositivo(nota.cantidadPalabras)) {
        errores.push("Cantidad de palabras debe ser positiva");
    }
    else {
        // Validar que coincida aproximadamente con contenido
        const conteoReal = nota.contenido.trim().split(/\s+/).length;
        if (Math.abs(conteoReal - nota.cantidadPalabras) > 5) {
            errores.push("Cantidad de palabras no coincide con contenido");
        }
    }
    // Palabras clave
    if (Array.isArray(nota.palabrasClave)) {
        const palabrasUnicas = new Set(nota.palabrasClave);
        if (palabrasUnicas.size !== nota.palabrasClave.length) {
            errores.push("Palabras clave contienen duplicados");
        }
        for (const palabra of nota.palabrasClave) {
            if (!esStringValido(palabra)) {
                errores.push("Palabra clave no puede estar vacía");
                break;
            }
        }
    }
    else {
        errores.push("Palabras clave debe ser un array");
    }
    // Puntuación de confianza
    if (nota.procesadoPorIA) {
        if (typeof nota.puntuacionConfianza !== "number" ||
            nota.puntuacionConfianza < 0 ||
            nota.puntuacionConfianza > 100) {
            errores.push("Puntuación de confianza debe estar entre 0 y 100 cuando está procesada");
        }
    }
    else {
        if (nota.puntuacionConfianza !== -1) {
            errores.push("Puntuación de confianza debe ser -1 cuando no está procesada");
        }
    }
    return {
        esValido: errores.length === 0,
        errores,
    };
}
// ==================== VALIDACIÓN DE CITAS ====================
/**
 * Valida una cita completa según reglas de negocio
 * Complejidad temporal: O(1)
 *
 * @param cita - Cita a validar
 * @returns Resultado de validación
 */
export function validarCita(cita) {
    const errores = [];
    if (!cita) {
        return { esValido: false, errores: ["Cita no definida"] };
    }
    // ID
    if (!esStringValido(cita.id)) {
        errores.push("ID de cita inválido");
    }
    // IDs de referencia
    if (!esStringValido(cita.idPaciente)) {
        errores.push("ID de paciente inválido");
    }
    if (!esStringValido(cita.idProveedor)) {
        errores.push("ID de proveedor inválido");
    }
    // Fecha programada
    if (!esFechaValida(cita.fechaProgramada, true)) {
        errores.push("Fecha programada inválida");
    }
    // Estado de asistencia
    const estadosValidos = ["PROGRAMADA", "ASISTIO", "NO_ASISTIO", "CANCELADA", "REPROGRAMADA"];
    if (!estadosValidos.includes(cita.estadoAsistencia)) {
        errores.push("Estado de asistencia inválido");
    }
    // Coherencia de estado y fecha
    if (cita.estadoAsistencia !== "PROGRAMADA" && cita.estadoAsistencia !== "REPROGRAMADA") {
        if (cita.fechaProgramada > new Date()) {
            errores.push("No se puede marcar cita futura con estado diferente a PROGRAMADA");
        }
    }
    // Tipo de cita
    if (!esStringValido(cita.tipoCita)) {
        errores.push("Tipo de cita es obligatorio");
    }
    // Recordatorios enviados
    if (!esNumeroPositivo(cita.recordatoriosEnviados)) {
        errores.push("Recordatorios enviados debe ser no negativo");
    }
    // Región
    if (!["US", "UK"].includes(cita.region)) {
        errores.push("Región debe ser US o UK");
    }
    // Duración
    if (typeof cita.duracionMinutos !== "number" || cita.duracionMinutos <= 0) {
        errores.push("Duración debe ser un número positivo");
    }
    return {
        esValido: errores.length === 0,
        errores,
    };
}
