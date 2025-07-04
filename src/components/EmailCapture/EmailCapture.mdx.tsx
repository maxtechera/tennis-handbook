import React from "react";
import { ContentEmailCapture } from "./ContentEmailCapture";

// This component can be imported in MDX files to add email capture
// Usage in MDX: import EmailCapture from '@site/src/components/EmailCapture/EmailCapture.mdx';
// Then use: <EmailCapture />

function EmailCapture() {
  // Get the current page path for tracking
  const source =
    typeof window !== "undefined"
      ? `content-${window.location.pathname.replace(/\//g, "-")}`
      : "content-unknown";

  return <ContentEmailCapture source={source} />;
}

// Export toc for MDX compatibility
export const toc = [];

export default EmailCapture;
