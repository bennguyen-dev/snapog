import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

interface IProps {
  children: string;
}

const CodeSnippet = ({ children }: IProps) => {
  return (
    <SyntaxHighlighter language="html" style={okaidia}>
      {children}
    </SyntaxHighlighter>
  );
};

CodeSnippet.displayName = "CodeSnippet";

export { CodeSnippet };
