import NDK, { NDKEvent, NDKRelay, NDKRelayStatus } from '@nostr-dev-kit/ndk';

// Connection states
export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

class NDKSingleton {
  private static instance: NDKSingleton;
  private _ndk: NDK;
  private _connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private _connectionPromise: Promise<void> | null = null;
  private _connectionError: Error | null = null;
  private _connectionListeners: ((state: ConnectionState, error?: Error) => void)[] = [];
  private _boundHandleRelayConnect: (relay: NDKRelay) => void;
  private _boundHandleRelayDisconnect: (relay: NDKRelay) => void;
  private _boundHandleRelayError: (relay: NDKRelay, error: unknown) => void;

  private constructor() {
    // Initialize NDK with default relays
    this._ndk = new NDK({
      explicitRelayUrls: [
        'wss://relay.damus.io',
        'wss://relay.nostr.band',
        'wss://nos.lol',
        'wss://nostr.mom',
        'wss://relay.current.fyi',
      ],
      autoConnectUserRelays: true,
    });

    // Store bound methods to be able to remove them later
    this._boundHandleRelayConnect = this.handleRelayConnect.bind(this);
    this._boundHandleRelayDisconnect = this.handleRelayDisconnect.bind(this);
    this._boundHandleRelayError = this.handleRelayError.bind(this);

    // Set up relay connection listeners
    this.setupRelayListeners();
  }

  private setupRelayListeners(): void {
    if (!this._ndk.pool) {
      console.warn('NDK pool not initialized');
      return;
    }

    this._ndk.pool.on('relay:connect', this._boundHandleRelayConnect);
    this._ndk.pool.on('relay:disconnect', this._boundHandleRelayDisconnect);
  }

  private removeRelayListeners(): void {
    if (!this._ndk.pool) return;

    this._ndk.pool.off('relay:connect', this._boundHandleRelayConnect);
    this._ndk.pool.off('relay:disconnect', this._boundHandleRelayDisconnect);
  }

  public static getInstance(): NDKSingleton {
    if (!NDKSingleton.instance) {
      NDKSingleton.instance = new NDKSingleton();
    }
    return NDKSingleton.instance;
  }

  /**
   * Get the NDK instance
   */
  public get ndk(): NDK {
    return this._ndk;
  }

  /**
   * Get current connection state
   */
  public get connectionState(): ConnectionState {
    return this._connectionState;
  }

  /**
   * Get the latest connection error if any
   */
  public get connectionError(): Error | null {
    return this._connectionError;
  }

  /**
   * Check if NDK is connected to at least one relay
   */
  public get isConnected(): boolean {
    return (
      this._connectionState === ConnectionState.CONNECTED &&
      Boolean(this._ndk.pool?.connectedRelays?.length)
    );
  }

  /**
   * Connect to the relays if not already connected
   * @returns Promise that resolves when connected
   */
  public async connect(): Promise<void> {
    // If already connected, return immediately
    if (this.isConnected) {
      return Promise.resolve();
    }

    // If already connecting, return the existing promise
    if (this._connectionState === ConnectionState.CONNECTING && this._connectionPromise) {
      return this._connectionPromise;
    }

    // Update state and clear any previous errors
    this.updateConnectionState(ConnectionState.CONNECTING);

    // Create and store the connection promise
    this._connectionPromise = new Promise<void>((resolve, reject) => {
      this._ndk
        .connect()
        .then(() => {
          // Only update state if we have at least one connected relay
          if (this._ndk.pool?.connectedRelays?.length) {
            this.updateConnectionState(ConnectionState.CONNECTED);
            resolve();
          } else {
            const error = new Error('Connected but no relays available');
            this.updateConnectionState(ConnectionState.ERROR, error);
            reject(error);
          }
        })
        .catch(error => {
          this.updateConnectionState(
            ConnectionState.ERROR,
            error instanceof Error ? error : new Error(String(error))
          );
          reject(error);
        });
    });

    return this._connectionPromise;
  }

  /**
   * Disconnect from all relays
   */
  public disconnect(): void {
    if (this._ndk.pool) {
      // Close all connected relays individually since pool.close() doesn't exist
      this._ndk.pool.relays.forEach(relay => {
        if (relay.status === NDKRelayStatus.CONNECTED) {
          relay.disconnect();
        }
      });
    }
    this.updateConnectionState(ConnectionState.DISCONNECTED);
    this._connectionPromise = null;
  }

  /**
   * Ensures NDK is connected before performing operations
   * @returns The NDK instance after ensuring connection
   */
  public async ensureConnected(): Promise<NDK> {
    await this.connect().catch(error => {
      console.error('Failed to connect to relays:', error);
      throw error;
    });
    return this._ndk;
  }

  /**
   * Add a listener for connection state changes
   * @param listener Function to call when connection state changes
   * @returns Function to remove the listener
   */
  public addConnectionListener(
    listener: (state: ConnectionState, error?: Error) => void
  ): () => void {
    this._connectionListeners.push(listener);

    // Immediately notify with current state
    listener(this._connectionState, this._connectionError || undefined);

    // Return function to remove this listener
    return () => {
      this._connectionListeners = this._connectionListeners.filter(l => l !== listener);
    };
  }

  /**
   * Reset the NDK instance with new relays
   * @param explicitRelayUrls Optional list of relay URLs to use
   */
  public async reset(explicitRelayUrls?: string[]): Promise<void> {
    // Remove existing listeners
    this.removeRelayListeners();

    // Disconnect current instance
    this.disconnect();

    // Create new NDK instance with provided relays or default ones
    this._ndk = new NDK({
      explicitRelayUrls: explicitRelayUrls || [
        'wss://relay.damus.io',
        'wss://relay.nostr.band',
        'wss://nos.lol',
        'wss://nostr.mom',
        'wss://relay.current.fyi',
      ],
      autoConnectUserRelays: true,
    });

    // Set up relay listeners again
    this.setupRelayListeners();

    // Connect to the new relays
    try {
      await this.connect();
    } catch (error) {
      console.error('Failed to connect after reset:', error);
      throw error;
    }
  }

  // Event handlers for relay events
  private handleRelayConnect(relay: NDKRelay) {
    console.log(`Connected to relay: ${relay.url}`);
    // If this is our first connected relay, update state
    if (
      this._connectionState !== ConnectionState.CONNECTED &&
      this._ndk.pool?.connectedRelays?.length
    ) {
      this.updateConnectionState(ConnectionState.CONNECTED);
    }
  }

  private handleRelayDisconnect(relay: NDKRelay) {
    console.log(`Disconnected from relay: ${relay.url}`);
    // If we have no more connected relays, update state
    if (!this._ndk.pool?.connectedRelays?.length) {
      this.updateConnectionState(ConnectionState.DISCONNECTED);

      // Attempt to reconnect after a short delay
      setTimeout(() => {
        if (this._connectionState === ConnectionState.DISCONNECTED) {
          this.connect().catch(error => {
            console.error('Failed to reconnect after disconnect:', error);
          });
        }
      }, 3000);
    }
  }

  private handleRelayError(relay: NDKRelay, error: unknown) {
    console.error(`Error with relay ${relay.url}:`, error);
    // Only update to error state if we have no connected relays
    if (!this._ndk.pool?.connectedRelays?.length) {
      const err = new Error(`Relay error: ${relay.url} - ${String(error)}`);
      this.updateConnectionState(ConnectionState.ERROR, err);

      // Attempt to reconnect after a longer delay
      setTimeout(() => {
        if (this._connectionState === ConnectionState.ERROR) {
          this.connect().catch(error => {
            console.error('Failed to reconnect after error:', error);
          });
        }
      }, 5000);
    }
  }

  private updateConnectionState(state: ConnectionState, error?: Error): void {
    this._connectionState = state;
    this._connectionError = error || null;

    // Notify all listeners
    for (const listener of this._connectionListeners) {
      try {
        listener(state, error);
      } catch (e) {
        console.error('Error in connection listener:', e);
      }
    }
  }
}

// Export a getter for the singleton instance
export const getNDKInstance = (): NDKSingleton => NDKSingleton.getInstance();

// Export the NDK directly for convenience
export const getNDK = (): NDK => NDKSingleton.getInstance().ndk;

// Export the ensure connected function for easy use
export const ensureNDKConnected = async (): Promise<NDK> => {
  return await NDKSingleton.getInstance().ensureConnected();
};

// Default export of the singleton instance
export default NDKSingleton.getInstance();
