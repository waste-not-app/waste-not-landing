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
