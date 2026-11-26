import type { CSSProperties, ReactNode } from "react";
import { RevealText } from "./RevealText";

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const steps: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: "Photo",
    body: "Snap one item. The photo leaves your phone only when you tap scan.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          className="draw"
          pathLength={1}
          d="M4 8.5a2 2 0 0 1 2-2h1.8l1.3-2h5.8l1.3 2H18a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8.5Z"
          {...stroke}
        />
        <circle
          className="draw"
          pathLength={1}
          cx="12"
          cy="12.5"
          r="3.4"
          {...stroke}
        />
      </svg>
    ),
  },
  {
    title: "Object",
    body: "A detection model suggests what it is. You pick the right match or choose the type yourself.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          className="draw"
          pathLength={1}
          d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"
          {...stroke}
        />
        <path className="draw" pathLength={1} d="M9 12.5l2 2 4-5" {...stroke} />
      </svg>
    ),
  },
  {
    title: "Condition",
    body: "Answer a few questions: can it be cleaned, what it held, and whether a collector near you takes it.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          className="draw"
          pathLength={1}
          d="M9 6h10M9 12h10M9 18h10"
          {...stroke}
        />
        <path
          className="draw"
          pathLength={1}
          d="M4.5 6l1 1 2-2M4.5 12l1 1 2-2"
          {...stroke}
        />
        <circle
          className="draw"
          pathLength={1}
          cx="6"
          cy="18"
          r="1.4"
          {...stroke}
        />
      </svg>
    ),
  },
  {
    title: "Advice",
    body: "Get a Reduce, Reuse, Recycle, or Trash suggestion with its reason, then log it in one tap.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          className="draw"
          pathLength={1}
          d="M18.5 4.5C11.5 4.5 6 8 6 14c0 2.8 1.8 4.5 4.5 4.5 6.2 0 8.5-6.5 8-14Z"
          {...stroke}
        />
        <path
          className="draw"
          pathLength={1}
          d="M4 20c2.5-4.5 5.5-7.5 10-10"
          {...stroke}
        />
      </svg>
    ),
  },
];

const notes = [
  "Gemini never receives your photo, only the object details",
  "Nothing is logged until you confirm",
  "Scan photos are cleared from the app within about an hour",
];

export function ScanFlow() {
  return (
    <section className="section scan-flow" id="scan">
      <div className="container">
        <div className="section-head" data-reveal="up">
          <p className="eyebrow">How a scan works</p>
          <h2>
            <RevealText text="Four quick steps, and you stay in charge." />
          </h2>
          <p>
            The AI only suggests. You check the item, answer what it can't see,
            and decide what gets logged.
          </p>
        </div>

        <ol className="flow-steps" data-reveal="up">
          <span className="flow-line" aria-hidden="true" />
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="flow-step"
              style={{ "--i": i } as CSSProperties}
            >
              <span className="flow-icon" aria-hidden="true">
                {step.icon}
              </span>
              <span className="flow-num">Step {i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>

        <ul className="flow-notes" data-reveal="up">
          {notes.map((note, i) => (
            <li key={note} style={{ "--i": i } as CSSProperties}>
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3.5 8.5l3 3 6-7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {note}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
