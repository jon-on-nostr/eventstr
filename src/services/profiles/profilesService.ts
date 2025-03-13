import { NDKEvent, NDKFilter, NDKKind, NDKUser } from '@nostr-dev-kit/ndk';
import { nip19 } from 'nostr-tools';
import { getNDK, ensureNDKConnected } from '../ndk';
import AuthService, { NostrUser } from '../auth';

export interface ProfileData {
  pubkey: string;
  npub: string;
  name?: string;
  displayName?: string;
  picture?: string;
  banner?: string;
  about?: string;
  website?: string;
  nip05?: string;
  lud16?: string; // Lightning address
  [key: string]: any; // Allow for additional fields
}

export interface ProfileUpdateResult {
  success: boolean;
  profile?: ProfileData;
  error?: string;
}

/**
 * Service for handling Nostr user profiles
 */
class ProfileService {
  private static instance: ProfileService;
  private profileCache: Map<string, ProfileData> = new Map();
  private pendingFetches: Map<string, Promise<ProfileData | null>> = new Map();

  private constructor() {
    // Subscribe to auth state changes to clear cache when user logs out
    AuthService.onAuthStateChanged(user => {
      if (!user) {
        // Clear cache when user logs out
        this.profileCache.clear();
      }
    });
  }

  public static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  /**
   * Gets the current user's profile
   * @returns Current user profile or null if not authenticated
   */
  public getCurrentProfile(): ProfileData | null {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) return null;

    // Convert NostrUser to ProfileData
    return this.nostrUserToProfileData(currentUser);
  }

  /**
   * Convert NostrUser to ProfileData
   */
  private nostrUserToProfileData(user: NostrUser): ProfileData {
    return {
      pubkey: user.pubkey,
      npub: user.npub,
      name: user.profile?.name,
      displayName: user.profile?.displayName,
      picture: user.profile?.picture,
      banner: user.profile?.banner,
      about: user.profile?.about,
      website: user.profile?.website,
      nip05: user.profile?.nip05,
      lud16: user.profile?.lud16,
      ...user.profile,
    };
  }

  /**
   * Fetches a profile by pubkey or npub
   * @param identifier pubkey (hex) or npub
   * @param forceRefresh Force refresh from network
   * @returns ProfileData or null if not found
   */
  public async getProfile(identifier: string, forceRefresh = false): Promise<ProfileData | null> {
    let pubkey: string;

    // Convert npub to pubkey if needed
    if (identifier.startsWith('npub')) {
      try {
        const decoded = nip19.decode(identifier);
        pubkey = decoded.data as string;
      } catch (error) {
        console.error('Invalid npub:', identifier);
        return null;
      }
    } else {
      pubkey = identifier;
    }

    // Return from cache if available and not forcing refresh
    if (!forceRefresh && this.profileCache.has(pubkey)) {
      return this.profileCache.get(pubkey) || null;
    }

    // If we already have a pending fetch for this pubkey, return that promise
    if (this.pendingFetches.has(pubkey)) {
      return this.pendingFetches.get(pubkey) || null;
    }

    // Create a new fetch promise
    const fetchPromise = this.fetchProfileFromNetwork(pubkey);
    this.pendingFetches.set(pubkey, fetchPromise);

    try {
      const profile = await fetchPromise;
      // Remove from pending after fetch completes
      this.pendingFetches.delete(pubkey);
      return profile;
    } catch (error) {
      this.pendingFetches.delete(pubkey);
      throw error;
    }
  }

  /**
   * Fetches multiple profiles at once
   * @param identifiers Array of pubkeys or npubs
   * @param forceRefresh Force refresh from network
   * @returns Map of pubkey to ProfileData
   */
  public async getProfiles(
    identifiers: string[],
    forceRefresh = false
  ): Promise<Map<string, ProfileData>> {
    const result = new Map<string, ProfileData>();
    const pubkeysToFetch: string[] = [];

    // Process identifiers and check cache
    for (const identifier of identifiers) {
      let pubkey: string;

      // Convert npub to pubkey if needed
      if (identifier.startsWith('npub')) {
        try {
          const decoded = nip19.decode(identifier);
          pubkey = decoded.data as string;
        } catch (error) {
          console.error('Invalid npub:', identifier);
          continue;
        }
      } else {
        pubkey = identifier;
      }

      // Use cache if available and not forcing refresh
      if (!forceRefresh && this.profileCache.has(pubkey)) {
        const profile = this.profileCache.get(pubkey);
        if (profile) {
          result.set(pubkey, profile);
        }
      } else {
        pubkeysToFetch.push(pubkey);
      }
    }

    // If we have pubkeys to fetch, do a bulk fetch
    if (pubkeysToFetch.length > 0) {
      const fetchedProfiles = await this.fetchProfilesFromNetwork(pubkeysToFetch);

      // Merge fetched profiles with result
      fetchedProfiles.forEach((profile, pubkey) => {
        result.set(pubkey, profile);
      });
    }

    return result;
  }

  /**
   * Fetches a single profile from the network
   * @param pubkey User's pubkey
   * @returns ProfileData or null if not found
   */
  private async fetchProfileFromNetwork(pubkey: string): Promise<ProfileData | null> {
    try {
      await ensureNDKConnected();
      const ndk = getNDK();

      const ndkUser = ndk.getUser({ pubkey });
      const profileEvent = await ndkUser.fetchProfile();

      if (!profileEvent) {
        // Create a minimal profile with just the pubkey/npub
        const minimalProfile: ProfileData = {
          pubkey,
          npub: nip19.npubEncode(pubkey),
        };
        this.profileCache.set(pubkey, minimalProfile);
        return minimalProfile;
      }

      // Use parseProfileContent instead of parseProfileEvent
      const profile = this.parseProfileContent(profileEvent.content, pubkey);
      this.profileCache.set(pubkey, profile);
      return profile;
    } catch (error) {
      console.error(`Error fetching profile for ${pubkey}:`, error);
      return null;
    }
  }

  /**
   * Parses profile content into ProfileData
   */
  private parseProfileContent(
    content: string | number | Record<string, any> | undefined,
    pubkey: string
  ): ProfileData {
    const npub = nip19.npubEncode(pubkey);

    try {
      if (content === undefined) {
        return { pubkey, npub };
      }

      const profileJson =
        typeof content === 'string'
          ? JSON.parse(content)
          : typeof content === 'number'
          ? { number: content }
          : content;

      return {
        pubkey,
        npub,
        name: profileJson.name,
        displayName: profileJson.display_name || profileJson.displayName,
        picture: profileJson.picture,
        banner: profileJson.banner,
        about: profileJson.about,
        website: profileJson.website,
        nip05: profileJson.nip05,
        lud16: profileJson.lud16,
        ...profileJson,
      };
    } catch (error) {
      console.error('Error parsing profile content:', error);
      return {
        pubkey,
        npub,
      };
    }
  }

  /**
   * Fetches multiple profiles from the network at once
   * @param pubkeys Array of pubkeys to fetch
   * @returns Map of pubkey to ProfileData
   */
  private async fetchProfilesFromNetwork(pubkeys: string[]): Promise<Map<string, ProfileData>> {
    const result = new Map<string, ProfileData>();

    try {
      await ensureNDKConnected();
      const ndk = getNDK();

      // Create a filter for all the pubkeys
      const filter: NDKFilter = {
        kinds: [NDKKind.Metadata],
        authors: pubkeys,
      };

      // Fetch all matching events
      const events = await ndk.fetchEvents(filter);

      // Process each event
      events.forEach(event => {
        const pubkey = event.pubkey;
        const profile = this.parseProfileEvent(event, pubkey);
        result.set(pubkey, profile);
        this.profileCache.set(pubkey, profile);
      });

      // Create minimal profiles for pubkeys that weren't found
      for (const pubkey of pubkeys) {
        if (!result.has(pubkey)) {
          const minimalProfile: ProfileData = {
            pubkey,
            npub: nip19.npubEncode(pubkey),
          };
          result.set(pubkey, minimalProfile);
          this.profileCache.set(pubkey, minimalProfile);
        }
      }

      return result;
    } catch (error) {
      console.error('Error fetching multiple profiles:', error);

      // Create minimal profiles for all pubkeys on error
      for (const pubkey of pubkeys) {
        if (!result.has(pubkey)) {
          const minimalProfile: ProfileData = {
            pubkey,
            npub: nip19.npubEncode(pubkey),
          };
          result.set(pubkey, minimalProfile);
        }
      }

      return result;
    }
  }

  /**
   * Parses a profile event into ProfileData
   */
  private parseProfileEvent(event: NDKEvent, pubkey: string): ProfileData {
    return this.parseProfileContent(event.content, pubkey);
  }

  /**
   * Updates the current user's profile
   * @param profileUpdate Profile data to update
   * @returns Result of the update operation
   */
  public async updateProfile(
    profileUpdate: Partial<Omit<ProfileData, 'pubkey' | 'npub'>>
  ): Promise<ProfileUpdateResult> {
    if (!AuthService.isAuthenticated()) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'Current user not found',
        };
      }

      // Convert from ProfileData format to raw profile format if needed
      const updateData: Record<string, any> = {};

      // Map display_name to displayName for consistency
      if (profileUpdate.displayName) {
        updateData.display_name = profileUpdate.displayName;
      }

      // Add all other properties
      Object.entries(profileUpdate).forEach(([key, value]) => {
        if (key !== 'displayName' && value !== undefined) {
          updateData[key] = value;
        }
      });

      // Use AuthService to update the profile
      const result = await AuthService.updateProfile(updateData);

      if (result.success && result.user) {
        // Update the profile cache
        const updatedProfile = this.nostrUserToProfileData(result.user);
        this.profileCache.set(result.user.pubkey, updatedProfile);

        return {
          success: true,
          profile: updatedProfile,
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to update profile',
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error updating profile',
      };
    }
  }

  /**
   * Clears the profile cache
   * @param pubkey Optional pubkey to clear only that profile
   */
  public clearCache(pubkey?: string): void {
    if (pubkey) {
      this.profileCache.delete(pubkey);
    } else {
      this.profileCache.clear();
    }
  }
}

export default ProfileService.getInstance();
