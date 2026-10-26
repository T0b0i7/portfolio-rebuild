"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { OPEN_PALETTE_EVENT } from "./site-header";
import { Icon } from "./icon";
import type { SearchEntry } from "@/lib/search-index";

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load the index once, on first open.
  useEffect(() => {
    if (!open || entries.length > 0) return;
    let cancelled = false;
    setLoading(true);
    fetch("/search-index.json")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SearchEntry[]) => {
        if (!cancelled) setEntries(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, entries.length]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "/" && !open) {
        const target = event.target as HTMLElement | null;
        if (target && /input|textarea|select/i.test(target.tagName)) return;
        event.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);

    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setActive(0);
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(id);
    };
  }, [open]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return entries;
    return entries.filter((entry) =>
      `${entry.title} ${entry.hint} ${entry.keywords}`.toLowerCase().includes(term),
    );
  }, [entries, query]);

  function go(entry: SearchEntry | undefined) {
    if (!entry) return;
    setOpen(false);
    setQuery("");
    router.push(entry.href as never);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, results.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    }
    if (event.key === "Enter") {
      event.preventDefault();
      go(results[active]);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-start justify-center p-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <button
        type="button"
        aria-label="Close search"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
      />
      <div className="reveal relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Icon name="search" size={16} className="shrink-0 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search projects, writing, pages…"
            aria-label="Search query"
            aria-controls="search-results"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[0.62rem] text-muted">
            esc
          </kbd>
        </div>

        <ul id="search-results" role="listbox" className="max-h-80 overflow-y-auto p-2">
          {loading && <li className="px-3 py-6 text-center text-sm text-muted">Loading…</li>}
          {!loading && results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted">No results for “{query}”</li>
          )}
          {results.map((entry, index) => (
            <li key={entry.id} role="option" aria-selected={index === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(index)}
                onClick={() => go(entry)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left"
                style={{
                  background: index === active ? "color-mix(in oklch, var(--fg) 8%, transparent)" : undefined,
                }}
              >
                <span className="font-mono text-[0.6rem] tracking-[0.12em] uppercase text-muted">
                  {entry.group}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">{entry.title}</span>
                  <span className="block truncate text-xs text-muted">{entry.hint}</span>
                </span>
                <Icon name="arrow-up-right" size={14} className="shrink-0 text-muted" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
