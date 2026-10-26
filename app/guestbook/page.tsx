import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { Guestbook } from "@/components/guestbook";

export const metadata: Metadata = {
  title: "Guestbook",
  description: "Sign the wall, leave a note.",
};

export default function GuestbookPage() {
  return (
    <PageShell
      eyebrow="Notes from the guestbook"
      title="Sign the wall, leave a note"
      intro="A small experiment in keeping a corner of the web that is not a feed."
    >
      <Guestbook />
    </PageShell>
  );
}
