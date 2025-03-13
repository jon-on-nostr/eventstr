import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useNostr } from './useNostr';
import ProfileService, { ProfileData, ProfileUpdateResult } from '../services/profiles';

/**
 * Hook for managing user profiles
 */
export function useProfile() {
  const { isReady } = useNostr();
  const { currentUser, isAuthenticated } = useAuth();
  const [currentProfile, setCurrentProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update current profile when auth state changes
  useEffect(() => {
    if (isReady && isAuthenticated && currentUser) {
      setCurrentProfile(ProfileService.getCurrentProfile());
    } else {
      setCurrentProfile(null);
    }
  }, [isReady, isAuthenticated, currentUser]);

  /**
   * Fetch a user profile by pubkey or npub
   */
  const getProfile = useCallback(
    async (identifier: string, forceRefresh = false): Promise<ProfileData | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const profile = await ProfileService.getProfile(identifier, forceRefresh);
        return profile;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error fetching profile';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Update the current user's profile
   */
  const updateProfile = useCallback(
    async (
      profileUpdate: Partial<Omit<ProfileData, 'pubkey' | 'npub'>>
    ): Promise<ProfileUpdateResult> => {
      if (!isAuthenticated) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await ProfileService.updateProfile(profileUpdate);

        if (result.success && result.profile) {
          setCurrentProfile(result.profile);
        } else {
          setError(result.error || 'Failed to update profile');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error updating profile';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  /**
   * Refresh the current profile from the network
   */
  const refreshCurrentProfile = useCallback(async (): Promise<ProfileData | null> => {
    if (!isAuthenticated || !currentUser) {
      return null;
    }

    setIsLoading(true);

    try {
      const profile = await ProfileService.getProfile(currentUser.pubkey, true);
      if (profile) {
        setCurrentProfile(profile);
      }
      return profile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error refreshing profile';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, currentUser]);

  return {
    currentProfile,
    isLoading,
    error,
    getProfile,
    updateProfile,
    refreshCurrentProfile,
  };
}
