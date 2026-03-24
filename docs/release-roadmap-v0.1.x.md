# Release Roadmap: v0.1.x

Context:
- `v0.1.0` is the current public beta baseline.
- The next releases should stay in the `0.1.x` line.
- This roadmap is aligned with the task-screen gap analysis in `docs/roadmap-gap-analysis-from-task-screens.md`.
- We should not move to `0.2.0` until there is a larger platform shift, not just steady feature completion.

## Versioning Rule

Stay in `0.1.x` while we are:
- deepening existing booking, invoice, admin, and customer workflows
- improving operational completeness
- expanding current product surfaces without redefining the platform

Move to `0.2.0` only when we introduce a broader product step such as:
- interactive sitemap workflows
- a significantly richer customer portal
- more advanced operations and analytics as a unified platform layer

## Current Baseline

`v0.1.0` covers:
- public marketing and discovery
- search, maps, and location pages
- verified authentication
- checkout and payment foundations
- bookings and invoices basics
- admin foundations
- support, referral, landlord, and email flows
- Google verification and GTM setup

## Execution Mode

This roadmap is now an execution queue, not just a planning note.

For each patch release we should:
- implement the scoped feature slice immediately
- test it right away
- fix regressions before moving on
- close the release cleanly before starting the next one

## Active Queue

- [x] `v0.1.0` public beta baseline
- [ ] `v0.1.1` admin invoice detail, resend flow, and payment-history groundwork
- [ ] `v0.1.2` manual payment entry and reconciliation support
- [ ] `v0.1.3` checkout flow upgrade
- [ ] `v0.1.4` move-in date support
- [ ] `v0.1.5` unit operations foundation
- [ ] `v0.1.6` operations queue and status transitions
- [ ] `v0.1.7` agreement layer
- [ ] `v0.1.8` add-ons and line items
- [ ] `v0.1.9` customer portal basics
- [ ] `v0.1.10` reporting and operational polish

## Release Ladder

## v0.1.1
Theme: Invoice operations foundation

Primary scope:
- admin invoice detail page
- payment history drill-down
- resend invoice action
- invoice notes or internal activity support

Why this first:
- It is the highest-value operations gap after beta.
- It improves admin usefulness without reshaping the booking journey yet.

Exit criteria:
- admins can open a full invoice record
- admins can resend an invoice
- invoice status and payment history are understandable at a glance

Execution checklist:
- [x] add admin invoice detail API
- [x] add admin invoice detail page
- [x] add resend invoice action
- [x] expose payment-history groundwork on the invoice view
- [x] verify list-to-detail admin navigation
- [x] run `pnpm lint`
- [x] run `pnpm build`

## v0.1.2
Theme: Manual finance controls

Primary scope:
- manual payment entry
- reconciliation support for invoice and booking records
- clearer payment state handling in admin

Why now:
- This builds directly on invoice detail.
- It reduces operational dependence on only automated payment paths.

Exit criteria:
- admins can record manual payment events safely
- invoice totals and statuses update predictably
- manual and provider payments are visible in one place

Execution checklist:
- [ ] add manual payment data model support
- [ ] add admin manual payment entry flow
- [ ] reconcile manual and provider payments in invoice views
- [ ] verify invoice math and status updates
- [ ] run `pnpm lint`
- [ ] run `pnpm build`

## v0.1.3
Theme: Booking flow upgrade

Primary scope:
- multi-step checkout flow
- clearer customer details step
- stronger order review step
- clearer confirmation state after payment

Why now:
- The current checkout works, but the task-driven roadmap suggests a more operationally expressive flow.

Exit criteria:
- checkout is easier to follow
- the user journey has clear stages
- payment success leads to a stronger confirmation experience

## v0.1.4
Theme: Move-in readiness

Primary scope:
- move-in date selection
- booking model support for move-in scheduling
- admin visibility for scheduled move-ins

Why now:
- Move-in intent is one of the most important missing real-world operational fields.

Exit criteria:
- users can select a move-in date during booking
- admins can see upcoming move-ins
- booking records include move-in scheduling consistently

## v0.1.5
Theme: Unit operations foundation

Primary scope:
- site-level unit operations view
- stronger unit and booking status badges
- filtering by site, status, and move-in timing
- occupant and booking linkage in admin

Why now:
- This closes a major gap between public booking and internal operations.

Exit criteria:
- admins can see unit availability and occupancy context clearly
- admins can find upcoming and active unit assignments quickly

## v0.1.6
Theme: Status transitions and operations queue

Primary scope:
- better booking and unit state transitions
- lightweight operations queue
- move-in, move-out, transfer, and overdue follow-up tracking

Why now:
- The task-gap analysis identified this as the main difference between a polished beta and an operations-complete platform.

Exit criteria:
- admins can work from a single action-oriented queue
- key state transitions are explicit and auditable

## v0.1.7
Theme: Agreement layer

Primary scope:
- agreement template support
- agreement acceptance capture
- downloadable agreement artifact or durable acceptance record

Why now:
- This should come after booking and unit workflows are more stable.

Exit criteria:
- agreements can be accepted in a traceable way
- admins and customers can retrieve agreement state when needed

## v0.1.8
Theme: Add-ons and line items

Primary scope:
- admin product/add-on CRUD
- invoice line-item expansion
- add-ons in checkout
- recurring vs one-time add-on modeling if needed

Why now:
- Add-ons touch catalog, pricing, checkout, and invoicing together, so they should come after the core booking and invoice flows are stronger.

Exit criteria:
- admins can manage core add-ons
- customers can add supported extras during checkout
- invoices reflect add-ons correctly

## v0.1.9
Theme: Customer portal basics

Primary scope:
- basic “My Units” workspace
- invoice history access
- agreement access
- booking/account self-service improvements

Why now:
- Customer self-service becomes more valuable once invoices, agreements, and booking states are reliable.

Exit criteria:
- signed-in users can view their active booking/unit context
- users can access key documents and billing history

## v0.1.10
Theme: Reporting and operational polish

Primary scope:
- basic occupancy and revenue reporting
- aging and delinquency visibility
- workflow polish across invoice, booking, and unit operations
- release hardening before `0.2.0`

Why now:
- Reporting depends on data quality from the earlier operational releases.

Exit criteria:
- core operational metrics are trustworthy enough for internal use
- the platform is stable enough to justify a larger next-step release

## What Stays Out Of v0.1.x Unless Priority Changes

Defer unless business pressure changes:
- interactive sitemap unit picking
- full enterprise-style admin utilities
- dynamic pricing automation
- large analytics suites beyond operational basics

These are better candidates for `0.2.0` or later.

## Delivery Strategy

For each `0.1.x` release:

1. Keep the scope narrow and operationally meaningful.
2. Ship only one major workflow expansion at a time.
3. Preserve current branding and UX patterns rather than redesigning the whole product each release.
4. Require smoke coverage for auth, payments, bookings, invoices, and admin before tagging.

## Suggested Release Checklist Template

For every patch release:
- update scope doc and changelog
- run `pnpm lint`
- run `pnpm build`
- run any needed DB migrations on a clean environment
- smoke test affected public and admin flows
- confirm no payment or auth regression

## Path To v0.2.0

We should consider `v0.2.0` only when at least one of these becomes true:
- interactive sitemap workflows are ready
- the customer portal becomes a larger product area
- analytics and operations become a stronger management layer
- the platform meaningfully expands beyond the current booking-and-ops maturity path
