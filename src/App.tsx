import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./styles/global.css";

type Release = { version: string; size: string; date: string };
type ScreenId =
  | "beranda"
  | "ai"
  | "catat"
  | "riwayat"
  | "panduan"
  | "statistik";

const base = "/wastenot-app/";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

function KineticText({
  text,
  accent,
}: {
  text: string;
  accent?: string;
}) {
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
          src="/images/wastenot-logo.png"
          alt=""
          loading="eager"
          decoding="async"
        />
      </span>
      WasteNot<span className="brand-dot">.</span>
    </span>
  );
}

function HeroWBackdrop({
  hoverX,
}: {
  hoverX: number | null;
}) {
  const targetRef = useRef({ x: 0.5, weight: 0 });
  const currentRef = useRef({ x: 0.5, weight: 0 });
  const rafRef = useRef<number | null>(null);
  const [motion, setMotion] = useState({ x: 0.5, weight: 0 });

  useEffect(() => {
    if (hoverX === null) {
      targetRef.current.weight = 0;
    } else {
      // If waking from rest, start x right at pointer so it doesn't sweep from the old side
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
    return Math.pow(0.5 * (1 + Math.cos((dist / radius) * Math.PI)), 1.3) * motion.weight;
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
          <linearGradient id="wnLeafGrad" x1="40" y1="300" x2="410" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1D6149" />
            <stop offset="48%" stopColor="#69B832" />
            <stop offset="100%" stopColor="#A6E244" />
          </linearGradient>
          <linearGradient id="wnRibbonGrad" x1="80" y1="450" x2="730" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1D6149" />
            <stop offset="28%" stopColor="#69B832" />
            <stop offset="56%" stopColor="#9EDB3A" />
            <stop offset="82%" stopColor="#267355" />
            <stop offset="100%" stopColor="#123F30" />
          </linearGradient>
          <linearGradient id="wnFoldGrad" x1="360" y1="290" x2="640" y2="490" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#123F30" />
            <stop offset="100%" stopColor="#1D6149" />
          </linearGradient>
        </defs>

        {/* Left Leaf — seamlessly anchored into the ribbon's left arm */}
        <path
          d={`M88 332 C62 198, 152 62, ${ltx} ${lty} C382 156, 282 224, 154 244 C198 176, 288 122, 362 82 C264 124, 160 198, 88 332 Z`}
          fill="url(#wnLeafGrad)"
        />
        <path
          d={`M78 348 C34 232, 108 82, ${ltx} ${lty} C306 68, 186 154, 118 302 C94 334, 78 348, 78 348 Z`}
          fill="#69B832"
          opacity="0.9"
        />

        {/* Inner Fold Shadow — coupled to center peak & right valley */}
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
      aria-label={isDark ? "Ubah ke tema terang" : "Ubah ke tema gelap"}
      title={isDark ? "Tema terang" : "Tema gelap"}
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
    { id: "Reduce", sub: "Hindari pemakaian" },
    { id: "Reuse", sub: "Gunakan kembali" },
    { id: "Recycle", sub: "Daur ulang" },
    { id: "Trash", sub: "Buang sebagai residu" },
  ];
  const isMainTab =
    screen === "beranda" ||
    screen === "riwayat" ||
    screen === "panduan" ||
    screen === "statistik";

  return (
    <div className={`phone${interactive ? " phone-interactive" : ""}`}>
      <div className="phone-top">
        <span>9:41</span>
        <span className="phone-status" aria-hidden="true">
          <svg viewBox="0 0 16 12" fill="none">
            <rect x="1" y="7" width="2.2" height="4" rx="0.8" fill="currentColor" />
            <rect x="4.8" y="5" width="2.2" height="6" rx="0.8" fill="currentColor" />
            <rect x="8.6" y="3" width="2.2" height="8" rx="0.8" fill="currentColor" />
            <rect x="12.4" y="1" width="2.2" height="10" rx="0.8" fill="currentColor" opacity="0.35" />
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
            <rect x="2.8" y="3.3" width="10.2" height="5.4" rx="1.1" fill="currentColor" />
            <path d="M17.5 4.3v3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
      </div>

      <div className={`phone-body${isMainTab ? " has-dock" : ""}`} key={screen}>
        {screen === "beranda" && (
          <div className="screen-pane">
            <div className="app-heading">
              <div>
                <span className="app-overline">Senin, 21 September</span>
                <strong>Halo, Pengguna Demo.</strong>
              </div>
              <span className="avatar-square" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.6" />
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
              <span>Sampah ditangani hari ini</span>
              <strong>
                650 <small>g</small>
              </strong>
              <span className="summary-sub">3 aktivitas tercatat</span>
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
                <span>Catatan pribadi, bukan dampak terverifikasi.</span>
              </div>
            </div>

            {interactive && onSelectScreen ? (
              <button
                type="button"
                className="mock-outline-btn"
                onClick={() => onSelectScreen("catat")}
              >
                Input manual
              </button>
            ) : (
              <div className="mock-outline-btn">Input manual</div>
            )}

            <div className="lime-highlight-card">
              <div>
                <strong>2 benda dihindari</strong>
                <small>Reduce dicatat terpisah.</small>
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
                <small>Berdasarkan aktivitas penanganan</small>
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
                  onClick={() => onSelectScreen("beranda")}
                  aria-label="Kembali ke Beranda"
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
              <strong>Kamera &amp; scan</strong>
            </div>

            <div className="scan-stepper" aria-hidden="true">
              <span className="scan-step is-active">1 Foto</span>
              <span className="scan-step">2 Objek</span>
              <span className="scan-step">3 Kondisi</span>
              <span className="scan-step">4 Saran</span>
            </div>

            <div className="ai-viewfinder is-scanning">
              <img
                src="/images/waste-materials.jpg"
                alt="Pratinjau kamera untuk memindai material sampah"
                loading="lazy"
                decoding="async"
              />
              <span className="ai-reticle" aria-hidden="true" />
              <span className="ai-scan-line" aria-hidden="true" />
            </div>

            <div className="ai-result-card">
              <div className="ai-result-head">
                <strong>Saran contoh · perlu konfirmasi</strong>
                <span>Recycle</span>
              </div>
              <small>
                Keputusan penanganan mengikuti kondisi dan penerimaan fasilitas
                setempat.
              </small>
            </div>

            {interactive && onSelectScreen ? (
              <>
                <button
                  type="button"
                  className="mock-save-btn"
                  onClick={() => onSelectScreen("catat")}
                >
                  Gunakan pilihan, isi jumlah
                </button>
                <button
                  type="button"
                  className="mock-outline-btn"
                  onClick={() => onSelectScreen("catat")}
                >
                  Input manual
                </button>
              </>
            ) : (
              <>
                <div className="mock-save-btn">Gunakan pilihan, isi jumlah</div>
                <div className="mock-outline-btn">Input manual</div>
              </>
            )}
          </div>
        )}

        {screen === "catat" && (
          <div className="screen-pane">
            <div className="subflow-header">
              {interactive && onSelectScreen ? (
                <button
                  type="button"
                  className="subflow-back"
                  onClick={() => onSelectScreen("beranda")}
                  aria-label="Kembali ke Beranda"
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
              <strong>Catat aktivitas</strong>
            </div>

            <div className="mock-field-label">Cara pengelolaan</div>
            <div className="method-grid-2x2">
              {methods.map((m) => {
                const active = (selectedAction ?? "Recycle") === m.id;
                const inner = (
                  <>
                    <span className="method-radio-top">
                      <strong>{m.id}</strong>
                      <span className={`method-radio-dot${active ? " is-checked" : ""}`} />
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

            <div className="mock-field-label">Kategori</div>
            <div className="mock-input-box">
              <span>Plastik</span>
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
                <div className="mock-field-label">Berat</div>
                <div className="mock-input-box">
                  <span>250</span>
                </div>
              </div>
              <div>
                <div className="mock-field-label">Satuan</div>
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

            <div className="mock-field-label">Tanggal aktivitas</div>
            <div className="mock-input-box">
              <span>21/09/2026</span>
            </div>

            <div className="mock-field-label">Catatan (opsional)</div>
            <div className="mock-input-box is-note">
              <span>Botol kemasan. Data simulasi.</span>
            </div>

            <div className="mock-save-btn">Simpan catatan</div>
          </div>
        )}

        {screen === "riwayat" && (
          <div className="screen-pane">
            <div className="app-heading">
              <div>
                <strong>Riwayat</strong>
                <span className="app-overline-sub">5 aktivitas tercatat.</span>
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
              <strong>Hari ini</strong>
            </div>
            <div className="activity">
              <span className="activity-icon" aria-hidden="true">
                ♻
              </span>
              <span>
                <strong>Plastik · Recycle</strong>
                <small>21 Sep · 250 g</small>
              </span>
            </div>
            <div className="activity">
              <span className="activity-icon pale" aria-hidden="true">
                ↻
              </span>
              <span>
                <strong>Kaca · Reuse</strong>
                <small>21 Sep · 400 g</small>
              </span>
            </div>
            <div className="activity">
              <span className="activity-icon pale" aria-hidden="true">
                ✦
              </span>
              <span>
                <strong>Plastik · Reduce</strong>
                <small>21 Sep · 2 benda dihindari</small>
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
                <strong>Organik · Trash</strong>
                <small>20 Sep · 600 g</small>
              </span>
            </div>
            <div className="activity">
              <span className="activity-icon" aria-hidden="true">
                ♻
              </span>
              <span>
                <strong>Kertas · Recycle</strong>
                <small>20 Sep · 150 g</small>
              </span>
            </div>

            {interactive && onSelectScreen ? (
              <button
                type="button"
                className="mock-outline-btn"
                onClick={() => onSelectScreen("catat")}
              >
                Input manual
              </button>
            ) : (
              <div className="mock-outline-btn">Input manual</div>
            )}
          </div>
        )}

        {screen === "panduan" && (
          <div className="screen-pane">
            <div className="app-heading">
              <div>
                <strong>Panduan</strong>
                <span className="app-overline-sub">
                  Kenali materialnya, tentukan langkah berikutnya.
                </span>
              </div>
            </div>

            <div className="mock-search-row">
              <div className="mock-search">Cari panduan</div>
              <span className="mock-search-btn">Cari</span>
              <span className="mock-search-clear">Hapus</span>
            </div>

            <div className="guide-warn-card">
              <strong>Periksa kondisi sebelum memilah</strong>
              <small>
                Pastikan wadah bebas sisa cairan agar tidak mencemari material
                lain.
              </small>
            </div>

            <div className="guide-list-item">
              <img
                src="/images/waste-materials.jpg"
                alt=""
                loading="lazy"
                decoding="async"
              />
              <div>
                <strong>Botol plastik</strong>
                <small>Recycle</small>
              </div>
              <span className="guide-chevron" aria-hidden="true">
                ›
              </span>
            </div>
            <div className="guide-list-item">
              <img
                src="/images/hero-sorting.jpg"
                alt=""
                loading="lazy"
                decoding="async"
              />
              <div>
                <strong>Wadah kaca</strong>
                <small>Reuse</small>
              </div>
              <span className="guide-chevron" aria-hidden="true">
                ›
              </span>
            </div>
            <div className="guide-list-item">
              <img
                src="/images/waste-organic.jpg"
                alt=""
                loading="lazy"
                decoding="async"
              />
              <div>
                <strong>Kertas dan kardus</strong>
                <small>Recycle</small>
              </div>
              <span className="guide-chevron" aria-hidden="true">
                ›
              </span>
            </div>
          </div>
        )}

        {screen === "statistik" && (
          <div className="screen-pane">
            <div className="app-heading">
              <div>
                <strong>Statistik</strong>
              </div>
            </div>

            <div className="segmented-toggle" aria-hidden="true">
              <span className="is-active">7 hari</span>
              <span>30 hari</span>
            </div>

            <span className="app-overline-sub">15 Sep hingga 21 Sep 2026</span>

            <div className="summary-card compact">
              <span>Sampah ditangani</span>
              <strong>
                1,4 <small>kg</small>
              </strong>
              <span className="summary-sub">5 aktivitas · 0 benda ditangani</span>
            </div>

            <div className="lime-highlight-card">
              <div>
                <strong>2 benda dihindari</strong>
                <small>Reduce dicatat terpisah.</small>
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
              <div className="mock-chart-title">Berat ditangani per hari</div>
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
                <circle cx="10" cy="11" r="2.6" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              <span>Catat / Scan</span>
            </button>
          ) : (
            <span className="dock-fab">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M3.5 7.5a2 2 0 0 1 2-2h1.4l1-1.5h4.2l1 1.5h1.4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-7Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <circle cx="10" cy="11" r="2.6" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              <span>Catat / Scan</span>
            </span>
          )}

          <div className="app-dock">
            {(
              [
                { id: "beranda", label: "Beranda", icon: "home" },
                { id: "riwayat", label: "Riwayat", icon: "list" },
                { id: "panduan", label: "Panduan", icon: "book" },
                { id: "statistik", label: "Statistik", icon: "chart" },
                { id: "profil", label: "Profil", icon: "user" },
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
                      <circle cx="10" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.6" />
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

              if (interactive && onSelectScreen && tab.id !== "profil") {
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
    fetch(`${base}versions.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Metadata rilis tidak tersedia");
        return response.json();
      })
      .then((data: { latest?: Release | null }) => {
        if (!data.latest || typeof data.latest.version !== "string")
          throw new Error("Belum ada rilis");
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
      {state === "loading" && "Memuat informasi rilis…"}
      {state === "error" && "Informasi versi belum dapat dimuat."}
      {state === "ready" &&
        release &&
        `Versi ${release.version} · ${release.size} · ${release.date}`}
    </div>
  );
}

const simulatorTabs: {
  id: ScreenId;
  title: string;
  desc: string;
}[] = [
  {
    id: "beranda",
    title: "Beranda & ringkasan harian",
    desc: "Pantau total berat sampah yang kamu tangani hari ini dan aktivitas terbarumu dalam satu pandangan.",
  },
  {
    id: "ai",
    title: "Pindai sampah dengan AI",
    desc: "Arahkan kamera ke material sampah untuk mengenali jenis, perkiraan berat, dan saran 3R secara otomatis.",
  },
  {
    id: "catat",
    title: "Catat manual dengan cepat",
    desc: "Pilih jenis material, tentukan berat atau jumlah, lalu tandai Reduce, Reuse, Recycle, atau Trash.",
  },
  {
    id: "riwayat",
    title: "Riwayat yang mudah ditelusuri",
    desc: "Lihat kembali catatan harianmu lengkap dengan kategori 3R dan waktu pencatatan.",
  },
  {
    id: "panduan",
    title: "Panduan pemilahan 3R",
    desc: "Referensi singkat untuk mengenali material dan langkah penanganan yang tepat tanpa menghakimi.",
  },
  {
    id: "statistik",
    title: "Statistik kebiasaan mingguan",
    desc: "Visualisasi progres berdasarkan catatan nyatamu sendiri dari hari ke hari.",
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
  const [activeScreen, setActiveScreen] = useState<ScreenId>("beranda");
  const [selectedAction, setSelectedAction] = useState("Recycle");
  const [heroHoverX, setHeroHoverX] = useState<number | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("wastenot-theme", theme);
  }, [theme]);

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
      "(prefers-reduced-motion: reduce)"
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
      { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
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
        Lewati ke konten
      </a>

      <header className="site-header">
        <div className="container header-inner">
          <a
            href="#atas"
            className="brand-link"
            aria-label="WasteNot, kembali ke atas"
            onClick={() => setMenuOpen(false)}
          >
            <Brand />
          </a>

          <nav className="desktop-nav" aria-label="Navigasi utama">
            <a href="#antarmuka">Antarmuka & AI</a>
            <a href="#manfaat">Manfaat</a>
            <a href="#tentang">Tentang aplikasi</a>
          </nav>

          <div className="header-actions">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <a className="header-cta" href="#unduh">
              Unduh aplikasi <Arrow diagonal />
            </a>
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                {menuOpen ? (
                  <path
                    d="M6 6l12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
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

        {menuOpen && (
          <div className="container">
            <nav className="mobile-nav" aria-label="Navigasi seluler">
              <a href="#antarmuka" onClick={() => setMenuOpen(false)}>
                Antarmuka & AI
              </a>
              <a href="#manfaat" onClick={() => setMenuOpen(false)}>
                Manfaat
              </a>
              <a href="#tentang" onClick={() => setMenuOpen(false)}>
                Tentang aplikasi
              </a>
              <a href="#unduh" onClick={() => setMenuOpen(false)}>
                Unduh aplikasi
              </a>
            </nav>
          </div>
        )}
      </header>

      <main id="main">
        <section className="hero" id="atas">
          <div className="container">
            <div className="hero-centered" data-reveal="up">
              <h1 aria-label="Kebiasaan baik dimulai dari satu catatan.">
                <KineticText
                  text="Kebiasaan baik dimulai dari satu catatan."
                  accent="satu catatan."
                />
              </h1>
              <p className="hero-lede">
                Catat sampah yang kamu tangani, kenali materialnya dengan AI,
                pahami pilihan 3R, dan lihat kebiasaanmu berkembang dari hari ke
                hari.
              </p>
              <div className="hero-actions">
                <a
                  className="button button-primary"
                  href="#antarmuka"
                  onClick={() => setActiveScreen("ai")}
                >
                  Coba demo AI & antarmuka <Arrow diagonal />
                </a>
                <a className="text-link" href="#unduh">
                  Unduh untuk Android <Arrow />
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
                <AndroidScreen screen="beranda" />
              </div>

              <div className="trio-side trio-right">
                <AndroidScreen screen="statistik" />
              </div>
            </div>
          </div>
        </section>

        <section className="section showcase-section" id="antarmuka">
          <div className="container showcase-grid">
            <div className="showcase-copy" data-reveal="left">
              <p className="eyebrow" aria-label="Eksplorasi antarmuka">
                <KineticText text="Eksplorasi antarmuka" />
              </p>
              <h2 aria-label="Semua fitur utama, termasuk demo pindai AI.">
                <KineticText text="Semua fitur utama, termasuk demo pindai AI." />
              </h2>
              <p className="showcase-lede">
                Pilih halaman di bawah atau ketuk langsung ikon navigasi di
                dalam ponsel untuk melihat alur setiap fitur, termasuk pindai
                AI.
              </p>

              <div
                className="screen-switcher"
                role="tablist"
                aria-label="Pilih layar Android"
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
                Demo interaktif · Ketuk layar ponsel untuk mencoba
              </p>
            </div>
          </div>
        </section>

        <section className="section benefits" id="manfaat">
          <div className="seam-photo seam-photo-right seam-bottle" aria-hidden="true">
            <img
              className="seam-bottle-body"
              src="/images/seam-bottle-body.png"
              alt=""
              loading="lazy"
              decoding="async"
            />
            <img
              className="seam-bottle-cap"
              src="/images/seam-bottle-cap.png"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="container">
            <div className="section-head" data-reveal="up">
              <p className="eyebrow" aria-label="Arah produk">
                <KineticText text="Arah produk" />
              </p>
              <h2 aria-label="Lebih mudah peduli saat semuanya terasa jelas.">
                <KineticText text="Lebih mudah peduli saat semuanya terasa jelas." />
              </h2>
              <p>Tiga kemampuan inti yang membuat kebiasaan baik terasa ringan.</p>
            </div>

            <div className="editorial-cards">
              <article
                className="editorial-card"
                data-reveal="up"
                style={{ "--reveal-delay": "0ms" } as CSSProperties}
              >
                <div className="editorial-media">
                  <img
                    src="/images/card-ai-bottle.jpg"
                    alt="Ponsel memindai botol plastik PET di atas meja untuk dikenali AI"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="editorial-body">
                  <span className="card-index">01 · Pindai & Catat</span>
                  <h3>Kenali lebih cepat dengan AI.</h3>
                  <p>
                    Ambil foto atau catat manual untuk memuat material, berat,
                    dan cara penanganan dalam satu langkah singkat.
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
                    <span>7 hari terakhir</span>
                    <strong>2,45 kg</strong>
                  </div>
                  <div className="editorial-chart-bars">
                    {[
                      { day: "Sen", val: 44 },
                      { day: "Sel", val: 68 },
                      { day: "Rab", val: 40 },
                      { day: "Kam", val: 84 },
                      { day: "Jum", val: 58 },
                      { day: "Sab", val: 94, peak: true },
                      { day: "Min", val: 72 },
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
                  <span className="card-index">02 · Pahami</span>
                  <h3>Lihat pola, bukan tebakan.</h3>
                  <p>
                    Riwayat dan statistik memperlihatkan aktivitas yang tercatat
                    dari waktu ke waktu secara jujur.
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
                    src="/images/hero-sorting.jpg"
                    alt="Penerapan 3R di rumah: botol plastik dan toples kaca bersih terpilah di samping wadah pilah Paper, Plastic, Glass serta tas belanja kain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="editorial-body">
                  <span className="card-index">03 · Lanjutkan</span>
                  <h3>Temukan langkah berikutnya.</h3>
                  <p>
                    Panduan material memberi arah Reduce, Reuse, Recycle, atau
                    Trash tanpa menghakimi pilihanmu.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section about" id="tentang">
          <div className="seam-photo seam-photo-left seam-box" aria-hidden="true">
            <img
              className="seam-box-body"
              src="/images/seam-box-body.png"
              alt=""
              loading="lazy"
              decoding="async"
            />
            <img
              className="seam-box-flap-left"
              src="/images/seam-box-flap-left.png"
              alt=""
              loading="lazy"
              decoding="async"
            />
            <img
              className="seam-box-flap-right"
              src="/images/seam-box-flap-right.png"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="container about-grid">
            <div className="about-copy" data-reveal="left">
              <p className="eyebrow" aria-label="Dibuat untuk kebiasaan nyata">
                <KineticText text="Dibuat untuk kebiasaan nyata" />
              </p>
              <h2 aria-label="Lebih dari sekadar menghitung sampah.">
                <KineticText text="Lebih dari sekadar menghitung sampah." />
              </h2>
              <p>
                WasteNot hadir sebagai ruang pribadi untuk mencatat keputusan
                sehari-hari, memahami pilihan yang tersedia, lalu menentukan
                langkah berikutnya.
              </p>
              <div className="about-tags">
                <span>Catatan pribadi</span>
                <span>Tanpa klaim berlebih</span>
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
                    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.75" />
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
                    <h3>Kurangi dari awal</h3>
                    <span className="pillar-badge">Reduce</span>
                  </div>
                  <p>Mengurangi barang sekali pakai sebelum menjadi sampah.</p>
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
                    <h3>Pakai ulang lebih lama</h3>
                    <span className="pillar-badge">Reuse</span>
                  </div>
                  <p>Memakai ulang wadah, kemasan, atau sisa organik untuk kompos.</p>
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
                    <h3>Pilah untuk didaur ulang</h3>
                    <span className="pillar-badge">Recycle</span>
                  </div>
                  <p>Memilah material bersih agar lebih mudah didaur ulang.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="download-section" id="unduh">
          <div className="seam-photo seam-photo-right seam-can" aria-hidden="true">
            <img
              className="seam-can-body"
              src="/images/seam-can-wastenot.png"
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span className="seam-can-opening" />
            <img
              className="seam-can-tab"
              src="/images/seam-can-tab.png"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="container">
            <div className="download-shell">
              <div className="download-grid">
                <div className="download-copy" data-reveal="left">
                  <p className="eyebrow" aria-label="Aplikasi Android">
                    <KineticText text="Aplikasi Android" />
                  </p>
                  <h2 aria-label="WasteNot siap digunakan di Android.">
                    <KineticText text="WasteNot siap digunakan di Android." />
                  </h2>
                  <p>
                    Catat sampah harian, pindai material dengan AI, pelajari
                    panduan 3R, dan pantau progres kebiasaanmu langsung dari
                    ponsel.
                  </p>
                  <div className="download-highlights">
                    <span>Kamera &amp; scan AI</span>
                    <span>Catatan 3R lengkap</span>
                    <span>Statistik 7 &amp; 30 hari</span>
                  </div>
                </div>
                <div
                  className="download-card"
                  data-reveal="right"
                  style={{ "--reveal-delay": "120ms" } as CSSProperties}
                >
                  <div className="download-card-head">
                    <img
                      src="/images/wastenot-logo.png"
                      alt=""
                      className="download-app-icon"
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <span className="download-platform">Android APK</span>
                      <strong>WasteNot untuk Android</strong>
                    </div>
                  </div>
                  <ReleaseInfo />
                  <a className="button button-lime" href={`${base}download`}>
                    Unduh aplikasi Android <Arrow diagonal />
                  </a>
                  <small>
                    File APK diunduh langsung dari server WasteNot. Perangkat
                    mungkin meminta izin pemasangan aplikasi dari browser.
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
            <p className="footer-tagline">Catat. Pahami. Lanjutkan.</p>
            <p className="footer-note">
              Ruang pribadi untuk mencatat kebiasaan pilah sampah 3R harian di
              Android.
            </p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <strong>Navigasi</strong>
              <nav aria-label="Navigasi footer">
                <a href="#antarmuka">Antarmuka &amp; AI</a>
                <a href="#manfaat">Manfaat</a>
                <a href="#tentang">Tentang</a>
                <a href="#unduh">Unduh Android</a>
              </nav>
            </div>
            <div className="footer-col">
              <strong>Fokus 3R</strong>
              <ul>
                <li>Reduce · Kurangi</li>
                <li>Reuse · Pakai ulang</li>
                <li>Recycle · Daur ulang</li>
                <li>Kamera &amp; scan AI</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} WasteNot</span>
          <span>Lebih sadar, mulai dari satu catatan.</span>
        </div>
      </footer>
    </>
  );
}

export default App;
