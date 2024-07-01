import React from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface IProps extends React.ComponentProps<typeof SyntaxHighlighter> {
  children: string;
}

const CodeSnippet = ({ children, ...rest }: IProps) => {
  return (
    <SyntaxHighlighter
      language="html"
      style={vscDarkPlus}
      wrapLongLines
      customStyle={{
        margin: 0,
      }}
      {...rest}
    >
      {children}
    </SyntaxHighlighter>
  );
};

CodeSnippet.displayName = "CodeSnippet";

export { CodeSnippet };
