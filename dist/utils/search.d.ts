/**
 * Utilidades de Búsqueda
 * Implementaciones de búsqueda lineal y binaria para datos de HealthCore
 */
import type { Predicado, Comparador } from "../types/models";
/**
 * Búsqueda lineal en un array no ordenado
 * Complejidad temporal: O(n)
 * Usar para: Arrays pequeños o cuando la lógica del predicado es compleja
 *
 * @param array - Array a buscar
 * @param predicado - Función que retorna true para el elemento buscado
 * @returns Primer elemento coincidente o undefined
 */
export declare function busquedaLineal<T>(array: T[], predicado: Predicado<T>): T | undefined;
/**
 * Busca todos los elementos coincidentes en un array no ordenado
 * Complejidad temporal: O(n)
 *
 * @param array - Array a buscar
 * @param predicado - Función que retorna true para elementos coincidentes
 * @returns Array de todos los elementos coincidentes
 */
export declare function busquedaLinealTodos<T>(array: T[], predicado: Predicado<T>): T[];
/**
 * Búsqueda binaria de un valor en un array ordenado
 * Complejidad temporal: O(log n)
 * Precondición: El array debe estar ordenado según comparadorFn
 *
 * @param array - Array ordenado a buscar
 * @param valor - Valor a encontrar
 * @param comparadorFn - Función comparadora (retorna <0, 0, o >0)
 * @returns Índice del elemento coincidente o -1 si no se encuentra
 */
export declare function busquedaBinaria<T>(array: T[], valor: T, comparadorFn: Comparador<T>): number;
/**
 * Búsqueda binaria para encontrar posición de inserción
 * Útil para mantener arrays ordenados
 * Complejidad temporal: O(log n)
 *
 * @param array - Array ordenado
 * @param valor - Valor para encontrar posición de inserción
 * @param comparadorFn - Función comparadora
 * @returns Índice donde el valor debe insertarse
 */
export declare function busquedaBinariaIndiceInsercion<T>(array: T[], valor: T, comparadorFn: Comparador<T>): number;
/**
 * Encuentra un elemento por coincidencia exacta de valor de propiedad
 * Complejidad temporal: O(n) - búsqueda lineal por propiedad
 *
 * @param array - Array a buscar
 * @param clave - Propiedad a comparar
 * @param valor - Valor a encontrar
 * @returns Elemento coincidente o undefined
 */
export declare function buscarPorPropiedad<T, K extends keyof T>(array: T[], clave: K, valor: T[K]): T | undefined;
/**
 * Encuentra todos los elementos que coinciden con un valor de propiedad
 * Complejidad temporal: O(n)
 *
 * @param array - Array a buscar
 * @param clave - Propiedad a comparar
 * @param valor - Valor a encontrar
 * @returns Array de todos los elementos coincidentes
 */
export declare function buscarTodosPorPropiedad<T, K extends keyof T>(array: T[], clave: K, valor: T[K]): T[];
/**
 * Verifica si existe un elemento en el array que cumpla el predicado
 * Complejidad temporal: O(n)
 *
 * @param array - Array a buscar
 * @param predicado - Condición de coincidencia
 * @returns true si al menos un elemento coincide
 */
export declare function existe<T>(array: T[], predicado: Predicado<T>): boolean;
/**
 * Encuentra el índice del primer elemento coincidente
 * Complejidad temporal: O(n)
 *
 * @param array - Array a buscar
 * @param predicado - Condición de coincidencia
 * @returns Índice de la primera coincidencia, o -1 si no se encuentra
 */
export declare function encontrarIndice<T>(array: T[], predicado: Predicado<T>): number;
/**
 * Encuentra todos los índices de elementos coincidentes
 * Complejidad temporal: O(n)
 *
 * @param array - Array a buscar
 * @param predicado - Condición de coincidencia
 * @returns Array de índices donde los elementos coinciden
 */
export declare function encontrarTodosIndices<T>(array: T[], predicado: Predicado<T>): number[];
//# sourceMappingURL=search.d.ts.map