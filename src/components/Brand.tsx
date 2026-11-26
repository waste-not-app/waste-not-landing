export function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark" aria-hidden="true">
        <img
          src="/images/wastenot-brand.webp"
          alt=""
          loading="eager"
          decoding="async"
        />
      </span>
      WasteNot<span className="brand-dot">.</span>
    </span>
  );
}
