import { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import NDK from '@nostr-dev-kit/ndk';
import { nip19 } from 'nostr-tools';
import { BadgeDefinition } from './types';

export interface BadgeAward {
  badgeDefId: string; // Badge definition event ID
  awardedTo: string; // Recipient's npub
  awardedBy: string; // Awarder's npub
  awardedAt: number; // Timestamp when awarded
  status: 'pending' | 'accepted' | 'blocked'; // Award status
}

// Type for badge definition event
export interface BadgeDefinitionEvent {
  name: string;
  description: string;
  image: string;
  thumbnail?: string;
}

// Type for badge award event
export interface BadgeAwardEvent {
  d: string; // Unique identifier for the badge award
  a: string; // Badge definition event id
  p: string[]; // List of pubkeys to award the badge to
}

/**
 * Service to handle Nostr badge operations according to NIP-58
 */
export default class BadgesService {
  private ndk: NDK;

  constructor(ndk: NDK) {
    this.ndk = ndk;
  }

  /**
   * Creates a new badge definition
   *
   * @param badgeData - The badge definition data
   * @returns Promise with the created badge definition event
   */
  public async createBadge(badgeData: BadgeDefinitionEvent): Promise<NDKEvent> {
    try {
      // Create a new event for badge definition (kind:30009)
      const event = new NDKEvent(this.ndk);
      event.kind = 30009;
      event.content = JSON.stringify(badgeData);

      // Sign and publish the event
      await event.publish();

      return event;
    } catch (error) {
      console.error('Error creating badge:', error);
      throw new Error(
        `Failed to create badge: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Assigns a badge to one or more users
   *
   * @param badgeDefId - Badge definition event ID
   * @param userPubkeys - Array of public keys to award the badge to
   * @returns Promise with the badge award event
   */
  public async awardBadge(badgeDefId: string, userPubkeys: string[]): Promise<NDKEvent> {
    try {
      // Validate inputs
      if (!badgeDefId || !userPubkeys.length) {
        throw new Error('Badge ID and at least one recipient pubkey are required');
      }

      // Ensure all pubkeys are in hex format
      const hexPubkeys = userPubkeys.map(pubkey => {
        if (pubkey.startsWith('npub')) {
          try {
            const { data } = nip19.decode(pubkey);
            return data as string;
          } catch (e) {
            throw new Error(`Invalid npub: ${pubkey}`);
          }
        }
        return pubkey;
      });

      // Create a new event for badge awarding (kind:8)
      const event = new NDKEvent(this.ndk);
      event.kind = 8;

      // Generate a unique identifier for this award
      const uniqueId = crypto.randomUUID();

      // Set the badge award content
      const badgeAwardContent: BadgeAwardEvent = {
        d: uniqueId,
        a: badgeDefId,
        p: hexPubkeys,
      };

      event.content = '';
      event.tags = [['d', uniqueId], ['a', badgeDefId], ...hexPubkeys.map(pubkey => ['p', pubkey])];

      // Sign and publish the event
      await event.publish();

      return event;
    } catch (error) {
      console.error('Error awarding badge:', error);
      throw new Error(
        `Failed to award badge: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Accept or block a badge that was awarded to the current user
   *
   * @param awardEventId - The badge award event ID
   * @param action - 'accept' or 'block'
   * @returns Promise with the acceptance/blocking event
   */
  public async respondToBadgeAward(
    awardEventId: string,
    action: 'accept' | 'block'
  ): Promise<NDKEvent> {
    try {
      // Ensure the user is signed in
      if (!this.ndk.signer) {
        throw new Error('User must be signed in to accept or block badges');
      }

      // Create a new event for badge acceptance/blocking (kind:30008)
      const event = new NDKEvent(this.ndk);
      event.kind = 30008;
      event.content = '';

      // Add appropriate tag based on action
      const actionTag = action === 'accept' ? 'a' : 'b';
      event.tags = [[actionTag, awardEventId]];

      // Sign and publish the event
      await event.publish();

      return event;
    } catch (error) {
      console.error(`Error ${action}ing badge:`, error);
      throw new Error(
        `Failed to ${action} badge: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Query for badge definitions based on filters
   *
   * @param filters - Object containing query filters
   * @returns Promise with an array of badge definition events
   */
  public async queryBadgeDefinitions(
    filters: {
      creator?: string;
      since?: number;
      until?: number;
      limit?: number;
    } = {}
  ): Promise<BadgeDefinition[]> {
    try {
      const filter: NDKFilter = {
        kinds: [30009],
        limit: filters.limit || 20,
      };

      // Add optional filters
      if (filters.creator) {
        // Convert npub to hex if needed
        if (filters.creator.startsWith('npub')) {
          const { data } = nip19.decode(filters.creator);
          filter.authors = [data as string];
        } else {
          filter.authors = [filters.creator];
        }
      }

      if (filters.since) filter.since = filters.since;
      if (filters.until) filter.until = filters.until;

      // Subscribe to events
      const subscription = this.ndk.subscribe(filter);

      // Process the events
      const badges: BadgeDefinition[] = [];

      return new Promise(resolve => {
        subscription.on('event', (event: NDKEvent) => {
          try {
            const content = JSON.parse(event.content);
            const creator = event.pubkey;

            // Validate required fields
            if (!content.name || !content.description || !content.image) {
              console.warn('Invalid badge definition, missing required fields:', event.id);
              return;
            }

            // Convert creator pubkey to npub
            const creatorNpub = nip19.npubEncode(creator);

            // Create badge definition object
            badges.push({
              id: event.id,
              name: content.name,
              description: content.description,
              image: content.image,
              thumbnail: content.thumbnail,
              createdAt: event.created_at || 0,
              creator: creatorNpub,
            });
          } catch (e) {
            console.warn('Error processing badge definition:', e);
          }
        });

        subscription.on('eose', () => {
          resolve(badges);
        });
      });
    } catch (error) {
      console.error('Error querying badge definitions:', error);
      throw new Error(
        `Failed to query badge definitions: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Query for badge awards based on filters
   *
   * @param filters - Object containing query filters
   * @returns Promise with an array of badge awards
   */
  public async queryBadgeAwards(
    filters: {
      awardedTo?: string;
      awardedBy?: string;
      badgeDefId?: string;
      since?: number;
      until?: number;
      limit?: number;
    } = {}
  ): Promise<BadgeAward[]> {
    try {
      const filter: NDKFilter = {
        kinds: [8],
        limit: filters.limit || 20,
      };

      // Add optional filters
      if (filters.awardedBy) {
        // Convert npub to hex if needed
        if (filters.awardedBy.startsWith('npub')) {
          const { data } = nip19.decode(filters.awardedBy);
          filter.authors = [data as string];
        } else {
          filter.authors = [filters.awardedBy];
        }
      }

      if (filters.awardedTo) {
        // Convert npub to hex if needed
        let hexPubkey = filters.awardedTo;
        if (filters.awardedTo.startsWith('npub')) {
          const { data } = nip19.decode(filters.awardedTo);
          hexPubkey = data as string;
        }
        filter['#p'] = [hexPubkey];
      }

      if (filters.badgeDefId) {
        filter['#a'] = [filters.badgeDefId];
      }

      if (filters.since) filter.since = filters.since;
      if (filters.until) filter.until = filters.until;

      // Subscribe to events
      const subscription = this.ndk.subscribe(filter);

      // Process the events
      const awards: BadgeAward[] = [];

      // To track badge acceptance/blocking status
      const acceptanceStatus = new Map<string, 'accepted' | 'blocked'>();

      // First, get all acceptance/blocking events
      await this.getBadgeAcceptanceStatuses(acceptanceStatus);

      return new Promise(resolve => {
        subscription.on('event', (event: NDKEvent) => {
          try {
            // Extract the badge definition ID from the 'a' tag
            const badgeDefTag = event.tags.find(tag => tag[0] === 'a');
            if (!badgeDefTag || !badgeDefTag[1]) {
              console.warn('Invalid badge award, missing badge definition ID:', event.id);
              return;
            }

            const badgeDefId = badgeDefTag[1];

            // Extract awarded pubkeys from 'p' tags
            const awardedToPubkeys = event.tags.filter(tag => tag[0] === 'p').map(tag => tag[1]);

            if (!awardedToPubkeys.length) {
              console.warn('Invalid badge award, no recipients specified:', event.id);
              return;
            }

            // Convert awarder pubkey to npub
            const awarderNpub = nip19.npubEncode(event.pubkey);

            // Create badge award objects for each recipient
            for (const pubkey of awardedToPubkeys) {
              const recipientNpub = nip19.npubEncode(pubkey);

              // Determine acceptance status
              const statusKey = `${event.id}:${pubkey}`;
              const status = acceptanceStatus.get(statusKey) || 'pending';

              awards.push({
                badgeDefId,
                awardedTo: recipientNpub,
                awardedBy: awarderNpub,
                awardedAt: event.created_at || 0,
                status,
              });
            }
          } catch (e) {
            console.warn('Error processing badge award:', e);
          }
        });

        subscription.on('eose', () => {
          resolve(awards);
        });
      });
    } catch (error) {
      console.error('Error querying badge awards:', error);
      throw new Error(
        `Failed to query badge awards: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Helper method to get badge acceptance statuses
   *
   * @param statusMap - Map to store the acceptance statuses
   */
  private async getBadgeAcceptanceStatuses(
    statusMap: Map<string, 'accepted' | 'blocked'>
  ): Promise<void> {
    const filter: NDKFilter = {
      kinds: [30008],
    };

    const subscription = this.ndk.subscribe(filter);

    return new Promise(resolve => {
      subscription.on('event', (event: NDKEvent) => {
        try {
          // Check for acceptance tags
          const acceptTag = event.tags.find(tag => tag[0] === 'a');
          if (acceptTag && acceptTag[1]) {
            const awardId = acceptTag[1];
            statusMap.set(`${awardId}:${event.pubkey}`, 'accepted');
          }

          // Check for blocking tags
          const blockTag = event.tags.find(tag => tag[0] === 'b');
          if (blockTag && blockTag[1]) {
            const awardId = blockTag[1];
            statusMap.set(`${awardId}:${event.pubkey}`, 'blocked');
          }
        } catch (e) {
          console.warn('Error processing badge acceptance/blocking:', e);
        }
      });

      subscription.on('eose', () => {
        resolve();
      });
    });
  }

  /**
   * Get badges awarded to a specific user
   *
   * @param npub - The npub of the user
   * @returns Promise with an array of badge definitions with award status
   */
  public async getUserBadges(
    npub: string
  ): Promise<Array<BadgeDefinition & { status: 'pending' | 'accepted' | 'blocked' }>> {
    try {
      // Convert npub to hex pubkey
      let pubkey: string;
      if (npub.startsWith('npub')) {
        const { data } = nip19.decode(npub);
        pubkey = data as string;
      } else {
        pubkey = npub;
      }

      // Get all badge awards for this user
      const awards = await this.queryBadgeAwards({ awardedTo: pubkey });

      // Get details for each badge definition
      const badges: Array<BadgeDefinition & { status: 'pending' | 'accepted' | 'blocked' }> = [];

      // Use a map to deduplicate badges (user might have received the same badge multiple times)
      const badgeMap = new Map<
        string,
        { badge: BadgeDefinition; status: 'pending' | 'accepted' | 'blocked' }
      >();

      for (const award of awards) {
        // Skip if we already have this badge with an accepted status
        if (
          badgeMap.has(award.badgeDefId) &&
          badgeMap.get(award.badgeDefId)?.status === 'accepted'
        ) {
          continue;
        }

        try {
          // Get the badge definition
          const event = await this.ndk.fetchEvent({ ids: [award.badgeDefId] });

          if (event) {
            const content = JSON.parse(event.content);

            const badge: BadgeDefinition = {
              id: event.id,
              name: content.name,
              description: content.description,
              image: content.image,
              thumbnail: content.thumbnail,
              createdAt: event.created_at || 0,
              creator: nip19.npubEncode(event.pubkey),
            };

            badgeMap.set(award.badgeDefId, { badge, status: award.status });
          }
        } catch (e) {
          console.warn(`Error fetching badge definition ${award.badgeDefId}:`, e);
        }
      }

      // Convert the map to an array
      for (const [_, { badge, status }] of badgeMap.entries()) {
        badges.push({ ...badge, status });
      }

      return badges;
    } catch (error) {
      console.error('Error getting user badges:', error);
      throw new Error(
        `Failed to get user badges: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Check if a user has a specific badge
   *
   * @param npub - The npub of the user
   * @param badgeDefId - The badge definition event ID
   * @param acceptedOnly - If true, only consider accepted badges
   * @returns Promise with boolean indicating if user has the badge
   */
  public async userHasBadge(
    npub: string,
    badgeDefId: string,
    acceptedOnly: boolean = true
  ): Promise<boolean> {
    try {
      // Convert npub to hex pubkey
      let pubkey: string;
      if (npub.startsWith('npub')) {
        const { data } = nip19.decode(npub);
        pubkey = data as string;
      } else {
        pubkey = npub;
      }

      // Query badge awards
      const awards = await this.queryBadgeAwards({
        awardedTo: pubkey,
        badgeDefId,
      });

      // Check if any award matches the criteria
      return awards.some(award => {
        if (acceptedOnly) {
          return award.status === 'accepted';
        }
        return award.status === 'accepted' || award.status === 'pending';
      });
    } catch (error) {
      console.error('Error checking if user has badge:', error);
      throw new Error(
        `Failed to check if user has badge: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
