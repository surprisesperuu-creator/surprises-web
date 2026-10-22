"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ApiDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Ocurrió un error inesperado";
}

/**
 * Hook para consumir endpoints de la API con estados loading / error / refetch.
 *
 * Nota de lint: el loading inicial es `true` y el estado solo se actualiza en
 * callbacks asíncronos (evita llamadas síncronas a setState dentro de efectos).
 */
export function useApiData<T>(
  fetcher: () => Promise<T>,
  dependencies: unknown[] = []
) {
  const [state, setState] = useState<ApiDataState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const [attempt, setAttempt] = useState(0);
  const fetcherRef = useRef(fetcher);

  // Mantiene la referencia del fetcher siempre al día.
  // (Actualizar refs dentro de efectos está permitido; durante render no).
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const refetch = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    setAttempt((value) => value + 1);
  }, []);

  useEffect(() => {
    let active = true;

    fetcherRef.current()
      .then((data) => {
        if (active) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setState({ data: null, loading: false, error: toErrorMessage(error) });
        }
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, ...dependencies]);

  return { data: state.data, loading: state.loading, error: state.error, refetch };
}
