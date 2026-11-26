import type { CSSProperties } from "react";
import { KineticText } from "./KineticText";

const sw = {
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Smaller app features the main sections don't cover, as a bento grid. */
export function MoreFeatures() {
  return (
    <section className="section more" id="more">
      <div className="container">
        <div className="section-head" data-reveal="up">
          <p className="eyebrow">
            <KineticText text="Also in the app" />
          </p>
          <h2>
            <KineticText text="The small things that keep you going." />
          </h2>
        </div>

        <div className="bento">
          <article
            className="bento-tile bento-offline"
            data-reveal="up"
            data-tilt
          >
            <div className="queue-demo" aria-hidden="true">
              <span className="queue-cloud">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7.5 18.5h9.8a3.7 3.7 0 0 0 .5-7.4A5.5 5.5 0 0 0 7.2 9.6a4.5 4.5 0 0 0 .3 8.9Z"
                    {...sw}
                  />
                </svg>
              </span>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="queue-item"
                  style={{ "--i": i } as CSSProperties}
                >
                  Log {i + 1}
                </span>
              ))}
            </div>
            <h3>Works offline</h3>
            <p>
              No signal? Your logs wait in a local queue and sync as soon as you
              are back online.
            </p>
          </article>

          <article
            className="bento-tile bento-level"
            data-reveal="up"
            data-tilt
            style={{ "--reveal-delay": "80ms" } as CSSProperties}
          >
            <div className="level-ring" aria-hidden="true">
              <svg viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" className="ring-track" />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  className="ring-fill"
                  pathLength={1}
                />
              </svg>
              <strong>Lv 1</strong>
            </div>
            <h3>Levels and achievements</h3>
            <p>Every log earns XP, and steady habits unlock achievements.</p>
          </article>

          <article
            className="bento-tile"
            data-reveal="up"
            data-tilt
            style={{ "--reveal-delay": "60ms" } as CSSProperties}
          >
            <span className="bento-icon icon-bell" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M6.5 16.5V11a5.5 5.5 0 1 1 11 0v5.5l1.5 1.5H5l1.5-1.5ZM10 20.5h4"
                  {...sw}
                />
              </svg>
            </span>
            <h3>Gentle reminders</h3>
            <p>An optional daily nudge, sent from your phone.</p>
          </article>

          <article
            className="bento-tile"
            data-reveal="up"
            data-tilt
            style={{ "--reveal-delay": "120ms" } as CSSProperties}
          >
            <span className="bento-icon icon-pin" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11Z"
                  {...sw}
                />
                <circle cx="12" cy="10" r="2.3" {...sw} />
              </svg>
            </span>
            <h3>Collection points</h3>
            <p>
              Find where to drop recyclables, no location permission needed.
            </p>
          </article>

          <article
            className="bento-tile"
            data-reveal="up"
            data-tilt
            style={{ "--reveal-delay": "180ms" } as CSSProperties}
          >
            <span className="bento-icon icon-moon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.7 7.7 0 1 0 10 10Z"
                  {...sw}
                />
              </svg>
            </span>
            <h3>Light and dark</h3>
            <p>Follows your phone's theme, or pick one yourself.</p>
          </article>

          <article
            className="bento-tile"
            data-reveal="up"
            data-tilt
            style={{ "--reveal-delay": "240ms" } as CSSProperties}
          >
            <span className="bento-icon icon-shield" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3.5l7 2.6v5.4c0 4.4-3 7.8-7 9-4-1.2-7-4.6-7-9V6.1l7-2.6Z"
                  {...sw}
                />
                <path d="M9 12l2.2 2.2L15.5 10" {...sw} />
              </svg>
            </span>
            <h3>Your data, your call</h3>
            <p>
              Sign in with email or Google, and delete your account from
              Settings.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
