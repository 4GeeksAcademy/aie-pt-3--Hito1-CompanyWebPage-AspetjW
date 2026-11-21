/**
 * Modelos de Datos de HealthCore
 * Interfaces TypeScript para procesamiento de datos sanitarios
 */

// ==================== TIPOS DE RECLAMACIÓN ====================

export type EstadoReclamacion =
  | "ENVIADA"
  | "EN_REVISION"
  | "APROBADA"
  | "PARCIALMENTE_APROBADA"
  | "DENEGADA"
  | "APELADA";

export interface Reclamacion {
  id: string;
  numeroReclamacion: string;
  idPaciente: string;
  idProveedor: string;
  fechaEnvio: Date;
  montoReclamacion: number;
  montoDenegado: number;
  montoAprobado: number;
  estado: EstadoReclamacion;
  razonesRechazo: string[];
  fechaServicio: Date;
  fechaActualizacion: Date;
  region: "US" | "UK";
  prioridad: "BAJA" | "MEDIA" | "ALTA";
  requiereRevisionIA: boolean;
  notas: string;
}

export interface FiltroReclamacion {
  estados?: EstadoReclamacion[];
  montoMinimo?: number;
  montoMaximo?: number;
  region?: "US" | "UK";
  fechaInicio?: Date;
  fechaFin?: Date;
  razonesRechazoIncluidas?: string[];
  requiereRevisionIA?: boolean;
  prioridades?: ("BAJA" | "MEDIA" | "ALTA")[];
}

export interface ReporteEstadisticasReclamaciones {
  totalReclamaciones: number;
  totalMontoEnviado: number;
  totalMontoAprobado: number;
  totalMontoDenegado: number;
  tasaDenegacion: number;
  montoPromedio: number;
  montoMediana: number;
  reclamacionesPorEstado: Record<EstadoReclamacion, number>;
  reclamacionesPorRegion: Record<"US" | "UK", number>;
  reclamacionesPorPrioridad: Record<"BAJA" | "MEDIA" | "ALTA", number>;
  razonesRechazoMasComunes: Array<{ razon: string; cantidad: number }>;
}

// ==================== TIPOS DE PACIENTE ====================

export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  correo: string;
  telefonoContacto: string;
  fechaRegistro: Date;
  totalCitas: number;
  citasFaltadas: number;
  fechaUltimaVisita: Date | null;
  puntuacionRiesgo: number;
  region: "US" | "UK";
}

export interface FiltroPaciente {
  region?: "US" | "UK";
  citas_faltadas_minimo?: number;
  citas_faltadas_maximo?: number;
  puntuacionRiesgoMinima?: number;
  puntuacionRiesgoMaxima?: number;
  registradoDesde?: Date;
  registradoHasta?: Date;
}

export interface ReporteAnalisisPacientes {
  totalPacientes: number;
  tasaInasistencia: number;
  pacientesAltoRiesgo: number;
  pacientesConInasistencias: number;
  promedioCitas: number;
  inasistenciasPorRegion: Record<"US" | "UK", number>;
  distribucionPuntuacionRiesgo: {
    riesgoBajo: number;
    riesgoMedio: number;
    riesgoAlto: number;
  };
}

// ==================== TIPOS DE PROVEEDOR ====================

export type TipoProveedor =
  | "HOSPITAL"
  | "CLINICA"
  | "LABORATORIO"
  | "CENTRO_IMAGENES"
  | "ESPECIALISTA";

export interface Proveedor {
  id: string;
  nombre: string;
  tipoProveedor: TipoProveedor;
  npi: string;
  reclamacionesEnviadas: number;
  tasaDenegacion: number;
  region: "US" | "UK";
  montoPromedioCita: number;
  especialidades: string[];
}

export interface ReporteDesempenoProveedor {
  totalProveedores: number;
  tasaDenegacionPromedio: number;
  montoPromedio: number;
  proveedoresPorTipo: Record<TipoProveedor, number>;
  proveedoresTopVolumen: Array<{
    id: string;
    nombre: string;
    reclamacionesEnviadas: number;
  }>;
  proveedoresPorRegion: Record<"US" | "UK", number>;
}

// ==================== TIPOS DE NOTA CLÍNICA ====================

export type TipoDocumento =
  | "NOTA_EVOLUCION"
  | "RESUMEN_ALTA"
  | "RESULTADO_LABORATORIO"
  | "REPORTE_IMAGENES"
  | "RECETA";

export interface NotaClinica {
  id: string;
  idPaciente: string;
  idProveedor: string;
  fechaCreacion: Date;
  tipoDocumento: TipoDocumento;
  contenido: string;
  cantidadPalabras: number;
  palabrasClave: string[];
  procesadoPorIA: boolean;
  puntuacionConfianza: number;
}

// ==================== TIPOS DE CITA ====================

export type EstadoAsistencia =
  | "PROGRAMADA"
  | "ASISTIO"
  | "NO_ASISTIO"
  | "CANCELADA"
  | "REPROGRAMADA";

export interface Cita {
  id: string;
  idPaciente: string;
  idProveedor: string;
  fechaProgramada: Date;
  estadoAsistencia: EstadoAsistencia;
  tipoCita: string;
  recordatoriosEnviados: number;
  region: "US" | "UK";
  duracionMinutos: number;
}

export interface FiltrosCita {
  estadoAsistencia?: EstadoAsistencia[];
  region?: "US" | "UK";
  fechaInicio?: Date;
  fechaFin?: Date;
  recordatoriosMinimo?: number;
}

export interface ReportePrediccionInasistencia {
  totalCitas: number;
  tasaAsistencia: number;
  tasaInasistencia: number;
  inasistenciasPorRegion: Record<"US" | "UK", number>;
  inasistenciasPorDiaSemana: Record<string, number>;
  recordatoriosPromAsistencia: number;
  recordatoriosPromInasistencia: number;
  pacientesAltoRiesgo: number;
}

// ==================== TIPOS UTILITARIOS ====================

export type Ordenamiento = "ASC" | "DESC";

export interface OpcionesOrdenamiento<T> {
  campo: keyof T;
  orden: Ordenamiento;
}

export interface ResultadoValidacion {
  esValido: boolean;
  errores: string[];
}

// ==================== TIPOS HELPER ====================

export type Comparador<T> = (a: T, b: T) => number;
export type Predicado<T> = (item: T) => boolean;
export type Mapeador<T, U> = (item: T) => U;
export type Reductor<T, U> = (acumulador: U, actual: T) => U;
