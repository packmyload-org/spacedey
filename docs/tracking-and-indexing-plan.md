# Google Verification, Indexing, and Tag Manager Plan

## What was implemented

- Google Search Console verification file is now served from `/googlebb5821e5a51238de.html`.
- Google Tag Manager is mounted once in the root layout when `NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID` is set.
- Next.js client-side route changes now push a `virtual_page_view` event into `dataLayer`.

## Deployment checklist

1. Set `NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID` in your production environment.
2. Deploy the site.
3. Open `/googlebb5821e5a51238de.html` on the live domain and confirm the verification text is visible.
4. In Google Search Console, use the HTML file verification method and click verify.
5. Submit `/sitemap.xml` in Google Search Console.
6. Request indexing for the homepage and your most important landing pages.

## GTM container setup

### 1. Base container

- Create or open your Google Tag Manager web container.
- Use the container ID as `NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID`.
- Publish the container after testing in Preview mode.

### 2. GA4 setup inside GTM

- Create a `Google tag` for your GA4 measurement ID.
- Trigger it on `Initialization - All Pages`.
- Create a second GA4 event tag for SPA pageviews.
- Use event name `page_view`.
- Trigger it on the custom event `virtual_page_view`.
- Map these event parameters from the data layer:
  - `page_location`
  - `page_path`
  - `page_title`

### 3. Meta Pixel setup inside GTM

- Add the Meta Pixel using the community template or a Custom HTML tag.
- Fire the base pixel on `All Pages`.
- Add a second tag for `PageView` tied to the custom event `virtual_page_view`.
- Reuse the same route-change trigger pattern so Meta receives client-side navigation events.

## Recommended first events after pageviews

Start with these events before adding more:

| Event | Trigger | Recommended properties |
| --- | --- | --- |
| `cta_clicked` | Hero, footer, pricing, storage inquiry CTAs | `cta_name`, `cta_location` |
| `form_submitted` | Newsletter, support, referral, landlord forms | `form_name`, `form_location` |
| `signup_completed` | Successful account creation | `method` |
| `checkout_started` | Checkout entry | `site_id`, `unit_type`, `price` |
| `checkout_completed` | Successful payment or booking | `site_id`, `booking_id`, `value`, `currency` |
| `lead_submitted` | Referral or landlord inquiry | `lead_type` |

## Validation steps

1. Use GTM Preview mode and confirm the container loads on first page view.
2. Navigate to a second page and confirm `virtual_page_view` appears in the GTM event timeline.
3. Confirm the GA4 SPA pageview tag fires on `virtual_page_view`.
4. Confirm the Meta Pixel `PageView` tag also fires on `virtual_page_view`.
5. Use GA4 DebugView and the Meta Pixel Helper to verify live hits.

## Notes

- This app still includes Vercel Analytics. That can stay enabled, but GTM should be the source of truth for marketing tags.
- If you later add conversion events in code, push them through `dataLayer` rather than adding direct `gtag` or `fbq` calls.
