import { useState, useEffect, useCallback } from 'react';
import { NostrUser, AuthResult } from '../services/auth';
import AuthService from '../services/auth';
import { useNostr } from './useNostr';

/**
 * Hook for handling authentication
 */
export function useAuth() {
  const { isReady } = useNostr();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<NostrUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if the user is already authenticated when the hook mounts
  useEffect(() => {
    if (isReady) {
      const user = AuthService.getCurrentUser();
      setIsAuthenticated(AuthService.isAuthenticated());
      setCurrentUser(user);
    }
  }, [isReady]);

  // Subscribe to auth state changes
  useEffect(() => {
    if (isReady) {
      // Subscribe to auth state changes
      const unsubscribe = AuthService.onAuthStateChanged(user => {
        setIsAuthenticated(!!user);
        setCurrentUser(user);
      });

      return unsubscribe;
    }
  }, [isReady]);

  /**
   * Login with a browser extension (NIP-07)
   */
  const loginWithExtension = useCallback(async (): Promise<AuthResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await AuthService.loginWithExtension();

      if (result.success) {
        setIsAuthenticated(true);
        setCurrentUser(result.user || null);
      } else {
        setError(result.error || 'Login failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during login';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login with an nsec private key
   */
  const loginWithPrivateKey = useCallback(async (nsec: string): Promise<AuthResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await AuthService.loginWithNsec(nsec);

      if (result.success) {
        setIsAuthenticated(true);
        setCurrentUser(result.user || null);
      } else {
        setError(result.error || 'Login failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during login';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Log out the current user
   */
  const logout = useCallback(() => {
    AuthService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  }, []);

  return {
    isLoading,
    isAuthenticated,
    currentUser,
    error,
    loginWithExtension,
    loginWithPrivateKey,
    logout,
  };
}
