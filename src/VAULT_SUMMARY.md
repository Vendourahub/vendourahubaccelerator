# Development Vault - Admin Access Summary

## Overview
All development documentation, prototypes, and workflow files have been moved to a secure vault within the admin dashboard.

## Access
- **URL**: `/admin/vault`
- **Permission**: Super Admin only
- **Authentication**: Requires admin login

## What's In The Vault

### 1. Project Documentation
- Project Index
- Quick Start Guide
- Phase 2 Checklist
- System Status
- Page Inventory

### 2. User Flows
- Flow Index
- Flow A: Application Process
- Flow B: Onboarding
- Flow C: Weekly Execution Cycle
- Flow D: Stage Progression
- Flow E: Admin Intervention

### 3. Screen Prototypes
- Screen Index
- Founder Dashboard
- Weekly Commit
- Execution Log
- Revenue Report
- Revenue Map
- RSD Document

### 4. Enforcement States
- Enforcement Index
- Locked Dashboard
- Locked Report
- Evidence Rejected
- Late Submission
- Removal Review
- Stage Locked
- Cannot Proceed

### 5. Refined Screens
- Refined Index
- Refined Dashboard
- Refined Commit
- Refined Report
- Refined Map

### 6. Handoff Documentation
- Handoff Index
- Data Models
- API Endpoints
- State Logic
- Validation Rules
- Component Specs

### 7. Testing & Validation
- Testing Index
- Test Protocol
- Success Metrics
- Founder Selection

## Security
- Only Super Admin accounts can access the vault
- All routes are protected under `/admin/vault/*`
- Founders and regular users cannot access these pages
- Navigation link only appears for Super Admin role

## Production Routes (Clean)
The following routes remain public/accessible:
- `/` - Landing page
- `/apply` - Application form
- `/login` - Founder login
- `/onboarding` - New founder onboarding
- `/dashboard` - Founder dashboard (authenticated)
- `/admin/login` - Admin login
- `/admin/*` - Admin dashboard (authenticated)

All development and documentation routes are now secured in the vault.
