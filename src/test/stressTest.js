// src/test/stressTest.js
require("dotenv").config();
const axios = require("axios");

// Load configuration from environment variables
const config = {
  concurrentRequests: parseInt(process.env.CONCURRENT_REQUESTS || 100),
  url: `http://localhost:${process.env.PORT || 3000}/process`,
  healthUrl: `http://localhost:${process.env.PORT || 3000}/health`,
  detailedLogs: process.env.DETAILED_LOGS !== "false",
  timeout: parseInt(process.env.REQUEST_TIMEOUT || 60000),
};

/**
 * Run a stress test against the API
 */
async function runStressTest() {
  console.log(
    `Starting stress test with ${config.concurrentRequests} concurrent requests...`
  );

  // First check server health and configuration
  try {
    const healthCheck = await axios.get(config.healthUrl);
    console.log("Server configuration:", healthCheck.data);
    console.log(
      `Each request will trigger ${healthCheck.data.requestsPerIncoming} third-party API calls`
    );
  } catch (error) {
    console.error("Error connecting to server. Is it running?");
    return;
  }

  const startTime = Date.now();

  // Create array of concurrent requests
  const requests = Array(config.concurrentRequests)
    .fill()
    .map(async (_, index) => {
      const requestStart = Date.now();
      try {
        const response = await axios.post(
          config.url,
          {},
          { timeout: config.timeout }
        );
        const requestEnd = Date.now();

        return {
          requestId: index + 1,
          success: true,
          responseCount: response.data.results.length,
          requestCount: response.data.requestCount,
          processingTime: requestEnd - requestStart,
          serverReportedTime: response.data.processingTime,
        };
      } catch (error) {
        return {
          requestId: index + 1,
          success: false,
          error: error.message,
        };
      }
    });

  // Execute all requests concurrently
  const results = await Promise.all(requests);

  const endTime = Date.now();
  const totalTime = endTime - startTime;

  // Calculate statistics
  const successfulRequests = results.filter((r) => r.success);
  const failedRequests = results.filter((r) => !r.success);

  if (successfulRequests.length === 0) {
    console.log("\n❌ ALL REQUESTS FAILED");
    console.log("First error:", failedRequests[0].error);
    return;
  }

  const processingTimes = successfulRequests.map((r) => r.processingTime);
  const avgProcessingTime =
    processingTimes.reduce((sum, time) => sum + time, 0) /
    processingTimes.length;
  const minTime = Math.min(...processingTimes);
  const maxTime = Math.max(...processingTimes);

  // Log results
  console.log("\n========== STRESS TEST RESULTS ==========");
  console.log(
    `Total test time: ${totalTime}ms (${(totalTime / 1000).toFixed(2)}s)`
  );
  console.log(
    `Successful requests: ${successfulRequests.length}/${config.concurrentRequests}`
  );
  console.log(
    `Failed requests: ${failedRequests.length}/${config.concurrentRequests}`
  );
  console.log(`Average processing time: ${avgProcessingTime.toFixed(2)}ms`);
  console.log(`Fastest request: ${minTime}ms`);
  console.log(`Slowest request: ${maxTime}ms`);

  // Calculate throughput
  if (successfulRequests.length > 0) {
    const totalApiCalls = successfulRequests.reduce(
      (sum, r) => sum + r.responseCount,
      0
    );
    const callsPerSecond = (totalApiCalls / (totalTime / 1000)).toFixed(2);
    console.log(`Total API calls processed: ${totalApiCalls}`);
    console.log(`Throughput: ${callsPerSecond} API calls per second`);
  }

  // Log individual request times if detailed logs enabled
  if (config.detailedLogs) {
    console.log("\n========== INDIVIDUAL REQUEST TIMES ==========");
    results
      .sort((a, b) => a.requestId - b.requestId)
      .forEach((result) => {
        if (result.success) {
          console.log(
            `Request #${result.requestId}: ${result.processingTime}ms, ${result.responseCount} responses`
          );
        } else {
          console.log(`Request #${result.requestId}: FAILED - ${result.error}`);
        }
      });
  }
}

// Run the test
runStressTest().catch(console.error);
