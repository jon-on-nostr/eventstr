// Define types for badge-related data structures according to NIP-58
export interface BadgeDefinition {
  id: string; // The badge event ID
  name: string; // Badge name
  description: string; // Badge description
  image: string; // Badge image URL
  createdAt: number; // Creation timestamp
  creator: string; // Creator's npub
  thumbnail?: string; // Optional thumbnail URL
  awardId?: string;
}
