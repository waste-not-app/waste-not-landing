import { useEffect, useRef, type RefObject } from "react";

type Motion = { x: number; weight: number };

/** The four ribbon paths for a pointer position and bend strength. */
function ribbonPaths(motion: Motion): string[] {
  const bend = (cx: number, radius = 0.28) => {
    if (motion.weight <= 0.001) return 0;
    const dist = Math.abs(motion.x - cx);
    if (dist >= radius) return 0;
    // Smooth cosine bell times the global fade-in/out weight
    return (
      Math.pow(0.5 * (1 + Math.cos((dist / radius) * Math.PI)), 1.3) *
      motion.weight
    );
  };

  // Exact 773x546 proportions of the W mark; all joints stay coupled
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

  return [
    `M88 332 C62 198, 152 62, ${ltx} ${lty} C382 156, 282 224, 154 244 C198 176, 288 122, 362 82 C264 124, 160 198, 88 332 Z`,
    `M78 348 C34 232, 108 82, ${ltx} ${lty} C306 68, 186 154, 118 302 C94 334, 78 348, 78 348 Z`,
    `M354 ${cpy} C404 ${(374 - pCenter * 10).toFixed(1)}, 468 ${(460 - pRightDip * 8).toFixed(1)}, 536 ${(492 - pRightDip * 10).toFixed(1)} C580 ${(512 - pRightDip * 10).toFixed(1)}, 628 492, 660 442 C614 452, 568 430, 514 372 C464 ${(316 - pCenter * 10).toFixed(1)}, 408 ${(282 - pCenter * 12).toFixed(1)}, 354 ${cpy} Z`,
    `M76 254 C40 384, 112 ${ldy}, 212 ${ldy} C288 ${ldy}, 338 ${(400 - pCenter * 8).toFixed(1)}, 388 ${cpy} C430 ${(278 - pCenter * 12).toFixed(1)}, 466 ${(322 - pCenter * 8).toFixed(1)}, 516 396 C562 466, 614 ${rdy}, 676 488 C746 426, ${(760 + atx).toFixed(1)} ${(292 + aty).toFixed(1)}, ${(702 + atx).toFixed(1)} ${(196 + aty).toFixed(1)} L${(742 + atx).toFixed(1)} ${(170 + aty).toFixed(1)} C${(748 + atx).toFixed(1)} ${(166 + aty).toFixed(1)}, ${(746 + atx).toFixed(1)} ${(156 + aty).toFixed(1)}, ${(738 + atx).toFixed(1)} ${(156 + aty).toFixed(1)} L${(596 + atx).toFixed(1)} ${(154 + aty).toFixed(1)} C${(588 + atx).toFixed(1)} ${(154 + aty).toFixed(1)}, ${(584 + atx).toFixed(1)} ${(162 + aty).toFixed(1)}, ${(586 + atx).toFixed(1)} ${(170 + aty).toFixed(1)} L${(622 + atx).toFixed(1)} ${(294 + aty).toFixed(1)} C${(624 + atx).toFixed(1)} ${(302 + aty).toFixed(1)}, ${(634 + atx).toFixed(1)} ${(304 + aty).toFixed(1)}, ${(640 + atx).toFixed(1)} ${(298 + aty).toFixed(1)} L${(668 + atx).toFixed(1)} ${(268 + aty).toFixed(1)} C${(704 + atx * 0.4).toFixed(1)} ${(326 + aty * 0.4).toFixed(1)}, 696 422, 638 468 C598 468, 562 422, 526 354 C472 ${(274 - pCenter * 10).toFixed(1)}, 410 ${cpyTop}, 352 ${cpy} C298 ${(358 - pLeftDip * 6).toFixed(1)}, 258 ${ldyInner}, 210 ${(462 - pLeftDip * 14).toFixed(1)} C142 ${(460 - pLeftDip * 12).toFixed(1)}, 98 346, 98 250 Z`,
  ];
}

const rest = ribbonPaths({ x: 0.5, weight: 0 });

/**
 * The WasteNot "W" ribbon behind the hero phones. It bends toward the mouse
 * while it moves over `stageRef`. The animation writes the path data straight
 * to the DOM once per frame instead of re-rendering React, so only the SVG
 * repaints.
 */
export function HeroWBackdrop({
  stageRef,
}: {
  stageRef: RefObject<HTMLElement | null>;
}) {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target: Motion = { x: 0.5, weight: 0 };
    const current: Motion = { x: 0.5, weight: 0 };
    let frame = 0;

    const draw = () => {
      const d = ribbonPaths(current);
      pathRefs.current.forEach((path, i) => path?.setAttribute("d", d[i]));
    };
    const tick = () => {
      const dx = target.x - current.x;
      const dw = target.weight - current.weight;
      current.x += dx * 0.09;
      current.weight += dw * 0.08;
      if (Math.abs(dx) < 0.0008 && Math.abs(dw) < 0.0008) {
        current.x = target.x;
        current.weight = target.weight;
        draw();
        frame = 0;
        return;
      }
      draw();
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onMove = (event: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      if (rect.width <= 0) return;
      const x = (event.clientX - rect.left) / rect.width;
      // When waking from rest, start at the pointer so it doesn't sweep in
      if (current.weight < 0.02) current.x = x;
      target.x = x;
      target.weight = 1;
      start();
    };
    const onLeave = () => {
      target.weight = 0;
      start();
    };

    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);
    return () => {
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [stageRef]);

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

        <path
          ref={(el) => {
            pathRefs.current[0] = el;
          }}
          d={rest[0]}
          fill="url(#wnLeafGrad)"
        />
        <path
          ref={(el) => {
            pathRefs.current[1] = el;
          }}
          d={rest[1]}
          fill="#69B832"
          opacity="0.9"
        />

        <path
          ref={(el) => {
            pathRefs.current[2] = el;
          }}
          d={rest[2]}
          fill="url(#wnFoldGrad)"
          opacity="0.88"
        />

        <path
          ref={(el) => {
            pathRefs.current[3] = el;
          }}
          d={rest[3]}
          fill="url(#wnRibbonGrad)"
        />
      </svg>
    </div>
  );
}
