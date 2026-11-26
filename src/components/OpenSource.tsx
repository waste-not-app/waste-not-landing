import type { CSSProperties } from "react";
import { Arrow } from "./Arrow";
import { RevealText } from "./RevealText";

const repos = [
  {
    name: "waste-not-android",
    role: "Android app",
    stack: ["Kotlin", "Jetpack Compose"],
    line: "AchievementsScreen()",
  },
  {
    name: "waste-not-backend",
    role: "API and data",
    stack: ["Go", "PostgreSQL"],
    line: "Handler.CreateLog()",
  },
  {
    name: "waste-not-ai",
    role: "Detection and advice",
    stack: ["Python", "YOLO", "Gemini"],
    line: "detector_for(args)",
  },
  {
    name: "waste-not-landing",
    role: "This website",
    stack: ["React", "Vite"],
    line: "function App()",
  },
];

/** Links to the four public repositories behind WasteNot. */
export function OpenSource() {
  return (
    <section className="section open-source" id="open-source">
      <div className="container">
        <div className="section-head" data-reveal="up">
          <p className="eyebrow">Built in the open</p>
          <h2>
            <RevealText text="Every part of WasteNot is on GitHub." />
          </h2>
          <p>
            Read how the app, the API, and the AI pipeline work, or follow along
            as they change.
          </p>
        </div>

        <div className="repo-grid">
          {repos.map((repo, i) => (
            <a
              key={repo.name}
              className="repo-card"
              href={`https://github.com/waste-not-app/${repo.name}`}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal="up"
              data-tilt
              style={{ "--reveal-delay": `${i * 80}ms` } as CSSProperties}
            >
              <span className="repo-code" aria-hidden="true">
                <span className="repo-caret">›</span>
                <span
                  className="repo-typed"
                  style={{ "--chars": repo.line.length } as CSSProperties}
                >
                  {repo.line}
                </span>
              </span>
              <span className="repo-role">{repo.role}</span>
              <strong className="repo-name">{repo.name}</strong>
              <span className="repo-stack">
                {repo.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </span>
              <span className="repo-link">
                View on GitHub <Arrow diagonal />
                <span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
