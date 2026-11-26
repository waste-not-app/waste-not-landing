import { memo } from "react";
import type { ScreenId } from "../types";

export const AndroidScreen = memo(function AndroidScreen({
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
});
