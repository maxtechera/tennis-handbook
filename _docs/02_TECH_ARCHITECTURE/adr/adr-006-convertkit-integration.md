# ADR-006: ConvertKit Email Platform Integration

> **Status: ACCEPTED** | Date: 2025-01-08

## Context
We needed an email platform to support progressive content unlocking strategy. Evaluated MailChimp and ConvertKit, focusing on automation capabilities, tag-based segmentation, and integration complexity with our Docusaurus platform.

## Decision
Choose ConvertKit over MailChimp for email capture and automation, integrating it via React components within Docusaurus.

## Consequences
### Positive
- Superior automation features for progressive unlocking
- Tag-based segmentation perfect for content access control
- Successfully achieved 48% open rate
- Clean API integration with React components
- Visual automation builder for complex flows

### Negative
- Higher cost than MailChimp at scale
- Learning curve for automation features
- Vendor lock-in for email workflows
- Need to maintain API keys and security

## Related
- [[adr-003-progressive-disclosure]] - Core use case for email system
- [[adr-001-docusaurus-platform]] - Integrated as React component