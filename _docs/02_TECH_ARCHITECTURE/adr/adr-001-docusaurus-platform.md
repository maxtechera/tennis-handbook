# ADR-001: Maintain Docusaurus Platform

> **Status: ACCEPTED** | Date: 2024-12-20

## Context
We considered migrating from Docusaurus to Next.js for more flexibility in implementing premium features and monetization. However, our current Docusaurus setup achieves 95+ Lighthouse scores, provides excellent SEO capabilities, and benefits from static site hosting with minimal infrastructure costs.

## Decision
We decided to maintain Docusaurus as our platform rather than migrating to Next.js, implementing progressive features within the Docusaurus framework.

## Consequences
### Positive
- Maintained 95+ Lighthouse performance scores
- Preserved SEO rankings and static hosting benefits
- Reduced implementation complexity and risk
- Leveraged existing Docusaurus ecosystem (MDX, plugins, etc.)
- Zero migration costs or downtime

### Negative
- Some limitations in implementing complex interactive features
- Need to work within Docusaurus plugin architecture
- Less flexibility for custom server-side functionality

## Related
- [[adr-003-progressive-disclosure]] - Built within Docusaurus constraints
- [[adr-006-convertkit-integration]] - Integrated via React components