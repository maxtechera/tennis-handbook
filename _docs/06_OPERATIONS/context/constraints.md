# Tenis Manual Constraints & Guidelines

**Purpose**: Document what NOT to do based on project values, technical requirements, and past learnings.  
**Usage**: Check against these constraints before implementing new features or making changes.

## 🚫 Performance Constraints

### Never Break 95+ Lighthouse

- **Constraint**: Lighthouse score must stay above 95
- **Why**: SEO rankings and user experience depend on it
- **How**: Test performance impact before deploying any feature
- **Alternative**: Use progressive enhancement or server-side only

### No Heavy JavaScript Frameworks

- **Constraint**: Avoid adding React Query, Redux, heavy state management
- **Why**: Bundle size impacts performance scores
- **How**: Use React Context and localStorage for state
- **Alternative**: Server-side features via API endpoints

### Image Optimization Required

- **Constraint**: All images must be optimized and lazy-loaded
- **Why**: Images are largest performance bottleneck
- **How**: Use WebP format, proper sizing, lazy loading
- **Alternative**: Link to external video content vs embedding

## 🎯 Business Constraints

### Don't Promise to Make Users Pros

- **Constraint**: Never claim our program will make users professional
- **Why**: Unrealistic expectations damage credibility
- **How**: Focus on "train like the pros" not "become a pro"
- **Alternative**: Emphasize elite methods and proper training

### No Aggressive Monetization

- **Constraint**: Avoid hard paywalls or aggressive popups
- **Why**: Damages user trust and Spanish community values
- **How**: Progressive disclosure with value at each tier
- **Alternative**: Gentle nudges and clear value propositions

### Spanish Market First, Always

- **Constraint**: Every feature must work for Spanish users
- **Why**: 3x engagement advantage is our moat
- **How**: Test with Spanish users before English release
- **Alternative**: Build Spanish-specific features if needed

## 🔧 Technical Constraints

### Maintain Static Site Architecture

- **Constraint**: Core content must work without JavaScript
- **Why**: SEO, performance, and accessibility
- **How**: Progressive enhancement on static foundation
- **Alternative**: API endpoints for dynamic features only

### No Breaking Changes to URLs

- **Constraint**: All existing URLs must continue working
- **Why**: SEO rankings and user bookmarks
- **How**: Use redirects if structure must change
- **Alternative**: Add new paths rather than changing existing

### GitHub Pages Compatibility

- **Constraint**: Must deploy successfully to GitHub Pages
- **Why**: Zero hosting cost and global CDN
- **How**: Static build output, no server requirements
- **Alternative**: Vercel for API endpoints only

## 📝 Content Constraints

### No Machine Translation

- **Constraint**: Spanish content must be manually translated
- **Why**: Quality and cultural adaptation critical
- **How**: Professional translation with cultural context
- **Alternative**: None - quality is non-negotiable

### Maintain Research Standards

- **Constraint**: All methods must have scientific backing
- **Why**: Credibility and differentiation
- **How**: Minimum 3 peer-reviewed sources per method
- **Alternative**: Clearly mark opinion vs research

### Elite Coach Attribution

- **Constraint**: Always credit original coaches/methods
- **Why**: Legal, ethical, and credibility reasons
- **How**: Clear attribution in content and marketing
- **Alternative**: None - proper attribution required

## 💰 Monetization Constraints

### No Credit Card for Free Tiers

- **Constraint**: Email-only for free content access
- **Why**: Reduces friction for initial engagement
- **How**: Progressive value delivery via email
- **Alternative**: Credit card only at premium tier

### Transparent Pricing

- **Constraint**: Pricing must be clear upfront
- **Why**: Trust and Spanish market expectations
- **How**: Display pricing on landing pages
- **Alternative**: None - transparency required

### No Bait and Switch

- **Constraint**: Free content must provide real value
- **Why**: Long-term trust more valuable than quick conversions
- **How**: Complete Week 1 free, premium adds MORE value
- **Alternative**: None - deliver what's promised

## 🌐 Internationalization Constraints

### Spanish Not a Translation

- **Constraint**: Spanish version is a cultural adaptation
- **Why**: 3x engagement comes from cultural fit
- **How**: Spanish-specific examples, references, style
- **Alternative**: Build separate Spanish features

### Time Zone Considerations

- **Constraint**: Respect Spanish/LATAM time zones
- **Why**: Email and notification timing critical
- **How**: Schedule for local time zones
- **Alternative**: User preference settings

### Payment Method Support

- **Constraint**: Must support European payment methods
- **Why**: Spanish market uses SEPA, local cards
- **How**: Stripe with full European support
- **Alternative**: None - payment support required

## 🔒 Security & Privacy Constraints

### Minimal Data Collection

- **Constraint**: Only collect essential user data
- **Why**: GDPR compliance and user trust
- **How**: Email + preferences only
- **Alternative**: Anonymous usage analytics only

### No Third-Party Tracking

- **Constraint**: Avoid Facebook Pixel, excessive tracking
- **Why**: Privacy and performance impact
- **How**: Google Analytics with anonymized IPs only
- **Alternative**: Privacy-focused analytics (Plausible)

### Secure Storage Only

- **Constraint**: Never store sensitive data in localStorage
- **Why**: Security and compliance requirements
- **How**: Server-side storage for payment/personal data
- **Alternative**: None - security non-negotiable

## ❌ Common Pitfalls to Avoid

1. **Over-engineering**: Keep solutions simple and maintainable
2. **Feature Creep**: Stay focused on daily training companion vision
3. **English-First Thinking**: Always design for Spanish users
4. **Performance Regression**: Test impact before deploying
5. **Ignoring Mobile**: 60%+ users are on mobile devices
6. **Complex Onboarding**: Keep signup process minimal
7. **Assuming Behaviors**: Spanish ≠ English user patterns

---

**Remember**: These constraints protect the core value propositions: performance, Spanish market advantage, and user trust. When in doubt, choose the path that maintains these three pillars.
