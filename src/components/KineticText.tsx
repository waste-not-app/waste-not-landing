/**
 * Splits text into per-letter spans that lift in a wave under the pointer.
 * Screen readers get the plain text from a visually hidden copy, so the
 * letter spans are hidden from them.
 */
export function KineticText({
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
        {wIdx < arr.length - 1 ? " " : ""}
      </span>
    ));

  const visual =
    accent && text.includes(accent)
      ? (() => {
          const [before, after] = text.split(accent);
          return (
            <>
              {before && renderChars(before)}
              <em className="k-em">{renderChars(accent, true)}</em>
              {after && renderChars(after)}
            </>
          );
        })()
      : renderChars(text);

  return (
    <span className="k-text">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{visual}</span>
    </span>
  );
}
