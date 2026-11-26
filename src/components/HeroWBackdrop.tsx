import { useEffect, useRef, useState } from "react";

export function HeroWBackdrop({ hoverX }: { hoverX: number | null }) {
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
