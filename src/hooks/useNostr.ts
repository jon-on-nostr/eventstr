import { useState, useEffect } from 'react';
import { NostrWindow, UserProfile, NostrLoginStatus } from '@/types/nostr';

export const useNostr = () => {
  const [loginStatus, setLoginStatus] = useState<NostrLoginStatus>('initial');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isNostrAvailable, setIsNostrAvailable] = useState<boolean>(false);

  useEffect(() => {
    const checkNostrAvailability = () => {
      const nostrWindow = window as unknown as NostrWindow;
      setIsNostrAvailable(!!nostrWindow.nostr);
    };

    checkNostrAvailability();
  }, []);

  const login = async (): Promise<void> => {
    try {
      setLoginStatus('loading');
      
      if (!isNostrAvailable) {
        throw new Error('No NOSTR provider found. Please install a NOSTR browser extension.');
      }

      const nostrWindow = window as unknown as NostrWindow;
      const pubkey = await nostrWindow.nostr?.getPublicKey();

      if (!pubkey) {
        throw new Error('Failed to get public key');
      }

      const profile: UserProfile = {
        pubkey,
        displayName: `npub...${pubkey.slice(-4)}`,
      };

      setUserProfile(profile);
      setLoginStatus('authenticated');
      setError(null);
      
    } catch (err) {
      setLoginStatus('error');
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setUserProfile(null);
    }
  };

  const logout = (): void => {
    setLoginStatus('initial');
    setUserProfile(null);
    setError(null);
  };

  return {
    loginStatus,
    userProfile,
    error,
    login,
    logout,
    isNostrAvailable,
  };
};