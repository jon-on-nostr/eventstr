import { NDKNip07Signer, NDKPrivateKeySigner, NDKUser, NDKKind } from '@nostr-dev-kit/ndk';
import { nip19 } from 'nostr-tools';
import { getNDK, getNDKInstance, ensureNDKConnected } from '../ndk';

/**
 * Represents a Nostr user with profile information
 */
export interface NostrUser {
  pubkey: string;
  npub: string;
  profile?: {
    name?: string;
    displayName?: string;
    picture?: string;
    about?: string;
    nip05?: string;
    [key: string]: any;
  };
}

/**
 * Result of an authentication operation
 */
export interface AuthResult {
  success: boolean;
  user?: NostrUser;
  error?: string;
}

/**
 * Auth state change listener type
 */
export type AuthStateListener = (user: NostrUser | null) => void;

/**
 * Service that handles Nostr authentication
 */
class AuthService {
  private static instance: AuthService;
  private _currentUser: NostrUser | null = null;
  private _authStateListeners: AuthStateListener[] = [];

  private constructor() {
    // Check if we already have a signer attached to NDK
    this.checkExistingSigner();
  }

  /**
   * Gets the singleton instance of AuthService
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Checks if NDK already has a signer and sets up the current user if so
   */
  private async checkExistingSigner(): Promise<void> {
    const ndk = getNDK();
    if (ndk.signer) {
      try {
        const user = await ndk.signer.user();
        if (user?.pubkey) {
          await this.setupCurrentUser(user);
        }
      } catch (error) {
        console.error('Error checking existing signer:', error);
      }
    }
  }

  /**
   * Sets up the current user with profile information
   */
  private async setupCurrentUser(ndkUser: NDKUser): Promise<NostrUser> {
    try {
      await ensureNDKConnected();

      const pubkey = ndkUser.pubkey;
      const npub = ndkUser.npub || nip19.npubEncode(pubkey);

      // Fetch user profile
      let profile: NostrUser['profile'] = {};
      try {
        const profileEvents = await ndkUser.fetchProfile();
        if (profileEvents) {
          profile = profileEvents.content
            ? JSON.parse(
                typeof profileEvents.content === 'string'
                  ? profileEvents.content
                  : String(profileEvents.content)
              )
            : {};
        }
      } catch (error) {
        console.warn('Error fetching user profile:', error);
      }

      const user: NostrUser = {
        pubkey,
        npub,
        profile,
      };

      this._currentUser = user;
      this.notifyAuthStateListeners();

      return user;
    } catch (error) {
      console.error('Error setting up current user:', error);
      throw error;
    }
  }

  /**
   * Checks if a user is currently authenticated
   */
  public isAuthenticated(): boolean {
    const ndk = getNDK();
    return Boolean(ndk.signer && this._currentUser);
  }

  /**
   * Gets the currently authenticated user
   */
  public getCurrentUser(): NostrUser | null {
    return this._currentUser;
  }

  /**
   * Logs in using a NIP-07 browser extension (Alby, nos2x, etc.)
   */
  public async loginWithExtension(): Promise<AuthResult> {
    try {
      await ensureNDKConnected();
      const ndk = getNDK();

      // Check if extension is available
      if (typeof window === 'undefined' || !window.nostr) {
        return {
          success: false,
          error: 'No Nostr extension found. Please install a Nostr extension like Alby or nos2x.',
        };
      }

      // Create a NIP-07 signer
      const signer = new NDKNip07Signer();
      ndk.signer = signer;

      // Get user from signer
      const ndkUser = await signer.user();
      if (!ndkUser?.pubkey) {
        return {
          success: false,
          error: 'Could not get public key from extension',
        };
      }

      // Set up current user with profile information
      const user = await this.setupCurrentUser(ndkUser);

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error('Error logging in with extension:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error logging in with extension',
      };
    }
  }

  /**
   * Logs in using a private key (nsec)
   * @param nsec Private key in nsec format
   */
  public async loginWithNsec(nsec: string): Promise<AuthResult> {
    try {
      // Basic validation
      if (!nsec.trim() || !nsec.startsWith('nsec')) {
        return {
          success: false,
          error: 'Invalid nsec format',
        };
      }

      await ensureNDKConnected();
      const ndk = getNDK();

      // Decode the nsec to get the hex private key
      let privateKey: string;
      try {
        const decoded = nip19.decode(nsec);
        if (decoded.type !== 'nsec') {
          return {
            success: false,
            error: 'Invalid nsec format',
          };
        }
        // Convert Uint8Array to hex string
        privateKey = Array.from(decoded.data)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      } catch (error) {
        return {
          success: false,
          error: 'Could not decode nsec key',
        };
      }

      // Create private key signer
      const signer = new NDKPrivateKeySigner(privateKey);
      ndk.signer = signer;

      // Get user from signer
      const ndkUser = await signer.user();
      if (!ndkUser?.pubkey) {
        return {
          success: false,
          error: 'Could not get public key from private key',
        };
      }

      // Set up current user with profile information
      const user = await this.setupCurrentUser(ndkUser);

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error('Error logging in with nsec:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error logging in with private key',
      };
    }
  }

  /**
   * Logs the current user out
   */
  public logout(): void {
    const ndk = getNDK();
    ndk.signer = undefined;
    this._currentUser = null;
    this.notifyAuthStateListeners();
  }

  /**
   * Registers a listener for auth state changes
   * @param listener Function to call when auth state changes
   * @returns Function to unregister the listener
   */
  public onAuthStateChanged(listener: AuthStateListener): () => void {
    this._authStateListeners.push(listener);

    // Immediately notify with current state
    listener(this._currentUser);

    // Return unsubscribe function
    return () => {
      this._authStateListeners = this._authStateListeners.filter(l => l !== listener);
    };
  }

  /**
   * Notifies all registered listeners of auth state changes
   */
  private notifyAuthStateListeners(): void {
    for (const listener of this._authStateListeners) {
      try {
        listener(this._currentUser);
      } catch (error) {
        console.error('Error in auth state listener:', error);
      }
    }
  }

  /**
   * Updates the current user's profile
   * @param profileData Profile data to update
   * @returns Result of the operation
   */
  public async updateProfile(profileData: Partial<NostrUser['profile']>): Promise<AuthResult> {
    try {
      if (!this.isAuthenticated() || !this._currentUser) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      await ensureNDKConnected();
      const ndk = getNDK();

      // Get current profile and merge with new data
      const currentProfile = this._currentUser.profile || {};
      const newProfile = {
        ...currentProfile,
        ...profileData,
      };

      // Create and publish profile event
      const ndkUser = ndk.getUser({ pubkey: this._currentUser.pubkey });
      await ndkUser.publish();

      // Update current user
      this._currentUser = {
        ...this._currentUser,
        profile: newProfile,
      };

      this.notifyAuthStateListeners();

      return {
        success: true,
        user: this._currentUser,
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error updating profile',
      };
    }
  }
}

export default AuthService.getInstance();
