import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col justify-center py-20">
      <p className="eyebrow">404 — Nothing here</p>
      <h1 className="display mt-4 max-w-2xl">This page took a different route.</h1>
      <p className="mt-4 max-w-md text-sm text-muted">
        The link may be stale, or the project may have been renamed. The search palette can find
        what actually exists.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
        >
          Back home
        </Link>
        <Link href="/#work" className="rounded-full border border-line px-4 py-2 text-sm">
          See selected work
        </Link>
      </div>
    </div>
  );
}
