import { useEffect } from "react";

/**
 * One delegated listener for every `[data-tilt]` and `[data-magnetic]`
 * element. It writes --mx/--my (-1 to 1) and --sx/--sy (pixels from the
 * top-left corner) on the element under the pointer, once per frame. CSS
 * turns them into composited transforms for card tilt, glare, and magnetic
 * buttons. Touch devices and reduced motion get no listener at all.
 */
export function usePointerSurfaces() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    let active: HTMLElement | null = null;
    let frame = 0;
    let rect: DOMRect | null = null;
    let px = 0;
    let py = 0;

    const reset = (el: HTMLElement) => {
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
    };
    const write = () => {
      frame = 0;
      if (!active || !rect) return;
      const x = (px - rect.left) / rect.width;
      const y = (py - rect.top) / rect.height;
      active.style.setProperty("--mx", (x * 2 - 1).toFixed(3));
      active.style.setProperty("--my", (y * 2 - 1).toFixed(3));
      active.style.setProperty("--sx", `${(px - rect.left).toFixed(1)}px`);
      active.style.setProperty("--sy", `${(py - rect.top).toFixed(1)}px`);
    };
    const onMove = (event: PointerEvent) => {
      const el = (event.target as Element | null)?.closest<HTMLElement>(
        "[data-tilt], [data-magnetic]",
      );
      if (el !== active) {
        if (active) reset(active);
        active = el ?? null;
        rect = active ? active.getBoundingClientRect() : null;
      }
      if (!active) return;
      px = event.clientX;
      py = event.clientY;
      if (!frame) frame = requestAnimationFrame(write);
    };
    const onScroll = () => {
      if (active) rect = active.getBoundingClientRect();
    };
    const onLeave = () => {
      if (active) reset(active);
      active = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}
