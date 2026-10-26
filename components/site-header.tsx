"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { Icon } from "./icon";
import { ThemeToggle } from "./theme-toggle";

export const OPEN_PALETTE_EVENT = "portfolio:open-palette";

export function SiteHeader() {
  const [shortcut, setShortcut] = useState("Ctrl K");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const isMac = /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent);
    setShortcut(isMac ? "⌘K" : "Ctrl K");

    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 border-b border-line/70 backdrop-blur-xl transition-colors"
      style={{ backgroundColor: "color-mix(in oklch, var(--bg) 82%, transparent)" }}
    >
      <div className="shell flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-xs tracking-[0.16em] uppercase"
        >
          <span
            className="size-2 rounded-full bg-accent"
            style={{ opacity: scrolled ? 1 : 0.4, transition: "opacity .3s" }}
            aria-hidden="true"
          />
          {site.name}
        </Link>

        <nav aria-label="Projects" className="hidden items-center gap-7 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-underline font-mono text-[0.7rem] tracking-[0.14em] uppercase text-muted hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            className="flex h-9 items-center gap-2 rounded-full border border-line px-3 font-mono text-[0.7rem] tracking-wide text-muted transition-colors hover:border-fg/40 hover:text-fg"
            aria-label="Search"
            aria-keyshortcuts="Control+K Meta+K"
          >
            <Icon name="search" size={14} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded border border-line px-1 py-px text-[0.62rem] sm:inline">
              {shortcut}
            </kbd>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
