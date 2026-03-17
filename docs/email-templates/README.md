# Resend Email Templates

These HTML templates are ready to upload into Resend as custom templates.

After creating them in Resend, paste the identifiers into `lib/email/resend.ts` under `RESEND_TEMPLATE_IDS`.

Suggested template names:

- `signup-verification`
- `forgot-password`
- `billing-success`
- `newsletter-welcome`

Suggested variables:

## Signup verification

- `firstName`
- `verificationUrl`
- `supportEmail`

## Forgot password

- `firstName`
- `resetUrl`
- `supportEmail`

## Billing success

- `firstName`
- `siteName`
- `invoiceNumber`
- `amountPaid`
- `billingType`
- `bookingsUrl`
- `invoicesUrl`
- `supportEmail`

## Newsletter welcome

- `email`
- `blogUrl`
- `supportEmail`

These templates use moustache-style placeholders like `{{firstName}}`, which map well to most transactional email providers.
