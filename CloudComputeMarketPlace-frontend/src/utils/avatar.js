/**
 * Generate a DiceBear pixel-art avatar URL using the provided username as a seed
 * @param {string} username - Username to use as seed for the avatar
 * @returns {string} URL of the generated avatar
 */
export const generateAvatarUrl = (username) => {
  // Use a default seed if username is undefined/null
  const seed = username || 'anonymous';
  return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(seed)}`;
};
