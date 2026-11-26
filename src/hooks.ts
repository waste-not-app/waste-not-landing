import { useEffect, useSyncExternalStore, type RefObject } from "react";

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * Writes the pointer position over `ref` into the --px and --py custom
 * properties (-1 to 1), at most once per frame and without a React render.
 * CSS turns them into composited translate values, so nothing repaints.
 */
export function usePointerParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const write = () => {
      frame = 0;
      el.style.setProperty("--px", x.toFixed(3));
      el.style.setProperty("--py", y.toFixed(3));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      schedule();
    };
    const onLeave = () => {
      x = 0;
      y = 0;
      schedule();
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);
}

/**
 * Calls `onStep` with the `data-step` value of whichever element crosses the
 * middle band of the viewport. Used to sync the sticky demo phone with the
 * feature list while scrolling.
 */
export function useScrollSteps(
  selector: string,
  enabled: boolean,
  onStep: (step: string) => void,
  isLocked: () => boolean,
) {
  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return;
    const targets = document.querySelectorAll<HTMLElement>(selector);
    const observer = new IntersectionObserver(
      (entries) => {
        if (isLocked()) return;
        for (const entry of entries) {
          const step = (entry.target as HTMLElement).dataset.step;
          if (entry.isIntersecting && step) onStep(step);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector, enabled, onStep, isLocked]);
}

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
