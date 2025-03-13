import NDK from '@nostr-dev-kit/ndk';
import { NDKNip07Signer } from '@nostr-dev-kit/ndk';

// Create a singleton NDK instance
const ndk = new NDK({
  explicitRelayUrls: [
    'wss://relay.damus.io',
    'wss://relay.nostr.band',
    'wss://nos.lol',
    'wss://nostr.mom',
    'wss://relay.current.fyi',
  ],
});

// Connect the NDK instance
ndk.connect().catch(error => {
  console.error('Failed to connect NDK instance:', error);
});

// Function to connect with NIP-07 signer
export const connectWithNip07Signer = async () => {
  try {
    if (typeof window === 'undefined' || !window.nostr) {
      throw new Error('No Nostr extension found');
    }

    const signer = new NDKNip07Signer();
    ndk.signer = signer;

    const user = await signer.user();
    const pubkey = user.pubkey;
    const npub = user.npub;

    return { pubkey, npub };
  } catch (error) {
    console.error('Error connecting with NIP-07 signer:', error);
    throw error;
  }
};

// Ensure NDK is connected
export const ensureNDKConnected = async () => {
  // Check if there are any connected relays in the pool
  if (!ndk.pool?.connectedRelays?.length) {
    await ndk.connect();
  }
  return ndk;
};

// Export the singleton instance
export default ndk;
