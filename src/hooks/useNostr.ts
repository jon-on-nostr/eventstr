import { useEffect, useState } from 'react';
import NDK, { NDKEvent } from '@nostr-dev-kit/ndk';
import { getNDK, ensureNDKConnected, ConnectionState } from '../services/ndk';

/**
 * Hook for interacting with the NDK instance
 */
export function useNostr() {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.DISCONNECTED
  );
  const [ndk, setNdk] = useState<NDK | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize NDK
  useEffect(() => {
    const initializeNdk = async () => {
      try {
        // Get NDK instance
        const ndkInstance = getNDK();
        setNdk(ndkInstance);

        // Try to connect if not already connected
        await ensureNDKConnected();
        setIsReady(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize NDK'));
        console.error('Error initializing NDK:', err);
      }
    };

    initializeNdk();

    return () => {
      // Cleanup if needed
    };
  }, []);

  /**
   * Publish an event to the Nostr network
   */
  const publishEvent = async (eventData: NDKEvent): Promise<NDKEvent | null> => {
    try {
      if (!isReady) {
        await ensureNDKConnected();
      }

      const ndkInstance = getNDK();
      // Create an NDKEvent first
      const event = new NDKEvent(ndkInstance, eventData);
      // Then publish it, which returns a Set<NDKRelay>
      await event.publish();
      // Return the event itself
      return event;
    } catch (err) {
      console.error('Error publishing event:', err);
      setError(err instanceof Error ? err : new Error('Failed to publish event'));
      return null;
    }
  };

  return {
    ndk,
    isReady,
    connectionState,
    error,
    publishEvent,
  };
}
