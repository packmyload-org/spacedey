# Release Plan: v0.1.0-beta.1

Branch: `feature/payment-controls-cloudinary`  
Proposed tag: `v0.1.0-beta.1`  
Review window: Monday, March 16, 2026 to Wednesday, March 18, 2026

## Release Goal
Ship the first public beta of Spacedey with a solid customer-facing storage discovery and booking experience, verified authentication, essential admin controls, and working support/referral/email flows.

This beta should prove that the platform can:
- attract and convert public traffic,
- support verified account creation,
- let users discover storage locations and unit options,
- initialize and verify payments,
- surface bookings and invoices,
- let admins manage the core platform safely.

## Beta Scope
Included in `v0.1.0-beta.1`:
- Public marketing pages and branded discovery flows
- Search and location browsing
- City and state landing pages
- Site detail pages
- OpenStreetMap / MapLibre migration
- Signup, login, forgot password, reset password, email verification
- Checkout and payment initialization
- Booking and invoice basics
- Admin basics for users, blogs, sites, invoices, and payment toggles
- Newsletter welcome and core transactional email flows
- Support, referral, and landlord conversation foundations

Explicitly not required for this beta:
- Full operations queue
- Rich invoice detail workflows
- Agreement/signature system
- Interactive sitemap allocation
- Full customer “My Units” portal
- Admin analytics dashboards
- Dynamic pricing automation

## Release Checklist
## Public Experience
- Verify home page, locations page, search page, product page, blog, referral, and support entry points load correctly.
- Verify city and state landing pages render with correct metadata and internal links.
- Verify site detail pages show location, hours, unit types, and add-ons cleanly.
- Verify map views render correctly on search and location pages.

## Authentication
- Verify signup creates a user and sends/handles email verification.
- Verify login blocks unverified users.
- Verify forgot-password and reset-password complete successfully.
- Verify signed-in users are prevented from re-entering auth pages incorrectly.

## Booking & Payments
- Verify checkout can initialize payment successfully.
- Verify payment verification updates booking/invoice state correctly.
- Verify both payment webhook paths are healthy in the target environment.
- Verify bookings and invoices pages show expected records after payment.

## Admin
- Verify admin login and access control.
- Verify site editing, unit-type editing, and media editing.
- Verify admin user create, edit, delete, and verification-aware flows.
- Verify admin blog listing, pagination, create/edit, and publish behavior.
- Verify payment-method settings load and can be changed safely.

## Email
- Verify signup verification email.
- Verify forgot-password email.
- Verify newsletter welcome email.
- Verify billing success or equivalent booking/payment email.
- Verify email links resolve against the correct domain in the target environment.

## Support & Communication
- Verify support conversation start and follow-up messages.
- Verify referral and landlord inquiry conversation flows.
- Verify relevant webhooks or message handling paths are healthy.

## Pre-Tag Checks
- Run `pnpm lint`
- Run `pnpm exec tsc --noEmit --pretty false`
- Run `pnpm build`
- Run a release smoke pass on a production-like deployment

## Release Risks
- Environment completeness:
  - Resend
  - Cloudinary
  - payment providers
  - map tile configuration
- Migration safety across recent schema additions:
  - user verification
  - payment settings
  - content/referral tables
  - conversation/message tables
- Payment regression risk across initialize, verify, and webhook flows
- Email deliverability and template QA risk
- Map regression risk because map/search work changed repeatedly in this window

## Go / No-Go Guidance
Go for beta if:
- auth, checkout, payment verify, bookings, invoices, and admin basics all pass smoke testing
- migrations run cleanly
- email templates send successfully
- core public pages render correctly

Hold beta if:
- payment verification is unstable
- email verification/reset is broken
- admin site or user management is failing
- maps are unreliable on core discovery flows

## Recommended Release Notes Framing
Suggested release headline:

`Spacedey Beta 1: verified auth, location discovery, map migration, admin controls, and in-app support`

## Next Milestone After Beta
Target the next release around operational depth:
- admin invoice detail
- manual payment entry
- unit operations
- move-in date support
- agreement/signature
- product/add-on checkout support

