// src/app.js
const express = require("express");
const config = require("./config");
const setupRoutes = require("./routes");
const ApiKeyManager = require("./services/apiKeyManager");
const ThirdPartyApiSimulator = require("./services/thirdPartyApiSimulator");
const RequestQueueManager = require("./services/requestQueueManager");

/**
 * Initialize the application
 * @returns {Object} Express application instance
 */
function initializeApp() {
  const app = express();

  // Configure middleware
  app.use(express.json());

  // Initialize services
  const apiKeyManager = new ApiKeyManager(config.apiKeys, config.rateLimit);

  const apiSimulator = new ThirdPartyApiSimulator(
    config.minLatency(config.testMode),
    config.maxLatency(config.testMode)
  );

  const queueManager = new RequestQueueManager(
    apiKeyManager,
    apiSimulator,
    config.batchSize
  );

  // Setup routes
  setupRoutes(app, queueManager, config);

  return app;
}

module.exports = initializeApp;
