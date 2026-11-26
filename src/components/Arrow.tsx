export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <span className="btn-arrow" aria-hidden="true">
      <svg viewBox="0 0 18 18" fill="none">
        {diagonal ? (
          <path
            d="M4.5 13.5 13.5 4.5M6.5 4.5h7v7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M3.5 9h11M10 4.5 14.5 9 10 13.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </span>
  );
}
