/**
 * Utilidades de Transformación y Agregación
 * Funciones para generar reportes y agregaciones de datos
 */
import type { Reclamacion, ReporteEstadisticasReclamaciones, Paciente, ReporteAnalisisPacientes, Proveedor, ReporteDesempenoProveedor, Cita, ReportePrediccionInasistencia } from "../types/models";
/**
 * Cuenta elementos agrupados por una propiedad
 * Complejidad temporal: O(n)
 *
 * @param items - Array a contar
 * @param propiedad - Propiedad por la cual contar
 * @returns Objeto con conteos por valor
 */
export declare function contarPorPropiedad<T, K extends keyof T>(items: T[], propiedad: K): Record<string, number>;
/**
 * Suma valores de una propiedad numérica
 * Complejidad temporal: O(n)
 *
 * @param items - Array a sumar
 * @param propiedad - Propiedad numérica a sumar
 * @returns Suma total
 */
export declare function sumarPorPropiedad<T, K extends keyof T>(items: T[], propiedad: K): number;
/**
 * Calcula el promedio de una propiedad numérica
 * Complejidad temporal: O(n)
 *
 * @param items - Array para calcular promedio
 * @param propiedad - Propiedad numérica a promediar
 * @returns Promedio o 0 si array vacío
 */
export declare function promediarPorPropiedad<T, K extends keyof T>(items: T[], propiedad: K): number;
/**
 * Encuentra el valor máximo de una propiedad
 * Complejidad temporal: O(n)
 *
 * @param items - Array de búsqueda
 * @param propiedad - Propiedad numérica
 * @returns Valor máximo o -Infinity si array vacío
 */
export declare function maximoPorPropiedad<T, K extends keyof T>(items: T[], propiedad: K): number;
/**
 * Encuentra el valor mínimo de una propiedad
 * Complejidad temporal: O(n)
 *
 * @param items - Array de búsqueda
 * @param propiedad - Propiedad numérica
 * @returns Valor mínimo o Infinity si array vacío
 */
export declare function minimoPorPropiedad<T, K extends keyof T>(items: T[], propiedad: K): number;
/**
 * Calcula la mediana de una propiedad numérica
 * Complejidad temporal: O(n log n)
 *
 * @param items - Array para calcular mediana
 * @param propiedad - Propiedad numérica
 * @returns Mediana o 0 si array vacío
 */
export declare function medianaPorPropiedad<T, K extends keyof T>(items: T[], propiedad: K): number;
/**
 * Genera reporte completo de estadísticas de reclamaciones
 * Complejidad temporal: O(n)
 *
 * @param reclamaciones - Array de reclamaciones
 * @returns Reporte detallado de estadísticas
 */
export declare function generarReporteEstadisticasReclamaciones(reclamaciones: Reclamacion[]): ReporteEstadisticasReclamaciones;
/**
 * Genera reporte de análisis de pacientes
 * Complejidad temporal: O(n)
 *
 * @param pacientes - Array de pacientes
 * @returns Reporte de análisis de pacientes
 */
export declare function generarReporteAnalisisPacientes(pacientes: Paciente[]): ReporteAnalisisPacientes;
/**
 * Genera reporte de desempeño de proveedores
 * Complejidad temporal: O(n log n)
 *
 * @param proveedores - Array de proveedores
 * @returns Reporte de desempeño
 */
export declare function generarReporteDesempenoProveedor(proveedores: Proveedor[]): ReporteDesempenoProveedor;
/**
 * Genera reporte de predicción de inasistencia
 * Complejidad temporal: O(n)
 *
 * @param citas - Array de citas
 * @param pacientes - Array de pacientes (para riesgo)
 * @returns Reporte de predicción de inasistencia
 */
export declare function generarReportePrediccionInasistencia(citas: Cita[], pacientes?: Paciente[]): ReportePrediccionInasistencia;
//# sourceMappingURL=transformations.d.ts.map