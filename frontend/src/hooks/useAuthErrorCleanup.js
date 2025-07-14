import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Custom hook to handle auth error cleanup
 * Clears auth errors when component mounts and unmounts
 *
 * @param {boolean} clearOnMount - Whether to clear errors on mount (default: true)
 * @param {boolean} clearOnUnmount - Whether to clear errors on unmount (default: true)
 */
export function useAuthErrorCleanup(
  clearOnMount = true,
  clearOnUnmount = true
) {
  const { clearAuthErrors } = useAuthStore();

  useEffect(() => {
    if (clearOnMount) {
      clearAuthErrors();
    }

    // Cleanup function to clear errors when component unmounts
    return () => {
      if (clearOnUnmount) {
        clearAuthErrors();
      }
    };
  }, [clearAuthErrors, clearOnMount, clearOnUnmount]);
}
