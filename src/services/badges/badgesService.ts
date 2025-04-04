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
            throw new Error(`Invalid npub: ${pubkey} ${e}`);
          }
        }
        return pubkey;
      });

      // Create a new event for badge awarding (kind:8)
      const event = new NDKEvent(this.ndk);
      event.kind = 8;

      // Generate a unique identifier for this award
      const uniqueId = crypto.randomUUID();

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
   * Query for badge awards based on filters. Optimized to fetch only relevant
   * acceptance/blocking statuses.
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
        limit: filters.limit || 100, // Increased default limit slightly
      };

      let specificRecipientHex: string | undefined = undefined;

      // Add optional filters for the kind 8 query
      if (filters.awardedBy) {
        filter.authors = [this.ensureHexPubkey(filters.awardedBy)];
      }

      if (filters.awardedTo) {
        specificRecipientHex = this.ensureHexPubkey(filters.awardedTo);
        filter['#p'] = [specificRecipientHex];
      }

      if (filters.badgeDefId) {
        filter['#a'] = [filters.badgeDefId];
      }

      if (filters.since) filter.since = filters.since;
      if (filters.until) filter.until = filters.until;

      // 1. Fetch the relevant badge award (kind:8) events
      const awardEvents = await this.ndk.fetchEvents(filter);
      if (!awardEvents || awardEvents.size === 0) {
        return []; // No awards found matching criteria
      }

      // 2. Collect data needed to fetch acceptance statuses
      const awardEventIds = new Set<string>();
      const potentialRecipientPubkeys = new Set<string>();

      awardEvents.forEach(event => {
        awardEventIds.add(event.id);
        // If we are filtering by a specific recipient, we only care about their status
        if (specificRecipientHex) {
          potentialRecipientPubkeys.add(specificRecipientHex);
        } else {
          // Otherwise, collect all recipients from the 'p' tags
          event.tags
            .filter(tag => tag[0] === 'p' && tag[1])
            .forEach(tag => potentialRecipientPubkeys.add(tag[1]));
        }
      });

      // 3. Fetch the relevant acceptance/blocking (kind:30008) events
      const acceptanceStatusMap = await this.getSpecificBadgeAcceptanceStatuses(
        awardEventIds,
        potentialRecipientPubkeys
      );

      // 4. Process the award events and combine with status information
      const awards: BadgeAward[] = [];

      awardEvents.forEach(event => {
        try {
          const badgeDefTag = event.tags.find(tag => tag[0] === 'a' && tag[1]);
          if (!badgeDefTag) {
            console.warn('Skipping award event with missing "a" tag:', event.id);
            return;
          }
          const badgeDefId = badgeDefTag[1];
          const awarderNpub = nip19.npubEncode(event.pubkey);
          const awardedAt = event.created_at || 0;

          const recipientTags = event.tags.filter(tag => tag[0] === 'p' && tag[1]);

          if (!recipientTags.length) {
            console.warn('Skipping award event with no "p" tags:', event.id);
            return;
          }

          for (const pTag of recipientTags) {
            const recipientHex = pTag[1];

            // If filtering by a specific recipient, skip if this pTag doesn't match
            if (specificRecipientHex && recipientHex !== specificRecipientHex) {
              continue;
            }

            const recipientNpub = nip19.npubEncode(recipientHex);

            // Determine status: Look up in the map using AwardID:RecipientHex
            const statusKey = `${event.id}:${recipientHex}`;
            const status = acceptanceStatusMap.get(statusKey) || 'pending';
            awards.push({
              badgeDefId,
              awardedTo: recipientNpub,
              awardedBy: awarderNpub,
              awardedAt,
              status,
            });
          }
        } catch (e) {
          console.warn('Error processing individual badge award event:', event.id, e);
        }
      });

      return awards;
    } catch (error) {
      console.error('Error querying badge awards:', error);
      throw new Error(
        `Failed to query badge awards: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Helper method to fetch and process relevant badge acceptance/blocking statuses.
   *
   * @param awardEventIds - Set of kind 8 event IDs to check statuses for.
   * @param recipientPubkeys - Set of potential recipient pubkeys (authors of kind 30008).
   * @returns Map where key is "awardEventId:recipientHexPubkey" and value is status.
   */
  private async getSpecificBadgeAcceptanceStatuses(
    awardEventIds: Set<string>,
    recipientPubkeys: Set<string>
  ): Promise<Map<string, 'accepted' | 'blocked'>> {
    const statusMap = new Map<string, 'accepted' | 'blocked'>();

    if (awardEventIds.size === 0 || recipientPubkeys.size === 0) {
      return statusMap; // Nothing to check
    }

    // Create a filter for kind 30008 events
    // Authored by the potential recipients
    // Referencing (via 'a' or 'b' tag) one of the specified award event IDs
    // Note: Filtering by tag *value* (#a or #b) is not universally supported or efficient
    // on all relays. Filtering by author is the most reliable first step.
    // We will filter client-side based on the tag value.
    const acceptanceFilter: NDKFilter = {
      kinds: [30008],
      authors: Array.from(recipientPubkeys),
      // We *could* add '#a': Array.from(awardEventIds) and '#b': Array.from(awardEventIds)
      // but it might not work well. Fetching by author and filtering locally is safer.
      // Let's set a reasonable limit, assuming not *too* many accept/reject events per user.
      limit: recipientPubkeys.size * 10, // Heuristic limit
    };

    try {
      const acceptanceEvents = await this.ndk.fetchEvents(acceptanceFilter);

      acceptanceEvents.forEach(event => {
        const authorHex = event.pubkey;

        // Check for acceptance tag ('a')
        const acceptTag = event.tags.find(tag => tag[0] === 'a' && tag[1]);
        if (acceptTag && awardEventIds.has(acceptTag[1])) {
          // Check if it references a relevant award
          const awardId = acceptTag[1];
          const statusKey = `${awardId}:${authorHex}`;
          // Add or update status (latest event wins if multiple exist)
          statusMap.set(statusKey, 'accepted');
        }

        // Check for blocking tag ('b')
        const blockTag = event.tags.find(tag => tag[0] === 'b' && tag[1]);
        if (blockTag && awardEventIds.has(blockTag[1])) {
          // Check if it references a relevant award
          const awardId = blockTag[1];
          const statusKey = `${awardId}:${authorHex}`;
          // Add or update status
          statusMap.set(statusKey, 'blocked');
        }
      });
    } catch (error) {
      console.error('Error fetching badge acceptance statuses:', error);
      // Proceed without status info or re-throw depending on desired behavior
    }

    return statusMap;
  }

  /**
   * Helper to ensure a pubkey is in hex format.
   * @param pubkey - npub or hex pubkey
   * @returns Hex pubkey
   * @throws Error if npub is invalid
   */
  private ensureHexPubkey(pubkey: string): string {
    if (pubkey.startsWith('npub')) {
      try {
        const { data } = nip19.decode(pubkey);
        if (typeof data !== 'string') {
          throw new Error(`Decoded data is not a string for npub: ${pubkey}`);
        }
        return data;
      } catch (e) {
        throw new Error(`Invalid npub: ${pubkey} ${e}`);
      }
    }
    // Add basic hex validation if desired, e.g., check length and characters
    // if (!/^[0-9a-fA-F]{64}$/.test(pubkey)) {
    //     throw new Error(`Invalid hex pubkey format: ${pubkey}`);
    // }
    return pubkey;
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  /**
   * Gets badges created by a specific user
   *
   * @param creatorPubkey - The public key of the creator
   * @returns Promise with array of badge definitions created by this user
   */
  public async getCreatedBadges(creatorPubkey: string): Promise<BadgeDefinition[]> {
    try {
      // Convert hex to npub if needed
      if (!creatorPubkey.startsWith('npub')) {
        creatorPubkey = nip19.npubEncode(creatorPubkey);
      }

      // Use the existing query method but filter by creator
      return this.queryBadgeDefinitions({
        creator: creatorPubkey,
        limit: 50,
      });
    } catch (error) {
      console.error('Error getting created badges:', error);
      throw new Error(
        `Failed to get created badges: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Gets detailed information about badge recipients
   *
   * @param badgeId - The badge definition ID
   * @returns Promise with array of badge awards with recipient information
   */
  public async getBadgeRecipients(badgeId: string): Promise<BadgeAward[]> {
    try {
      // Use the existing query method but filter by badge ID
      return this.queryBadgeAwards({
        badgeDefId: badgeId,
        limit: 100,
      });
    } catch (error) {
      console.error('Error getting badge recipients:', error);
      throw new Error(
        `Failed to get badge recipients: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Gets the current user's public key if signed in
   *
   * @returns Promise with the user's public key or null if not signed in
   */
  public async getCurrentUserPubkey(): Promise<string | null> {
    try {
      if (!this.ndk.signer) {
        return null;
      }

      const user = await this.ndk.signer.user();
      return user.pubkey || null;
    } catch (error) {
      console.error('Error getting current user pubkey:', error);
      return null;
    }
  }

  /**
   * Gets pending badge awards for the current user
   * @param userPubkey - The pubkey to check pending badges for (npub or hex)
   * @returns Promise with array of badge definitions with pending status
   */
  public async getPendingBadgeAwards(
    userPubkey: string
  ): Promise<Array<BadgeDefinition & { status: 'pending'; awardId: string; awardedAt: Date }>> {
    try {
      // Convert npub to hex if needed
      let hexPubkey = userPubkey;
      if (userPubkey.startsWith('npub')) {
        const { data } = nip19.decode(userPubkey);
        hexPubkey = data as string;
      }

      // Create a filter specifically for kind:8 (badge award) events where this user is tagged
      const filter: NDKFilter = {
        kinds: [8],
        '#p': [hexPubkey],
        // Look back about a month for pending badges
        since: Math.floor(Date.now() / 1000) - 86400 * 30,
      };

      // Fetch the award events
      const events = await this.ndk.fetchEvents(filter);
      const pendingBadges: Array<
        BadgeDefinition & {
          status: 'pending';
          awardId: string;
          awardedAt: Date;
        }
      > = [];

      // Map to track badges we've already processed
      const processedAwardIds = new Map<string, boolean>();

      // First, get the acceptance/blocking events from this user
      const acceptanceFilter: NDKFilter = {
        kinds: [30008],
        authors: [hexPubkey],
      };

      const acceptanceEvents = await this.ndk.fetchEvents(acceptanceFilter);
      // Create a Set of award IDs that have already been responded to
      const respondedAwardIds = new Set<string>();

      for (const event of acceptanceEvents) {
        // Check for acceptance tags
        const acceptTag = event.tags.find(tag => tag[0] === 'a');
        if (acceptTag && acceptTag[1]) {
          respondedAwardIds.add(acceptTag[1]);
        }

        // Check for blocking tags
        const blockTag = event.tags.find(tag => tag[0] === 'b');
        if (blockTag && blockTag[1]) {
          respondedAwardIds.add(blockTag[1]);
        }
      }

      // Process each award event
      for (const event of events) {
        // Skip if we've already processed this award
        if (processedAwardIds.has(event.id)) continue;
        processedAwardIds.set(event.id, true);
        // Skip if this user has already accepted or blocked this award
        if (respondedAwardIds.has(event.id)) continue;

        // Get badge definition from the 'a' tag
        const badgeDefTag = event.tags.find(tag => tag[0] === 'a');
        if (!badgeDefTag || badgeDefTag.length < 2) continue;

        const badgeDefId = badgeDefTag[1];

        try {
          // Get the badge definition
          const badgeEvent = await this.ndk.fetchEvent({ ids: [badgeDefId] });

          if (badgeEvent) {
            const content = JSON.parse(badgeEvent.content);

            pendingBadges.push({
              id: badgeEvent.id,
              name: content.name,
              description: content.description,
              image: content.image,
              thumbnail: content.thumbnail,
              createdAt: badgeEvent.created_at || 0,
              creator: nip19.npubEncode(badgeEvent.pubkey),
              status: 'pending',
              awardId: event.id,
              awardedAt: new Date((event?.created_at || 0) * 1000),
            });
          }
        } catch (e) {
          console.warn(`Error fetching badge definition ${badgeDefId}:`, e);
        }
      }

      console.log(`Found ${pendingBadges.length} pending badges for user ${userPubkey}`);
      return pendingBadges;
    } catch (error) {
      console.error('Error fetching pending badge awards:', error);
      throw new Error(
        `Failed to fetch pending badges: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
