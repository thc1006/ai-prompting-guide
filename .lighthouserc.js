module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      settings: {
        // Skip audits that are not applicable to GitHub Pages
        skipAudits: [
          'uses-http2',
          'redirects-http',
          'uses-long-cache-ttl',
          'server-response-time'
        ],
        // Performance budget configuration
        budgets: [
          {
            path: '/*',
            resourceSizes: [
              {
                resourceType: 'script',
                budget: 400
              },
              {
                resourceType: 'total',
                budget: 2000
              }
            ],
            resourceCounts: [
              {
                resourceType: 'third-party',
                budget: 10
              }
            ]
          }
        ]
      }
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['warn', { minScore: 0.75 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        // Disable assertions for GitHub Pages specific limitations
        'uses-http2': 'off',
        'redirects-http': 'off',
        'uses-long-cache-ttl': 'off',
        'server-response-time': 'off',
        'canonical': 'off',
        'is-crawlable': 'off'
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};