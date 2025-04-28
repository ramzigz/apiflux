// src/server.js
const initializeApp = require("./app");
const config = require("./config");

// Initialize the application
const app = initializeApp();

// Start the server
app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
  console.log(`Running in ${config.testMode ? "TEST" : "FULL-SCALE"} mode`);
  console.log(
    `Requests per incoming call: ${config.requestsPerIncoming(config.testMode)}`
  );
  console.log(
    `API latency: ${config.minLatency(config.testMode)}-${config.maxLatency(
      config.testMode
    )}ms`
  );
  console.log(`Rate limit: ${config.rateLimit} requests per minute per key`);
  console.log(`API keys: ${config.apiKeys.length}`);
});
