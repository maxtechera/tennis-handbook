#!/bin/bash
# Migration setup script - creates new documentation structure

echo "🚀 Setting up new documentation structure..."

# Create all directories
mkdir -p docs/{00_PROJECT_OVERVIEW,01_PRODUCT/{features,personas},02_TECH_ARCHITECTURE/adr,03_MARKETING,04_CONTENT,05_BRAND/assets,06_OPERATIONS/{meeting-notes,context},07_EXTERNAL,99_TEMPORARY/archive}

# Preserve context system
if [ -d "_docs/context" ]; then
    cp -r _docs/context/* docs/06_OPERATIONS/context/
    echo "✅ Context system preserved"
fi

# Create navigation hub
cat > docs/00_PROJECT_OVERVIEW/index.md << 'EOF'
# Documentation Index

> **Status: ACTIVE** | Last updated: 2025-07-05

## Quick Links
- [Current Sprint](../06_OPERATIONS/current-sprint.md)
- [Vision & Strategy](vision.md)
- [Business Model](business-model.md)
- [Technical Architecture](../02_TECH_ARCHITECTURE/architecture-overview.md)
- [Product Roadmap](../01_PRODUCT/roadmap.md)

## Navigation Map

### 00_PROJECT_OVERVIEW
- Vision & Strategy
- Business Model
- Goals & Success Metrics

### 01_PRODUCT
- Product Roadmap
- Feature Specifications
- User Personas
- Progressive Disclosure Strategy

### 02_TECH_ARCHITECTURE
- Architecture Overview
- Deployment Guide
- Architectural Decision Records (ADRs)

### 03_MARKETING
- Audience Analysis
- Growth Experiments
- Spanish Market Focus

### 04_CONTENT
- Content Strategy
- Localization Guide

### 05_BRAND
- Brand Guidelines
- Voice & Tone

### 06_OPERATIONS
- Current Sprint
- Implementation Checklist
- Decision Log
- Context System

### 07_EXTERNAL
- ConvertKit Integration
- Third-party Documentation

### 99_TEMPORARY
- Archive
- Work in Progress
EOF

echo "✅ Structure created successfully!"
echo "📁 Run 'tree docs' to verify the structure"