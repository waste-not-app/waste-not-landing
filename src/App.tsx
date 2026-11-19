import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./styles/global.css";

type Release = { version: string; size: string; date: string };
type ScreenId = "home" | "ai" | "log" | "history" | "guide" | "stats";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <span className="btn-arrow" aria-hidden="true">
      <svg viewBox="0 0 18 18" fill="none">
        {diagonal ? (
          <path
            d="M4.5 13.5 13.5 4.5M6.5 4.5h7v7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M3.5 9h11M10 4.5 14.5 9 10 13.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </span>
  );
}

function KineticText({ text, accent }: { text: string; accent?: string }) {
  const renderChars = (str: string, isAccent = false) =>
    str.split(" ").map((word, wIdx, arr) => (
      <span key={`${word}-${wIdx}`} className="k-word">
        {word.split("").map((ch, cIdx) => (
          <span
            key={`${ch}-${cIdx}`}
            className={`k-char${isAccent ? " k-accent" : ""}`}
          >
            {ch}
          </span>
        ))}
        {wIdx < arr.length - 1 ? "\u00A0" : ""}
      </span>
    ));

  if (!accent || !text.includes(accent)) {
    return <span className="k-text">{renderChars(text)}</span>;
  }

  const [before, after] = text.split(accent);
  return (
    <span className="k-text">
      {before && renderChars(before)}
      <em className="k-em">{renderChars(accent, true)}</em>
      {after && renderChars(after)}
    </span>
  );
}

function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark" aria-hidden="true">
        <img
          src="/images/wastenot-brand.webp"
          alt=""
          loading="eager"
          decoding="async"
        />
      </span>
      WasteNot<span className="brand-dot">.</span>
    </span>
  );
}

function HeroWBackdrop({ hoverX }: { hoverX: number | null }) {
  const targetRef = useRef({ x: 0.5, weight: 0 });
  const currentRef = useRef({ x: 0.5, weight: 0 });
  const rafRef = useRef<number | null>(null);
  const [motion, setMotion] = useState({ x: 0.5, weight: 0 });

  useEffect(() => {
    if (hoverX === null) {
      targetRef.current.weight = 0;
    } else {
      // When waking from rest, start at the pointer so it doesn't sweep in from the old side
      if (currentRef.current.weight < 0.02) {
        currentRef.current.x = hoverX;
      }
      targetRef.current.x = hoverX;
      targetRef.current.weight = 1;
    }

    if (rafRef.current !== null) return;

    const tick = () => {
      const cur = currentRef.current;
      const tgt = targetRef.current;
      const dx = tgt.x - cur.x;
      const dw = tgt.weight - cur.weight;

      cur.x += dx * 0.09;
      cur.weight += dw * 0.08;

      if (Math.abs(dx) < 0.0008 && Math.abs(dw) < 0.0008) {
        cur.x = tgt.x;
        cur.weight = tgt.weight;
        setMotion({ x: cur.x, weight: cur.weight });
        rafRef.current = null;
        return;
      }

      setMotion({ x: cur.x, weight: cur.weight });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [hoverX]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const bend = (cx: number, radius = 0.28) => {
    if (motion.weight <= 0.001) return 0;
    const dist = Math.abs(motion.x - cx);
    if (dist >= radius) return 0;
    // Smooth cosine bell * global fade-in/out weight
    return (
      Math.pow(0.5 * (1 + Math.cos((dist / radius) * Math.PI)), 1.3) *
      motion.weight
    );
  };

  // Exact 773x546 proportions matching wastenot-w-mark.png; all joints stay coupled
  const pLeaf = bend(0.22, 0.28);
  const pLeftDip = bend(0.26, 0.24);
  const pCenter = bend(0.49, 0.24);
  const pRightDip = bend(0.71, 0.24);
  const pArrow = bend(0.82, 0.28);

  const ltx = (420 + pLeaf * 16).toFixed(1);
  const lty = (22 - pLeaf * 18).toFixed(1);
  const ldy = (526 - pLeftDip * 14).toFixed(1);
  const ldyInner = (462 - pLeftDip * 12).toFixed(1);
  const cpy = (318 - pCenter * 18).toFixed(1);
  const cpyTop = (246 - pCenter * 14).toFixed(1);
  const rdy = (524 - pRightDip * 14).toFixed(1);
  const atx = pArrow * 12;
  const aty = -pArrow * 15;

  return (
    <div className="hero-w-backdrop" aria-hidden="true">
      <svg viewBox="0 0 773 546" fill="none" className="hero-w-svg">
        <defs>
          <linearGradient
            id="wnLeafGrad"
            x1="40"
            y1="300"
            x2="410"
            y2="30"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#1D6149" />
            <stop offset="48%" stopColor="#69B832" />
            <stop offset="100%" stopColor="#A6E244" />
          </linearGradient>
          <linearGradient
            id="wnRibbonGrad"
            x1="80"
            y1="450"
            x2="730"
            y2="140"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#1D6149" />
            <stop offset="28%" stopColor="#69B832" />
            <stop offset="56%" stopColor="#9EDB3A" />
            <stop offset="82%" stopColor="#267355" />
            <stop offset="100%" stopColor="#123F30" />
          </linearGradient>
          <linearGradient
            id="wnFoldGrad"
            x1="360"
            y1="290"
            x2="640"
            y2="490"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#123F30" />
            <stop offset="100%" stopColor="#1D6149" />
          </linearGradient>
        </defs>

        {/* Left leaf, anchored into the ribbon's left arm */}
        <path
          d={`M88 332 C62 198, 152 62, ${ltx} ${lty} C382 156, 282 224, 154 244 C198 176, 288 122, 362 82 C264 124, 160 198, 88 332 Z`}
          fill="url(#wnLeafGrad)"
        />
        <path
          d={`M78 348 C34 232, 108 82, ${ltx} ${lty} C306 68, 186 154, 118 302 C94 334, 78 348, 78 348 Z`}
          fill="#69B832"
          opacity="0.9"
        />

        {/* Inner fold shadow, coupled to the center peak and right valley */}
        <path
          d={`M354 ${cpy} C404 ${(374 - pCenter * 10).toFixed(1)}, 468 ${(460 - pRightDip * 8).toFixed(1)}, 536 ${(492 - pRightDip * 10).toFixed(1)} C580 ${(512 - pRightDip * 10).toFixed(1)}, 628 492, 660 442 C614 452, 568 430, 514 372 C464 ${(316 - pCenter * 10).toFixed(1)}, 408 ${(282 - pCenter * 12).toFixed(1)}, 354 ${cpy} Z`}
          fill="url(#wnFoldGrad)"
          opacity="0.88"
        />

        {/* Continuous W Ribbon + Upward Arrow */}
        <path
          d={`M76 254 C40 384, 112 ${ldy}, 212 ${ldy} C288 ${ldy}, 338 ${(400 - pCenter * 8).toFixed(1)}, 388 ${cpy} C430 ${(278 - pCenter * 12).toFixed(1)}, 466 ${(322 - pCenter * 8).toFixed(1)}, 516 396 C562 466, 614 ${rdy}, 676 488 C746 426, ${(760 + atx).toFixed(1)} ${(292 + aty).toFixed(1)}, ${(702 + atx).toFixed(1)} ${(196 + aty).toFixed(1)} L${(742 + atx).toFixed(1)} ${(170 + aty).toFixed(1)} C${(748 + atx).toFixed(1)} ${(166 + aty).toFixed(1)}, ${(746 + atx).toFixed(1)} ${(156 + aty).toFixed(1)}, ${(738 + atx).toFixed(1)} ${(156 + aty).toFixed(1)} L${(596 + atx).toFixed(1)} ${(154 + aty).toFixed(1)} C${(588 + atx).toFixed(1)} ${(154 + aty).toFixed(1)}, ${(584 + atx).toFixed(1)} ${(162 + aty).toFixed(1)}, ${(586 + atx).toFixed(1)} ${(170 + aty).toFixed(1)} L${(622 + atx).toFixed(1)} ${(294 + aty).toFixed(1)} C${(624 + atx).toFixed(1)} ${(302 + aty).toFixed(1)}, ${(634 + atx).toFixed(1)} ${(304 + aty).toFixed(1)}, ${(640 + atx).toFixed(1)} ${(298 + aty).toFixed(1)} L${(668 + atx).toFixed(1)} ${(268 + aty).toFixed(1)} C${(704 + atx * 0.4).toFixed(1)} ${(326 + aty * 0.4).toFixed(1)}, 696 422, 638 468 C598 468, 562 422, 526 354 C472 ${(274 - pCenter * 10).toFixed(1)}, 410 ${cpyTop}, 352 ${cpy} C298 ${(358 - pLeftDip * 6).toFixed(1)}, 258 ${ldyInner}, 210 ${(462 - pLeftDip * 14).toFixed(1)} C142 ${(460 - pLeftDip * 12).toFixed(1)}, 98 346, 98 250 Z`}
          fill="url(#wnRibbonGrad)"
        />
      </svg>
    </div>
  );
}

function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: "light" | "dark";
  onToggle: () => void;
}) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle
            cx="12"
            cy="12"
            r="4.2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M20.2 14.5A8.2 8.2 0 0 1 9.5 3.8a8.4 8.4 0 1 0 10.7 10.7Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

function AndroidScreen({
  screen,
  onSelectScreen,
  interactive = false,
  selectedAction,
  onSelectAction,
}: {
  screen: ScreenId;
  onSelectScreen?: (s: ScreenId) => void;
  interactive?: boolean;
  selectedAction?: string;
  onSelectAction?: (a: string) => void;
}) {
  const methods = [
    { id: "Reduce", sub: "Avoid using it" },
    { id: "Reuse", sub: "Use it again" },
    { id: "Recycle", sub: "Recycle it" },
    { id: "Trash", sub: "Throw it away" },
  ];
  const isMainTab =
    screen === "home" ||
    screen === "history" ||
    screen === "guide" ||
    screen === "stats";

  return (
    <div className={`phone${interactive ? " phone-interactive" : ""}`}>
      <div className="phone-top">
        <span>9:41</span>
        <span className="phone-status" aria-hidden="true">
          <svg viewBox="0 0 16 12" fill="none">
            <rect
              x="1"
              y="7"
              width="2.2"
              height="4"
              rx="0.8"
              fill="currentColor"
            />
            <rect
              x="4.8"
              y="5"
              width="2.2"
              height="6"
              rx="0.8"
              fill="currentColor"
            />
            <rect
              x="8.6"
              y="3"
              width="2.2"
              height="8"
              rx="0.8"
              fill="currentColor"
            />
            <rect
              x="12.4"
              y="1"
              width="2.2"
              height="10"
              rx="0.8"
              fill="currentColor"
              opacity="0.35"
            />
          </svg>
          <svg viewBox="0 0 20 12" fill="none">
            <rect
              x="1"
              y="1.5"
              width="15"
              height="9"
              rx="2.5"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <rect
              x="2.8"
              y="3.3"
              width="10.2"
              height="5.4"
              rx="1.1"
              fill="currentColor"
            />
            <path
              d="M17.5 4.3v3.4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>

      <div className={`phone-body${isMainTab ? " has-dock" : ""}`} key={screen}>
        {screen === "home" && (
          <div className="screen-pane">
            <div className="app-heading">
              <div>
                <span className="app-overline">Monday, 21 September</span>
                <strong>Hi, Demo User.</strong>
              </div>
              <span className="avatar-square" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <circle
                    cx="10"
                    cy="7.5"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M4.8 16.2c.9-2.4 2.8-3.7 5.2-3.7s4.3 1.3 5.2 3.7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>

            <div className="summary-card">
              <span>Waste handled today</span>
              <strong>
                650 <small>g</small>
              </strong>
              <span className="summary-sub">3 activities logged</span>
              <div className="summary-rule" />
              <div className="summary-bottom">
                <span className="summary-note-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none">
                    <rect
                      x="3"
                      y="2"
                      width="10"
                      height="12"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span>Your personal log, not a verified impact claim.</span>
              </div>
            </div>

            {interactive && onSelectScreen ? (
              <button
                type="button"
                className="mock-outline-btn"
                onClick={() => onSelectScreen("log")}
              >
                Log manually
              </button>
            ) : (
              <div className="mock-outline-btn">Log manually</div>
            )}

            <div className="lime-highlight-card">
              <div>
                <strong>2 items avoided</strong>
                <small>Reduce is tracked separately.</small>
              </div>
              <span className="lime-card-icon" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path
                    d="M15.8 4.2C9.8 4.2 5.2 7 5.2 12.2c0 2.3 1.5 3.6 3.8 3.6 5.2 0 7.2-5.4 6.8-11.6Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>

            <div className="rate-row">
              <div>
                <strong>Recycling rate</strong>
                <small>Based on handling activities</small>
              </div>
              <strong className="rate-value">50%</strong>
            </div>

            <div className="level-row">
              <div className="level-head">
                <strong>Level 1</strong>
                <small>50 XP total</small>
              </div>
              <div className="level-track" aria-hidden="true">
                <span className="level-fill" style={{ width: "50%" }} />
              </div>
            </div>
          </div>
        )}

        {screen === "ai" && (
          <div className="screen-pane">
            <div className="subflow-header">
              {interactive && onSelectScreen ? (
                <button
                  type="button"
                  className="subflow-back"
                  onClick={() => onSelectScreen("home")}
                  aria-label="Back to Home"
                >
                  <svg viewBox="0 0 20 20" fill="none">
                    <path
                      d="M12.5 5 7.5 10l5 5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ) : (
                <span className="subflow-back" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none">
                    <path
                      d="M12.5 5 7.5 10l5 5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
              <strong>Camera &amp; scan</strong>
            </div>

            <div className="scan-stepper" aria-hidden="true">
              <span className="scan-step is-active">1 Photo</span>
              <span className="scan-step">2 Object</span>
              <span className="scan-step">3 Condition</span>
              <span className="scan-step">4 Advice</span>
            </div>

            <div className="ai-viewfinder is-scanning">
              <img
                src="/images/waste-materials.webp"
                alt="Camera preview scanning waste materials"
                loading="lazy"
                decoding="async"
              />
              <span className="ai-reticle" aria-hidden="true" />
              <span className="ai-scan-line" aria-hidden="true" />
            </div>

            <div className="ai-result-card">
              <div className="ai-result-head">
                <strong>Sample advice · needs your OK</strong>
                <span>Recycle</span>
              </div>
              <small>
                How you handle it depends on its condition and what your local
                facility accepts.
              </small>
            </div>

            {interactive && onSelectScreen ? (
              <>
                <button
                  type="button"
                  className="mock-save-btn"
                  onClick={() => onSelectScreen("log")}
                >
                  Use this, add amount
                </button>
                <button
                  type="button"
                  className="mock-outline-btn"
                  onClick={() => onSelectScreen("log")}
                >
                  Log manually
                </button>
              </>
            ) : (
              <>
                <div className="mock-save-btn">Use this, add amount</div>
                <div className="mock-outline-btn">Log manually</div>
              </>
            )}
          </div>
        )}

        {screen === "log" && (
          <div className="screen-pane">
            <div className="subflow-header">
              {interactive && onSelectScreen ? (
                <button
                  type="button"
                  className="subflow-back"
                  onClick={() => onSelectScreen("home")}
                  aria-label="Back to Home"
                >
                  <svg viewBox="0 0 20 20" fill="none">
                    <path
                      d="M12.5 5 7.5 10l5 5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ) : (
                <span className="subflow-back" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none">
                    <path
                      d="M12.5 5 7.5 10l5 5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
              <strong>Log activity</strong>
            </div>

            <div className="mock-field-label">How you handled it</div>
            <div className="method-grid-2x2">
              {methods.map((m) => {
                const active = (selectedAction ?? "Recycle") === m.id;
                const inner = (
                  <>
                    <span className="method-radio-top">
                      <strong>{m.id}</strong>
                      <span
                        className={`method-radio-dot${active ? " is-checked" : ""}`}
                      />
                    </span>
                    <small>{m.sub}</small>
                  </>
                );
                return interactive && onSelectAction ? (
                  <button
                    key={m.id}
                    type="button"
                    className={`method-radio-card${active ? " is-selected" : ""}`}
                    onClick={() => onSelectAction(m.id)}
                  >
                    {inner}
                  </button>
                ) : (
                  <div
                    key={m.id}
                    className={`method-radio-card${active ? " is-selected" : ""}`}
                  >
                    {inner}
                  </div>
                );
              })}
            </div>

            <div className="mock-field-label">Category</div>
            <div className="mock-input-box">
              <span>Plastic</span>
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="m4 6 4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="mock-row-2col">
              <div>
                <div className="mock-field-label">Weight</div>
                <div className="mock-input-box">
                  <span>250</span>
                </div>
              </div>
              <div>
                <div className="mock-field-label">Unit</div>
                <div className="mock-input-box">
                  <span>g</span>
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="m4 6 4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mock-field-label">Activity date</div>
            <div className="mock-input-box">
              <span>21/09/2026</span>
            </div>

            <div className="mock-field-label">Notes (optional)</div>
            <div className="mock-input-box is-note">
              <span>Drink bottle. Sample data.</span>
            </div>

            <div className="mock-save-btn">Save log</div>
          </div>
        )}

        {screen === "history" && (
          <div className="screen-pane">
            <div className="app-heading">
              <div>
                <strong>History</strong>
                <span className="app-overline-sub">5 activities logged.</span>
              </div>
              <span className="avatar-square" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path
                    d="M4 6h12M6.5 10h7M9 14h2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>

            <div className="app-section-title">
              <strong>Today</strong>
            </div>
            <div className="activity">
              <span className="activity-icon" aria-hidden="true">
                ♻
              </span>
              <span>
                <strong>Plastic · Recycle</strong>
                <small>21 Sep · 250 g</small>
              </span>
            </div>
            <div className="activity">
              <span className="activity-icon pale" aria-hidden="true">
                ↻
              </span>
              <span>
                <strong>Glass · Reuse</strong>
                <small>21 Sep · 400 g</small>
              </span>
            </div>
            <div className="activity">
              <span className="activity-icon pale" aria-hidden="true">
                ✦
              </span>
              <span>
                <strong>Plastic · Reduce</strong>
                <small>21 Sep · 2 items avoided</small>
              </span>
            </div>

            <div className="app-section-title">
              <strong>20 Sep</strong>
            </div>
            <div className="activity">
              <span className="activity-icon muted" aria-hidden="true">
                •
              </span>
              <span>
                <strong>Organic · Trash</strong>
                <small>20 Sep · 600 g</small>
              </span>
            </div>
            <div className="activity">
              <span className="activity-icon" aria-hidden="true">
                ♻
              </span>
              <span>
                <strong>Paper · Recycle</strong>
                <small>20 Sep · 150 g</small>
              </span>
            </div>

            {interactive && onSelectScreen ? (
              <button
                type="button"
                className="mock-outline-btn"
                onClick={() => onSelectScreen("log")}
              >
                Log manually
              </button>
            ) : (
              <div className="mock-outline-btn">Log manually</div>
            )}
          </div>
        )}

        {screen === "guide" && (
          <div className="screen-pane">
            <div className="app-heading">
              <div>
                <strong>Guide</strong>
                <span className="app-overline-sub">
                  Know the material, then pick your next step.
                </span>
              </div>
            </div>

            <div className="mock-search-row">
              <div className="mock-search">Search guides</div>
              <span className="mock-search-btn">Search</span>
              <span className="mock-search-clear">Clear</span>
            </div>

            <div className="guide-warn-card">
              <strong>Check the condition before sorting</strong>
              <small>
                Empty out any liquid first so it doesn't contaminate other
                materials.
              </small>
            </div>

            <div className="guide-list-item">
              <img
                src="/images/waste-materials.webp"
                alt=""
                loading="lazy"
                decoding="async"
              />
              <div>
                <strong>Plastic bottles</strong>
                <small>Recycle</small>
              </div>
              <span className="guide-chevron" aria-hidden="true">
                ›
              </span>
            </div>
            <div className="guide-list-item">
              <img
                src="/images/hero-sorting.webp"
                alt=""
                loading="lazy"
                decoding="async"
              />
              <div>
                <strong>Glass containers</strong>
                <small>Reuse</small>
              </div>
              <span className="guide-chevron" aria-hidden="true">
                ›
              </span>
            </div>
            <div className="guide-list-item">
              <img
                src="/images/waste-organic.webp"
                alt=""
                loading="lazy"
                decoding="async"
              />
              <div>
                <strong>Paper and cardboard</strong>
                <small>Recycle</small>
              </div>
              <span className="guide-chevron" aria-hidden="true">
                ›
              </span>
            </div>
          </div>
        )}

        {screen === "stats" && (
          <div className="screen-pane">
            <div className="app-heading">
              <div>
                <strong>Statistics</strong>
              </div>
            </div>

            <div className="segmented-toggle" aria-hidden="true">
              <span className="is-active">7 days</span>
              <span>30 days</span>
            </div>

            <span className="app-overline-sub">15 Sep to 21 Sep 2026</span>

            <div className="summary-card compact">
              <span>Waste handled</span>
              <strong>
                1.4 <small>kg</small>
              </strong>
              <span className="summary-sub">
                5 activities · 0 items handled
              </span>
            </div>

            <div className="lime-highlight-card">
              <div>
                <strong>2 items avoided</strong>
                <small>Reduce is tracked separately.</small>
              </div>
              <span className="lime-card-icon" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path
                    d="M15.8 4.2C9.8 4.2 5.2 7 5.2 12.2c0 2.3 1.5 3.6 3.8 3.6 5.2 0 7.2-5.4 6.8-11.6Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>

            <div className="mock-chart-card">
              <div className="mock-chart-title">Weight handled per day</div>
              <div className="mock-chart-bars">
                {[
                  { day: "15", h: 12 },
                  { day: "16", h: 12 },
                  { day: "17", h: 12 },
                  { day: "18", h: 12 },
                  { day: "19", h: 12 },
                  { day: "20", h: 86, val: "750" },
                  { day: "21", h: 74, val: "650" },
                ].map((bar) => (
                  <div key={bar.day} className="mock-bar-col">
                    {bar.val && <span className="mock-bar-val">{bar.val}</span>}
                    <span
                      className={`mock-bar${bar.val ? " is-peak" : ""}`}
                      style={{ height: `${bar.h}%` }}
                    />
                    <small>{bar.day}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {isMainTab && (
        <div className="app-dock-wrap">
          {interactive && onSelectScreen ? (
            <button
              type="button"
              className="dock-fab"
              onClick={() => onSelectScreen("ai")}
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M3.5 7.5a2 2 0 0 1 2-2h1.4l1-1.5h4.2l1 1.5h1.4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-7Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <circle
                  cx="10"
                  cy="11"
                  r="2.6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
              <span>Log / Scan</span>
            </button>
          ) : (
            <span className="dock-fab">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M3.5 7.5a2 2 0 0 1 2-2h1.4l1-1.5h4.2l1 1.5h1.4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-7Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <circle
                  cx="10"
                  cy="11"
                  r="2.6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
              <span>Log / Scan</span>
            </span>
          )}

          <div className="app-dock">
            {(
              [
                { id: "home", label: "Home", icon: "home" },
                { id: "history", label: "History", icon: "list" },
                { id: "guide", label: "Guide", icon: "book" },
                { id: "stats", label: "Stats", icon: "chart" },
                { id: "profile", label: "Profile", icon: "user" },
              ] as const
            ).map((tab) => {
              const isActive = screen === tab.id;
              const content = (
                <>
                  {tab.icon === "home" && (
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path
                        d="M3.5 8.8 10 3.5l6.5 5.3v7.2a1 1 0 0 1-1 1h-3.6v-4.8H8.1V17H4.5a1 1 0 0 1-1-1V8.8Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {tab.icon === "list" && (
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path
                        d="M4.5 6h11M4.5 10h11M4.5 14h7"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                  {tab.icon === "book" && (
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <rect
                        x="4"
                        y="3.5"
                        width="12"
                        height="13"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M7.5 7.5h5M7.5 10.5h5M7.5 13.5h3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                  {tab.icon === "chart" && (
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path
                        d="M4.5 15.5V11M10 15.5V5.5M15.5 15.5V8.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                  {tab.icon === "user" && (
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <circle
                        cx="10"
                        cy="7.5"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M5 16c.8-2.2 2.6-3.4 5-3.4s4.2 1.2 5 3.4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                  <small>{tab.label}</small>
                </>
              );

              if (interactive && onSelectScreen && tab.id !== "profile") {
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`dock-item${isActive ? " dock-active" : ""}`}
                    onClick={() => onSelectScreen(tab.id)}
                    aria-pressed={isActive}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <span
                  key={tab.id}
                  className={`dock-item${isActive ? " dock-active" : ""}`}
                >
                  {content}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ReleaseInfo() {
  const [release, setRelease] = useState<Release | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/apk/versions.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Release metadata unavailable");
        return response.json();
      })
      .then((data: { latest?: Release | null }) => {
        if (!data.latest || typeof data.latest.version !== "string")
          throw new Error("No release yet");
        setRelease(data.latest);
        setState("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setState("error");
      });
    return () => controller.abort();
  }, []);
  return (
    <div
      className={`release-info${state === "error" ? " release-info-error" : ""}`}
      aria-live="polite"
    >
      {state === "loading" && "Loading release info…"}
      {state === "error" && "Couldn't load the version info."}
      {state === "ready" &&
        release &&
        `Version ${release.version} · ${release.size} · ${release.date}`}
    </div>
  );
}

const simulatorTabs: {
  id: ScreenId;
  title: string;
  desc: string;
}[] = [
  {
    id: "home",
    title: "Home and daily summary",
    desc: "See how much waste you handled today and your latest activity at a glance.",
  },
  {
    id: "ai",
    title: "Scan waste with AI",
    desc: "Point the camera at an item to identify the material and get a suggested Reduce, Reuse, Recycle, or Trash step that you confirm.",
  },
  {
    id: "log",
    title: "Quick manual logging",
    desc: "Pick the material, enter the weight or count, then mark it as Reduce, Reuse, Recycle, or Trash.",
  },
  {
    id: "history",
    title: "History that's easy to browse",
    desc: "Look back at your daily logs, with each entry's category, method, and date.",
  },
  {
    id: "guide",
    title: "Sorting guides for every method",
    desc: "Short, judgment-free references for recognizing a material and handling it properly.",
  },
  {
    id: "stats",
    title: "Weekly habit statistics",
    desc: "Charts of your progress, built from your own logs day by day.",
  },
];

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("wastenot-theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function App() {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const [activeScreen, setActiveScreen] = useState<ScreenId>("home");
  const [selectedAction, setSelectedAction] = useState("Recycle");
  const [heroHoverX, setHeroHoverX] = useState<number | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("wastenot-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const forceTop = () => {
      if (!window.location.hash) {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollTo(0, 0);
      }
    };
    forceTop();
    const rafTop = requestAnimationFrame(forceTop);
    window.addEventListener("pageshow", forceTop);

    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!targets.length) {
      return () => {
        cancelAnimationFrame(rafTop);
        window.removeEventListener("pageshow", forceTop);
      };
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => el.classList.add("is-visible"));
      return () => {
        cancelAnimationFrame(rafTop);
        window.removeEventListener("pageshow", forceTop);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -60px 0px" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => {
      cancelAnimationFrame(rafTop);
      window.removeEventListener("pageshow", forceTop);
      observer.disconnect();
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header" ref={headerRef}>
        <div className="container header-inner">
          <a
            href="#top"
            className="brand-link"
            aria-label="WasteNot, back to top"
            onClick={() => setMenuOpen(false)}
          >
            <Brand />
          </a>

          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#interface">App &amp; AI</a>
            <a href="#benefits">Benefits</a>
            <a href="#about">About</a>
          </nav>

          <div className="header-actions">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <a className="header-cta" href="#download">
              Get the app <Arrow diagonal />
            </a>
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                {menuOpen ? (
                  <path
                    d="M6 15l6-6 6 6"
                    stroke="currentColor"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`mobile-nav-wrap${menuOpen ? " is-open" : ""}`}
          aria-hidden={!menuOpen}
          inert={!menuOpen}
        >
          <div className="container">
            <nav className="mobile-nav" aria-label="Mobile navigation">
              <a
                href="#interface"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
              >
                App &amp; AI
              </a>
              <a
                href="#benefits"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
              >
                Benefits
              </a>
              <a
                href="#about"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#download"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
              >
                Get the app
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="container">
            <div className="hero-centered" data-reveal="up">
              <h1 aria-label="Good habits start with a single log.">
                <KineticText
                  text="Good habits start with a single log."
                  accent="a single log."
                />
              </h1>
              <p className="hero-lede">
                Log the waste you handle, let AI help you identify the material,
                learn your options from Reduce to Trash, and watch your habits
                grow day by day.
              </p>
              <div className="hero-actions">
                <a
                  className="button button-primary"
                  href="#interface"
                  onClick={() => setActiveScreen("ai")}
                >
                  Try the app and AI demo <Arrow diagonal />
                </a>
                <a className="text-link" href="#download">
                  Download for Android <Arrow />
                </a>
              </div>
            </div>

            <div
              className="hero-trio"
              data-reveal="scale"
              style={{ "--reveal-delay": "90ms" } as CSSProperties}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                if (rect.width > 0) {
                  setHeroHoverX((e.clientX - rect.left) / rect.width);
                }
              }}
              onMouseLeave={() => setHeroHoverX(null)}
            >
              <HeroWBackdrop hoverX={heroHoverX} />
              <div className="trio-side trio-left">
                <AndroidScreen screen="ai" />
              </div>

              <div className="trio-center">
                <AndroidScreen screen="home" />
              </div>

              <div className="trio-side trio-right">
                <AndroidScreen screen="stats" />
              </div>
            </div>
          </div>
        </section>

        <section className="section showcase-section" id="interface">
          <div className="container showcase-grid">
            <div className="showcase-copy" data-reveal="left">
              <p className="eyebrow" aria-label="Explore the app">
                <KineticText text="Explore the app" />
              </p>
              <h2 aria-label="Every main feature, including the AI scan.">
                <KineticText text="Every main feature, including the AI scan." />
              </h2>
              <p className="showcase-lede">
                Pick a screen below, or tap the navigation icons on the phone,
                to walk through each feature, including the AI scan.
              </p>

              <div
                className="screen-switcher"
                role="tablist"
                aria-label="Choose an Android screen"
              >
                {simulatorTabs.map((tab, idx) => {
                  const active = activeScreen === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      className={`switcher-item${active ? " is-active" : ""}`}
                      onClick={() => setActiveScreen(tab.id)}
                    >
                      <span className="switcher-num">0{idx + 1}</span>
                      <div>
                        <strong>{tab.title}</strong>
                        <p>{tab.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className="showcase-device"
              data-reveal="scale"
              style={{ "--reveal-delay": "80ms" } as CSSProperties}
            >
              <AndroidScreen
                screen={activeScreen}
                onSelectScreen={setActiveScreen}
                interactive
                selectedAction={selectedAction}
                onSelectAction={setSelectedAction}
              />
              <p className="device-caption">
                Interactive demo · Tap the phone screen to try it
              </p>
            </div>
          </div>
        </section>

        <section className="section benefits" id="benefits">
          <div
            className="seam-photo seam-photo-right seam-bottle"
            aria-hidden="true"
          >
            <img
              className="seam-bottle-body"
              src="/images/seam-bottle-body.webp"
              alt=""
              loading="lazy"
              decoding="async"
            />
            <img
              className="seam-bottle-cap"
              src="/images/seam-bottle-cap.webp"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="container">
            <div className="section-head" data-reveal="up">
              <p className="eyebrow" aria-label="What it does">
                <KineticText text="What it does" />
              </p>
              <h2 aria-label="Caring is easier when things are clear.">
                <KineticText text="Caring is easier when things are clear." />
              </h2>
              <p>Three things that make good habits feel lighter.</p>
            </div>

            <div className="editorial-cards">
              <article
                className="editorial-card"
                data-reveal="up"
                style={{ "--reveal-delay": "0ms" } as CSSProperties}
              >
                <div className="editorial-media">
                  <img
                    src="/images/card-ai-bottle.webp"
                    alt="A phone scanning a PET plastic bottle on a table for the AI to identify"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="editorial-body">
                  <span className="card-index">01 · Scan and log</span>
                  <h3>Identify items faster with AI.</h3>
                  <p>
                    Snap a photo or log it by hand to capture the material,
                    weight, and how you handled it in one quick step.
                  </p>
                </div>
              </article>

              <article
                className="editorial-card editorial-card-chart"
                data-reveal="up"
                style={{ "--reveal-delay": "80ms" } as CSSProperties}
              >
                <div className="editorial-chart-stage" aria-hidden="true">
                  <div className="editorial-chart-head">
                    <span>Last 7 days</span>
                    <strong>2.45 kg</strong>
                  </div>
                  <div className="editorial-chart-bars">
                    {[
                      { day: "Mon", val: 44 },
                      { day: "Tue", val: 68 },
                      { day: "Wed", val: 40 },
                      { day: "Thu", val: 84 },
                      { day: "Fri", val: 58 },
                      { day: "Sat", val: 94, peak: true },
                      { day: "Sun", val: 72 },
                    ].map((bar) => (
                      <div key={bar.day} className="editorial-bar-col">
                        <span
                          className={`editorial-bar${bar.peak ? " is-peak" : ""}`}
                          style={{ "--bar-h": `${bar.val}%` } as CSSProperties}
                        />
                        <small>{bar.day}</small>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="editorial-body">
                  <span className="card-index">02 · Understand</span>
                  <h3>See patterns, not guesses.</h3>
                  <p>
                    History and statistics show what you've actually logged over
                    time.
                  </p>
                </div>
              </article>

              <article
                className="editorial-card"
                data-reveal="up"
                style={{ "--reveal-delay": "160ms" } as CSSProperties}
              >
                <div className="editorial-media">
                  <img
                    src="/images/hero-sorting.webp"
                    alt="Sorting at home: clean plastic bottles and glass jars next to Paper, Plastic, and Glass bins and a cloth shopping bag"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="editorial-body">
                  <span className="card-index">03 · Keep going</span>
                  <h3>Find your next step.</h3>
                  <p>
                    Material guides point you to Reduce, Reuse, Recycle, or
                    Trash without judging your choices.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section about" id="about">
          <div
            className="seam-photo seam-photo-left seam-box"
            aria-hidden="true"
          >
            <img
              className="seam-box-body"
              src="/images/seam-box-body.webp"
              alt=""
              loading="lazy"
              decoding="async"
            />
            <img
              className="seam-box-flap-left"
              src="/images/seam-box-flap-left.webp"
              alt=""
              loading="lazy"
              decoding="async"
            />
            <img
              className="seam-box-flap-right"
              src="/images/seam-box-flap-right.webp"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="container about-grid">
            <div className="about-copy" data-reveal="left">
              <p className="eyebrow" aria-label="Built for real habits">
                <KineticText text="Built for real habits" />
              </p>
              <h2 aria-label="More than counting trash.">
                <KineticText text="More than counting trash." />
              </h2>
              <p>
                WasteNot is a private space to record everyday choices,
                understand your options, and decide what to do next.
              </p>
              <div className="about-tags">
                <span>Private by default</span>
                <span>No inflated claims</span>
              </div>
            </div>

            <div className="about-pillars">
              <div
                className="pillar-item pillar-reduce"
                data-reveal="right"
                style={{ "--reveal-delay": "60ms" } as CSSProperties}
              >
                <span className="pillar-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="8.5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    />
                    <path
                      d="M8.5 12h7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <div className="pillar-body">
                  <div className="pillar-head">
                    <h3>Cut it at the source</h3>
                    <span className="pillar-badge">Reduce</span>
                  </div>
                  <p>Use fewer single-use items before they become waste.</p>
                </div>
              </div>

              <div
                className="pillar-item pillar-reuse"
                data-reveal="right"
                style={{ "--reveal-delay": "150ms" } as CSSProperties}
              >
                <span className="pillar-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6.2 10A6.5 6.5 0 0 1 17.4 7.2l1.4 1.4M19 6.2v2.8h-2.8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.8 14A6.5 6.5 0 0 1 6.6 16.8l-1.4-1.4M5 17.8V15h2.8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div className="pillar-body">
                  <div className="pillar-head">
                    <h3>Keep using it longer</h3>
                    <span className="pillar-badge">Reuse</span>
                  </div>
                  <p>
                    Reuse containers and packaging, or turn organic scraps into
                    compost.
                  </p>
                </div>
              </div>

              <div
                className="pillar-item pillar-recycle is-accent"
                data-reveal="right"
                style={{ "--reveal-delay": "240ms" } as CSSProperties}
              >
                <span className="pillar-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M10.2 5h3.6l1.9 3.4m.3-1.9-.3 2.1-2-.7"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.2 12.7l1.7 2.9a1.7 1.7 0 0 1-1.5 2.5h-3.5m1.3 1.3-1.5-1.3 1.5-1.3"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 18.1H5.5A1.7 1.7 0 0 1 4 15.6l1.8-3.1m-1.8.2 1.9-.7.6 2"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div className="pillar-body">
                  <div className="pillar-head">
                    <h3>Sort it for recycling</h3>
                    <span className="pillar-badge">Recycle</span>
                  </div>
                  <p>Separate clean materials so they're easier to recycle.</p>
                </div>
              </div>

              <div
                className="pillar-item pillar-trash"
                data-reveal="right"
                style={{ "--reveal-delay": "330ms" } as CSSProperties}
              >
                <span className="pillar-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4.5 7h15M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2M7 7l1 12a1.5 1.5 0 0 0 1.5 1.4h5A1.5 1.5 0 0 0 16 19l1-12"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div className="pillar-body">
                  <div className="pillar-head">
                    <h3>Throw away what's left, properly</h3>
                    <span className="pillar-badge">Trash</span>
                  </div>
                  <p>
                    Log the leftover waste that can't be recycled, honestly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="download-section" id="download">
          <div
            className="seam-photo seam-photo-right seam-can"
            aria-hidden="true"
          >
            <img
              className="seam-can-body"
              src="/images/seam-can-wastenot.webp"
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span className="seam-can-opening" />
            <img
              className="seam-can-tab"
              src="/images/seam-can-tab.webp"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="container">
            <div className="download-shell">
              <div className="download-grid">
                <div className="download-copy" data-reveal="left">
                  <p className="eyebrow" aria-label="Android app">
                    <KineticText text="Android app" />
                  </p>
                  <h2 aria-label="WasteNot is ready for Android.">
                    <KineticText text="WasteNot is ready for Android." />
                  </h2>
                  <p>
                    Log your daily waste, scan materials with AI, read the
                    handling guides, and track your habits, all from your phone.
                  </p>
                  <div className="download-highlights">
                    <span>Camera and AI scan</span>
                    <span>Reduce, Reuse, Recycle, and Trash logs</span>
                    <span>7- and 30-day statistics</span>
                  </div>
                </div>
                <div
                  className="download-card"
                  data-reveal="right"
                  style={{ "--reveal-delay": "120ms" } as CSSProperties}
                >
                  <div className="download-card-head">
                    <img
                      src="/images/wastenot-brand.webp"
                      alt=""
                      className="download-app-icon"
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <span className="download-platform">Android APK</span>
                      <strong>WasteNot for Android</strong>
                    </div>
                  </div>
                  <ReleaseInfo />
                  <a
                    className="button button-lime"
                    href="/apk/latest.apk"
                    download="WasteNot-latest.apk"
                  >
                    Download the Android app <Arrow diagonal />
                  </a>
                  <small>
                    The APK downloads straight from the WasteNot server. Your
                    phone may ask you to allow installs from your browser.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-top" data-reveal="up">
          <div className="footer-brand">
            <Brand />
            <p className="footer-tagline">Log it. Understand it. Keep going.</p>
            <p className="footer-note">
              A private space on Android to log how you reduce, reuse, recycle,
              and throw away waste every day.
            </p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <strong>Navigation</strong>
              <nav aria-label="Footer navigation">
                <a href="#interface">App &amp; AI</a>
                <a href="#benefits">Benefits</a>
                <a href="#about">About</a>
                <a href="#download">Download for Android</a>
                <a href="/privacy/">Privacy policy</a>
              </nav>
            </div>
            <div className="footer-col">
              <strong>The four methods</strong>
              <ul>
                <li>Reduce · Use less</li>
                <li>Reuse · Use again</li>
                <li>Recycle · Sort for recycling</li>
                <li>Trash · Dispose of the rest</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} WasteNot</span>
          <span>More mindful, one log at a time.</span>
        </div>
      </footer>
    </>
  );
}

export default App;
