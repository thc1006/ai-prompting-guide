// Security configuration for production deployment
// This file configures security headers and CSP policies

module.exports = {
  // Content Security Policy configuration
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Required for Docusaurus, but consider alternatives
        "'unsafe-eval'", // Required for React development, remove in production
        "https://cdn.jsdelivr.net",
        "https://unpkg.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Required for inline styles
        "https://fonts.googleapis.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "blob:"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      connectSrc: [
        "'self'",
        "https://api.github.com",
        "https://thc1006.github.io"
      ],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: [],
      blockAllMixedContent: []
    },
    reportOnly: false
  },

  // Security headers configuration
  securityHeaders: {
    // Prevent clickjacking attacks
    'X-Frame-Options': 'DENY',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Enable XSS protection (legacy browsers)
    'X-XSS-Protection': '1; mode=block',
    
    // Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions Policy (formerly Feature Policy)
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    
    // HSTS - Enforce HTTPS
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    
    // Prevent DNS prefetching
    'X-DNS-Prefetch-Control': 'off',
    
    // Disable powered-by header
    'X-Powered-By': null,
    
    // Additional CORS headers
    'Access-Control-Allow-Origin': 'https://thc1006.github.io',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  },

  // Rate limiting configuration
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
  },

  // Input validation rules
  inputValidation: {
    maxUrlLength: 2048,
    maxBodySize: '10mb',
    allowedFileTypes: ['.md', '.mdx', '.jpg', '.png', '.svg', '.pdf'],
    sanitizeOptions: {
      allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre'],
      allowedAttributes: {
        'a': ['href', 'target', 'rel']
      },
      allowedSchemes: ['http', 'https', 'mailto']
    }
  },

  // Cookie security settings
  cookieSettings: {
    secure: true, // Requires HTTPS
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 86400000 // 24 hours
  }
};