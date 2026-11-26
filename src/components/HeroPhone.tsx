import { useEffect, useRef, useState } from "react";
import type { ScreenId } from "../types";
import { AndroidScreen } from "./AndroidScreen";

const cycle: ScreenId[] = ["home", "history", "guide"];

/**
 * The center hero phone. It steps through a few screens on its own while it
 * is on screen, the tab is visible, and the visitor isn't pointing at it.
 */
export function HeroPhone() {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let visible = false;
    let hovered = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    const enter = () => (hovered = true);
    const leave = () => (hovered = false);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    const timer = window.setInterval(() => {
      if (visible && !hovered && document.visibilityState === "visible") {
        setIndex((i) => (i + 1) % cycle.length);
      }
    }, 3400);
    return () => {
      observer.disconnect();
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="trio-center" ref={ref}>
      <AndroidScreen screen={cycle[index]} />
      <div className="hero-dots" aria-hidden="true">
        {cycle.map((id, i) => (
          <span key={id} className={i === index ? "is-active" : undefined} />
        ))}
      </div>
    </div>
  );
}
