/**
 * Ejemplos de Uso - HealthCore Data Processing Utilities
 * Demonstración de cómo utilizar las funciones TypeScript
 */

// Importaríamos las utilidades así:
// import {
//   Reclamacion,
//   Paciente,
//   busquedaLineal,
//   filtrar,
//   ordenarAscendente,
//   generarReporteEstadisticasReclamaciones,
//   validarReclamacion,
// } from "./src/index";

// ==================== EJEMPLO 1: VALIDACIÓN ====================

// Crear una reclamación de prueba
const reclamacionTest: Reclamacion = {
  id: "REC-001",
  numeroReclamacion: "CLM-2024-001",
  idPaciente: "PAC-123",
  idProveedor: "PROV-456",
  fechaServicio: new Date("2024-01-15"),
  fechaEnvio: new Date("2024-01-20"),
  fechaActualizacion: new Date("2024-01-25"),
  montoReclamacion: 1500.00,
  montoAprobado: 1200.00,
  montoDenegado: 300.00,
  estado: "PARCIALMENTE_APROBADA",
  razonesRechazo: ["DOCUMENTO_INCOMPLETO", "CODIGO_INVALIDO"],
  region: "US",
  prioridad: "MEDIA",
  requiereRevisionIA: true,
  notas: "Revisión de codificación pendiente",
};

// Validar la reclamación
// const resultado = validarReclamacion(reclamacionTest);
// console.log("¿Es válida?", resultado.esValido);
// if (!resultado.esValido) {
//   console.log("Errores:", resultado.errores);
// }

// ==================== EJEMPLO 2: BÚSQUEDA ====================

// Array de reclamaciones
const reclamaciones: Reclamacion[] = [
  reclamacionTest,
  // ... más reclamaciones
];

// Buscar la primera reclamación de alto riesgo
// const citaAltoRiesgo = busquedaLineal(
//   reclamaciones,
//   (rec) => rec.prioridad === "ALTA" && rec.montoDenegado > 500
// );

// Buscar todas las reclamaciones denegadas
// const reclamacionesDenegadas = busquedaLinealTodos(
//   reclamaciones,
//   (rec) => rec.estado === "DENEGADA"
// );

// ==================== EJEMPLO 3: FILTRADO ====================

// Filtrar por múltiples criterios
// const reclamacionesFiltradas = filtrarPorMultiplesCriterios(reclamaciones, {
//   estado: (estado) => estado === "APROBADA" || estado === "PARCIALMENTE_APROBADA",
//   region: (region) => region === "US",
//   montoReclamacion: (monto) => monto > 1000,
// });

// ==================== EJEMPLO 4: ORDENAMIENTO ====================

// Ordenar reclamaciones por monto de mayor a menor
// const reclamacionesOrdenadas = ordenarDescendente(
//   reclamaciones,
//   "montoReclamacion"
// );

// Ordenar por múltiples campos (primero por región, luego por estado)
// const reclamacionesMultiOrden = ordenarPorMultiplesCampos(reclamaciones, [
//   { campo: "region", orden: "ASC" },
//   { campo: "estado", orden: "DESC" },
// ]);

// ==================== EJEMPLO 5: AGRUPACIÓN ====================

// Agrupar reclamaciones por región
// const reclamacionesPorRegion = agruparPorPropiedad(reclamaciones, "region");
// console.log("Reclamaciones en US:", reclamacionesPorRegion["US"]?.length);
// console.log("Reclamaciones en UK:", reclamacionesPorRegion["UK"]?.length);

// Agrupar por estado
// const reclamacionesPorEstado = agrupar(reclamaciones, (rec) => rec.estado);

// ==================== EJEMPLO 6: AGREGACIONES ====================

// Contar reclamaciones por estado
// const conteosPorEstado = contarPorPropiedad(reclamaciones, "estado");
// console.log("Conteo por estado:", conteosPorEstado);

// Suma total de montos
// const totalMontoReclamado = sumarPorPropiedad(reclamaciones, "montoReclamacion");
// console.log("Monto total reclamado:", totalMontoReclamado);

// Promedio de montos
// const montoPromedio = promediarPorPropiedad(reclamaciones, "montoReclamacion");
// console.log("Monto promedio:", montoPromedio);

// Máximo monto denegado
// const maxDenegado = maximoPorPropiedad(reclamaciones, "montoDenegado");
// console.log("Máximo monto denegado:", maxDenegado);

// ==================== EJEMPLO 7: REPORTES COMPLEJOS ====================

// Generar reporte completo de estadísticas de reclamaciones
// const reporte = generarReporteEstadisticasReclamaciones(reclamaciones);
// console.log("Total de reclamaciones:", reporte.totalReclamaciones);
// console.log("Tasa de denegación:", reporte.tasaDenegacion.toFixed(2) + "%");
// console.log("Monto promedio:", reporte.montoPromedio);
// console.log("Razones de rechazo más comunes:", reporte.razonesRechazoMasComunes);

// ==================== EJEMPLO 8: PACIENTES ====================

// Crear pacientes de prueba
const pacienteTest: Paciente = {
  id: "PAC-123",
  nombre: "Juan",
  apellido: "García",
  fechaNacimiento: new Date("1985-05-15"),
  correo: "juan.garcia@email.com",
  telefonoContacto: "5551234567",
  fechaRegistro: new Date("2023-01-01"),
  totalCitas: 15,
  citasFaltadas: 3,
  fechaUltimaVisita: new Date("2024-01-20"),
  puntuacionRiesgo: 45,
  region: "US",
};

// Validar paciente
// const resultadoPaciente = validarPaciente(pacienteTest);
// console.log("¿Paciente válido?", resultadoPaciente.esValido);

// Filtrar pacientes de alto riesgo (puntuación > 70)
// const pacientesAltoRiesgo = filtrar(
//   [pacienteTest],
//   (p) => p.puntuacionRiesgo > 70
// );

// ==================== EJEMPLO 9: CITAS ====================

// Crear citas de prueba
const citaTest: Cita = {
  id: "CIT-001",
  idPaciente: "PAC-123",
  idProveedor: "PROV-456",
  fechaProgramada: new Date("2024-02-15T10:00:00"),
  estadoAsistencia: "ASISTIO",
  tipoCita: "CONSULTA",
  recordatoriosEnviados: 2,
  region: "US",
  duracionMinutos: 30,
};

// Validar cita
// const resultadoCita = validarCita(citaTest);
// console.log("¿Cita válida?", resultadoCita.esValido);

// ==================== EJEMPLO 10: UTILIDADES AVANZADAS ====================

// Eliminar duplicados
// const pacientes = [pacienteTest, pacienteTest];
// const pacientesUnicos = eliminarDuplicados(pacientes);

// Particionar array (asistencias vs no-asistencias)
// const citas: Cita[] = [citaTest, /* más citas */];
// const [asistencias, noAsistencias] = particionar(
//   citas,
//   (c) => c.estadoAsistencia === "ASISTIO"
// );

// Tomar primeros N elementos
// const primerasCinco = tomar(reclamaciones, 5);

// Encontrar intersección
// const array1 = [1, 2, 3, 4, 5];
// const array2 = [3, 4, 5, 6, 7];
// const comunes = interseccion(array1, array2); // [3, 4, 5]

console.log("✅ Archivo de ejemplos cargado correctamente");
console.log("Para ver ejemplos en acción, descomenta las líneas de código");
