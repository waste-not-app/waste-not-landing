import type { CSSProperties } from "react";

/**
 * Splits a heading into words that slide up from a clipped line once an
 * ancestor with `data-reveal` gains `is-visible`. Words stay real text with
 * real spaces, so screen readers read the heading normally.
 */
export function RevealText({
  text,
  accent,
}: {
  text: string;
  accent?: string;
}) {
  const accentStart = accent ? text.indexOf(accent) : -1;
  const before = accentStart >= 0 ? text.slice(0, accentStart) : text;
  const marked = accentStart >= 0 && accent ? accent : "";
  const after =
    accentStart >= 0 && accent ? text.slice(accentStart + accent.length) : "";

  let index = 0;
  const words = (part: string, isAccent: boolean) =>
    part
      .split(" ")
      .filter(Boolean)
      .map((word) => {
        const i = index++;
        return (
          <span key={i}>
            <span className="rt-w">
              <span
                className={`rt-i${isAccent ? " rt-accent" : ""}`}
                style={{ "--i": i } as CSSProperties}
              >
                {word}
              </span>
            </span>{" "}
          </span>
        );
      });

  return (
    <span className="rt">
      {words(before, false)}
      {marked && <em className="rt-em">{words(marked, true)}</em>}
      {words(after, false)}
    </span>
  );
}
