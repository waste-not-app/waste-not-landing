import type { CSSProperties, ReactNode } from "react";
import { KineticText } from "./KineticText";

const questions: { q: string; a: ReactNode }[] = [
  {
    q: "Which phones can run WasteNot?",
    a: "Any phone on Android 11 or newer.",
  },
  {
    q: "How do I install the APK?",
    a: "Download it from this page and open the file. If Android asks, allow installs from your browser for this one app, then open WasteNot and create an account.",
  },
  {
    q: "Does the AI see my photos?",
    a: "Your scan photo goes to the WasteNot detection service and is never saved as a log attachment. When Gemini helps write the advice, it gets the object details and guide evidence, never your photo, name, or email.",
  },
  {
    q: "Is the AI advice always right?",
    a: "No. It's a suggestion you confirm. Always check the item's condition and what your local collection point accepts.",
  },
  {
    q: "Can I use it without the camera or a connection?",
    a: "Yes. You can log everything by hand, and logs made offline wait on your phone until they can sync.",
  },
  {
    q: "How do I delete my account?",
    a: (
      <>
        Open Profile, then Settings, then Delete account. The{" "}
        <a href="/privacy/">privacy policy</a> explains what is removed and
        when.
      </>
    ),
  },
];

export function Faq() {
  return (
    <section className="section faq" id="faq">
      <div className="container faq-grid">
        <div className="faq-head" data-reveal="up">
          <p className="eyebrow">
            <KineticText text="Questions" />
          </p>
          <h2>
            <KineticText text="Good to know before you start." />
          </h2>
          <p>
            Still unsure about something? The{" "}
            <a className="inline-link" href="/privacy/">
              privacy policy
            </a>{" "}
            covers the details.
          </p>
        </div>
        <div className="faq-list">
          {questions.map((item, i) => (
            <details
              key={item.q}
              className="faq-item"
              data-reveal="up"
              style={{ "--reveal-delay": `${i * 50}ms` } as CSSProperties}
            >
              <summary>
                {item.q}
                <span className="faq-plus" aria-hidden="true" />
              </summary>
              <div className="faq-answer">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
