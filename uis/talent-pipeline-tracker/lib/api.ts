/**
 * Capa de Servicios API - Talent Pipeline Tracker
 * Centraliza todas las llamadas asíncronas con manejo de errores tipado
 */

import {
  Candidate,
  CandidateNote,
  CreateCandidateDTO,
  UpdateCandidateDTO,
  UpdateCandidateStatusDTO,
  UpdateCandidateStageDTO,
  CreateNoteDTO,
  PaginatedResponse,
  ApiError,
  CandidateFilters,
} from '@/types/candidate';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://playground.4geeks.com/tracker/api/v1';

/**
 * Realiza una llamada HTTP con manejo centralizado de errores
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    // Intenta parsear la respuesta como JSON
    let data: unknown;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Si la respuesta no es OK, lanza un error con la información disponible
    if (!response.ok) {
      const error: ApiError = {
        message: typeof data === 'object' && data !== null && 'message' in data
          ? (data as Record<string, unknown>).message as string
          : `Error ${response.status}: ${response.statusText}`,
        status: response.status,
        details: typeof data === 'object' ? (data as Record<string, unknown>) : undefined,
      };
      throw error;
    }

    return data as T;
  } catch (error) {
    // Si es un ApiError ya, lanzalo directamente
    if (error instanceof Object && 'status' in error && 'message' in error) {
      throw error as ApiError;
    }
    
    // Para otros errores (ej: network), convierte a ApiError
    throw {
      message: error instanceof Error ? error.message : 'Error desconocido en la API',
      status: 0,
    } as ApiError;
  }
}

/**
 * Obtiene todos los candidatos con filtros opcionales
 */
export async function fetchCandidates(
  filters?: CandidateFilters
): Promise<Candidate[]> {
  const params = new URLSearchParams();
  
  if (filters?.status) params.append('status', filters.status);
  if (filters?.stage) params.append('stage', filters.stage);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const queryString = params.toString();
  const endpoint = queryString ? `/records?${queryString}` : '/records';

  try {
    const response = await fetchApi<Candidate[] | PaginatedResponse<Candidate>>(endpoint);
    
    // Si es una respuesta paginada, retorna solo los datos
    if (Array.isArray(response)) {
      return response;
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene un candidato específico por ID
 */
export async function fetchCandidateById(id: string): Promise<Candidate> {
  return fetchApi<Candidate>(`/records/${id}`);
}

/**
 * Crea un nuevo candidato
 */
export async function createCandidate(
  data: CreateCandidateDTO
): Promise<Candidate> {
  return fetchApi<Candidate>('/records', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Actualiza un candidato existente
 */
export async function updateCandidate(
  id: string,
  data: UpdateCandidateDTO
): Promise<Candidate> {
  return fetchApi<Candidate>(`/records/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Actualiza solo el estado de un candidato
 */
export async function updateCandidateStatus(
  id: string,
  status: UpdateCandidateStatusDTO['status']
): Promise<Candidate> {
  return fetchApi<Candidate>(`/records/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

/**
 * Actualiza solo la etapa de un candidato
 */
export async function updateCandidateStage(
  id: string,
  stage: UpdateCandidateStageDTO['stage']
): Promise<Candidate> {
  return fetchApi<Candidate>(`/records/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ stage }),
  });
}

/**
 * Elimina un candidato
 */
export async function deleteCandidate(id: string): Promise<void> {
  return fetchApi<void>(`/records/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Obtiene las notas de un candidato
 */
export async function fetchCandidateNotes(
  candidateId: string
): Promise<CandidateNote[]> {
  try {
    const response = await fetchApi<CandidateNote[] | PaginatedResponse<CandidateNote>>(
      `/records/${candidateId}/notes`
    );
    
    if (Array.isArray(response)) {
      return response;
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Crea una nueva nota para un candidato
 */
export async function createCandidateNote(
  candidateId: string,
  data: CreateNoteDTO
): Promise<CandidateNote> {
  return fetchApi<CandidateNote>(`/records/${candidateId}/notes`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Elimina una nota de un candidato
 */
export async function deleteCandidateNote(
  candidateId: string,
  noteId: string
): Promise<void> {
  return fetchApi<void>(`/records/${candidateId}/notes/${noteId}`, {
    method: 'DELETE',
  });
}

/**
 * Hook para manejar errores de API y mostrar mensajes user-friendly
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Object && 'message' in error) {
    return (error as ApiError).message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Error inesperado. Por favor intenta de nuevo.';
}
