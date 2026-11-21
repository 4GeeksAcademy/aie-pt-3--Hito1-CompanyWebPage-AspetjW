/**
 * Hook personalizado para manejar datos de candidatos con caché
 * Mantiene en memoria los candidatos y maneja los estados de carga
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { Candidate, CandidateFilters, ApiError } from '@/types/candidate';
import { fetchCandidates, getErrorMessage } from '@/lib/api';

export interface UseCandidatesResult {
  candidates: Candidate[];
  isLoading: boolean;
  error: ApiError | null;
  refresh: () => Promise<void>;
  errorMessage: string | null;
}

/**
 * Hook para obtener y cachear la lista de candidatos
 * Solo hace fetch si los datos no están en caché o si se solicita refresh explícito
 */
export function useCandidates(filters?: CandidateFilters): UseCandidatesResult {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  
  // Referencia para trackear si el componente está montado
  const isMountedRef = useRef(true);
  
  // Referencia para cachear datos y evitar fetches innecesarios
  const cacheRef = useRef<{
    data: Candidate[];
    filters: CandidateFilters | undefined;
    timestamp: number;
  } | null>(null);

  const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutos

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCandidates(filters);
      
      if (isMountedRef.current) {
        setCandidates(data);
        // Actualiza el caché
        cacheRef.current = {
          data,
          filters,
          timestamp: Date.now(),
        };
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err as ApiError);
        setCandidates([]);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [filters]);

  useEffect(() => {
    // Establece mounted flag al montar
    isMountedRef.current = true;

    // Verifica si hay caché válido
    if (
      cacheRef.current &&
      JSON.stringify(cacheRef.current.filters) === JSON.stringify(filters) &&
      Date.now() - cacheRef.current.timestamp < CACHE_DURATION_MS
    ) {
      // Usa el caché
      setCandidates(cacheRef.current.data);
      setIsLoading(false);
      setError(null);
      
      return () => {
        isMountedRef.current = false;
      };
    }

    // Si no hay caché válido, hace fetch
    refresh();

    return () => {
      isMountedRef.current = false;
    };
  }, [filters, refresh]);

  return {
    candidates,
    isLoading,
    error,
    refresh,
    errorMessage: error ? getErrorMessage(error) : null,
  };
}
