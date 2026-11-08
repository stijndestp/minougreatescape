/** Tijdelijk portret van Sinterklaas (SVG-placeholder, vervangbaar). */
export default function SinterklaasSprite({ size = 150 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 150 150" role="img" aria-label="Sinterklaas (placeholder)">
      {/* mantel */}
      <path d="M20 150 Q24 100 75 96 Q126 100 130 150 Z" fill="#d62f2f" />
      <path d="M75 96 V150" stroke="#ffc400" strokeWidth={5} />
      {/* baard */}
      <path d="M34 66 Q30 124 75 132 Q120 124 116 66 Z" fill="#fff" />
      {/* gezicht */}
      <circle cx={75} cy={66} r={28} fill="#ffd9b8" />
      <circle cx={65} cy={62} r={3.2} fill="#3a2a2a" />
      <circle cx={85} cy={62} r={3.2} fill="#3a2a2a" />
      <path d="M62 54 Q65 50 69 53 M81 53 Q85 50 88 54" stroke="#e8e8e8" strokeWidth={3} fill="none" strokeLinecap="round" />
      <ellipse cx={75} cy={73} rx={5} ry={3.5} fill="#f2a08a" />
      {/* snor */}
      <path d="M52 80 Q75 70 98 80 Q75 92 52 80 Z" fill="#fff" stroke="#ddd" strokeWidth={1.5} />
      {/* mijter */}
      <path d="M44 46 Q75 -6 106 46 Q75 38 44 46 Z" fill="#d62f2f" stroke="#ffc400" strokeWidth={3} strokeLinejoin="round" />
      <path d="M75 8 V32 M65 18 H85" stroke="#ffc400" strokeWidth={5} strokeLinecap="round" />
      <rect x={42} y={42} width={66} height={8} rx={4} fill="#ffc400" />
    </svg>
  );
}
