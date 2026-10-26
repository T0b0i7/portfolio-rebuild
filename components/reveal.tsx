"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  once?: boolean;
};

/**
 * Fades content in when it enters the viewport. Uses one IntersectionObserver
 * per instance and falls back to visible when the API is missing or the user
 * asked for reduced motion.
 */
export function Reveal({ children, as: Tag = "div", className = "", delay = 0, once = true }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      node.dataset.visible = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.dataset.visible = "true";
            if (once) observer.unobserve(node);
          } else if (!once) {
            node.dataset.visible = "false";
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref as never}
      data-reveal=""
      data-visible="false"
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
      className={className}
    >
      {children}
    </Tag>
  );
}
