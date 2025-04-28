/**
 * Simulates a third-party API with configurable latency
 */
class ThirdPartyApiSimulator {
  /**
   * Create a new API simulator
   * @param {number} minLatency - Minimum response time in ms
   * @param {number} maxLatency - Maximum response time in ms
   */
  constructor(minLatency, maxLatency) {
    this.minLatency = minLatency;
    this.maxLatency = maxLatency;
  }

  /**
   * Simulate an API request with random latency
   * @returns {Promise<string>} Promise resolving to "success" after delay
   */
  async makeRequest() {
    // Simulate response time between min and max latency
    const delay =
      Math.floor(Math.random() * (this.maxLatency - this.minLatency)) +
      this.minLatency;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return "success";
  }
}

module.exports = ThirdPartyApiSimulator;
