/**
 * Utilidades de Colecciones
 * Funciones para filtrar, ordenar, agrupar y manipular arrays
 */
import type { Predicado, Comparador, Ordenamiento, OpcionesOrdenamiento } from "../types/models";
/**
 * Filtra elementos por múltiples criterios
 * Complejidad temporal: O(n*m) donde m es cantidad de criterios
 *
 * @param items - Array a filtrar
 * @param criterios - Objetos predicado por propiedad
 * @returns Array filtrado (copia inmutable)
 */
export declare function filtrarPorMultiplesCriterios<T>(items: T[], criterios: Partial<Record<keyof T, (valor: T[keyof T]) => boolean>>): T[];
/**
 * Filtra elementos que cumplen un predicado
 * Complejidad temporal: O(n)
 *
 * @param items - Array a filtrar
 * @param predicado - Función de filtrado
 * @returns Array filtrado
 */
export declare function filtrar<T>(items: T[], predicado: Predicado<T>): T[];
/**
 * Elimina duplicados por comparación de identidad
 * Complejidad temporal: O(n)
 *
 * @param items - Array con posibles duplicados
 * @returns Array sin duplicados
 */
export declare function eliminarDuplicados<T>(items: T[]): T[];
/**
 * Elimina duplicados por propiedad específica
 * Complejidad temporal: O(n)
 *
 * @param items - Array a deduplica
 * @param clave - Propiedad por la cual deduplicar
 * @returns Array sin duplicados por clave
 */
export declare function eliminarDuplicadosPorPropiedad<T, K extends keyof T>(items: T[], clave: K): T[];
/**
 * Ordena array de forma ascendente por propiedad
 * Complejidad temporal: O(n log n)
 *
 * @param items - Array a ordenar
 * @param clave - Propiedad por la cual ordenar
 * @returns Array ordenado (copia inmutable)
 */
export declare function ordenarAscendente<T, K extends keyof T>(items: T[], clave: K): T[];
/**
 * Ordena array de forma descendente por propiedad
 * Complejidad temporal: O(n log n)
 *
 * @param items - Array a ordenar
 * @param clave - Propiedad por la cual ordenar
 * @returns Array ordenado (copia inmutable)
 */
export declare function ordenarDescendente<T, K extends keyof T>(items: T[], clave: K): T[];
/**
 * Ordena array usando comparador personalizado
 * Complejidad temporal: O(n log n)
 *
 * @param items - Array a ordenar
 * @param comparador - Función comparadora
 * @param orden - Dirección de ordenamiento (ASC o DESC)
 * @returns Array ordenado (copia inmutable)
 */
export declare function ordenarConComparador<T>(items: T[], comparador: Comparador<T>, orden?: Ordenamiento): T[];
/**
 * Ordena por múltiples campos con prioridad
 * Complejidad temporal: O(n log n)
 *
 * @param items - Array a ordenar
 * @param opciones - Array de opciones de ordenamiento
 * @returns Array ordenado por múltiples criterios
 */
export declare function ordenarPorMultiplesCampos<T>(items: T[], opciones: OpcionesOrdenamiento<T>[]): T[];
/**
 * Agrupa elementos por una propiedad específica
 * Complejidad temporal: O(n)
 *
 * @param items - Array a agrupar
 * @param clave - Propiedad por la cual agrupar
 * @returns Objeto con grupos por clave
 */
export declare function agruparPorPropiedad<T, K extends keyof T>(items: T[], clave: K): Record<string, T[]>;
/**
 * Agrupa elementos usando función extractor personalizada
 * Complejidad temporal: O(n)
 *
 * @param items - Array a agrupar
 * @param extractorClave - Función que extrae la clave de agrupación
 * @returns Objeto con grupos por clave
 */
export declare function agrupar<T, K extends string | number>(items: T[], extractorClave: (item: T) => K): Record<K, T[]>;
/**
 * Particiones un array en dos según un predicado
 * Complejidad temporal: O(n)
 *
 * @param items - Array a particionar
 * @param predicado - Condición de partición
 * @returns Tupla [cumple predicado, no cumple predicado]
 */
export declare function particionar<T>(items: T[], predicado: Predicado<T>): [T[], T[]];
/**
 * Obtiene los primeros N elementos
 * Complejidad temporal: O(n)
 *
 * @param items - Array de entrada
 * @param cantidad - Cantidad de elementos a tomar
 * @returns Primeros N elementos
 */
export declare function tomar<T>(items: T[], cantidad: number): T[];
/**
 * Salta N elementos y retorna el resto
 * Complejidad temporal: O(n)
 *
 * @param items - Array de entrada
 * @param cantidad - Cantidad de elementos a saltar
 * @returns Elementos después de saltar N
 */
export declare function saltar<T>(items: T[], cantidad: number): T[];
/**
 * Une dos arrays eliminando duplicados
 * Complejidad temporal: O(n + m)
 *
 * @param array1 - Primer array
 * @param array2 - Segundo array
 * @returns Array unido sin duplicados
 */
export declare function unir<T>(array1: T[], array2: T[]): T[];
/**
 * Encuentra la intersección de dos arrays
 * Complejidad temporal: O(n + m)
 *
 * @param array1 - Primer array
 * @param array2 - Segundo array
 * @returns Elementos comunes en ambos arrays
 */
export declare function interseccion<T>(array1: T[], array2: T[]): T[];
/**
 * Calcula la diferencia entre dos arrays (elementos en array1 pero no en array2)
 * Complejidad temporal: O(n + m)
 *
 * @param array1 - Array de referencia
 * @param array2 - Array de exclusión
 * @returns Elementos en array1 que no están en array2
 */
export declare function diferencia<T>(array1: T[], array2: T[]): T[];
//# sourceMappingURL=collections.d.ts.map