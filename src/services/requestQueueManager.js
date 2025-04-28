// src/services/RequestQueueManager.js

/**
 * Manages a queue of API requests with rate limiting
 */
class RequestQueueManager {
  /**
   * Create a new request queue manager
   * @param {Object} apiKeyManager - Instance of ApiKeyManager
   * @param {Object} apiSimulator - Instance of ThirdPartyApiSimulator
   * @param {number} batchSize - Number of requests to process in each batch
   */
  constructor(apiKeyManager, apiSimulator, batchSize = 10) {
    this.apiKeyManager = apiKeyManager;
    this.apiSimulator = apiSimulator;
    this.batchSize = batchSize;
    this.requestQueue = [];
    this.isProcessing = false;
  }

  /**
   * Process requests in batches that respect rate limits
   * @returns {Promise<void>}
   */
  async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return;

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const { key, waitTime } = this.apiKeyManager.getBestKey();

      if (waitTime > 0) {
        // Wait until we can use a key again
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      // We have an available key, process a batch of requests
      const batch = this.requestQueue.splice(
        0,
        Math.min(this.batchSize, this.requestQueue.length)
      );

      // Process the batch requests in parallel
      await Promise.all(
        batch.map(async ({ resolve }) => {
          try {
            const result = await this.apiSimulator.makeRequest();
            resolve(result);
          } catch (error) {
            resolve("error"); // In a real system, we'd handle errors better
          }
        })
      );
    }

    this.isProcessing = false;
  }

  /**
   * Add a request to the queue
   * @returns {Promise<string>} Promise resolving to the API response
   */
  addRequest() {
    return new Promise((resolve) => {
      this.requestQueue.push({ resolve });

      // Start processing if not already running
      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }
}

module.exports = RequestQueueManager;
