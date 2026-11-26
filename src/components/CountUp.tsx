import { useEffect, useRef } from "react";

/**
 * Counts from zero to `value` once the number scrolls into view. Writes the
 * text node directly, so the count never re-renders React.
 */
export function CountUp({
  value,
  decimals = 0,
  duration = 1400,
}: {
  value: number;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const final = value.toFixed(decimals);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = (value * eased).toFixed(decimals);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        el.textContent = (0).toFixed(decimals);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, decimals, duration]);

  return (
    <span ref={ref} className="count-up">
      {final}
    </span>
  );
}
