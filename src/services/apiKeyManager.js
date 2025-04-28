/**
 * Manages a pool of API keys with rate limiting functionality
 */
class ApiKeyManager {
  /**
   * Create a new API key manager
   * @param {string[]} keys - Array of API keys
   * @param {number} requestsPerMinute - Maximum requests per minute per key
   */
  constructor(keys, requestsPerMinute) {
    this.keys = keys.map((key) => ({
      key,
      requestsThisMinute: 0,
      resetTime: Date.now() + 60000,
    }));
    this.requestsPerMinute = requestsPerMinute;
  }

  /**
   * Get the best available API key
   * @returns {Object} Object containing key and waitTime
   */
  getBestKey() {
    const now = Date.now();

    // Reset counters for keys that have passed their minute window
    this.keys.forEach((keyData) => {
      if (now > keyData.resetTime) {
        keyData.requestsThisMinute = 0;
        keyData.resetTime = now + 60000;
      }
    });

    // Sort keys by usage (least used first)
    const sortedKeys = [...this.keys].sort(
      (a, b) => a.requestsThisMinute - b.requestsThisMinute
    );

    // If the least used key is still at limit, we need to wait
    if (sortedKeys[0].requestsThisMinute >= this.requestsPerMinute) {
      const waitTime = sortedKeys[0].resetTime - now;
      return { key: null, waitTime };
    }

    // Return the least used key and increment its counter
    sortedKeys[0].requestsThisMinute++;
    return { key: sortedKeys[0].key, waitTime: 0 };
  }
}

module.exports = ApiKeyManager;
