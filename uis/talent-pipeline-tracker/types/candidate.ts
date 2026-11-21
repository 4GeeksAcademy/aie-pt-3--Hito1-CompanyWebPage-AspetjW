/**
 * Tipos para el Talent Pipeline Tracker
 * Define las estructuras de datos para candidatos, notas y operaciones CRUD
 */

// Estados posibles de un candidato en el pipeline
export type CandidateStatus = 
  | 'applied' 
  | 'screening' 
  | 'interviewed' 
  | 'offered' 
  | 'hired' 
  | 'rejected';

// Etapas del proceso de selección
export type CandidateStage = 
  | 'initial_review' 
  | 'phone_screening' 
  | 'technical_assessment' 
  | 'interview' 
  | 'final_round' 
  | 'offer_pending' 
  | 'completed';

/**
 * Interfaz para un Candidato completo
 * Representa un registro de candidatura en el sistema
 */
export interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  position: string;
  linkedin_url?: string | null;
  cv_url?: string | null;
  years_of_experience?: number | null;
  status: CandidateStatus;
  stage: CandidateStage;
  applied_at: string; // ISO 8601 date
  created_at: string;
  updated_at: string;
}

/**
 * Interfaz para una Nota interna sobre un candidato
 */
export interface CandidateNote {
  id: string;
  record_id: string; // ID del candidato
  content: string;
  author?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * DTO para crear un nuevo candidato
 * Los campos opcionales tienen valores por defecto en el backend
 */
export interface CreateCandidateDTO {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  position: string;
  linkedin_url?: string;
  cv_url?: string;
  years_of_experience?: number;
  status?: CandidateStatus;
  stage?: CandidateStage;
}

/**
 * DTO para actualizar un candidato existente
 * Todos los campos son opcionales
 */
export interface UpdateCandidateDTO {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  position?: string;
  linkedin_url?: string;
  cv_url?: string;
  years_of_experience?: number;
  status?: CandidateStatus;
  stage?: CandidateStage;
}

/**
 * DTO para actualizar solo el estado de un candidato
 */
export interface UpdateCandidateStatusDTO {
  status: CandidateStatus;
}

/**
 * DTO para actualizar solo la etapa de un candidato
 */
export interface UpdateCandidateStageDTO {
  stage: CandidateStage;
}

/**
 * DTO para crear una nota
 */
export interface CreateNoteDTO {
  content: string;
  author?: string;
}

/**
 * Respuesta de paginación de la API
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * Respuesta de error estándar de la API
 */
export interface ApiError {
  message: string;
  status: number;
  details?: Record<string, unknown>;
}

/**
 * Estados de carga para operaciones asíncronas
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Resultado genérico de una operación asíncrona
 */
export interface AsyncResult<T> {
  state: LoadingState;
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Parámetros de filtrado y búsqueda
 */
export interface CandidateFilters {
  status?: CandidateStatus;
  stage?: CandidateStage;
  search?: string; // Busca en nombre, email
  page?: number;
  limit?: number;
}

/**
 * Etiquetas legibles para estados
 */
export const STATUS_LABELS: Record<CandidateStatus, string> = {
  applied: 'Aplicó',
  screening: 'En revisión',
  interviewed: 'Entrevistado',
  offered: 'Oferta extendida',
  hired: 'Contratado',
  rejected: 'Rechazado',
};

/**
 * Etiquetas legibles para etapas
 */
export const STAGE_LABELS: Record<CandidateStage, string> = {
  initial_review: 'Revisión inicial',
  phone_screening: 'Entrevista telefónica',
  technical_assessment: 'Evaluación técnica',
  interview: 'Entrevista',
  final_round: 'Ronda final',
  offer_pending: 'Oferta pendiente',
  completed: 'Completado',
};

/**
 * Colores para estados (para UI)
 */
export const STATUS_COLORS: Record<CandidateStatus, string> = {
  applied: 'bg-blue-100 text-blue-800',
  screening: 'bg-yellow-100 text-yellow-800',
  interviewed: 'bg-purple-100 text-purple-800',
  offered: 'bg-green-100 text-green-800',
  hired: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
};

/**
 * Colores para etapas (para UI)
 */
export const STAGE_COLORS: Record<CandidateStage, string> = {
  initial_review: 'bg-gray-100 text-gray-800',
  phone_screening: 'bg-indigo-100 text-indigo-800',
  technical_assessment: 'bg-cyan-100 text-cyan-800',
  interview: 'bg-violet-100 text-violet-800',
  final_round: 'bg-orange-100 text-orange-800',
  offer_pending: 'bg-lime-100 text-lime-800',
  completed: 'bg-teal-100 text-teal-800',
};
