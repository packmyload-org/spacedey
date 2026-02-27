# Spacedey Release Checklist (Auth + Locations)

## Pre-release checks
- [ ] Set environment variables in deployment target:
  - `STOREGANISE_API_URL`
  - `STOREGANISE_API_KEY`
  - `RECAPTCHA_SECRET_KEY`
  - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- [ ] Confirm Storeganise API base URL is reachable from server runtime.
- [ ] Confirm reCAPTCHA keys are for the correct domain.
- [ ] Run smoke checks:
  - [ ] Sign up with valid email/password
  - [ ] Sign in with created account
  - [ ] Forgot password request returns success message
  - [ ] Reset password works with valid token
  - [ ] `/locations` loads site data
  - [ ] `/locations/[siteId]` renders units, contact details, and sitemap (if available)

## UI/UX checks
- [ ] Auth screens are visually consistent (card style, spacing, input focus states).
- [ ] Body text and helper text have readable contrast on light backgrounds.
- [ ] Hero search input icon/placeholder remain readable.
- [ ] Site details page address, products, and helper labels are legible.

## Build checks
- [ ] `pnpm lint` (currently fails on pre-existing lint debt)
- [ ] `pnpm build`
- [ ] Verify no runtime errors in browser console on auth and locations pages.

## Known unresolved risks
1. **Lint debt (blocking strict CI):** repository has pre-existing ESLint errors unrelated to this patch (e.g., `no-explicit-any`, react hooks static component/effect rules).
2. **Auth token behavior not fully end-to-end validated:** only API-level validation and connectivity checks were performed; valid credential login and real email reset cycle still need full QA.
3. **Storeganise response variance risk:** localized/address fields may vary by tenant config; additional fallback handling may be needed if some site fields are missing.
4. **Sitemap optionality:** some sites may return no sitemap; UI currently handles this but needs product sign-off on empty-state messaging.
