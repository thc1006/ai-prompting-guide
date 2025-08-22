module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      settings: {
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
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};