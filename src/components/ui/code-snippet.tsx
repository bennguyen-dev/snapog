import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeSnippet = () => {
  const codeString = `
  <!-- Put in your <head> tag -->
  <meta
    property="og:image"
    content="https://image.social/get?url=your.rentals/your/example/path"
  />
  `;

  return (
    <SyntaxHighlighter language="html" style={okaidia}>
      {codeString}
    </SyntaxHighlighter>
  );
};

CodeSnippet.displayName = "CodeSnippet";

export { CodeSnippet };
