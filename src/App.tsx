import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { AndroidScreen } from "./components/AndroidScreen";
import { Arrow } from "./components/Arrow";
import { Brand } from "./components/Brand";
import { CountUp } from "./components/CountUp";
import { Faq } from "./components/Faq";
import { HeroPhone } from "./components/HeroPhone";
import { Marquee } from "./components/Marquee";
import { MoreFeatures } from "./components/MoreFeatures";
import { ScanFlow } from "./components/ScanFlow";
import { HeroWBackdrop } from "./components/HeroWBackdrop";
import { RevealText } from "./components/RevealText";
import { ReleaseInfo } from "./components/ReleaseInfo";
import { ThemeToggle } from "./components/ThemeToggle";
import { simulatorTabs } from "./data/screens";
import {
  useMediaQuery,
  usePointerParallax,
  usePointerSurfaces,
  useScrollSteps,
} from "./hooks";
import type { ScreenId } from "./types";
import "./styles/global.css";
import "./styles/sections.css";

/** Pauses scroll-synced step changes while a programmatic scroll runs. */
function lockSteps(until: { current: number }, ms: number) {
  until.current = performance.now() + ms;
}

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
  const heroStageRef = useRef<HTMLDivElement | null>(null);
  const stepLockUntil = useRef(0);
  const stickyDemo = useMediaQuery("(min-width: 981px)");
  usePointerParallax(heroStageRef);
  usePointerSurfaces();
  const isStepLocked = useCallback(
    () => performance.now() < stepLockUntil.current,
    [],
  );
  const syncStep = useCallback((step: string) => {
    setActiveScreen(step as ScreenId);
  }, []);
  useScrollSteps("[data-step]", stickyDemo, syncStep, isStepLocked);

  const selectStep = (id: ScreenId, target?: HTMLElement) => {
    setActiveScreen(id);
    if (!stickyDemo || !target) return;
    // Ignore the steps the smooth scroll passes on its way to the chosen one.
    lockSteps(stepLockUntil, 900);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({
      block: "center",
      behavior: reduced ? "auto" : "smooth",
    });
  };

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
            <a href="#scan">How it works</a>
            <a href="#benefits">Benefits</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="header-actions">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <a className="header-cta" href="#download" data-magnetic>
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
                href="#scan"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
              >
                How it works
              </a>
              <a
                href="#faq"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
              >
                FAQ
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
              <p className="hero-badge">
                <span className="hero-badge-dot" aria-hidden="true" />
                Android app with an AI scan
              </p>
              <h1>
                <RevealText
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
                  data-magnetic
                  onClick={() => {
                    lockSteps(stepLockUntil, 1200);
                    setActiveScreen("ai");
                  }}
                >
                  Try the app and AI demo <Arrow diagonal />
                </a>
                <a className="text-link" href="#download">
                  Download for Android <Arrow />
                </a>
              </div>
            </div>

            <div className="hero-trio" ref={heroStageRef}>
              <HeroWBackdrop />
              <div className="trio-side trio-left">
                <AndroidScreen screen="ai" />
              </div>

              <HeroPhone />

              <div className="trio-side trio-right">
                <AndroidScreen screen="stats" />
              </div>

              <div className="hero-chips" aria-hidden="true">
                <span className="hero-chip chip-a">
                  <span className="chip-icon">✓</span>
                  Logged · Plastic 250 g
                </span>
                <span className="hero-chip chip-b">
                  <span className="chip-icon lime">✦</span>2 items avoided
                </span>
                <span className="hero-chip chip-c">
                  <span className="chip-icon">↑</span>
                  Level 1 · 50 XP
                </span>
              </div>
            </div>
          </div>
        </section>

        <Marquee />

        <section className="section showcase-section" id="interface">
          <div className="container showcase-grid">
            <div className="showcase-copy" data-reveal="up">
              <p className="eyebrow">Explore the app</p>
              <h2>
                <RevealText text="Every main feature, including the AI scan." />
              </h2>
              <p className="showcase-lede">
                Scroll through the features, pick one, or tap the phone itself.
                Every screen uses sample data.
              </p>

              <div
                className="screen-switcher"
                role="tablist"
                aria-label="Choose an Android screen"
                style={
                  {
                    "--progress":
                      (simulatorTabs.findIndex((t) => t.id === activeScreen) +
                        1) /
                      simulatorTabs.length,
                  } as CSSProperties
                }
              >
                <span className="switcher-rail" aria-hidden="true" />
                {simulatorTabs.map((tab, idx) => {
                  const active = activeScreen === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls="demo-phone"
                      data-step={tab.id}
                      className={`switcher-item${active ? " is-active" : ""}`}
                      onClick={(event) =>
                        selectStep(tab.id, event.currentTarget)
                      }
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
              id="demo-phone"
              role="tabpanel"
              aria-label="Interactive demo phone"
              data-reveal="up"
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

        <ScanFlow />

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
              <p className="eyebrow">What it does</p>
              <h2>
                <RevealText text="Caring is easier when things are clear." />
              </h2>
              <p>Three things that make good habits feel lighter.</p>
            </div>

            <div className="editorial-cards">
              <article
                className="editorial-card"
                data-tilt
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
                data-tilt
                data-reveal="up"
                style={{ "--reveal-delay": "80ms" } as CSSProperties}
              >
                <div className="editorial-chart-stage" aria-hidden="true">
                  <div className="editorial-chart-head">
                    <span>Last 7 days</span>
                    <strong>
                      <CountUp value={2.45} decimals={2} /> kg
                    </strong>
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
                    ].map((bar, i) => (
                      <div key={bar.day} className="editorial-bar-col">
                        <span
                          className={`editorial-bar${bar.peak ? " is-peak" : ""}`}
                          style={
                            {
                              "--bar-h": `${bar.val}%`,
                              "--i": i,
                            } as CSSProperties
                          }
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
                data-tilt
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
              <p className="eyebrow">Built for real habits</p>
              <h2>
                <RevealText text="More than counting trash." />
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

        <MoreFeatures />

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
                  <p className="eyebrow">Android app</p>
                  <h2>
                    <RevealText text="WasteNot is ready for Android." />
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
                    data-magnetic
                    href="/apk/latest.apk"
                    download="WasteNot-latest.apk"
                  >
                    Download the Android app <Arrow diagonal />
                  </a>
                  <ol className="install-steps">
                    <li>Download the APK on your Android phone.</li>
                    <li>Open the file and allow installs from your browser.</li>
                    <li>Open WasteNot and create your account.</li>
                  </ol>
                  <small>
                    Needs Android 11 or newer. The APK downloads straight from
                    the WasteNot server.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Faq />
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
                <a href="#scan">How it works</a>
                <a href="#about">About</a>
                <a href="#faq">FAQ</a>
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
        <div className="container footer-wordmark" aria-hidden="true">
          WasteNot<span>.</span>
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
