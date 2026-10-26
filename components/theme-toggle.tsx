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
  const dark =
    mode === "dark" ||
    (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
}

/** Loads the pre-paint theme bootstrap from /theme-init.js (see that file). */
export function ThemeScript() {
  return <script src="/theme-init.js" />;
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Mode | null) ?? "system";
    setMode(stored);
    setReady(true);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if ((localStorage.getItem(STORAGE_KEY) as Mode | null) === "system") apply("system");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function cycle() {
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    setMode(next);
    localStorage.setItem(STORAGE_KEY, next);
    apply(next);
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-fg/40 hover:text-fg"
      aria-label={`${LABEL[mode]} — change theme`}
      title={LABEL[mode]}
      data-ready={ready}
    >
      <Icon name={GLYPH[mode]} size={15} />
    </button>
  );
}
