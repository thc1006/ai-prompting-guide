/**
 * Security utilities for input validation and sanitization
 * Implements OWASP best practices for web application security
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Input validation and sanitization class
 * Provides methods to validate and sanitize user inputs
 */
export class SecurityValidator {
  constructor() {
    // Regex patterns for common validation scenarios
    this.patterns = {
      email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
      alphanumeric: /^[a-zA-Z0-9]+$/,
      noScript: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      sqlInjection: /(\b(SELECT|UPDATE|DELETE|INSERT|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|FROM|WHERE)\b)/gi,
      pathTraversal: /(\.\.|\/\.\.\/|\\\.\.\\)/g,
      commandInjection: /[;&|`$()]/g
    };

    // Maximum allowed lengths for different input types
    this.maxLengths = {
      username: 50,
      email: 100,
      url: 2048,
      shortText: 255,
      longText: 5000,
      searchQuery: 100
    };
  }

  /**
   * Sanitize HTML content to prevent XSS attacks
   * @param {string} input - Raw HTML input
   * @param {Object} options - Sanitization options
   * @returns {string} Sanitized HTML
   */
  sanitizeHTML(input, options = {}) {
    if (!input || typeof input !== 'string') {
      return '';
    }

    const defaultConfig = {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'h3', 'h4', 'h5', 'h6'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id'],
      ALLOW_DATA_ATTR: false,
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      SAFE_FOR_TEMPLATES: true,
      RETURN_TRUSTED_TYPE: false
    };

    const config = { ...defaultConfig, ...options };
    return DOMPurify.sanitize(input, config);
  }

  /**
   * Validate and sanitize text input
   * @param {string} input - User input
   * @param {string} type - Type of input (username, email, url, etc.)
   * @returns {Object} Validation result with sanitized value
   */
  validateInput(input, type = 'text') {
    const result = {
      isValid: false,
      sanitized: '',
      errors: []
    };

    // Check if input exists
    if (!input || typeof input !== 'string') {
      result.errors.push('Input is required');
      return result;
    }

    // Trim whitespace
    let sanitized = input.trim();

    // Check length constraints
    const maxLength = this.maxLengths[type] || this.maxLengths.shortText;
    if (sanitized.length > maxLength) {
      result.errors.push(`Input exceeds maximum length of ${maxLength} characters`);
      return result;
    }

    // Type-specific validation
    switch (type) {
      case 'email':
        if (!this.patterns.email.test(sanitized)) {
          result.errors.push('Invalid email format');
          return result;
        }
        sanitized = sanitized.toLowerCase();
        break;

      case 'url':
        if (!this.patterns.url.test(sanitized)) {
          result.errors.push('Invalid URL format');
          return result;
        }
        break;

      case 'username':
        if (!this.patterns.alphanumeric.test(sanitized)) {
          result.errors.push('Username can only contain letters and numbers');
          return result;
        }
        break;

      case 'searchQuery':
        // Remove potential SQL injection attempts
        sanitized = sanitized.replace(this.patterns.sqlInjection, '');
        // Remove command injection characters
        sanitized = sanitized.replace(this.patterns.commandInjection, '');
        break;

      default:
        // General text sanitization
        // Remove script tags
        sanitized = sanitized.replace(this.patterns.noScript, '');
        // Remove path traversal attempts
        sanitized = sanitized.replace(this.patterns.pathTraversal, '');
    }

    // Escape special characters for database storage
    sanitized = this.escapeSpecialChars(sanitized);

    result.isValid = result.errors.length === 0;
    result.sanitized = sanitized;
    return result;
  }

  /**
   * Escape special characters to prevent injection attacks
   * @param {string} input - Input string
   * @returns {string} Escaped string
   */
  escapeSpecialChars(input) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };
    return input.replace(/[&<>"'/]/g, char => map[char]);
  }

  /**
   * Validate file upload
   * @param {File} file - File object
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  validateFileUpload(file, options = {}) {
    const result = {
      isValid: false,
      errors: []
    };

    const defaultOptions = {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'text/markdown'],
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.txt', '.md']
    };

    const config = { ...defaultOptions, ...options };

    // Check file exists
    if (!file) {
      result.errors.push('No file provided');
      return result;
    }

    // Check file size
    if (file.size > config.maxSize) {
      result.errors.push(`File size exceeds ${config.maxSize / (1024 * 1024)}MB limit`);
    }

    // Check MIME type
    if (!config.allowedTypes.includes(file.type)) {
      result.errors.push('File type not allowed');
    }

    // Check file extension
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    if (!config.allowedExtensions.includes(extension)) {
      result.errors.push('File extension not allowed');
    }

    // Check for double extensions (e.g., file.pdf.exe)
    const parts = file.name.split('.');
    if (parts.length > 2) {
      result.errors.push('Suspicious filename detected');
    }

    result.isValid = result.errors.length === 0;
    return result;
  }

  /**
   * Rate limiting check
   * @param {string} identifier - User identifier (IP, user ID, etc.)
   * @param {number} maxRequests - Maximum requests allowed
   * @param {number} windowMs - Time window in milliseconds
   * @returns {boolean} Whether request should be allowed
   */
  checkRateLimit(identifier, maxRequests = 100, windowMs = 60000) {
    const now = Date.now();
    const key = `rateLimit:${identifier}`;
    
    // In a real implementation, this would use Redis or similar
    // This is a simplified in-memory version
    if (!this.rateLimitStore) {
      this.rateLimitStore = new Map();
    }

    const record = this.rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count++;
    }

    this.rateLimitStore.set(key, record);
    return record.count <= maxRequests;
  }

  /**
   * Generate CSRF token
   * @returns {string} CSRF token
   */
  generateCSRFToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate CSRF token
   * @param {string} token - Token to validate
   * @param {string} storedToken - Stored token to compare against
   * @returns {boolean} Whether token is valid
   */
  validateCSRFToken(token, storedToken) {
    if (!token || !storedToken) {
      return false;
    }
    // Constant-time comparison to prevent timing attacks
    return this.constantTimeCompare(token, storedToken);
  }

  /**
   * Constant-time string comparison
   * @param {string} a - First string
   * @param {string} b - Second string
   * @returns {boolean} Whether strings are equal
   */
  constantTimeCompare(a, b) {
    if (a.length !== b.length) {
      return false;
    }
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }

  /**
   * Sanitize JSON data
   * @param {Object} data - JSON object to sanitize
   * @returns {Object} Sanitized JSON object
   */
  sanitizeJSON(data) {
    if (typeof data !== 'object' || data === null) {
      return {};
    }

    const sanitized = {};
    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];

    for (const [key, value] of Object.entries(data)) {
      // Skip dangerous keys
      if (dangerousKeys.includes(key.toLowerCase())) {
        continue;
      }

      // Recursively sanitize nested objects
      if (typeof value === 'object' && value !== null) {
        sanitized[key] = Array.isArray(value) 
          ? value.map(item => this.sanitizeJSON(item))
          : this.sanitizeJSON(value);
      } else if (typeof value === 'string') {
        // Sanitize string values
        sanitized[key] = this.escapeSpecialChars(value);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        sanitized[key] = value;
      }
      // Skip functions and undefined values
    }

    return sanitized;
  }
}

// Export singleton instance
export const securityValidator = new SecurityValidator();

// Export security middleware for Express/similar frameworks
export const securityMiddleware = {
  /**
   * XSS protection middleware
   */
  xssProtection: (req, res, next) => {
    // Set X-XSS-Protection header
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Sanitize common input fields
    if (req.body) {
      for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
          req.body[key] = securityValidator.escapeSpecialChars(req.body[key]);
        }
      }
    }
    
    next();
  },

  /**
   * CSRF protection middleware
   */
  csrfProtection: (req, res, next) => {
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const token = req.headers['x-csrf-token'] || req.body?._csrf;
      const sessionToken = req.session?.csrfToken;
      
      if (!securityValidator.validateCSRFToken(token, sessionToken)) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
      }
    }
    
    next();
  },

  /**
   * Security headers middleware
   */
  securityHeaders: (req, res, next) => {
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // Remove X-Powered-By header
    res.removeHeader('X-Powered-By');
    
    next();
  }
};

export default SecurityValidator;