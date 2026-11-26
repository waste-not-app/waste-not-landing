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
