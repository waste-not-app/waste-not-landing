const items = [
  { label: "Plastic", tone: "pine" },
  { label: "Reduce", tone: "lime" },
  { label: "Paper", tone: "sand" },
  { label: "Reuse", tone: "lime" },
  { label: "Glass", tone: "sky" },
  { label: "Recycle", tone: "lime" },
  { label: "Metal", tone: "steel" },
  { label: "Trash", tone: "lime" },
  { label: "Organic", tone: "leaf" },
  { label: "Electronic", tone: "steel" },
] as const;

/** A decorative band of the categories and methods the app tracks. */
export function Marquee() {
  const row = items.map((item) => (
    <span key={item.label} className={`marquee-item tone-${item.tone}`}>
      <span className="marquee-dot" />
      {item.label}
    </span>
  ));
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <div className="marquee-row">{row}</div>
        <div className="marquee-row">{row}</div>
      </div>
    </div>
  );
}
