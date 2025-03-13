import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Badge,
  initializeNDK,
  searchBadgesByNpub,
  signInWithExtension,
  getUserProfile,
  getAllBadges,
  getTrendingBadges,
  getBadgeDetails,
} from '../services/nostrService';
import { nip19 } from 'nostr-tools';

interface BadgeContextType {
  // Authentication
  isLoggedIn: boolean;
  currentUser: {
    pubkey?: string;
    npub?: string;
    name?: string;
    displayName?: string;
    picture?: string;
  };
  login: () => Promise<void>;
  logout: () => void;

  // Badge search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: {
    badgesCreated: Badge[];
    badgesReceived: Badge[];
    userProfile?: {
      name?: string;
      displayName?: string;
      picture?: string;
    };
  };
  isSearching: boolean;
  searchError?: string;
  performSearch: (npub: string) => Promise<void>;

  // User badges
  userBadges: {
    created: Badge[];
    received: Badge[];
  };
  isLoadingUserBadges: boolean;
  userBadgesError?: string;
  refreshUserBadges: () => Promise<void>;

  // Discover badges
  discoverBadges: {
    trending: Badge[];
    recent: Badge[];
  };
  isLoadingDiscover: boolean;
  discoverError?: string;
  loadDiscoverBadges: () => Promise<void>;

  // Badge details
  selectedBadge?: Badge & {
    awardCount?: number;
    recentRecipients?: Array<{ pubkey: string; timestamp: number }>;
  };
  isLoadingBadgeDetails: boolean;
  badgeDetailsError?: string;
  loadBadgeDetails: (badgeId: string) => Promise<void>;
}

const BadgeContext = createContext<BadgeContextType | undefined>(undefined);

export const BadgeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<BadgeContextType['currentUser']>({});

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BadgeContextType['searchResults']>({
    badgesCreated: [],
    badgesReceived: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | undefined>(undefined);

  // User badges state
  const [userBadges, setUserBadges] = useState<BadgeContextType['userBadges']>({
    created: [],
    received: [],
  });
  const [isLoadingUserBadges, setIsLoadingUserBadges] = useState(false);
  const [userBadgesError, setUserBadgesError] = useState<string | undefined>(undefined);

  // Discover state
  const [discoverBadges, setDiscoverBadges] = useState<{
    trending: Badge[];
    recent: Badge[];
  }>({
    trending: [],
    recent: [],
  });
  const [isLoadingDiscover, setIsLoadingDiscover] = useState(false);
  const [discoverError, setDiscoverError] = useState<string | undefined>(undefined);

  // Badge details state
  const [selectedBadge, setSelectedBadge] = useState<BadgeContextType['selectedBadge']>(undefined);
  const [isLoadingBadgeDetails, setIsLoadingBadgeDetails] = useState(false);
  const [badgeDetailsError, setBadgeDetailsError] = useState<string | undefined>(undefined);

  // Initialize NDK on component mount
  useEffect(() => {
    const init = async () => {
      try {
        await initializeNDK();
        // Load default badges when the component mounts
        await loadDefaultBadges();
      } catch (error) {
        console.error('Failed to initialize NDK:', error);
      }
    };

    init();
  }, []);

  // Login function
  const login = async () => {
    try {
      const result = await signInWithExtension();

      if (result.error) {
        console.error(result.error);
        return;
      }

      if (result.pubkey && result.npub) {
        // Get user profile
        const profile = await getUserProfile(result.pubkey);

        setCurrentUser({
          pubkey: result.pubkey,
          npub: result.npub,
          name: profile.name,
          displayName: profile.displayName,
          picture: profile.picture,
        });

        setIsLoggedIn(true);

        // Load user badges
        await refreshUserBadges();
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Logout function
  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser({});
    setUserBadges({ created: [], received: [] });
  };

  // Search function
  const performSearch = async (npub: string) => {
    if (!npub.trim()) {
      // If search is empty, load default badges
      await loadDefaultBadges();
      return;
    }

    setIsSearching(true);
    setSearchError(undefined);

    try {
      // Check if input is a valid npub
      let isValidNpub = true;
      try {
        if (npub.startsWith('npub')) {
          nip19.decode(npub);
        } else {
          // Check if it's a valid hex pubkey (64 hex chars)
          isValidNpub = /^[0-9a-f]{64}$/.test(npub);
        }
      } catch (e) {
        isValidNpub = false;
      }

      if (!isValidNpub) {
        // If not a valid npub, load default badges
        await loadDefaultBadges();
        return;
      }

      const results = await searchBadgesByNpub(npub);

      if (results.error) {
        setSearchError(results.error);
        // If there's an error, load default badges
        await loadDefaultBadges();
      } else {
        // Get user profile
        const profile = await getUserProfile(npub);

        setSearchResults({
          badgesCreated: results.badgesCreated,
          badgesReceived: results.badgesReceived,
          userProfile: {
            name: profile.name,
            displayName: profile.displayName,
            picture: profile.picture,
          },
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('An unexpected error occurred during search');
      // If there's an error, load default badges
      await loadDefaultBadges();
    } finally {
      setIsSearching(false);
    }
  };

  // Add a new function to load default badges
  const loadDefaultBadges = async () => {
    setIsSearching(true);

    try {
      const result = await getAllBadges({ limit: 16 });

      setSearchResults({
        badgesCreated: result.badges,
        badgesReceived: [],
        userProfile: undefined,
      });

      if (result.error) {
        setSearchError(result.error);
      }
    } catch (error) {
      console.error('Error loading default badges:', error);
      setSearchError('Failed to load badges');
    } finally {
      setIsSearching(false);
    }
  };

  // Refresh user badges
  const refreshUserBadges = async () => {
    if (!currentUser.pubkey) return;

    setIsLoadingUserBadges(true);
    setUserBadgesError(undefined);

    try {
      const results = await searchBadgesByNpub(currentUser.pubkey);

      if (results.error) {
        setUserBadgesError(results.error);
      } else {
        setUserBadges({
          created: results.badgesCreated,
          received: results.badgesReceived,
        });
      }
    } catch (error) {
      console.error('Error refreshing user badges:', error);
      setUserBadgesError('Failed to load your badges');
    } finally {
      setIsLoadingUserBadges(false);
    }
  };

  // Load discover badges
  const loadDiscoverBadges = async () => {
    setIsLoadingDiscover(true);
    setDiscoverError(undefined);

    try {
      // Get trending badges
      const trendingResult = await getTrendingBadges(12);

      // Get recent badges
      const recentResult = await getAllBadges({
        limit: 12,
        since: Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60, // Last 7 days
      });

      setDiscoverBadges({
        trending: trendingResult.badges,
        recent: recentResult.badges,
      });

      if (trendingResult.error || recentResult.error) {
        setDiscoverError(trendingResult.error || recentResult.error);
      }
    } catch (error) {
      console.error('Error loading discover badges:', error);
      setDiscoverError('Failed to load badges');
    } finally {
      setIsLoadingDiscover(false);
    }
  };

  // Load badge details
  const loadBadgeDetails = async (badgeId: string) => {
    setIsLoadingBadgeDetails(true);
    setBadgeDetailsError(undefined);

    try {
      const result = await getBadgeDetails(badgeId);

      if (result.error) {
        setBadgeDetailsError(result.error);
        setSelectedBadge(undefined);
      } else if (result.badge) {
        setSelectedBadge(result.badge);
      }
    } catch (error) {
      console.error('Error loading badge details:', error);
      setBadgeDetailsError('Failed to load badge details');
    } finally {
      setIsLoadingBadgeDetails(false);
    }
  };

  const value: BadgeContextType = {
    isLoggedIn,
    currentUser,
    login,
    logout,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchError,
    performSearch,
    userBadges,
    isLoadingUserBadges,
    userBadgesError,
    refreshUserBadges,
    discoverBadges,
    isLoadingDiscover,
    discoverError,
    loadDiscoverBadges,
    selectedBadge,
    isLoadingBadgeDetails,
    badgeDetailsError,
    loadBadgeDetails,
  };

  return <BadgeContext.Provider value={value}>{children}</BadgeContext.Provider>;
};

// Custom hook to use the badge context
export const useBadges = () => {
  const context = useContext(BadgeContext);
  if (context === undefined) {
    throw new Error('useBadges must be used within a BadgeProvider');
  }
  return context;
};
