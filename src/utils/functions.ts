// Function to format pubkeys for display
export const formatPubkey = (pubkey: string, options?: { prefix?: number; suffix?: number }) => {
  const prefix = options?.prefix || 7;
  const suffix = options?.suffix || 3;

  if (!pubkey || pubkey.length < prefix + suffix) {
    return pubkey;
  }

  return `${pubkey.substring(0, prefix)}...${pubkey.substring(pubkey.length - suffix)}`;
};
