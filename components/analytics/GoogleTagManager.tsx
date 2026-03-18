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
