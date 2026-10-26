"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icon";

type Mode = "light" | "dark" | "system";
const STORAGE_KEY = "theme";
const ORDER: Mode[] = ["light", "system", "dark"];
const LABEL: Record<Mode, string> = {
  light: "Light theme",
  dark: "Dark theme",
  system: "System theme",
};
const GLYPH: Record<Mode, string> = {
  light: "sun",
  dark: "moon",
  system: "monitor",
};

function apply(mode: Mode) {
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.classList.toggle("light", mode === "light");
}

// Runs when this client module is evaluated (hydration), not during render:
// no `<script>` in <head>, so extensions cannot desync the markup.
if (typeof document !== "undefined") {
  try {
    apply((localStorage.getItem(STORAGE_KEY) as Mode | null) ?? "system");
  } catch {
    /* storage blocked: keep the OS default from CSS */
  }
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("system");

  useEffect(() => {
    try {
      setMode((localStorage.getItem(STORAGE_KEY) as Mode | null) ?? "system");
    } catch {
      /* ignore */
    }
  }, []);

  function cycle() {
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    setMode(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    apply(next);
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-fg/40 hover:text-fg"
      aria-label={`${LABEL[mode]} — change theme`}
      title={LABEL[mode]}
    >
      <Icon name={GLYPH[mode]} size={15} />
    </button>
  );
}
