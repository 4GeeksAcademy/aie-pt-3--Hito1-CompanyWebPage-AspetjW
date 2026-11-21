/**
 * HealthCore Data Processing Utilities
 * Exportaciones principales de tipos y funciones
 */
// ==================== EXPORTACIONES DE BÚSQUEDA ====================
export { busquedaLineal, busquedaLinealTodos, busquedaBinaria, busquedaBinariaIndiceInsercion, buscarPorPropiedad, buscarTodosPorPropiedad, existe, encontrarIndice, encontrarTodosIndices, } from "./utils/search";
// ==================== EXPORTACIONES DE COLECCIONES ====================
export { filtrarPorMultiplesCriterios, filtrar, eliminarDuplicados, eliminarDuplicadosPorPropiedad, ordenarAscendente, ordenarDescendente, ordenarConComparador, ordenarPorMultiplesCampos, agruparPorPropiedad, agrupar, particionar, tomar, saltar, unir, interseccion, diferencia, } from "./utils/collections";
// ==================== EXPORTACIONES DE TRANSFORMACIÓN ====================
export { contarPorPropiedad, sumarPorPropiedad, promediarPorPropiedad, maximoPorPropiedad, minimoPorPropiedad, medianaPorPropiedad, generarReporteEstadisticasReclamaciones, generarReporteAnalisisPacientes, generarReporteDesempenoProveedor, generarReportePrediccionInasistencia, } from "./utils/transformations";
// ==================== EXPORTACIONES DE VALIDACIÓN ====================
export { validarReclamacion, validarPaciente, validarProveedor, validarNotaClinica, validarCita, } from "./utils/validations";
