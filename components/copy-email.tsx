"use client";

import { useState } from "react";
import { Icon } from "./icon";

export function CopyEmail({ email, label = "Copy email" }: { email: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[0.62rem] tracking-[0.12em] uppercase text-muted transition-colors hover:border-fg/40 hover:text-fg"
    >
      <Icon name={copied ? "check" : "copy"} size={13} />
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
