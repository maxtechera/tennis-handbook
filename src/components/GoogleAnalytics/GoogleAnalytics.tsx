import React from 'react';
import Head from '@docusaurus/Head';

export default function GoogleAnalytics() {
  const GA_MEASUREMENT_ID = 'G-E4P2L6BMXG';
  
  return (
    <Head>
      {/* Google tag (gtag.js) */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </Head>
  );
}