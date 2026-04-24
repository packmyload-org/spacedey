import Script from 'next/script';

type GoogleTagManagerProps = {
  containerId?: string;
};

export default function GoogleTagManager({ containerId }: GoogleTagManagerProps) {
  if (!containerId) {
    return null;
  }

  return (
    <>
      <Script id="gtm-consent" strategy="afterInteractive" data-cookieconsent="ignore">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            window.dataLayer.push(arguments);
          }
          gtag("consent", "default", {
            ad_personalization: "denied",
            ad_storage: "denied",
            ad_user_data: "denied",
            analytics_storage: "granted",
            functionality_storage: "granted",
            personalization_storage: "granted",
            security_storage: "granted",
            wait_for_update: 500,
          });
          gtag("set", "ads_data_redaction", true);
          gtag("set", "url_passthrough", false);
        `}
      </Script>
      <Script id="gtm-data-layer" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js',
          });
        `}
      </Script>
      <Script
        id="gtm-loader"
        src={`https://www.googletagmanager.com/gtm.js?id=${containerId}`}
        strategy="afterInteractive"
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${containerId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
