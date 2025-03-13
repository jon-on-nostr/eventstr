import NDK, { NDKEvent, NDKFilter, NDKNip07Signer, NDKUser } from '@nostr-dev-kit/ndk';
import { nip19 } from 'nostr-tools';
import DOMPurify from 'dompurify';

// Initialize NDK with relays
const relays = [
  'wss://relay.damus.io',
  'wss://relay.nostr.band',
  'wss://nos.lol',
  'wss://relay.snort.social',
];

// Badge-related event kinds
const BADGE_DEFINITION = 30009; // NIP-58 Badge Definition
const BADGE_AWARD = 8; // NIP-58 Badge Award

// Create NDK instance
const ndk = new NDK({ explicitRelayUrls: relays });

// Initialize NDK
export const initializeNDK = async (): Promise<void> => {
  try {
    await ndk.connect();
    console.log('Connected to Nostr relays');
  } catch (error) {
    console.error('Failed to connect to Nostr relays:', error);
    throw error;
  }
};

// Badge interface
export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  issuer: string;
  created: string;
  thumb?: string;
  eventId?: string;
}

// Add sanitization utility
const sanitizeString = (input: string | undefined | null): string => {
  if (!input) return '';

  // First use DOMPurify to remove any HTML/script tags
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
  });

  // Then escape any remaining special characters
  return sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Validate and sanitize image URLs
const sanitizeImageUrl = (url: string | undefined | null): string => {
  if (!url) return 'https://placehold.co/200x200/1a1a1a/00ff00?text=BADGE';

  try {
    // Check if it's a valid URL
    const parsedUrl = new URL(url);

    // Only allow specific protocols
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      return 'https://placehold.co/200x200/1a1a1a/00ff00?text=BADGE';
    }

    // Optional: whitelist domains
    // const allowedDomains = ['i.imgur.com', 'images.nostr.build', ...];
    // if (!allowedDomains.includes(parsedUrl.hostname)) {
    //   return 'https://placehold.co/200x200/1a1a1a/00ff00?text=BADGE';
    // }

    return url;
  } catch (e) {
    // If URL parsing fails, return default
    return 'https://placehold.co/200x200/1a1a1a/00ff00?text=BADGE';
  }
};

// Convert NDK event to Badge object
const eventToBadge = (event: NDKEvent): Badge => {
  console.log('Processing event:', event);

  try {
    // Handle case where content is empty or not valid JSON
    let parsedContent: Partial<Badge> = {};

    if (event.content && event.content.trim()) {
      try {
        parsedContent = JSON.parse(event.content);
      } catch (parseError) {
        console.warn('Failed to parse event content as JSON:', parseError);
        // Use the content as name if it's not JSON
        parsedContent = {
          name: event.content.substring(0, 50),
          description: event.content,
        };
      }
    }

    // Extract and sanitize name from tags if not in content
    if (!parsedContent.name) {
      const nameTag = event.tags.find(tag => tag[0] === 'name' || tag[0] === 'title');
      if (nameTag && nameTag[1]) {
        parsedContent.name = nameTag[1];
      }
    }

    // Extract and sanitize description from tags if not in content
    if (!parsedContent.description) {
      const descTag = event.tags.find(tag => tag[0] === 'description' || tag[0] === 'summary');
      if (descTag && descTag[1]) {
        parsedContent.description = descTag[1];
      }
    }

    // Extract and sanitize image from tags if not in content
    if (!parsedContent.image && !parsedContent.thumb) {
      const imageTag = event.tags.find(tag => tag[0] === 'image' || tag[0] === 'picture');
      if (imageTag && imageTag[1]) {
        parsedContent.image = imageTag[1];
      }
    }

    return {
      id: event.id,
      name: sanitizeString(parsedContent.name) || 'Unnamed Badge',
      description: sanitizeString(parsedContent.description) || 'No description provided',
      image: sanitizeImageUrl(parsedContent.image || parsedContent.thumb),
      issuer: event.pubkey,
      created: new Date((event.created_at || 0) * 1000).toISOString().split('T')[0],
      eventId: event.id,
    };
  } catch (error) {
    console.error('Error creating badge from event:', error, 'Event:', event);
    return {
      id: event.id || 'unknown',
      name: 'Invalid Badge',
      description: 'Could not parse badge data',
      image: 'https://placehold.co/200x200/1a1a1a/ff0000?text=ERROR',
      issuer: event.pubkey || 'unknown',
      created: new Date((event.created_at || 0) * 1000).toISOString().split('T')[0],
      eventId: event.id,
    };
  }
};

// Search badges by npub
export const searchBadgesByNpub = async (
  npub: string
): Promise<{
  badgesCreated: Badge[];
  badgesReceived: Badge[];
  error?: string;
}> => {
  try {
    // Validate and convert npub to hex pubkey
    let pubkey: string;
    try {
      if (npub.startsWith('npub')) {
        const { data } = nip19.decode(npub);
        pubkey = data as string;
      } else {
        // Assume it's already a hex pubkey
        pubkey = npub;
      }
    } catch (error) {
      return {
        badgesCreated: [],
        badgesReceived: [],
        error: 'Invalid npub format',
      };
    }

    // Create NDK user from pubkey
    const user = new NDKUser({ pubkey });

    // 1. Find badges created by this user
    const createdFilter: NDKFilter = {
      kinds: [BADGE_DEFINITION],
      authors: [pubkey],
      limit: 50,
    };

    const createdEvents = await ndk.fetchEvents(createdFilter);
    const badgesCreated = Array.from(createdEvents).map(eventToBadge);

    // 2. Find badges awarded to this user
    const receivedFilter: NDKFilter = {
      kinds: [BADGE_AWARD],
      '#p': [pubkey],
      limit: 50,
    };

    const receivedEvents = await ndk.fetchEvents(receivedFilter);

    // For each badge award, we need to fetch the badge definition
    const badgeDefinitionIds = new Set<string>();
    receivedEvents.forEach(event => {
      const eTag = event.tags.find(tag => tag[0] === 'e');
      if (eTag && eTag[1]) {
        badgeDefinitionIds.add(eTag[1]);
      }
    });

    // Fetch badge definitions
    const definitionFilter: NDKFilter = {
      kinds: [BADGE_DEFINITION],
      ids: Array.from(badgeDefinitionIds),
    };

    const definitionEvents = await ndk.fetchEvents(definitionFilter);
    const badgesReceived = Array.from(definitionEvents).map(eventToBadge);

    return {
      badgesCreated,
      badgesReceived,
    };
  } catch (error) {
    console.error('Error searching badges:', error);
    return {
      badgesCreated: [],
      badgesReceived: [],
      error: 'Failed to search badges. Please try again.',
    };
  }
};

// Get user profile
export const getUserProfile = async (
  npub: string
): Promise<{
  name?: string;
  displayName?: string;
  picture?: string;
  error?: string;
}> => {
  try {
    // Validate and convert npub to hex pubkey
    let pubkey: string;
    try {
      if (npub.startsWith('npub')) {
        const { data } = nip19.decode(npub);
        pubkey = data as string;
      } else {
        // Assume it's already a hex pubkey
        pubkey = npub;
      }
    } catch (error) {
      return { error: 'Invalid npub format' };
    }

    // Create NDK user from pubkey
    const user = new NDKUser({ pubkey });

    // Fetch user profile
    await user.fetchProfile();

    return {
      name: user.profile?.name,
      displayName: user.profile?.displayName,
      picture: user.profile?.image,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { error: 'Failed to fetch user profile' };
  }
};

// Sign in with NIP-07 extension (e.g., Alby, nos2x)
export const signInWithExtension = async (): Promise<{
  pubkey?: string;
  npub?: string;
  error?: string;
}> => {
  try {
    // Check if window.nostr is available (NIP-07)
    if (typeof window !== 'undefined' && window.nostr) {
      const signer = new NDKNip07Signer();
      ndk.signer = signer;

      // Get public key
      const user = await signer.user();
      const npub = nip19.npubEncode(user.pubkey);

      return {
        pubkey: user.pubkey,
        npub,
      };
    } else {
      return {
        error:
          'No Nostr extension found. Please install Alby, nos2x, or another NIP-07 compatible extension.',
      };
    }
  } catch (error) {
    console.error('Error signing in with extension:', error);
    return { error: 'Failed to sign in with extension' };
  }
};

// // Add window.nostr type for TypeScript
// declare global {
//   interface Window {
//     nostr?: {
//       getPublicKey: () => Promise<string>;
//       signEvent: (event: any) => Promise<any>;
//     };
//   }
// }

// Get all badges with pagination and filtering options
export const getAllBadges = async ({
  limit = 20,
  since,
  until,
  authors,
}: {
  limit?: number;
  since?: number;
  until?: number;
  authors?: string[];
} = {}): Promise<{
  badges: Badge[];
  error?: string;
}> => {
  try {
    // Enforce reasonable limits
    const safeLimit = Math.min(Math.max(1, limit), 3);

    console.log(`Fetching badges with limit: ${safeLimit}`);

    // Create filter for badge definitions
    const filter: NDKFilter = {
      kinds: [BADGE_DEFINITION],
      limit: safeLimit,
    };

    // Add optional filters if provided
    if (since) filter.since = since;
    if (until) filter.until = until;
    if (authors && authors.length > 0) filter.authors = authors;

    console.log('Filter being used:', filter);

    // Fetch events
    const events = await ndk.fetchEvents(filter);

    console.log(`Received ${events.size} events from relays`);

    // Convert events to badges and ensure we respect the limit
    const badges = Array.from(events).map(eventToBadge).slice(0, safeLimit); // Explicitly enforce the limit here

    console.log(`Returning ${badges.length} badges after processing`);

    return { badges };
  } catch (error) {
    console.error('Error fetching badges:', error);
    return {
      badges: [],
      error: 'Failed to fetch badges. Please try again.',
    };
  }
};

// Get trending badges based on award count
export const getTrendingBadges = async (
  limit = 20
): Promise<{
  badges: Badge[];
  error?: string;
}> => {
  try {
    // Enforce reasonable limits
    const safeLimit = Math.min(Math.max(1, limit), 100);

    // First, get recent badge awards
    const awardFilter: NDKFilter = {
      kinds: [BADGE_AWARD],
      limit: 500, // Get a large sample to analyze
      since: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60, // Last 30 days
    };

    const awardEvents = await ndk.fetchEvents(awardFilter);

    // Count badge references
    const badgeCounts = new Map<string, number>();

    awardEvents.forEach(event => {
      const eTag = event.tags.find(tag => tag[0] === 'e');
      if (eTag && eTag[1]) {
        const badgeId = eTag[1];
        badgeCounts.set(badgeId, (badgeCounts.get(badgeId) || 0) + 1);
      }
    });

    // Sort by count and take top N
    const topBadgeIds = Array.from(badgeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, safeLimit)
      .map(entry => entry[0]);

    if (topBadgeIds.length === 0) {
      return { badges: [] };
    }

    // Fetch the actual badge definitions
    const badgeFilter: NDKFilter = {
      kinds: [BADGE_DEFINITION],
      ids: topBadgeIds,
    };

    const badgeEvents = await ndk.fetchEvents(badgeFilter);

    // Convert to badges and sort by award count
    const badges = Array.from(badgeEvents)
      .map(event => ({
        ...eventToBadge(event),
        awardCount: badgeCounts.get(event.id) || 0,
      }))
      .sort((a, b) => (b as any).awardCount - (a as any).awardCount);

    return { badges };
  } catch (error) {
    console.error('Error fetching trending badges:', error);
    return {
      badges: [],
      error: 'Failed to fetch trending badges. Please try again.',
    };
  }
};

// Get badges by tag or search term
export const searchBadgesByTerm = async (
  term: string,
  limit = 20
): Promise<{
  badges: Badge[];
  error?: string;
}> => {
  try {
    if (!term.trim()) {
      return { badges: [], error: 'Search term is required' };
    }

    // Enforce reasonable limits
    const safeLimit = Math.min(Math.max(1, limit), 100);

    // Create filter for badge definitions
    const filter: NDKFilter = {
      kinds: [BADGE_DEFINITION],
      limit: safeLimit * 5, // Get more to filter client-side
    };

    // Add tag search if term starts with #
    if (term.startsWith('#')) {
      const tag = term.substring(1).toLowerCase();
      filter['#t'] = [tag];
    }

    // Fetch events
    const events = await ndk.fetchEvents(filter);

    // Filter and convert events to badges
    const badges = Array.from(events)
      .filter(event => {
        // If we're already filtering by tag, no need for additional filtering
        if (term.startsWith('#')) return true;

        try {
          const content = JSON.parse(event.content);
          const searchTerm = term.toLowerCase();

          // Search in name, description, and tags
          return (
            (content.name && content.name.toLowerCase().includes(searchTerm)) ||
            (content.description && content.description.toLowerCase().includes(searchTerm)) ||
            (Array.isArray(content.tags) &&
              content.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm)))
          );
        } catch {
          return false;
        }
      })
      .map(eventToBadge)
      .slice(0, safeLimit);

    return { badges };
  } catch (error) {
    console.error('Error searching badges by term:', error);
    return {
      badges: [],
      error: 'Failed to search badges. Please try again.',
    };
  }
};

// Get badge details including stats
export const getBadgeDetails = async (
  badgeId: string
): Promise<{
  badge?: Badge & {
    awardCount: number;
    recentRecipients: Array<{ pubkey: string; timestamp: number }>;
  };
  error?: string;
}> => {
  console.log('het badge details');
  try {
    // Fetch the badge definition
    const badgeFilter: NDKFilter = {
      kinds: [BADGE_DEFINITION],
      ids: [badgeId],
    };

    const badgeEvents = await ndk.fetchEvents(badgeFilter);

    if (badgeEvents.size === 0) {
      return { error: 'Badge not found' };
    }

    const badgeEvent = Array.from(badgeEvents)[0];
    const badge = eventToBadge(badgeEvent);

    // Fetch award events for this badge
    const awardFilter: NDKFilter = {
      kinds: [BADGE_AWARD],
      '#e': [badgeId],
      limit: 100,
    };

    const awardEvents = await ndk.fetchEvents(awardFilter);

    // Process award events
    const recipients = new Set<string>();
    const recentRecipients: Array<{ pubkey: string; timestamp: number }> = [];

    awardEvents.forEach(event => {
      const pTags = event.tags.filter(tag => tag[0] === 'p');

      pTags.forEach(tag => {
        if (tag[1]) {
          recipients.add(tag[1]);
          recentRecipients.push({
            pubkey: tag[1],
            timestamp: event.created_at || 0,
          });
        }
      });
    });

    // Sort recipients by timestamp (most recent first) and take top 10
    const sortedRecipients = recentRecipients
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);

    return {
      badge: {
        ...badge,
        awardCount: recipients.size,
        recentRecipients: sortedRecipients,
      },
    };
  } catch (error) {
    console.error('Error fetching badge details:', error);
    return {
      error: 'Failed to fetch badge details. Please try again.',
    };
  }
};
