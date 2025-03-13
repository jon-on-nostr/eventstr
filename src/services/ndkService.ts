import NDK, { NDKNip07Signer } from '@nostr-dev-kit/ndk';

// Define relays
const relays = [
  'wss://relay.damus.io',
  'wss://relay.nostr.band',
  'wss://nos.lol',
  'wss://relay.snort.social',
];

// Create a singleton NDK service
class NDKService {
  private static instance: NDKService;
  private _ndk: NDK;
  private _initialized = false;
  private _connecting = false;
  private _connectionPromise: Promise<void> | null = null;

  private constructor() {
    this._ndk = new NDK({ explicitRelayUrls: relays });
  }

  public static getInstance(): NDKService {
    if (!NDKService.instance) {
      NDKService.instance = new NDKService();
    }
    return NDKService.instance;
  }

  public get ndk(): NDK {
    return this._ndk;
  }

  public get initialized(): boolean {
    return this._initialized;
  }

  public async connect(): Promise<void> {
    // If already connected, return immediately
    if (this._initialized) {
      return;
    }

    // If connection is in progress, return the existing promise
    if (this._connecting && this._connectionPromise) {
      return this._connectionPromise;
    }

    // Start connection process
    this._connecting = true;
    this._connectionPromise = new Promise<void>(async (resolve, reject) => {
      try {
        console.log('Connecting to Nostr relays...');
        await this._ndk.connect();
        console.log('Connected to Nostr relays');
        this._initialized = true;
        this._connecting = false;
        resolve();
      } catch (error) {
        console.error('Failed to connect to Nostr relays:', error);
        this._connecting = false;

        // Recreate NDK instance on failure
        this._ndk = new NDK({ explicitRelayUrls: relays });
        reject(error);
      }
    });

    return this._connectionPromise;
  }

  public async connectWithNip07Signer(): Promise<{ pubkey: string; npub: string }> {
    await this.connect();

    if (!window.nostr) {
      throw new Error(
        'No Nostr extension found. Please install a Nostr extension like Alby or nos2x.'
      );
    }

    const signer = new NDKNip07Signer();
    this._ndk.signer = signer;

    const user = await signer.user();
    if (!user.pubkey) {
      throw new Error('Failed to get public key from extension');
    }

    return {
      pubkey: user.pubkey,
      npub: user.npub,
    };
  }
}

export { NDKService };

// Export a singleton instance
export const ndkService = NDKService.getInstance();

// Export a function to get the NDK instance
export const getNDK = (): NDK => {
  return ndkService.ndk;
};

// Export a function to ensure NDK is connected
export const ensureNDKConnected = async (): Promise<NDK> => {
  await ndkService.connect();
  return ndkService.ndk;
};
