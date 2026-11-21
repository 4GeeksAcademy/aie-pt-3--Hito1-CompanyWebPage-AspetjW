/**
 * Utilidades de Transformación y Agregación
 * Funciones para generar reportes y agregaciones de datos
 */
// ==================== FUNCIONES DE AGREGACIÓN GENÉRICAS ====================
/**
 * Cuenta elementos agrupados por una propiedad
 * Complejidad temporal: O(n)
 *
 * @param items - Array a contar
 * @param propiedad - Propiedad por la cual contar
 * @returns Objeto con conteos por valor
 */
export function contarPorPropiedad(items, propiedad) {
    if (!Array.isArray(items) || items.length === 0) {
        return {};
    }
    const conteos = {};
    for (const item of items) {
        const clave = String(item[propiedad]);
        conteos[clave] = (conteos[clave] || 0) + 1;
    }
    return conteos;
}
/**
 * Suma valores de una propiedad numérica
 * Complejidad temporal: O(n)
 *
 * @param items - Array a sumar
 * @param propiedad - Propiedad numérica a sumar
 * @returns Suma total
 */
export function sumarPorPropiedad(items, propiedad) {
    if (!Array.isArray(items) || items.length === 0) {
        return 0;
    }
    return items.reduce((suma, item) => {
        const valor = item[propiedad];
        return suma + (typeof valor === "number" ? valor : 0);
    }, 0);
}
/**
 * Calcula el promedio de una propiedad numérica
 * Complejidad temporal: O(n)
 *
 * @param items - Array para calcular promedio
 * @param propiedad - Propiedad numérica a promediar
 * @returns Promedio o 0 si array vacío
 */
export function promediarPorPropiedad(items, propiedad) {
    if (!Array.isArray(items) || items.length === 0) {
        return 0;
    }
    const suma = sumarPorPropiedad(items, propiedad);
    return suma / items.length;
}
/**
 * Encuentra el valor máximo de una propiedad
 * Complejidad temporal: O(n)
 *
 * @param items - Array de búsqueda
 * @param propiedad - Propiedad numérica
 * @returns Valor máximo o -Infinity si array vacío
 */
export function maximoPorPropiedad(items, propiedad) {
    if (!Array.isArray(items) || items.length === 0) {
        return -Infinity;
    }
    return items.reduce((maximo, item) => {
        const valor = item[propiedad];
        const numValor = typeof valor === "number" ? valor : 0;
        return Math.max(maximo, numValor);
    }, -Infinity);
}
/**
 * Encuentra el valor mínimo de una propiedad
 * Complejidad temporal: O(n)
 *
 * @param items - Array de búsqueda
 * @param propiedad - Propiedad numérica
 * @returns Valor mínimo o Infinity si array vacío
 */
export function minimoPorPropiedad(items, propiedad) {
    if (!Array.isArray(items) || items.length === 0) {
        return Infinity;
    }
    return items.reduce((minimo, item) => {
        const valor = item[propiedad];
        const numValor = typeof valor === "number" ? valor : 0;
        return Math.min(minimo, numValor);
    }, Infinity);
}
/**
 * Calcula la mediana de una propiedad numérica
 * Complejidad temporal: O(n log n)
 *
 * @param items - Array para calcular mediana
 * @param propiedad - Propiedad numérica
 * @returns Mediana o 0 si array vacío
 */
export function medianaPorPropiedad(items, propiedad) {
    if (!Array.isArray(items) || items.length === 0) {
        return 0;
    }
    const valores = items
        .map((item) => {
        const valor = item[propiedad];
        return typeof valor === "number" ? valor : 0;
    })
        .sort((a, b) => a - b);
    const mitad = Math.floor(valores.length / 2);
    if (valores.length % 2 === 0) {
        return (valores[mitad - 1] + valores[mitad]) / 2;
    }
    return valores[mitad];
}
// ==================== REPORTES DE RECLAMACIONES ====================
/**
 * Genera reporte completo de estadísticas de reclamaciones
 * Complejidad temporal: O(n)
 *
 * @param reclamaciones - Array de reclamaciones
 * @returns Reporte detallado de estadísticas
 */
export function generarReporteEstadisticasReclamaciones(reclamaciones) {
    if (!Array.isArray(reclamaciones) || reclamaciones.length === 0) {
        return {
            totalReclamaciones: 0,
            totalMontoEnviado: 0,
            totalMontoAprobado: 0,
            totalMontoDenegado: 0,
            tasaDenegacion: 0,
            montoPromedio: 0,
            montoMediana: 0,
            reclamacionesPorEstado: {},
            reclamacionesPorRegion: { US: 0, UK: 0 },
            reclamacionesPorPrioridad: { BAJA: 0, MEDIA: 0, ALTA: 0 },
            razonesRechazoMasComunes: [],
        };
    }
    const totalMontoEnviado = sumarPorPropiedad(reclamaciones, "montoReclamacion");
    const totalMontoAprobado = sumarPorPropiedad(reclamaciones, "montoAprobado");
    const totalMontoDenegado = sumarPorPropiedad(reclamaciones, "montoDenegado");
    // Contar reclamaciones por estado
    const conteosPorEstado = contarPorPropiedad(reclamaciones, "estado");
    const reclamacionesPorEstado = {
        ENVIADA: conteosPorEstado["ENVIADA"] || 0,
        EN_REVISION: conteosPorEstado["EN_REVISION"] || 0,
        APROBADA: conteosPorEstado["APROBADA"] || 0,
        PARCIALMENTE_APROBADA: conteosPorEstado["PARCIALMENTE_APROBADA"] || 0,
        DENEGADA: conteosPorEstado["DENEGADA"] || 0,
        APELADA: conteosPorEstado["APELADA"] || 0,
    };
    // Contar por región
    const conteosPorRegion = contarPorPropiedad(reclamaciones, "region");
    const reclamacionesPorRegion = {
        US: conteosPorRegion["US"] || 0,
        UK: conteosPorRegion["UK"] || 0,
    };
    // Contar por prioridad
    const conteosPorPrioridad = contarPorPropiedad(reclamaciones, "prioridad");
    const reclamacionesPorPrioridad = {
        BAJA: conteosPorPrioridad["BAJA"] || 0,
        MEDIA: conteosPorPrioridad["MEDIA"] || 0,
        ALTA: conteosPorPrioridad["ALTA"] || 0,
    };
    // Razones de rechazo más comunes
    const contadorRazones = {};
    for (const rec of reclamaciones) {
        for (const razon of rec.razonesRechazo) {
            contadorRazones[razon] = (contadorRazones[razon] || 0) + 1;
        }
    }
    const razonesRechazoMasComunes = Object.entries(contadorRazones)
        .map(([razon, cantidad]) => ({ razon, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 10);
    return {
        totalReclamaciones: reclamaciones.length,
        totalMontoEnviado,
        totalMontoAprobado,
        totalMontoDenegado,
        tasaDenegacion: totalMontoEnviado > 0
            ? (totalMontoDenegado / totalMontoEnviado) * 100
            : 0,
        montoPromedio: promediarPorPropiedad(reclamaciones, "montoReclamacion"),
        montoMediana: medianaPorPropiedad(reclamaciones, "montoReclamacion"),
        reclamacionesPorEstado,
        reclamacionesPorRegion,
        reclamacionesPorPrioridad,
        razonesRechazoMasComunes,
    };
}
// ==================== REPORTES DE PACIENTES ====================
/**
 * Genera reporte de análisis de pacientes
 * Complejidad temporal: O(n)
 *
 * @param pacientes - Array de pacientes
 * @returns Reporte de análisis de pacientes
 */
export function generarReporteAnalisisPacientes(pacientes) {
    if (!Array.isArray(pacientes) || pacientes.length === 0) {
        return {
            totalPacientes: 0,
            tasaInasistencia: 0,
            pacientesAltoRiesgo: 0,
            pacientesConInasistencias: 0,
            promedioCitas: 0,
            inasistenciasPorRegion: { US: 0, UK: 0 },
            distribucionPuntuacionRiesgo: {
                riesgoBajo: 0,
                riesgoMedio: 0,
                riesgoAlto: 0,
            },
        };
    }
    // Contar pacientes con alto riesgo (>70)
    const pacientesAltoRiesgo = pacientes.filter((p) => p.puntuacionRiesgo > 70).length;
    // Contar pacientes con inasistencias
    const pacientesConInasistencias = pacientes.filter((p) => p.citasFaltadas > 0).length;
    // Calcular tasa de inasistencia general
    const totalInasistencias = sumarPorPropiedad(pacientes, "citasFaltadas");
    const totalCitas = sumarPorPropiedad(pacientes, "totalCitas");
    const tasaInasistencia = totalCitas > 0 ? (totalInasistencias / totalCitas) * 100 : 0;
    // Inasistencias por región
    const pacientesUS = pacientes.filter((p) => p.region === "US");
    const pacientesUK = pacientes.filter((p) => p.region === "UK");
    const inasistenciasPorRegion = {
        US: sumarPorPropiedad(pacientesUS, "citasFaltadas"),
        UK: sumarPorPropiedad(pacientesUK, "citasFaltadas"),
    };
    // Distribución de puntuación de riesgo
    const riesgoBajo = pacientes.filter((p) => p.puntuacionRiesgo <= 30).length;
    const riesgoMedio = pacientes.filter((p) => p.puntuacionRiesgo > 30 && p.puntuacionRiesgo <= 70).length;
    const riesgoAlto = pacientes.filter((p) => p.puntuacionRiesgo > 70).length;
    return {
        totalPacientes: pacientes.length,
        tasaInasistencia,
        pacientesAltoRiesgo,
        pacientesConInasistencias,
        promedioCitas: promediarPorPropiedad(pacientes, "totalCitas"),
        inasistenciasPorRegion,
        distribucionPuntuacionRiesgo: {
            riesgoBajo,
            riesgoMedio,
            riesgoAlto,
        },
    };
}
// ==================== REPORTES DE PROVEEDORES ====================
/**
 * Genera reporte de desempeño de proveedores
 * Complejidad temporal: O(n log n)
 *
 * @param proveedores - Array de proveedores
 * @returns Reporte de desempeño
 */
export function generarReporteDesempenoProveedor(proveedores) {
    if (!Array.isArray(proveedores) || proveedores.length === 0) {
        return {
            totalProveedores: 0,
            tasaDenegacionPromedio: 0,
            montoPromedio: 0,
            proveedoresPorTipo: {},
            proveedoresTopVolumen: [],
            proveedoresPorRegion: { US: 0, UK: 0 },
        };
    }
    // Tipos de proveedor
    const conteosPorTipo = contarPorPropiedad(proveedores, "tipoProveedor");
    const proveedoresPorTipo = {
        HOSPITAL: conteosPorTipo["HOSPITAL"] || 0,
        CLINICA: conteosPorTipo["CLINICA"] || 0,
        LABORATORIO: conteosPorTipo["LABORATORIO"] || 0,
        CENTRO_IMAGENES: conteosPorTipo["CENTRO_IMAGENES"] || 0,
        ESPECIALISTA: conteosPorTipo["ESPECIALISTA"] || 0,
    };
    // Proveedores por región
    const conteosPorRegion = contarPorPropiedad(proveedores, "region");
    const proveedoresPorRegion = {
        US: conteosPorRegion["US"] || 0,
        UK: conteosPorRegion["UK"] || 0,
    };
    // Top proveedores por volumen
    const proveedoresTopVolumen = [...proveedores]
        .sort((a, b) => b.reclamacionesEnviadas - a.reclamacionesEnviadas)
        .slice(0, 10)
        .map((p) => ({
        id: p.id,
        nombre: p.nombre,
        reclamacionesEnviadas: p.reclamacionesEnviadas,
    }));
    return {
        totalProveedores: proveedores.length,
        tasaDenegacionPromedio: promediarPorPropiedad(proveedores, "tasaDenegacion"),
        montoPromedio: promediarPorPropiedad(proveedores, "montoPromedioCita"),
        proveedoresPorTipo,
        proveedoresTopVolumen,
        proveedoresPorRegion,
    };
}
// ==================== REPORTES DE CITAS ====================
/**
 * Obtiene nombre del día de la semana
 * @param fecha - Fecha
 * @returns Nombre del día
 */
function obtenerNombreDia(fecha) {
    const dias = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ];
    return dias[fecha.getDay()];
}
/**
 * Genera reporte de predicción de inasistencia
 * Complejidad temporal: O(n)
 *
 * @param citas - Array de citas
 * @param pacientes - Array de pacientes (para riesgo)
 * @returns Reporte de predicción de inasistencia
 */
export function generarReportePrediccionInasistencia(citas, pacientes = []) {
    if (!Array.isArray(citas) || citas.length === 0) {
        return {
            totalCitas: 0,
            tasaAsistencia: 0,
            tasaInasistencia: 0,
            inasistenciasPorRegion: { US: 0, UK: 0 },
            inasistenciasPorDiaSemana: {},
            recordatoriosPromAsistencia: 0,
            recordatoriosPromInasistencia: 0,
            pacientesAltoRiesgo: 0,
        };
    }
    // Contar asistencias e inasistencias
    const asistidas = citas.filter((c) => c.estadoAsistencia === "ASISTIO");
    const noAsistidas = citas.filter((c) => c.estadoAsistencia === "NO_ASISTIO");
    // Tasas
    const tasaAsistencia = (asistidas.length / citas.length) * 100;
    const tasaInasistencia = (noAsistidas.length / citas.length) * 100;
    // Inasistencias por región
    const conteosPorRegion = contarPorPropiedad(noAsistidas, "region");
    const inasistenciasPorRegion = {
        US: conteosPorRegion["US"] || 0,
        UK: conteosPorRegion["UK"] || 0,
    };
    // Inasistencias por día de semana
    const inasistenciasPorDia = {};
    for (const cita of noAsistidas) {
        const diaNombre = obtenerNombreDia(cita.fechaProgramada);
        inasistenciasPorDia[diaNombre] = (inasistenciasPorDia[diaNombre] || 0) + 1;
    }
    // Promedio de recordatorios
    const recordatoriosPromAsistencia = asistidas.length > 0
        ? sumarPorPropiedad(asistidas, "recordatoriosEnviados") / asistidas.length
        : 0;
    const recordatoriosPromInasistencia = noAsistidas.length > 0
        ? sumarPorPropiedad(noAsistidas, "recordatoriosEnviados") / noAsistidas.length
        : 0;
    // Pacientes de alto riesgo
    const pacientesAltoRiesgo = pacientes.filter((p) => p.puntuacionRiesgo > 70).length;
    return {
        totalCitas: citas.length,
        tasaAsistencia,
        tasaInasistencia,
        inasistenciasPorRegion,
        inasistenciasPorDiaSemana: inasistenciasPorDia,
        recordatoriosPromAsistencia,
        recordatoriosPromInasistencia,
        pacientesAltoRiesgo,
    };
}
