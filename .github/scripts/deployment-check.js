#!/usr/bin/env node

/**
 * Deployment health check script
 * Verifies that the deployed site is accessible and functional
 */

const https = require('https');
const { URL } = require('url');

const DEPLOYMENT_URL = process.env.DEPLOYMENT_URL || process.argv[2];
const TIMEOUT = 30000; // 30 seconds

if (!DEPLOYMENT_URL) {
  console.error('❌ No deployment URL provided');
  process.exit(1);
}

console.log(`🔍 Checking deployment at: ${DEPLOYMENT_URL}`);

/**
 * Performs basic health checks on the deployed site
 */
async function healthCheck(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const request = https.get(url, { timeout: TIMEOUT }, (response) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      let data = '';
      response.on('data', chunk => data += chunk);
      
      response.on('end', () => {
        const result = {
          statusCode: response.statusCode,
          responseTime,
          contentLength: data.length,
          hasDocusaurusMarkers: data.includes('docusaurus') || data.includes('Docusaurus'),
          hasReactMarkers: data.includes('react') || data.includes('React'),
          title: data.match(/<title>([^<]+)<\/title>/)?.[1] || 'No title found'
        };
        
        resolve(result);
      });
    });
    
    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error(`Request timeout after ${TIMEOUT}ms`));
    });
  });
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('⏱️  Starting health check...');
    
    const result = await healthCheck(DEPLOYMENT_URL);
    
    console.log('\n📊 Health Check Results:');
    console.log(`   Status Code: ${result.statusCode}`);
    console.log(`   Response Time: ${result.responseTime}ms`);
    console.log(`   Content Length: ${result.contentLength} bytes`);
    console.log(`   Page Title: ${result.title}`);
    console.log(`   Has Docusaurus Markers: ${result.hasDocusaurusMarkers ? '✅' : '❌'}`);
    console.log(`   Has React Markers: ${result.hasReactMarkers ? '✅' : '❌'}`);
    
    // Determine overall health
    const isHealthy = result.statusCode === 200 && 
                     result.responseTime < 10000 && 
                     result.contentLength > 1000 &&
                     result.hasDocusaurusMarkers;
    
    if (isHealthy) {
      console.log('\n✅ Deployment is healthy!');
      process.exit(0);
    } else {
      console.log('\n❌ Deployment health check failed!');
      
      if (result.statusCode !== 200) {
        console.log(`   - Non-200 status code: ${result.statusCode}`);
      }
      if (result.responseTime >= 10000) {
        console.log(`   - Slow response time: ${result.responseTime}ms`);
      }
      if (result.contentLength <= 1000) {
        console.log(`   - Small content size: ${result.contentLength} bytes`);
      }
      if (!result.hasDocusaurusMarkers) {
        console.log('   - Missing Docusaurus markers in HTML');
      }
      
      process.exit(1);
    }
    
  } catch (error) {
    console.error(`\n❌ Health check failed with error:`);
    console.error(`   ${error.message}`);
    process.exit(1);
  }
}

// Performance monitoring
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main();