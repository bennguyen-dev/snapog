import React from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

interface IProps extends React.ComponentProps<typeof SyntaxHighlighter> {
  children: string;
  className?: string;
}

const CodeSnippet = ({ children, className, ...rest }: IProps) => {
  return (
    <div className={className}>
      <SyntaxHighlighter
        language="html"
        customStyle={{
          margin: 0,
        }}
        lineProps={{
          style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
        }}
        wrapLines
        wrapLongLines
        {...rest}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

CodeSnippet.displayName = "CodeSnippet";

export { CodeSnippet };
