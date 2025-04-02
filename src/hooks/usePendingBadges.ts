import { useState, useCallback, useEffect } from 'react';
import { BadgesService } from '@/services/badges';
import { BadgeDefinition } from '@/services/badges/types';
import { useAuth } from './useAuth';

// Add awardId and awardedAt to the badge type for pending badges
type PendingBadge = BadgeDefinition & {
  status: 'pending';
  awardId: string;
  awardedAt: Date;
};

export const usePendingBadges = (badgesService: BadgesService | null, refreshTrigger = 0) => {
  const { currentUser } = useAuth();
  const [pendingBadges, setPendingBadges] = useState<PendingBadge[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingBadges = useCallback(async () => {
    if (!badgesService || !currentUser?.pubkey) return;

    setIsLoading(true);
    setError(null);

    try {
      // Use our new specialized method for pending badges
      const pending = await badgesService.getPendingBadgeAwards(currentUser.pubkey);
      setPendingBadges(pending);
    } catch (err) {
      console.error('Error fetching pending badges:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pending badges');
      setPendingBadges([]);
    } finally {
      setIsLoading(false);
    }
  }, [badgesService, currentUser]);

  // Fetch pending badges on mount and when dependencies change
  useEffect(() => {
    fetchPendingBadges();
  }, [fetchPendingBadges, refreshTrigger]);

  // Function to accept a badge
  const acceptBadge = useCallback(
    async (awardId: string | undefined) => {
      if (!badgesService || !awardId) return;

      try {
        await badgesService.respondToBadgeAward(awardId, 'accept');
        // Remove the accepted badge from the pending list
        setPendingBadges(prev => prev.filter(badge => badge.awardId !== awardId));
        return true;
      } catch (err) {
        console.error('Error accepting badge:', err);
        setError(err instanceof Error ? err.message : 'Failed to accept badge');
        return false;
      }
    },
    [badgesService]
  );

  // Function to block a badge
  const blockBadge = useCallback(
    async (awardId: string | undefined) => {
      if (!badgesService || !awardId) return;

      try {
        await badgesService.respondToBadgeAward(awardId, 'block');
        // Remove the blocked badge from the pending list
        setPendingBadges(prev => prev.filter(badge => badge.awardId !== awardId));
        return true;
      } catch (err) {
        console.error('Error blocking badge:', err);
        setError(err instanceof Error ? err.message : 'Failed to block badge');
        return false;
      }
    },
    [badgesService]
  );

  return {
    pendingBadges,
    isLoading,
    error,
    fetchPendingBadges,
    acceptBadge,
    blockBadge,
  };
};
