"use client";

import SwaggerUI from "swagger-ui-react";

// Importing the CSS file directly can cause TypeScript to complain about missing
// module declarations for side-effect CSS imports. Use a CDN stylesheet link
// instead to avoid that issue.

export default function DocsPage() {
  return (
    <>
      <link
        rel="stylesheet"
        // Using a stable CDN for swagger-ui styles
        href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
      />
      <SwaggerUI url="/api/v1/docs" />
    </>
  );
}