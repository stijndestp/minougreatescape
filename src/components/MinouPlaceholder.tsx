/** Tijdelijke illustratie van Minou: rood haar en grote ringoorbellen. */
export default function MinouPlaceholder({ size = 120 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Minou (placeholder)"
    >
      <circle cx="60" cy="52" r="42" fill="#d6401f" />
      <rect x="22" y="50" width="76" height="62" rx="30" fill="#d6401f" />
      <circle cx="60" cy="58" r="30" fill="#ffd9b8" />
      <circle cx="49" cy="55" r="4" fill="#3a2a2a" />
      <circle cx="71" cy="55" r="4" fill="#3a2a2a" />
      <path d="M49 70 Q60 80 71 70" stroke="#c2185b" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="28" cy="78" r="11" fill="none" stroke="#ffc400" strokeWidth="4" />
      <circle cx="92" cy="78" r="11" fill="none" stroke="#ffc400" strokeWidth="4" />
    </svg>
  );
}
