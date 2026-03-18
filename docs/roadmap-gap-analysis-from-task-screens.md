# Roadmap Gap Analysis From Task Screens

Source reviewed: screenshots in `docs/tasks/`  
Goal: identify what the screenshot set implies that Spacedey still lacks or only partially supports, while preserving Spacedey branding and changing flows only when necessary.

## Current Product Strengths
Spacedey already has a stronger branded public experience than the task screenshots in several areas:
- polished public marketing pages
- branded locations and search experience
- city and state landing pages
- OSM / MapLibre map support
- site detail pages
- product/add-on presentation
- signup/login/password reset/email verification
- bookings and invoices basics
- referral, newsletter, and support flows
- admin foundations for sites, users, blogs, invoices, and payment toggles

This means the next roadmap should not chase screenshot parity blindly. We should add missing operational depth while keeping the current Spacedey visual identity.

## Priority 1 Gaps
## 1. Operations Queue
Missing:
- move-in confirmation workflows
- move-out workflows
- transfer workflows
- overdue follow-up workflows
- reservation confirmation / fulfillment queue

Why it matters:
- This is the main gap between “nice public beta” and “operations-complete platform.”

Recommendation:
- Build an admin operations queue driven by booking and unit status changes.
- Keep it simple at first: status, due date, site, customer, assigned action.

## 2. Rich Invoice Operations
Missing:
- invoice detail page
- resend invoice
- payment history drill-down
- manual payment entry
- possibly notes/activity per invoice

Why it matters:
- Admin finance workflows are too shallow for scaling beyond basic launch operations.

Recommendation:
- Add invoice detail before expanding invoices into broader accounting workflows.

## 3. Booking Completion Flow
Missing or partial:
- move-in date selection
- more explicit staged checkout flow
- clearer customer-details step
- agreement acceptance / signature
- payment-method handling inside the journey

Why it matters:
- Current checkout is functional but not yet fully operationally expressive.

Recommendation:
- Move to a multi-step checkout flow while keeping the current Spacedey brand and page language.

## 4. Interactive Sitemap Workflows
Missing:
- customer unit-picking from sitemap
- admin interactive sitemap management
- floor / zone / status interaction

Why it matters:
- The screenshots suggest a stronger inventory operations layer than we currently expose.

Recommendation:
- Treat this as a second-wave feature after booking and unit state models are stabilized.

## Priority 2 Gaps
## 5. Unit Operations UI
Missing or partial:
- dense filterable unit lists
- occupant labels
- scheduled move dates
- stronger status badges
- export or operations-oriented views

Recommendation:
- Add an operations-focused unit management screen per site.

## 6. Product Catalog Management
Missing or partial:
- admin CRUD for add-ons/products
- per-site product availability
- recurring vs one-time add-on modeling
- full checkout and invoice integration for add-ons

Recommendation:
- Start with admin CRUD and invoice line-item support before deeper merchandising.

## 7. Customer Portal Expansion
Missing or partial:
- unified “My Units” workspace
- agreement downloads
- stronger location and account service details
- stored payment methods
- self-service account actions

Recommendation:
- Expand customer portal gradually after bookings, invoices, and agreements are richer.

## 8. Analytics
Missing:
- occupancy dashboards
- revenue dashboards
- aging or delinquency views
- historical trends and filters

Recommendation:
- Add analytics after invoice detail and unit operations are reliable.

## Priority 3 Gaps
## 9. Dynamic Pricing
Missing:
- pricing rules
- threshold logic
- preview / activation / audit flow

Recommendation:
- Postpone until occupancy and reporting are trusted.

## 10. Guided Tours / Enterprise Utilities
Missing:
- onboarding tooltips
- academy/help dropdowns
- jump-to navigation
- enterprise-style admin chrome

Recommendation:
- Nice to have, not core to first release.

## Recommended Implementation Phases
## Phase 1: First-Release Hardening
- Freeze beta scope
- Run smoke checklist across auth, payments, bookings, invoices, admin, and support
- Decide which screenshot-driven items are launch blockers

## Phase 2: Admin Operations Foundation
- Admin invoice detail page
- Manual payment entry
- Resend invoice
- Site/unit operations view
- Better booking/unit state transitions

## Phase 3: Booking Flow Upgrade
- Multi-step checkout
- Move-in date
- Account-details step cleanup
- Clearer confirmation step

## Phase 4: Agreement Layer
- Agreement template
- Acceptance/signature capture
- Downloadable agreement artifact

## Phase 5: Product & Add-On Expansion
- Admin product CRUD
- Add-on modeling
- Add-ons in checkout and invoices

## Phase 6: Customer Portal Expansion
- “My Units” workspace
- Invoice history and agreement access
- Better self-service

## Phase 7: Sitemap Interactivity
- Customer unit picking
- Admin unit map controls

## Phase 8: Analytics & Pricing
- Occupancy and revenue dashboards
- Dynamic pricing only after data maturity

## Flow Changes: Necessary vs Optional
Necessary:
- move-in date in booking flow
- better invoice operations
- stronger unit operations for admin
- agreement/signature if operationally required

Optional:
- screenshot-style tooltip systems
- academy/help utilities
- dense enterprise nav patterns
- public sitemap unit-picking in first release
- dynamic pricing in first release

## Risks
- Dynamic pricing before reporting maturity creates operational noise.
- Agreement/signature without audit discipline creates legal/ops debt.
- Add-ons in checkout touch cart, invoices, pricing, and payment allocation at once.
- Interactive sitemap can become a large UI project if not tightly scoped.
- Customer portal scope can sprawl quickly if not tied to retention and billing needs.

## Recommended First Release Positioning
Ship the current product as a public beta focused on:
- discovery
- verified auth
- payments and booking basics
- admin foundations
- support and referral

Then use the roadmap above to grow into the more operations-heavy product implied by the screenshots.
