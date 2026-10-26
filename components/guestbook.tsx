"use client";

import { useEffect, useState } from "react";
import { guestbookSeed } from "@/lib/pages-content";

type Entry = { name: string; message: string; date: string };
const STORAGE_KEY = "guestbook";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>(guestbookSeed);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  // Local persistence only — swap for a server action + database when ready.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const stored = raw ? (JSON.parse(raw) as Entry[]) : [];
      if (Array.isArray(stored) && stored.length > 0) setEntries([...stored, ...guestbookSeed]);
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const cleanName = name.trim().slice(0, 40);
    const cleanMessage = message.trim().slice(0, 240);
    if (!cleanName || !cleanMessage) {
      setStatus("Add a name and a note first.");
      return;
    }

    const entry: Entry = { name: cleanName, message: cleanMessage, date: new Date().toISOString() };
    const next = [entry, ...entries];
    setEntries(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next.filter((item) => !guestbookSeed.some((seed) => seed.date === item.date))));
    } catch {
      /* storage full or unavailable */
    }
    setName("");
    setMessage("");
    setStatus("Signed. Thanks for stopping by.");
  }

  return (
    <div className="space-y-10">
      <form onSubmit={onSubmit} className="card space-y-3 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs text-muted">
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={40}
              required
              className="mt-1.5 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-fg/40"
            />
          </label>
          <label className="text-xs text-muted">
            Note <span className="text-muted/70">({240 - message.length} left)</span>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={240}
              required
              className="mt-1.5 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-fg/40"
            />
          </label>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-full bg-fg px-4 py-2 text-sm text-bg transition-transform hover:-translate-y-0.5"
          >
            Sign the wall
          </button>
          <p className="text-xs text-muted" aria-live="polite">
            {status}
          </p>
        </div>
        <p className="text-[0.65rem] text-muted">
          Notes are stored in your browser only — no account, no tracking.
        </p>
      </form>

      <ul className="space-y-3">
        {entries.map((entry, index) => (
          <li key={`${entry.date}-${index}`} className="card p-4">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-sm font-medium">{entry.name}</p>
              <p className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-muted">
                {formatDate(entry.date)}
              </p>
            </div>
            <p className="mt-1.5 text-sm text-muted">{entry.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
