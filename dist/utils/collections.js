/**
 * Utilidades de Colecciones
 * Funciones para filtrar, ordenar, agrupar y manipular arrays
 */
// ==================== FILTRADO ====================
/**
 * Filtra elementos por múltiples criterios
 * Complejidad temporal: O(n*m) donde m es cantidad de criterios
 *
 * @param items - Array a filtrar
 * @param criterios - Objetos predicado por propiedad
 * @returns Array filtrado (copia inmutable)
 */
export function filtrarPorMultiplesCriterios(items, criterios) {
    if (!Array.isArray(items) || items.length === 0) {
        return [];
    }
    return items.filter((item) => {
        for (const clave in criterios) {
            const predicado = criterios[clave];
            if (predicado && !predicado(item[clave])) {
                return false;
            }
        }
        return true;
    });
}
/**
 * Filtra elementos que cumplen un predicado
 * Complejidad temporal: O(n)
 *
 * @param items - Array a filtrar
 * @param predicado - Función de filtrado
 * @returns Array filtrado
 */
export function filtrar(items, predicado) {
    if (!Array.isArray(items) || items.length === 0) {
        return [];
    }
    return items.filter(predicado);
}
/**
 * Elimina duplicados por comparación de identidad
 * Complejidad temporal: O(n)
 *
 * @param items - Array con posibles duplicados
 * @returns Array sin duplicados
 */
export function eliminarDuplicados(items) {
    if (!Array.isArray(items) || items.length === 0) {
        return [];
    }
    return Array.from(new Set(items));
}
/**
 * Elimina duplicados por propiedad específica
 * Complejidad temporal: O(n)
 *
 * @param items - Array a deduplica
 * @param clave - Propiedad por la cual deduplicar
 * @returns Array sin duplicados por clave
 */
export function eliminarDuplicadosPorPropiedad(items, clave) {
    if (!Array.isArray(items) || items.length === 0) {
        return [];
    }
    const vistos = new Set();
    const resultado = [];
    for (const item of items) {
        const valor = item[clave];
        if (!vistos.has(valor)) {
            vistos.add(valor);
            resultado.push(item);
        }
    }
    return resultado;
}
// ==================== ORDENAMIENTO ====================
/**
 * Ordena array de forma ascendente por propiedad
 * Complejidad temporal: O(n log n)
 *
 * @param items - Array a ordenar
 * @param clave - Propiedad por la cual ordenar
 * @returns Array ordenado (copia inmutable)
 */
export function ordenarAscendente(items, clave) {
    if (!Array.isArray(items) || items.length === 0) {
        return [];
    }
    return [...items].sort((a, b) => {
        const valA = a[clave];
        const valB = b[clave];
        if (valA < valB)
            return -1;
        if (valA > valB)
            return 1;
        return 0;
    });
}
/**
 * Ordena array de forma descendente por propiedad
 * Complejidad temporal: O(n log n)
 *
 * @param items - Array a ordenar
 * @param clave - Propiedad por la cual ordenar
 * @returns Array ordenado (copia inmutable)
 */
export function ordenarDescendente(items, clave) {
    if (!Array.isArray(items) || items.length === 0) {
        return [];
    }
    return [...items].sort((a, b) => {
        const valA = a[clave];
        const valB = b[clave];
        if (valA > valB)
            return -1;
        if (valA < valB)
            return 1;
        return 0;
    });
}
/**
 * Ordena array usando comparador personalizado
 * Complejidad temporal: O(n log n)
 *
 * @param items - Array a ordenar
 * @param comparador - Función comparadora
 * @param orden - Dirección de ordenamiento (ASC o DESC)
 * @returns Array ordenado (copia inmutable)
 */
export function ordenarConComparador(items, comparador, orden = "ASC") {
    if (!Array.isArray(items) || items.length === 0) {
        return [];
    }
    const copia = [...items];
    copia.sort((a, b) => {
        const resultado = comparador(a, b);
        return orden === "ASC" ? resultado : -resultado;
    });
    return copia;
}
/**
 * Ordena por múltiples campos con prioridad
 * Complejidad temporal: O(n log n)
 *
 * @param items - Array a ordenar
 * @param opciones - Array de opciones de ordenamiento
 * @returns Array ordenado por múltiples criterios
 */
export function ordenarPorMultiplesCampos(items, opciones) {
    if (!Array.isArray(items) || items.length === 0 || opciones.length === 0) {
        return [];
    }
    return [...items].sort((a, b) => {
        for (const opcion of opciones) {
            const valA = a[opcion.campo];
            const valB = b[opcion.campo];
            let comparacion = 0;
            if (valA < valB)
                comparacion = -1;
            else if (valA > valB)
                comparacion = 1;
            if (comparacion !== 0) {
                return opcion.orden === "ASC" ? comparacion : -comparacion;
            }
        }
        return 0;
    });
}
// ==================== AGRUPACIÓN ====================
/**
 * Agrupa elementos por una propiedad específica
 * Complejidad temporal: O(n)
 *
 * @param items - Array a agrupar
 * @param clave - Propiedad por la cual agrupar
 * @returns Objeto con grupos por clave
 */
export function agruparPorPropiedad(items, clave) {
    if (!Array.isArray(items) || items.length === 0) {
        return {};
    }
    const grupos = {};
    for (const item of items) {
        const valorClave = String(item[clave]);
        if (!grupos[valorClave]) {
            grupos[valorClave] = [];
        }
        grupos[valorClave].push(item);
    }
    return grupos;
}
/**
 * Agrupa elementos usando función extractor personalizada
 * Complejidad temporal: O(n)
 *
 * @param items - Array a agrupar
 * @param extractorClave - Función que extrae la clave de agrupación
 * @returns Objeto con grupos por clave
 */
export function agrupar(items, extractorClave) {
    if (!Array.isArray(items) || items.length === 0) {
        return {};
    }
    const grupos = {};
    for (const item of items) {
        const clave = extractorClave(item);
        if (!grupos[clave]) {
            grupos[clave] = [];
        }
        grupos[clave].push(item);
    }
    return grupos;
}
// ==================== UTILIDADES ====================
/**
 * Particiones un array en dos según un predicado
 * Complejidad temporal: O(n)
 *
 * @param items - Array a particionar
 * @param predicado - Condición de partición
 * @returns Tupla [cumple predicado, no cumple predicado]
 */
export function particionar(items, predicado) {
    if (!Array.isArray(items) || items.length === 0) {
        return [[], []];
    }
    const cumple = [];
    const noCumple = [];
    for (const item of items) {
        if (predicado(item)) {
            cumple.push(item);
        }
        else {
            noCumple.push(item);
        }
    }
    return [cumple, noCumple];
}
/**
 * Obtiene los primeros N elementos
 * Complejidad temporal: O(n)
 *
 * @param items - Array de entrada
 * @param cantidad - Cantidad de elementos a tomar
 * @returns Primeros N elementos
 */
export function tomar(items, cantidad) {
    if (!Array.isArray(items) || items.length === 0 || cantidad <= 0) {
        return [];
    }
    return items.slice(0, Math.min(cantidad, items.length));
}
/**
 * Salta N elementos y retorna el resto
 * Complejidad temporal: O(n)
 *
 * @param items - Array de entrada
 * @param cantidad - Cantidad de elementos a saltar
 * @returns Elementos después de saltar N
 */
export function saltar(items, cantidad) {
    if (!Array.isArray(items) || items.length === 0 || cantidad <= 0) {
        return items;
    }
    return items.slice(Math.min(cantidad, items.length));
}
/**
 * Une dos arrays eliminando duplicados
 * Complejidad temporal: O(n + m)
 *
 * @param array1 - Primer array
 * @param array2 - Segundo array
 * @returns Array unido sin duplicados
 */
export function unir(array1, array2) {
    const combinado = [...(array1 || []), ...(array2 || [])];
    return eliminarDuplicados(combinado);
}
/**
 * Encuentra la intersección de dos arrays
 * Complejidad temporal: O(n + m)
 *
 * @param array1 - Primer array
 * @param array2 - Segundo array
 * @returns Elementos comunes en ambos arrays
 */
export function interseccion(array1, array2) {
    if (!Array.isArray(array1) || !Array.isArray(array2)) {
        return [];
    }
    const conjunto2 = new Set(array2);
    return eliminarDuplicados(array1.filter((item) => conjunto2.has(item)));
}
/**
 * Calcula la diferencia entre dos arrays (elementos en array1 pero no en array2)
 * Complejidad temporal: O(n + m)
 *
 * @param array1 - Array de referencia
 * @param array2 - Array de exclusión
 * @returns Elementos en array1 que no están en array2
 */
export function diferencia(array1, array2) {
    if (!Array.isArray(array1) || array1.length === 0) {
        return [];
    }
    if (!Array.isArray(array2) || array2.length === 0) {
        return array1;
    }
    const conjunto2 = new Set(array2);
    return array1.filter((item) => !conjunto2.has(item));
}
