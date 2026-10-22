"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Indica si el componente se ha montado en el cliente (hidratación completada).
 * Evita errores de hidratación al renderizar datos persistidos
 * (p. ej. el carrito recuperado de localStorage).
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
