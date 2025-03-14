import { useState, useEffect, useCallback } from 'react';
import { useNostr } from './useNostr';
import { useAuth } from './useAuth';
import BadgesService from '../services/badges/badgesService';
import type { BadgeDefinition } from '../services/badges/types';

type BadgeWithStatus = BadgeDefinition & { status: 'pending' | 'accepted' | 'blocked' };

export function useBadges(npubOverride?: string) {
  const { ndk, isReady } = useNostr();
  const { currentUser } = useAuth();
  const [badgesService, setBadgesService] = useState<BadgesService | null>(null);

  const [badges, setBadges] = useState<BadgeWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the badges service when NDK is ready
  useEffect(() => {
    if (isReady && ndk) {
      setBadgesService(new BadgesService(ndk));
    }
  }, [isReady, ndk]);

  useEffect(() => {
    if (badgesService) {
      // If an override npub is provided, use that instead of the current user
      if (npubOverride) {
        fetchBadges(npubOverride);
      }
      // Otherwise use the current logged in user if available
      else if (currentUser?.npub) {
        fetchBadges(currentUser.npub);
      } else {
        // Reset badges if no user is available - use empty array instead of null
        setBadges([]);
      }
    }
  }, [badgesService, currentUser, npubOverride]);

  const fetchBadges = useCallback(
    async (npub: string) => {
      if (!badgesService) return;

      setIsLoading(true);
      setError(null);

      try {
        // Create a timeout controller
        const timeoutId = setTimeout(() => {
          console.log('Badge fetch timed out, returning empty list');
          setIsLoading(false);
          setBadges([]);
        }, 15000);

        // Fetch badges
        try {
          const userBadges = await badgesService.getUserBadges(npub);
          // Clear timeout since we got a response
          clearTimeout(timeoutId);
          setBadges(userBadges);
        } catch (err) {
          // Clear timeout if we got an error
          clearTimeout(timeoutId);
          console.error('Error fetching badges:', err);
          setError(err instanceof Error ? err.message : 'Failed to fetch badges');
          setBadges([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [badgesService]
  );

  // Fetch badges when the user changes or npubOverride is provided
  useEffect(() => {
    if (badgesService) {
      // If an override npub is provided, use that instead of the current user
      if (npubOverride) {
        fetchBadges(npubOverride);
      }
      // Otherwise use the current logged in user if available
      else if (currentUser?.npub) {
        fetchBadges(currentUser.npub);
      } else {
        // Reset badges if no user is available
        setBadges([]);
      }
    }
  }, [badgesService, currentUser, npubOverride, fetchBadges]);

  // Provide a function to manually refresh badges
  const refreshBadges = useCallback(() => {
    if (npubOverride) {
      fetchBadges(npubOverride);
    } else if (currentUser?.npub) {
      fetchBadges(currentUser.npub);
    }
  }, [fetchBadges, currentUser, npubOverride]);

  return {
    badges,
    isLoading,
    error,
    refreshBadges,
  };
}
