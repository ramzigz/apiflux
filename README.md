# APIFlux - Rate Limited API Request Handler

A scalable backend system for handling high concurrency with rate limiting. APIFlux efficiently distributes requests across multiple API keys while respecting rate limits and optimizing performance.

## Features

- Handles up to 100 concurrent incoming HTTP requests
- Processes thousands of external API calls per request
- Intelligently distributes load across multiple API keys
- Respects rate limits per key
- Configurable for testing and production environments
- Includes stress testing capabilities

## Architecture

- **API Key Manager**: Tracks usage of each API key and selects the optimal key for each request
- **Request Queue Manager**: Manages request queues and processes them in batches
- **Third-Party API Simulator**: Simulates external API calls with configurable latency

## Installation

```bash
# Clone the repository
git clone https://github.com/ramzigz/apiflux.git
cd apiflux

# Install dependencies
npm install

# Create .env file (copy from example)
cp .env.example .env
```

## Configuration

Edit the `.env` file to configure the application:

```
# Server configuration
PORT=3000

# Mode configuration (true/false)
TEST_MODE=true

# Test mode settings
TEST_REQUESTS_COUNT=50
TEST_MIN_LATENCY=10
TEST_MAX_LATENCY=50

# Production mode settings
PROD_REQUESTS_COUNT=2000
PROD_MIN_LATENCY=500
PROD_MAX_LATENCY=3000

# Common settings
RATE_LIMIT=1000
API_KEYS=key1,key2,key3
BATCH_SIZE=10

# Stress test settings
CONCURRENT_REQUESTS=100
REQUEST_TIMEOUT=60000
```

## Usage

### Start the server:

```bash
# Start with default configuration (from .env)
npm start

# Start in test mode
npm run start:test

# Start in production mode
npm run start:prod
```

### Run stress tests:

```bash
# Run full stress test
npm test

# Run quick stress test with fewer requests
npm run test:quick

# Run full-scale stress test
npm run test:full
```

## API Endpoints

- **POST /process**: Processes a batch of API requests
- **GET /health**: Returns health and configuration information

## Project Structure

```
src/
├── config/
│   └── index.js           # Configuration loaded from environment variables
├── services/
│   ├── ApiKeyManager.js   # Manages API keys and rate limits
│   ├── RequestQueueManager.js  # Manages request queues
│   └── ThirdPartyApiSimulator.js  # Simulates third-party API
├── routes/
│   └── index.js           # API route definitions
├── test/
│   └── stressTest.js      # Stress testing script
├── app.js                 # Application initialization
└── server.js              # Server entry point
```

## Performance

When running in test mode with reduced request counts and latency, the system can process requests in seconds. Full-scale testing with 2000 requests per incoming call and up to 3-second latency per request will take longer but demonstrates the system's ability to efficiently distribute load while respecting rate limits.

## License

MIT