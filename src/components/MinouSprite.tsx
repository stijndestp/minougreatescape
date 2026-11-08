/**
 * Minou op de kaart — tijdelijk 2D-cartoonpersonage (voeten op het punt 0,0).
 * Alleen weergave: de bewegingslogica staat in src/map/rig.ts. Vervang de
 * tekening hier door een definitieve illustratie zonder iets anders te wijzigen;
 * houd wel de klassen `.minou-leg-a/-b`, `.minou-body` en `.minou-pin` aan voor
 * de loop- en markeringsanimaties (zie globals.css).
 */
export default function MinouSprite() {
  return (
    <g className="minou-sprite">
      <ellipse cx={0} cy={0} rx={26} ry={8} fill="rgba(0,0,0,.25)" />
      <g className="minou-pin">
        <path d="M0 -146 L-12 -166 L12 -166 Z" fill="#ff3d68" stroke="#fff" strokeWidth={3} strokeLinejoin="round" />
      </g>

      {/* Benen (zwaaien tijdens het lopen) */}
      <g className="minou-leg minou-leg-a">
        <rect x={-11} y={-36} width={9} height={34} rx={4.5} fill="#ffd9b8" />
        <ellipse cx={-6.5} cy={-2} rx={9} ry={4.5} fill="#5b2a86" />
      </g>
      <g className="minou-leg minou-leg-b">
        <rect x={2} y={-36} width={9} height={34} rx={4.5} fill="#ffd9b8" />
        <ellipse cx={6.5} cy={-2} rx={9} ry={4.5} fill="#5b2a86" />
      </g>

      <g className="minou-body">
        {/* Lang rood haar achter het lichaam */}
        <path d="M-30 -100 Q-38 -60 -22 -52 L22 -52 Q38 -60 30 -100 Z" fill="#d6401f" />
        {/* Jurk: smalle taille, uitlopende rok */}
        <path d="M-12 -76 Q-14 -62 -24 -34 L24 -34 Q14 -62 12 -76 Z" fill="#7b2cbf" />
        <path d="M-12 -76 L12 -76 L10 -66 L-10 -66 Z" fill="#9d4edd" />
        {/* Armen */}
        <rect x={-20} y={-74} width={7} height={26} rx={3.5} fill="#ffd9b8" transform="rotate(8 -16 -74)" />
        <rect x={13} y={-74} width={7} height={26} rx={3.5} fill="#ffd9b8" transform="rotate(-8 16 -74)" />
        {/* Hoofd */}
        <circle cx={0} cy={-96} r={22} fill="#ffd9b8" />
        {/* Haar: volle krullen en pony */}
        <path d="M-26 -98 Q-28 -126 0 -126 Q28 -126 26 -98 Q20 -112 6 -112 Q-10 -106 -26 -98 Z" fill="#d6401f" />
        <circle cx={-25} cy={-100} r={9} fill="#d6401f" />
        <circle cx={25} cy={-100} r={9} fill="#d6401f" />
        {/* Gezicht */}
        <circle cx={-8} cy={-94} r={2.8} fill="#3a2a2a" />
        <circle cx={8} cy={-94} r={2.8} fill="#3a2a2a" />
        <path d="M-7 -85 Q0 -79 7 -85" stroke="#c2185b" strokeWidth={3} fill="none" strokeLinecap="round" />
        {/* Grote ringoorbellen */}
        <circle cx={-23} cy={-84} r={9} fill="none" stroke="#ffc400" strokeWidth={3.5} />
        <circle cx={23} cy={-84} r={9} fill="none" stroke="#ffc400" strokeWidth={3.5} />
      </g>
    </g>
  );
}
