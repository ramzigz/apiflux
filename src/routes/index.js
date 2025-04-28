// src/routes/index.js

/**
 * Configure all API routes
 * @param {Object} app - Express application instance
 * @param {Object} queueManager - RequestQueueManager instance
 * @param {Object} config - Application configuration
 */
function setupRoutes(app, queueManager, config) {
  // Main processing endpoint
  app.post("/process", async (req, res) => {
    const startTime = Date.now();
    const requestCount = config.requestsPerIncoming(config.testMode);

    try {
      // Create the promises for third-party API requests
      const requests = Array(requestCount)
        .fill()
        .map(() => queueManager.addRequest());

      // Wait for all requests to complete
      const results = await Promise.all(requests);

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      console.log(
        `Request completed in ${processingTime}ms with ${requestCount} API calls`
      );

      res.json({
        results,
        processingTime,
        requestCount,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Failed to process request" });
    }
  });

  // Health check endpoint with configuration details
  app.get("/health", (req, res) => {
    res.json({
      status: "ok",
      mode: config.testMode ? "test" : "full-scale",
      requestsPerIncoming: config.requestsPerIncoming(config.testMode),
      apiKeys: config.apiKeys.length,
      rateLimit: config.rateLimit,
      latency: {
        min: config.minLatency(config.testMode),
        max: config.maxLatency(config.testMode),
      },
      batchSize: config.batchSize,
    });
  });
}

module.exports = setupRoutes;
