"use client";
import React from "react";

import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/utils";

type CodeBlockProps = {
  language: string;
  filename?: string;
  highlightLines?: number[];
  style?: { [key: string]: React.CSSProperties };
  className?: string;
} & (
  | {
      code: string;
      tabs?: never;
    }
  | {
      code?: never;
      tabs: Array<{
        name: string;
        code: string;
        language?: string;
        highlightLines?: number[];
      }>;
    }
);

export const CodeBlock = ({
  language,
  filename,
  code,
  style = atomDark,
  highlightLines = [],
  tabs = [],
  className,
}: CodeBlockProps) => {
  const [copied, setCopied] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);

  const tabsExist = tabs.length > 0;

  const copyToClipboard = async () => {
    const textToCopy = tabsExist ? tabs[activeTab].code : code;
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activeCode = tabsExist ? tabs[activeTab].code : code;
  const activeLanguage = tabsExist
    ? tabs[activeTab].language || language
    : language;
  const activeHighlightLines = tabsExist
    ? tabs[activeTab].highlightLines || []
    : highlightLines;

  return (
    <div
      className={cn(
        "relative w-full rounded-lg bg-slate-900 px-6 pb-1 pt-3 font-mono text-sm",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        {tabsExist && (
          <div className="flex overflow-x-auto">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`!py-2 px-3 font-sans text-xs transition-colors ${
                  activeTab === index
                    ? "text-white"
                    : "text-zinc-200 hover:text-zinc-200"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}
        {!tabsExist && (
          <div
            className={cn(
              "flex items-center justify-between pb-3 pt-1",
              !filename && "pb-0",
            )}
          >
            <div className="text-xs text-zinc-200">{filename ?? ""}</div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 font-sans text-xs text-zinc-400 transition-colors hover:text-zinc-200"
            >
              <span className="sr-only">Copy</span>
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        )}
      </div>
      <ScrollArea className={cn("pb-5", filename && "pb-3")}>
        <SyntaxHighlighter
          language={activeLanguage}
          style={style}
          customStyle={{
            margin: 0,
            padding: 0,
            background: "transparent",
            fontSize: "0.875rem", // text-sm equivalent
          }}
          wrapLines={true}
          showLineNumbers={true}
          lineProps={(lineNumber) => ({
            style: {
              backgroundColor: activeHighlightLines.includes(lineNumber)
                ? "rgba(255,255,255,0.1)"
                : "transparent",
              display: "block",
              width: "100%",
            },
          })}
          PreTag="div"
        >
          {String(activeCode)}
        </SyntaxHighlighter>
        <ScrollBar orientation="horizontal" />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};
