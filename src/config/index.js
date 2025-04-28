// src/config/index.js
require("dotenv").config();

/**
 * Application configuration loaded from environment variables
 */
const config = {
  // Server settings
  port: process.env.PORT || 3000,

  // Test mode flag
  testMode: process.env.TEST_MODE === "true",

  // Request count settings
  requestsPerIncoming: function (testMode) {
    return testMode
      ? parseInt(process.env.TEST_REQUESTS_COUNT || 50)
      : parseInt(process.env.PROD_REQUESTS_COUNT || 2000);
  },

  // API latency settings
  minLatency: function (testMode) {
    return testMode
      ? parseInt(process.env.TEST_MIN_LATENCY || 10)
      : parseInt(process.env.PROD_MIN_LATENCY || 500);
  },

  maxLatency: function (testMode) {
    return testMode
      ? parseInt(process.env.TEST_MAX_LATENCY || 50)
      : parseInt(process.env.PROD_MAX_LATENCY || 3000);
  },

  // API key settings
  rateLimit: parseInt(process.env.RATE_LIMIT || 1000),
  apiKeys: (process.env.API_KEYS || "key1,key2,key3").split(","),

  // Queue settings
  batchSize: parseInt(process.env.BATCH_SIZE || 10),
};

module.exports = config;
