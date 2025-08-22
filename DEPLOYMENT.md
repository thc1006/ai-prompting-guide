# Deployment Guide

This document outlines the automated deployment process for the AI Prompting Guide using GitHub Actions and GitHub Pages.

## Overview

The project uses a comprehensive GitHub Actions workflow for automated deployment that includes:

- **Build Process**: Automated Node.js setup, dependency installation, and Docusaurus build
- **Deployment**: Direct deployment to GitHub Pages with proper permissions
- **Monitoring**: Performance auditing with Lighthouse
- **Notifications**: Automated status updates and failure notifications
- **Health Checks**: Post-deployment verification

## Workflow Files

### Primary Deployment Workflow
- **File**: `.github/workflows/deploy.yml`
- **Triggers**: Push to `main` branch, manual dispatch
- **Features**:
  - Node.js 18 with npm caching
  - Build optimization with increased memory allocation
  - Artifact uploading for GitHub Pages
  - Deployment status tracking
  - Failure notifications with automatic issue creation
  - Lighthouse performance auditing

### Simplified Pages Workflow
- **File**: `.github/workflows/pages.yml`
- **Purpose**: Alternative simple deployment workflow
- **Use Case**: Fallback option for basic deployments

## Configuration Files

### Docusaurus Configuration
- **File**: `docusaurus.config.js`
- **Key Features**:
  - Environment-aware URL configuration
  - GitHub Pages optimized settings
  - Performance optimizations with SWC loader
  - SEO-friendly sitemap generation

### Performance Monitoring
- **File**: `.lighthouserc.js`
- **Purpose**: Lighthouse CI configuration for performance budgets
- **Metrics Tracked**:
  - Performance scores (min 80%)
  - Accessibility scores (min 90%)
  - Best practices and SEO scores
  - Resource budgets and third-party limits

### Deployment Health Check
- **File**: `.github/scripts/deployment-check.js`
- **Purpose**: Post-deployment verification script
- **Checks**:
  - Response status and timing
  - Content validation
  - Docusaurus-specific markers
  - Overall site health

## Deployment Process

### Automatic Deployment
1. **Trigger**: Push to `main` branch
2. **Build**: 
   - Checkout code with full history
   - Setup Node.js 18 with npm caching
   - Install dependencies with `npm ci`
   - Build site with environment variables
3. **Deploy**:
   - Upload build artifacts
   - Deploy to GitHub Pages
   - Update deployment status
4. **Monitor**:
   - Run Lighthouse performance audit
   - Execute health checks
   - Create notifications for failures

### Manual Deployment
Use the `workflow_dispatch` trigger to manually initiate deployment from the GitHub Actions tab.

## Environment Variables

The workflow supports the following environment variables:

- `DOCUSAURUS_URL`: Production URL (auto-configured by GitHub Pages)
- `DOCUSAURUS_BASE_URL`: Base path for routing (auto-configured)
- `NODE_ENV`: Set to `production` during build
- `NODE_OPTIONS`: Memory optimization for build process

## Repository Setup

### Required Settings
1. **GitHub Pages**: Enable in repository settings
2. **Actions Permissions**: Allow read/write permissions for GITHUB_TOKEN
3. **Environment**: Create `github-pages` environment (optional for additional protection)

### Branch Protection (Recommended)
- Protect `main` branch
- Require status checks to pass before merging
- Include deployment workflow in required checks

## Performance Optimization

### Build Optimizations
- **SWC Loader**: Fast TypeScript/JavaScript compilation
- **Memory Allocation**: Increased Node.js memory limit (4GB)
- **Caching**: Aggressive npm and build caching
- **Environment Variables**: Production optimizations

### Runtime Optimizations
- **Code Splitting**: Automatic with Docusaurus
- **Asset Optimization**: Images and static files
- **CDN**: GitHub Pages CDN for global distribution

## Monitoring and Alerts

### Success Indicators
- ✅ Build completes without errors
- ✅ Deployment successful to GitHub Pages
- ✅ Lighthouse scores meet thresholds
- ✅ Health check passes
- ✅ Site accessible and functional

### Failure Handling
- 🚨 Automatic issue creation for deployment failures
- 📧 Commit comments with deployment status
- 📊 Lighthouse reports for performance regression
- 🔍 Detailed logs in GitHub Actions

## Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version compatibility
- Verify package.json dependencies
- Review Docusaurus configuration syntax

**Deployment Failures:**
- Ensure GitHub Pages is enabled
- Check repository permissions
- Verify workflow permissions in Settings > Actions

**Performance Issues:**
- Review Lighthouse reports
- Optimize images and assets
- Check for large bundle sizes

### Debug Commands

```bash
# Local development
npm start

# Local build test
npm run build
npm run serve

# Clear cache
npm run clear

# Type checking
npm run typecheck
```

## Security Considerations

- **Token Permissions**: Minimal required permissions for GITHUB_TOKEN
- **Dependency Security**: Regular security updates through Dependabot
- **Build Isolation**: Each build runs in fresh environment
- **Asset Validation**: Content security policies in place

## Maintenance

### Regular Tasks
- Monitor Lighthouse performance reports
- Review and update dependencies
- Check deployment success rates
- Update Node.js version as needed

### Quarterly Reviews
- Evaluate performance budgets
- Update security configurations
- Review deployment metrics
- Optimize build processes

---

For questions or issues with the deployment process, please check the [GitHub Actions logs](../../actions) or create an issue in this repository.