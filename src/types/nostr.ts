/* eslint-disable  @typescript-eslint/no-explicit-any */
export interface NostrWindow {
    nostr?: {
      getPublicKey(): Promise<string>;
      signEvent(event: any): Promise<any>;
      getRelays(): Promise<{ [url: string]: { read: boolean; write: boolean } }>;
    };
  }
  
  export interface UserProfile {
    pubkey: string;
    name?: string;
    displayName?: string;
    image?: string;
  }
  
  export type NostrLoginStatus = 'initial' | 'loading' | 'authenticated' | 'error';