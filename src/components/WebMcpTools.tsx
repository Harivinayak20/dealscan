"use client";

import { useEffect } from "react";

/**
 * Exposes DealScan's deal analyzer to in-browser AI agents via WebMCP.
 * No-ops in browsers without navigator.modelContext, which is most of them.
 */
type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (args: Record<string, unknown>) => Promise<{
    content: { type: "text"; text: string }[];
  }>;
};

type ModelContext = {
  provideContext: (context: { tools: WebMcpTool[] }) => void;
};

export function WebMcpTools() {
  useEffect(() => {
    const modelContext = (navigator as Navigator & { modelContext?: ModelContext })
      .modelContext;
    if (!modelContext?.provideContext) return;

    modelContext.provideContext({
      tools: [
        {
          name: "analyze_listing",
          description:
            "Score a used-car listing from 0-100 with a verdict, red flags, good signs, a fair-value range, and a suggested offer. Accepts a public listing URL or pasted listing text.",
          inputSchema: {
            type: "object",
            properties: {
              url: { type: "string", description: "Public listing URL" },
              text: { type: "string", description: "Pasted listing text" },
            },
          },
          execute: async (args) => {
            const response = await fetch("/api/v1/analyze", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(args),
            });
            const text = await response.text();
            return { content: [{ type: "text", text }] };
          },
        },
      ],
    });
  }, []);

  return null;
}
