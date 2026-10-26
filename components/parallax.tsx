"use client";

import { useEffect } from "react";

/**
 * Publishes scroll progress (0..1 over the viewport) and normalised pointer
 * position (-1..1) as CSS variables on <html>, so any descendant can consume
 * them through the `.parallax` utility with an arbitrary `--depth`.
 */
export function Parallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    let target = { x: 0, y: 0 };
    let pointer = { x: 0, y: 0 };
    let frame = 0;

    const onScroll = () => {
      target = { x: 0, y: window.scrollY / Math.max(window.innerHeight, 1) };
    };

    const onPointer = (event: PointerEvent) => {
      pointer = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
    };

    const render = () => {
      // ease towards the pointer so the motion stays soft
      target.x += (pointer.x - target.x) * 0.08;
      target.y += (pointer.y - target.y) * 0.08;
      root.style.setProperty("--pointer-x", target.x.toFixed(3));
      root.style.setProperty("--pointer-y", target.y.toFixed(3));
      root.style.setProperty("--scroll", target.y.toFixed(3));
      frame = window.requestAnimationFrame(render);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    frame = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
