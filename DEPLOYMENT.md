# Deployment Guide

## Overview

The Finance Agent uses a comprehensive deployment pipeline with automated quality gates, performance validation, and GitHub releases.

## Deployment Architecture

```
Development → Quality Gates → Production Build → GitHub Release → CDN Distribution
```

## Pre-Deployment Quality Gates

### Automated Quality Checks

Run the complete quality validation pipeline:

```bash
npm run check
```

This executes:
1. **TypeScript Type Check** - Validates JSDoc type annotations
2. **ESLint Code Quality** - Enforces code standards and detects issues
3. **Test Suite** - Runs all 544 tests with coverage validation
4. **Bundle Size Analysis** - Validates production bundle size and performance
5. **Unused Code Detection** - Identifies dead code and unused dependencies
6. **Dependency Count** - Ensures minimal dependency footprint

### Quality Gate Thresholds

- **Test Coverage**: Must be ≥ 95% line coverage
- **Bundle Size**: Must be ≤ 25KB (current: 8.42KB gzipped)
- **Time to Interactive**: Must be ≤ 300ms (current: 166ms)
- **Runtime Dependencies**: Must be ≤ 5 packages (current: 3)
- **Type Safety**: Zero TypeScript errors
- **Code Quality**: Zero ESLint errors or warnings

## Build Process

### Development Build

For local development with hot reloading:

```bash
npm run build:dev
```

- CSS modules are copied individually for debugging
- JavaScript files are copied without minification
- Source maps included for debugging
- No tree-shaking (faster builds)

### Production Build

For deployment-ready optimized bundle:

```bash
npm run build
```

- **CSS Optimization**: All styles concatenated and minified
- **JavaScript Minification**: Code compressed with esbuild
- **Tree Shaking**: Unused code eliminated
- **Bundle Analysis**: Size and performance validation
- **Asset Optimization**: Images and resources optimized

### Build Output

```
dist/
├── index.html          # Entry point with import maps
├── styles.css          # Concatenated and minified styles
├── bundle.js           # Minified JavaScript bundle
└── assets/            # Optimized static assets
```

## Release Process

### Automated Release Workflow

1. **Pre-Release Validation**:
   ```bash
   npm run check          # Quality gates
   ```

2. **Automated Commit** (with AI-generated message):
   ```bash
   ./scripts/auto-commit.sh "feat: implement new feature X
   
   Detailed description of changes including:
   - What was changed and why
   - Business motivation and impact
   - Performance implications
   - Architecture decisions"
   ```

3. **GitHub Release**:
   ```bash
   npm run release
   ```

### Release Assets

Each GitHub release includes:
- **Production Bundle** (`dist/` folder as ZIP)
- **Source Code** (tagged commit)
- **Performance Report** (bundle size, TTI, test coverage)
- **Changelog** (generated from commit messages)
- **Documentation** (README.md, ARCHITECTURE.md)

### Version Management

- **Semantic Versioning**: `MAJOR.MINOR.PATCH`
- **Automatic Version Bumping**: Based on commit message prefixes
  - `feat:` → Minor version bump
  - `fix:` → Patch version bump
  - `feat!:` or `BREAKING CHANGE:` → Major version bump
- **Release Notes**: Generated from commit messages since last release

## CDN Distribution

### Import Maps Configuration

The application uses import maps for zero-build development:

```html
<script type="importmap">
{
  "imports": {
    "lodash-es": "https://cdn.skypack.dev/lodash-es@4.17.21",
    "date-fns": "https://cdn.skypack.dev/date-fns@2.30.0",
    "uplot": "https://cdn.skypack.dev/uplot@1.6.32"
  }
}
</script>
```

### CDN Benefits

- **Reduced Bundle Size**: External dependencies not included in bundle
- **Browser Caching**: Dependencies cached across sites
- **Fast Loading**: CDN geographic distribution
- **Version Pinning**: Specific versions ensure consistency

## Performance Validation

### Automated Performance Testing

Performance validation runs on every build:

```bash
npm run build:analyze
```

### Performance Metrics

- **Bundle Size**: 8.42KB gzipped (target: < 25KB)
- **Time to Interactive**: 166ms on 3G (target: < 300ms)
- **First Contentful Paint**: < 1.5s on 3G
- **Largest Contentful Paint**: < 2.5s on 3G
- **Cumulative Layout Shift**: < 0.1

### Performance Monitoring

- **Bundle Size Tracking**: Historical size tracking in CI
- **Performance Budgets**: Automated alerts for regressions
- **Lighthouse Scoring**: Automated performance audits
- **Real User Monitoring**: Performance tracking in production

## Environment Configuration

### Development Environment

```bash
# Required tools
node --version    # v18.0.0+
npm --version     # v8.0.0+
git --version     # v2.0.0+

# Setup
npm install
npm run check     # Validate environment
```

### Production Environment

- **Static Hosting**: Any CDN or static host (Netlify, Vercel, GitHub Pages)
- **HTTPS Required**: For modern JavaScript features
- **Browser Support**: Modern browsers with ES2022 and import maps
- **No Server**: Pure client-side application

### Environment Variables

No environment variables required - all configuration is compile-time.

## Deployment Strategies

### GitHub Pages Deployment

1. **Automated Deployment**:
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
         - run: npm install
         - run: npm run check
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

### Netlify Deployment

1. **Build Configuration** (`netlify.toml`):
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [build.environment]
     NODE_VERSION = "18"
   
   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-Content-Type-Options = "nosniff"
   ```

### Vercel Deployment

1. **Build Configuration** (`vercel.json`):
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": null,
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           }
         ]
       }
     ]
   }
   ```

## Security Considerations

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' cdn.skypack.dev;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  connect-src 'self';
  base-uri 'self';
  form-action 'none';
">
```

### Security Headers

- **X-Frame-Options**: DENY
- **X-Content-Type-Options**: nosniff
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: Restrict unnecessary browser APIs

### Dependency Security

- **Regular Updates**: Automated dependency updates with Dependabot
- **Security Audits**: `npm audit` in CI pipeline
- **Minimal Dependencies**: Only 3 runtime dependencies reduce attack surface
- **CDN Integrity**: SRI hashes for CDN resources

## Monitoring and Maintenance

### Health Checks

1. **Build Health**: CI pipeline validates every commit
2. **Performance Health**: Bundle size and TTI monitoring
3. **Security Health**: Automated vulnerability scanning
4. **Dependency Health**: Regular dependency updates

### Maintenance Schedule

- **Weekly**: Dependency updates and security patches
- **Monthly**: Performance review and optimization
- **Quarterly**: Architecture review and refactoring
- **Annually**: Major version updates and technology refresh

### Troubleshooting

#### Common Issues

1. **Bundle Size Exceeded**:
   ```bash
   npm run build:analyze  # Identify large dependencies
   # Remove unused imports or externalize large dependencies
   ```

2. **Test Failures**:
   ```bash
   npm test               # Run tests locally
   npm run test:coverage  # Check coverage
   # Fix failing tests before deployment
   ```

3. **Type Errors**:
   ```bash
   npm run type-check     # Check TypeScript errors
   # Fix JSDoc annotations or add type assertions
   ```

4. **Performance Regression**:
   ```bash
   npm run build:analyze  # Check bundle size and TTI
   # Optimize code or add lazy loading
   ```

#### Emergency Rollback

If critical issues are discovered in production:

1. **Immediate**: Revert to previous GitHub release
2. **Investigation**: Identify root cause in development
3. **Fix**: Apply hotfix with accelerated testing
4. **Redeploy**: New release with fix

## Quality Assurance

### Pre-Deployment Checklist

- [ ] All quality gates pass (`npm run check`)
- [ ] Bundle size under 25KB target
- [ ] TTI under 300ms target
- [ ] All 544+ tests passing
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Documentation updated
- [ ] Performance validated

### Post-Deployment Validation

- [ ] Application loads correctly in production
- [ ] All core features functional
- [ ] Performance metrics within targets
- [ ] No console errors
- [ ] Responsive design working
- [ ] Dark/light theme toggle functional
- [ ] Data persistence working

This comprehensive deployment guide ensures reliable, performant, and secure deployments while maintaining the high quality standards established throughout the development process.
