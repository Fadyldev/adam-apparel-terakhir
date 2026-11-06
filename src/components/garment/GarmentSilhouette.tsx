interface GarmentSilhouetteProps {
  catalogId: string;
  colorHex: string;
  className?: string;
  strokeColor?: string;
}

export default function GarmentSilhouette({
  catalogId,
  colorHex,
  className = 'w-48 h-56',
  strokeColor = '#334155',
}: GarmentSilhouetteProps) {
  // 1. JUBAH PRIA SALAF / THOBE
  // Ankle-length flowing robe, stand mandarin collar, concealed placket, welt pocket, long sleeves
  if (catalogId === 'cat-jubah') {
    return (
      <svg
        viewBox="0 0 320 380"
        className={className}
        role="img"
        aria-label="Mockup Jubah Pria Salaf"
      >
        <defs>
          <linearGradient id="jubahShade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.14" />
          </linearGradient>
        </defs>

        {/* Main Jubah Body & Long Sleeves down to ankles */}
        <path
          d="M125 35 L50 72 L10 205 L48 218 L68 150 L64 350 Q64 365 85 365 L235 365 Q256 365 256 350 L252 150 L272 218 L310 205 L270 72 L195 35 Z"
          fill={colorHex}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        {/* Soft fabric drape overlay */}
        <path
          d="M125 35 L50 72 L10 205 L48 218 L68 150 L64 350 Q64 365 85 365 L235 365 Q256 365 256 350 L252 150 L272 218 L310 205 L270 72 L195 35 Z"
          fill="url(#jubahShade)"
        />

        {/* Mandarin / Shanghai Stand Collar */}
        <path
          d="M125 35 Q160 48 195 35 L192 20 Q160 33 128 20 Z"
          fill="#ffffff"
          fillOpacity="0.25"
          stroke={strokeColor}
          strokeWidth="2"
        />

        {/* Concealed Front Placket */}
        <rect
          x="154"
          y="42"
          width="12"
          height="115"
          rx="2"
          fill="#ffffff"
          fillOpacity="0.18"
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        <circle cx="160" cy="55" r="2.5" fill="#f8fafc" stroke={strokeColor} strokeWidth="1" />
        <circle cx="160" cy="85" r="2.5" fill="#f8fafc" stroke={strokeColor} strokeWidth="1" />
        <circle cx="160" cy="115" r="2.5" fill="#f8fafc" stroke={strokeColor} strokeWidth="1" />
        <circle cx="160" cy="145" r="2.5" fill="#f8fafc" stroke={strokeColor} strokeWidth="1" />

        {/* Chest Welt Pocket (Kiri Dada) */}
        <rect x="94" y="85" width="36" height="6" rx="1.5" fill="#ffffff" fillOpacity="0.2" stroke={strokeColor} strokeWidth="1.5" />

        {/* Cuffs (Pergelangan Tangan) */}
        <line x1="10" y1="205" x2="48" y2="218" stroke={strokeColor} strokeWidth="2" />
        <line x1="310" y1="205" x2="272" y2="218" stroke={strokeColor} strokeWidth="2" />

        {/* Vertical Center Flowing Drape Line */}
        <line x1="160" y1="160" x2="160" y2="360" stroke={strokeColor} strokeWidth="1.2" strokeDasharray="6 4" strokeOpacity="0.5" />
        <line x1="110" y1="190" x2="98" y2="360" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="4 4" strokeOpacity="0.3" />
        <line x1="210" y1="190" x2="222" y2="360" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="4 4" strokeOpacity="0.3" />
      </svg>
    );
  }

  // 2. GAMIS & ABAYA AKHWAT SYAR'I
  // Flowing A-line wide drape, waist pleats, wudhu-friendly cuffs, modest round neckline
  if (catalogId === 'cat-gamis') {
    return (
      <svg
        viewBox="0 0 320 380"
        className={className}
        role="img"
        aria-label="Mockup Gamis & Abaya Akhwat Syar'i"
      >
        <defs>
          <linearGradient id="gamisShade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.14" />
          </linearGradient>
        </defs>

        {/* Wide Elegant A-line Gamis Body & Long Sleeves */}
        <path
          d="M130 35 L55 75 L12 210 L50 220 L68 150 L42 355 Q42 368 65 368 L255 368 Q278 368 278 355 L252 150 L270 220 L308 210 L265 75 L190 35 Z"
          fill={colorHex}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        <path
          d="M130 35 L55 75 L12 210 L50 220 L68 150 L42 355 Q42 368 65 368 L255 368 Q278 368 278 355 L252 150 L270 220 L308 210 L265 75 L190 35 Z"
          fill="url(#gamisShade)"
        />

        {/* Modest Round Neckline with Soft Binding */}
        <path d="M130 35 Q160 52 190 35" fill="none" stroke={strokeColor} strokeWidth="2.5" />
        <path d="M132 37 Q160 50 188 37" fill="#ffffff" fillOpacity="0.2" />

        {/* Front Concealed Busui Zipper line */}
        <line x1="160" y1="52" x2="160" y2="135" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="160" cy="54" r="2" fill="#e2e8f0" stroke={strokeColor} strokeWidth="1" />

        {/* Wudhu-Friendly Long Cuffs with Buttons */}
        <line x1="12" y1="210" x2="50" y2="220" stroke={strokeColor} strokeWidth="2" />
        <circle cx="31" cy="207" r="1.5" fill="#f8fafc" stroke={strokeColor} strokeWidth="0.8" />
        <line x1="308" y1="210" x2="270" y2="220" stroke={strokeColor} strokeWidth="2" />
        <circle cx="289" cy="207" r="1.5" fill="#f8fafc" stroke={strokeColor} strokeWidth="0.8" />

        {/* Waist Gather Line (Garis Potongan Pinggang Longgar) */}
        <path d="M68 145 Q160 156 252 145" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeOpacity="0.5" />

        {/* Flowing Pleats Lines down the skirt */}
        <path d="M110 150 Q100 250 85 368" fill="none" stroke={strokeColor} strokeWidth="1" strokeOpacity="0.35" />
        <path d="M160 152 Q160 255 160 368" fill="none" stroke={strokeColor} strokeWidth="1.2" strokeOpacity="0.4" />
        <path d="M210 150 Q220 250 235 368" fill="none" stroke={strokeColor} strokeWidth="1" strokeOpacity="0.35" />
      </svg>
    );
  }

  // 3. KHIMAR & HIJAB SYAR'I
  // Draped triangle veil closing over chest & shoulders with soft face opening
  if (catalogId === 'cat-khimar') {
    return (
      <svg
        viewBox="0 0 320 380"
        className={className}
        role="img"
        aria-label="Mockup Khimar & Hijab Syar'i"
      >
        {/* Head and Flowing Drape Body */}
        <path
          d="M160 20 Q105 20 95 90 Q85 180 40 250 Q100 295 160 350 Q220 295 280 250 Q235 180 225 90 Q215 20 160 20 Z"
          fill={colorHex}
          stroke={strokeColor}
          strokeWidth="1.5"
        />

        {/* Soft Face Opening */}
        <ellipse cx="160" cy="100" rx="36" ry="46" fill="#f8fafc" fillOpacity="0.95" stroke="#94a3b8" strokeWidth="1.5" />

        {/* Antem Pet (Bantalan Pet Tegak di Dahi) */}
        <path d="M125 75 Q160 60 195 75 Q160 68 125 75 Z" fill="#ffffff" fillOpacity="0.3" stroke={strokeColor} strokeWidth="1.2" />

        {/* Under-chin Stitched Seam */}
        <line x1="160" y1="146" x2="160" y2="340" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="5 3" />

        {/* Soft Flowing Drapes on Sides */}
        <path d="M100 170 Q120 240 145 315" fill="none" stroke={strokeColor} strokeWidth="1" strokeOpacity="0.35" />
        <path d="M220 170 Q200 240 175 315" fill="none" stroke={strokeColor} strokeWidth="1" strokeOpacity="0.35" />

        {/* Hem Stitched Edge (Jahitan Kelim Tepi Halus) */}
        <path d="M42 250 Q100 295 160 350 Q220 295 278 250" fill="none" stroke={strokeColor} strokeWidth="2" strokeDasharray="3 2" strokeOpacity="0.6" />
      </svg>
    );
  }

  // 4. KEMEJA KOKO KURTA MODERN / SIRWAL
  // Mid-thigh length shirt, mandarin collar, center button placket, side slit slits
  if (catalogId === 'cat-kurta') {
    return (
      <svg
        viewBox="0 0 320 380"
        className={className}
        role="img"
        aria-label="Mockup Kemeja Koko Kurta Modern"
      >
        {/* Main Kurta Body & Sleeves (Mid-thigh length) */}
        <path
          d="M125 38 L55 72 L18 175 L56 190 L72 145 L70 315 L88 315 L88 280 L232 280 L232 315 L250 315 L248 145 L264 190 L302 175 L265 72 L195 38 Z"
          fill={colorHex}
          stroke={strokeColor}
          strokeWidth="1.5"
        />

        {/* Mandarin Stand Collar */}
        <path d="M125 38 Q160 50 195 38 L192 25 Q160 36 128 25 Z" fill="#ffffff" fillOpacity="0.25" stroke={strokeColor} strokeWidth="2" />

        {/* Chest Button Placket */}
        <rect x="153" y="44" width="14" height="90" rx="2" fill="#ffffff" fillOpacity="0.2" stroke={strokeColor} strokeWidth="1.5" />
        <circle cx="160" cy="55" r="2.5" fill="#f8fafc" stroke={strokeColor} strokeWidth="1" />
        <circle cx="160" cy="80" r="2.5" fill="#f8fafc" stroke={strokeColor} strokeWidth="1" />
        <circle cx="160" cy="105" r="2.5" fill="#f8fafc" stroke={strokeColor} strokeWidth="1" />
        <circle cx="160" cy="125" r="2.5" fill="#f8fafc" stroke={strokeColor} strokeWidth="1" />

        {/* Subtle Embroidered Chest Accent (Bordir Minimalis Koko) */}
        <path d="M100 80 Q120 70 145 80" fill="none" stroke={strokeColor} strokeWidth="1.2" strokeOpacity="0.4" />
        <path d="M175 80 Q200 70 220 80" fill="none" stroke={strokeColor} strokeWidth="1.2" strokeOpacity="0.4" />

        {/* Side Slit Cuts (Belahan Samping Fleksibel Melangkah) */}
        <line x1="88" y1="240" x2="88" y2="315" stroke={strokeColor} strokeWidth="2" />
        <line x1="232" y1="240" x2="232" y2="315" stroke={strokeColor} strokeWidth="2" />

        {/* Sleeve Cuffs */}
        <line x1="18" y1="175" x2="56" y2="190" stroke={strokeColor} strokeWidth="2" />
        <line x1="302" y1="175" x2="264" y2="190" stroke={strokeColor} strokeWidth="2" />
      </svg>
    );
  }

  // 5. KEMEJA PDH / PDL / SERAGAM PONDOK & KANTOR
  // Spread collar, dual buttoned chest pockets with flaps, shoulder epaulets, button placket
  if (catalogId === 'cat-pdh') {
    return (
      <svg
        viewBox="0 0 320 380"
        className={className}
        role="img"
        aria-label="Mockup Kemeja PDH Seragam Pondok"
      >
        {/* Main Body */}
        <path
          d="M125 45 L50 75 L15 170 L55 185 L70 140 L70 310 Q70 325 90 325 L230 325 Q250 325 250 310 L250 140 L265 185 L305 170 L270 75 L195 45 Z"
          fill={colorHex}
          stroke={strokeColor}
          strokeWidth="1.5"
        />

        {/* Spread Shirt Collar */}
        <path d="M125 45 L145 75 L160 55 L175 75 L195 45 L170 35 Q160 42 150 35 Z" fill="#ffffff" fillOpacity="0.25" stroke={strokeColor} strokeWidth="2" />

        {/* Center Placket with Buttons */}
        <rect x="153" y="55" width="14" height="260" rx="1.5" fill="#ffffff" fillOpacity="0.15" stroke={strokeColor} strokeWidth="1.2" />
        <circle cx="160" cy="75" r="2.5" fill="#f8fafc" stroke={strokeColor} strokeWidth="1" />
        <circle cx="160" cy="115" r="2.5" fill="#f8fafc" stroke={strokeColor} strokeWidth="1" />
        <circle cx="160" cy="155" r="2.5" fill="#f8fafc" stroke={strokeColor} strokeWidth="1" />
        <circle cx="160" cy="195" r="2.5" fill="#f8fafc" stroke={strokeColor} strokeWidth="1" />
        <circle cx="160" cy="235" r="2.5" fill="#f8fafc" stroke={strokeColor} strokeWidth="1" />
        <circle cx="160" cy="275" r="2.5" fill="#f8fafc" stroke={strokeColor} strokeWidth="1" />

        {/* Dual Flap Chest Pockets (Kiri & Kanan) */}
        {/* Left Pocket */}
        <rect x="90" y="105" width="46" height="50" rx="2" fill="#ffffff" fillOpacity="0.12" stroke={strokeColor} strokeWidth="1.5" />
        <path d="M90 105 L113 118 L136 105 Z" fill="#ffffff" fillOpacity="0.25" stroke={strokeColor} strokeWidth="1.5" />
        <circle cx="113" cy="112" r="2" fill="#f8fafc" stroke={strokeColor} strokeWidth="0.8" />

        {/* Right Pocket */}
        <rect x="184" y="105" width="46" height="50" rx="2" fill="#ffffff" fillOpacity="0.12" stroke={strokeColor} strokeWidth="1.5" />
        <path d="M184 105 L207 118 L230 105 Z" fill="#ffffff" fillOpacity="0.25" stroke={strokeColor} strokeWidth="1.5" />
        <circle cx="207" cy="112" r="2" fill="#f8fafc" stroke={strokeColor} strokeWidth="0.8" />

        {/* Shoulder Epaulets (Pangkat di Pundak) */}
        <polygon points="125,45 85,62 88,68 128,50" fill="#ffffff" fillOpacity="0.25" stroke={strokeColor} strokeWidth="1.2" />
        <polygon points="195,45 235,62 232,68 192,50" fill="#ffffff" fillOpacity="0.25" stroke={strokeColor} strokeWidth="1.2" />
      </svg>
    );
  }

  // 6. ROMPI & JAKET HOODIE ANGKATAN PESANTREN
  if (catalogId === 'cat-hoodie') {
    return (
      <svg
        viewBox="0 0 320 380"
        className={className}
        role="img"
        aria-label="Mockup Hoodie & Jaket Angkatan"
      >
        {/* Hood at top */}
        <path d="M115 50 Q160 15 205 50 Q160 68 115 50 Z" fill="#ffffff" fillOpacity="0.2" stroke={strokeColor} strokeWidth="2" />

        {/* Main Body & Long Sleeves */}
        <path
          d="M120 48 L48 80 L12 190 L52 205 L68 165 L68 315 Q68 330 88 330 L232 330 Q252 330 252 315 L252 165 L268 205 L308 190 L272 80 L200 48 Z"
          fill={colorHex}
          stroke={strokeColor}
          strokeWidth="1.5"
        />

        {/* Drawstrings */}
        <line x1="145" y1="55" x2="140" y2="115" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="175" y1="55" x2="180" y2="115" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />

        {/* Kangaroo Pocket */}
        <path d="M100 215 L220 215 L235 275 L85 275 Z" fill="#ffffff" fillOpacity="0.14" stroke={strokeColor} strokeWidth="1.5" />

        {/* Bottom Waist Rib */}
        <rect x="68" y="310" width="184" height="20" rx="3" fill="#ffffff" fillOpacity="0.1" stroke={strokeColor} strokeWidth="1.5" />
      </svg>
    );
  }

  // 7. POLO BORDIR
  if (catalogId === 'cat-polo') {
    return (
      <svg
        viewBox="0 0 320 380"
        className={className}
        role="img"
        aria-label="Mockup Polo Bordir"
      >
        <path
          d="M125 45 L65 72 L25 145 L68 165 L78 135 L78 310 Q78 325 98 325 L222 325 Q242 325 242 310 L242 135 L252 165 L295 145 L255 72 L195 45 Z"
          fill={colorHex}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        {/* Ribbed Collar */}
        <path d="M125 45 L150 68 L160 68 L170 68 L195 45 L170 36 Q160 44 150 36 Z" fill="#ffffff" fillOpacity="0.25" stroke={strokeColor} strokeWidth="2.5" />
        {/* Placket */}
        <rect x="151" y="65" width="18" height="65" rx="2" fill="#ffffff" fillOpacity="0.18" stroke={strokeColor} strokeWidth="1.5" />
        <circle cx="160" cy="80" r="2.5" fill="#f8fafc" stroke={strokeColor} strokeWidth="1" />
        <circle cx="160" cy="105" r="2.5" fill="#f8fafc" stroke={strokeColor} strokeWidth="1" />
        {/* Sleeve Ribs */}
        <path d="M25 145 L68 165" stroke={strokeColor} strokeWidth="3" />
        <path d="M295 145 L252 165" stroke={strokeColor} strokeWidth="3" />
      </svg>
    );
  }

  // 8. JERSEY SANTRI & SPORT
  if (catalogId === 'cat-jersey') {
    return (
      <svg
        viewBox="0 0 320 380"
        className={className}
        role="img"
        aria-label="Mockup Jersey Sport Santri"
      >
        <path
          d="M125 42 L65 72 L25 145 L65 165 L76 135 L76 310 Q76 325 96 325 L224 325 Q244 325 244 310 L244 135 L255 165 L295 145 L255 72 L195 42 Z"
          fill={colorHex}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        <path d="M125 42 L65 165" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" />
        <path d="M195 42 L255 165" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" />
        <path d="M125 42 L160 75 L195 42" fill="none" stroke="#f8fafc" strokeWidth="3" />
      </svg>
    );
  }

  // 9. KAOS DAKWAH / KOMUNITAS KAJIAN & DEFAULT CUSTOM
  return (
    <svg
      viewBox="0 0 320 380"
      className={className}
      role="img"
      aria-label="Mockup Kaos Dakwah / Busana"
    >
      <path
        d="M125 40 L60 70 L20 145 L62 165 L74 135 L74 305 Q74 320 94 320 L226 320 Q246 320 246 305 L246 135 L258 165 L300 145 L260 70 L195 40 Q160 65 125 40 Z"
        fill={colorHex}
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      {/* Rib Collar */}
      <path d="M125 40 Q160 65 195 40" fill="none" stroke={strokeColor} strokeWidth="2.5" />
      <path d="M125 40 Q160 58 195 40" fill="none" stroke="#94a3b8" strokeWidth="1" />
      {/* Shoulder Chain Stitch */}
      <line x1="125" y1="40" x2="60" y2="70" stroke={strokeColor} strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.5" />
      <line x1="195" y1="40" x2="260" y2="70" stroke={strokeColor} strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.5" />
    </svg>
  );
}
