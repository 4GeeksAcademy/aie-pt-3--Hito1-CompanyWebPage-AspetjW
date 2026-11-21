/**
 * Utilidades de Búsqueda
 * Implementaciones de búsqueda lineal y binaria para datos de HealthCore
 */
/**
 * Búsqueda lineal en un array no ordenado
 * Complejidad temporal: O(n)
 * Usar para: Arrays pequeños o cuando la lógica del predicado es compleja
 *
 * @param array - Array a buscar
 * @param predicado - Función que retorna true para el elemento buscado
 * @returns Primer elemento coincidente o undefined
 */
export function busquedaLineal(array, predicado) {
    if (!Array.isArray(array) || array.length === 0) {
        return undefined;
    }
    for (let i = 0; i < array.length; i++) {
        if (predicado(array[i])) {
            return array[i];
        }
    }
    return undefined;
}
/**
 * Busca todos los elementos coincidentes en un array no ordenado
 * Complejidad temporal: O(n)
 *
 * @param array - Array a buscar
 * @param predicado - Función que retorna true para elementos coincidentes
 * @returns Array de todos los elementos coincidentes
 */
export function busquedaLinealTodos(array, predicado) {
    if (!Array.isArray(array) || array.length === 0) {
        return [];
    }
    return array.filter(predicado);
}
/**
 * Búsqueda binaria de un valor en un array ordenado
 * Complejidad temporal: O(log n)
 * Precondición: El array debe estar ordenado según comparadorFn
 *
 * @param array - Array ordenado a buscar
 * @param valor - Valor a encontrar
 * @param comparadorFn - Función comparadora (retorna <0, 0, o >0)
 * @returns Elemento coincidente o undefined
 */
export function busquedaBinaria(array, valor, comparadorFn) {
    if (!Array.isArray(array) || array.length === 0) {
        return undefined;
    }
    let izquierda = 0;
    let derecha = array.length - 1;
    while (izquierda <= derecha) {
        const medio = Math.floor((izquierda + derecha) / 2);
        const comparacion = comparadorFn(array[medio], valor);
        if (comparacion === 0) {
            return array[medio];
        }
        else if (comparacion < 0) {
            izquierda = medio + 1;
        }
        else {
            derecha = medio - 1;
        }
    }
    return undefined;
}
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
export function busquedaBinariaIndiceInsercion(array, valor, comparadorFn) {
    if (!Array.isArray(array) || array.length === 0) {
        return 0;
    }
    let izquierda = 0;
    let derecha = array.length;
    while (izquierda < derecha) {
        const medio = Math.floor((izquierda + derecha) / 2);
        if (comparadorFn(array[medio], valor) < 0) {
            izquierda = medio + 1;
        }
        else {
            derecha = medio;
        }
    }
    return izquierda;
}
/**
 * Encuentra un elemento por coincidencia exacta de valor de propiedad
 * Complejidad temporal: O(n) - búsqueda lineal por propiedad
 *
 * @param array - Array a buscar
 * @param clave - Propiedad a comparar
 * @param valor - Valor a encontrar
 * @returns Elemento coincidente o undefined
 */
export function buscarPorPropiedad(array, clave, valor) {
    return busquedaLineal(array, (item) => item[clave] === valor);
}
/**
 * Encuentra todos los elementos que coinciden con un valor de propiedad
 * Complejidad temporal: O(n)
 *
 * @param array - Array a buscar
 * @param clave - Propiedad a comparar
 * @param valor - Valor a encontrar
 * @returns Array de todos los elementos coincidentes
 */
export function buscarTodosPorPropiedad(array, clave, valor) {
    return busquedaLinealTodos(array, (item) => item[clave] === valor);
}
/**
 * Verifica si existe un elemento en el array que cumpla el predicado
 * Complejidad temporal: O(n)
 *
 * @param array - Array a buscar
 * @param predicado - Condición de coincidencia
 * @returns true si al menos un elemento coincide
 */
export function existe(array, predicado) {
    return busquedaLineal(array, predicado) !== undefined;
}
/**
 * Encuentra el índice del primer elemento coincidente
 * Complejidad temporal: O(n)
 *
 * @param array - Array a buscar
 * @param predicado - Condición de coincidencia
 * @returns Índice de la primera coincidencia, o -1 si no se encuentra
 */
export function encontrarIndice(array, predicado) {
    if (!Array.isArray(array) || array.length === 0) {
        return -1;
    }
    for (let i = 0; i < array.length; i++) {
        if (predicado(array[i])) {
            return i;
        }
    }
    return -1;
}
/**
 * Encuentra todos los índices de elementos coincidentes
 * Complejidad temporal: O(n)
 *
 * @param array - Array a buscar
 * @param predicado - Condición de coincidencia
 * @returns Array de índices donde los elementos coinciden
 */
export function encontrarTodosIndices(array, predicado) {
    if (!Array.isArray(array) || array.length === 0) {
        return [];
    }
    const indices = [];
    for (let i = 0; i < array.length; i++) {
        if (predicado(array[i])) {
            indices.push(i);
        }
    }
    return indices;
}
