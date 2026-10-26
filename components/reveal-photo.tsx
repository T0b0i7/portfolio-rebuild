"use client";

import { useState } from "react";

export function RevealPhoto() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="relative">
      <div
        className="relative aspect-4/5 w-full max-w-[18rem] overflow-hidden rounded-xl border border-line"
        style={{
          background:
            revealed
              ? "linear-gradient(160deg, color-mix(in oklch, var(--accent) 30%, var(--bg-elevated)), var(--bg-elevated))"
              : "repeating-linear-gradient(45deg, var(--bg-elevated) 0 10px, color-mix(in oklch, var(--fg) 5%, var(--bg-elevated)) 10px 20px)",
        }}
      >
        <span className="absolute inset-x-0 bottom-0 p-4 font-mono text-[0.6rem] tracking-[0.14em] uppercase text-muted">
          {revealed ? "Photo placeholder" : "Portrait hidden"}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setRevealed((value) => !value)}
        aria-pressed={revealed}
        className="mt-3 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[0.62rem] tracking-[0.12em] uppercase text-muted hover:text-fg"
      >
        {revealed ? "Hide photo" : "Reveal photo"}
      </button>
    </div>
  );
}
