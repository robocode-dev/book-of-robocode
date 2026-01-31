# Implementation Plan: Contributing Workflow and Subdomain Setup

This document tracks the planned work for setting up the contributing workflow and book.robocode.dev subdomain.

**Created:** 2026-01-31  
**Status:** Complete

---

## Overview

The goal is to:
1. Create proper contributing documentation with AI-assisted workflow instructions
2. Add a Code of Conduct
3. Configure the book.robocode.dev subdomain
4. Update README.md to reference these new files

---

## Completed Tasks

### ✅ 1. SETUP-SUBDOMAIN.md Created

**File:** `SETUP-SUBDOMAIN.md`

Comprehensive instructions for the human to configure:
- Namecheap DNS (add CNAME record: `book` → `robocode-dev.github.io`)
- GitHub Pages settings (custom domain, enforce HTTPS)
- Verification checklist
- Troubleshooting guide
- Future linking from Tank Royale docs

### ✅ 2. CONTRIBUTING.md Created

**File:** `CONTRIBUTING.md`

Complete contributing guide including:
- Code of Conduct reference
- Ways to contribute (issues, content, illustrations, new pages, suggestions)
- Getting started with local development
- Writing guidelines (terminology, formatting, page structure)
- **AI-Assisted Workflow with GitHub Copilot** section documenting:
  - `/create-page` skill usage and capabilities
  - `/create-illustration` skill usage and capabilities
  - Reference documents table
- Pull request process
- Project structure overview

---

## Pending Tasks

### ✅ 3. CODE_OF_CONDUCT.md

**File:** `CODE_OF_CONDUCT.md`

Created with Contributor Covenant v2.1 content including all standard sections.

---

### ✅ 4. Update README.md

**File:** `README.md`

Completed:
- Updated live site URL to `https://book.robocode.dev/`
- Replaced Contributing section with link to `CONTRIBUTING.md`
- Added Code of Conduct reference

---

### ⏳ 5. Verify CNAME File

**File:** `book/public/CNAME`

Verify it contains exactly:
```
book.robocode.dev
```

(This file should already exist and be correct)

---

## Human Actions Required (After Implementation)

These are documented in `SETUP-SUBDOMAIN.md`:

### DNS Configuration (Namecheap)

1. Log in to Namecheap
2. Go to Domain List → robocode.dev → Manage → Advanced DNS
3. Add CNAME Record:
   - Host: `book`
   - Value: `robocode-dev.github.io`
   - TTL: Automatic

### GitHub Pages Configuration

1. Go to repository Settings → Pages
2. Set custom domain: `book.robocode.dev`
3. Wait for DNS verification
4. Enable "Enforce HTTPS"

---

## Future Considerations (Not In Scope)

### Documentation Consolidation

The user mentioned potentially merging Tank Royale docs into book-of-robocode in the future. This would involve:

- Moving content from `robocode-dev/tank-royale/docs` to this repository
- Restructuring to have `/tank-royale` path for API docs
- Updating the VitePress configuration for multisection site
- Coordinating the API documentation uploaded from tank-royale builds

**Decision:** Deferred for future implementation.

---

## File Checklist

| File                 | Status    | Description                                 |
|----------------------|-----------|---------------------------------------------|
| `SETUP-SUBDOMAIN.md` | ✅ Created | Human instructions for DNS and GitHub Pages |
| `CONTRIBUTING.md`    | ✅ Created | Full contributing guide with Copilot skills |
| `CODE_OF_CONDUCT.md` | ✅ Created | Contributor Covenant v2.1                   |
| `README.md`          | ✅ Updated | URL and Contributing section                |
| `book/public/CNAME`  | ✅ Exists  | Verify contains `book.robocode.dev`         |

---

## Resume Instructions

To continue this work:

1. Create `CODE_OF_CONDUCT.md` using Contributor Covenant v2.1
2. Update `README.md`:
   - Change live site URL to `https://book.robocode.dev/`
   - Replace a Contributing section with link to `CONTRIBUTING.md`
   - Add Code of Conduct reference
3. Verify `book/public/CNAME` contains correct domain
4. Test locally with `npm run dev`

---

*This plan can be deleted once all tasks are complete.*
