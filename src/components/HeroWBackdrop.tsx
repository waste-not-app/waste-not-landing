/**
 * The WasteNot "W" ribbon behind the hero phones. It is painted once and only
 * moved with a composited transform (see .hero-w-backdrop), so pointer
 * parallax never repaints it. Gecko repaints a masked SVG on every path
 * change, which made the old bending animation stutter in Firefox and Zen.
 */
export function HeroWBackdrop() {
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
          d="M88 332 C62 198, 152 62, 420 22 C382 156, 282 224, 154 244 C198 176, 288 122, 362 82 C264 124, 160 198, 88 332 Z"
          fill="url(#wnLeafGrad)"
        />
        <path
          d="M78 348 C34 232, 108 82, 420 22 C306 68, 186 154, 118 302 C94 334, 78 348, 78 348 Z"
          fill="#69B832"
          opacity="0.9"
        />

        <path
          d="M354 318 C404 374, 468 460, 536 492 C580 512, 628 492, 660 442 C614 452, 568 430, 514 372 C464 316, 408 282, 354 318 Z"
          fill="url(#wnFoldGrad)"
          opacity="0.88"
        />

        <path
          d="M76 254 C40 384, 112 526, 212 526 C288 526, 338 400, 388 318 C430 278, 466 322, 516 396 C562 466, 614 524, 676 488 C746 426, 760 292, 702 196 L742 170 C748 166, 746 156, 738 156 L596 154 C588 154, 584 162, 586 170 L622 294 C624 302, 634 304, 640 298 L668 268 C704 326, 696 422, 638 468 C598 468, 562 422, 526 354 C472 274, 410 246, 352 318 C298 358, 258 462, 210 462 C142 460, 98 346, 98 250 Z"
          fill="url(#wnRibbonGrad)"
        />
      </svg>
    </div>
  );
}
