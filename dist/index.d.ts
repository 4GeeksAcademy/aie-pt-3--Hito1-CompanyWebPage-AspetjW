/**
 * HealthCore Data Processing Utilities
 * Exportaciones principales de tipos y funciones
 */
export type { EstadoReclamacion, Reclamacion, FiltroReclamacion, ReporteEstadisticasReclamaciones, Paciente, FiltroPaciente, ReporteAnalisisPacientes, TipoProveedor, Proveedor, ReporteDesempenoProveedor, TipoNota, NotaClinica, EstadoCita, Cita, FiltroCita, ReportePrediccionInasistencia, Ordenamiento, OpcionesOrdenamiento, ResultadoValidacion, Comparador, Predicado, Mapeador, Reductor, } from "./types/models";
export { busquedaLineal, busquedaLinealTodos, busquedaBinaria, busquedaBinariaIndiceInsercion, buscarPorPropiedad, buscarTodosPorPropiedad, existe, encontrarIndice, encontrarTodosIndices, } from "./utils/search";
export { filtrarPorMultiplesCriterios, filtrar, eliminarDuplicados, eliminarDuplicadosPorPropiedad, ordenarAscendente, ordenarDescendente, ordenarConComparador, ordenarPorMultiplesCampos, agruparPorPropiedad, agrupar, particionar, tomar, saltar, unir, interseccion, diferencia, } from "./utils/collections";
export { contarPorPropiedad, sumarPorPropiedad, promediarPorPropiedad, maximoPorPropiedad, minimoPorPropiedad, medianaPorPropiedad, generarReporteEstadisticasReclamaciones, generarReporteAnalisisPacientes, generarReporteDesempenoProveedor, generarReportePrediccionInasistencia, } from "./utils/transformations";
export { validarReclamacion, validarPaciente, validarProveedor, validarNotaClinica, validarCita, } from "./utils/validations";
//# sourceMappingURL=index.d.ts.map