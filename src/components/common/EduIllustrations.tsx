import React from 'react';

interface IllustrationProps {
  type: string;
  className?: string;
}

export const EduIllustration: React.FC<IllustrationProps> = ({ type, className = 'w-48 h-48' }) => {
  switch (type) {
    case 'leaf':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#ecfdf5" />
          {/* Leaf body */}
          <path
            d="M50 150 C40 80, 110 40, 150 40 C160 100, 110 160, 50 150 Z"
            fill="#10b981"
            stroke="#047857"
            strokeWidth="4"
          />
          {/* Main vein */}
          <path d="M50 150 Q105 100 150 40" stroke="#d1fae5" strokeWidth="4" strokeLinecap="round" />
          {/* Side veins */}
          <path d="M80 120 Q105 125 120 135" stroke="#d1fae5" strokeWidth="3" strokeLinecap="round" />
          <path d="M95 100 Q120 105 135 110" stroke="#d1fae5" strokeWidth="3" strokeLinecap="round" />
          <path d="M110 80 Q130 85 142 88" stroke="#d1fae5" strokeWidth="3" strokeLinecap="round" />
          <path d="M75 130 Q65 110 65 95" stroke="#d1fae5" strokeWidth="3" strokeLinecap="round" />
          {/* Sun energy sparkle */}
          <circle cx="160" cy="35" r="8" fill="#facc15" />
          <path d="M160 22 L160 26 M160 44 L160 48 M147 35 L151 35 M169 35 L173 35" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'stem':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#fef3c7" />
          {/* Soil */}
          <ellipse cx="100" cy="170" rx="75" ry="16" fill="#78350f" />
          {/* Main stem / trunk */}
          <path d="M90 170 L92 40 Q100 36 108 40 L110 170 Z" fill="#b45309" stroke="#78350f" strokeWidth="3" />
          {/* Branches */}
          <path d="M92 110 Q70 95 55 100" stroke="#b45309" strokeWidth="6" strokeLinecap="round" />
          <path d="M108 85 Q135 70 148 76" stroke="#b45309" strokeWidth="6" strokeLinecap="round" />
          {/* Branch leaves */}
          <ellipse cx="50" cy="98" rx="14" ry="8" fill="#22c55e" transform="rotate(-20 50 98)" />
          <ellipse cx="152" cy="74" rx="14" ry="8" fill="#22c55e" transform="rotate(25 152 74)" />
          {/* Water transport arrows */}
          <path d="M100 150 L100 130 M100 130 L97 135 M100 130 L103 135" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          <path d="M100 115 L100 95 M100 95 L97 100 M100 95 L103 100" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'root':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#fbf0e4" />
          {/* Surface line */}
          <path d="M25 80 L175 80" stroke="#451a03" strokeWidth="4" strokeLinecap="round" />
          <text x="35" y="72" fill="#78350f" fontSize="12" fontWeight="bold">Permukaan Tanah</text>
          {/* Stem top */}
          <rect x="94" y="30" width="12" height="50" fill="#15803d" rx="2" />
          {/* Tap root (Akar tunggang utama) */}
          <path d="M100 80 Q102 125 100 170" stroke="#92400e" strokeWidth="8" strokeLinecap="round" />
          {/* Side roots */}
          <path d="M100 100 Q75 115 55 125" stroke="#b45309" strokeWidth="4" strokeLinecap="round" />
          <path d="M100 115 Q125 130 145 138" stroke="#b45309" strokeWidth="4" strokeLinecap="round" />
          <path d="M100 135 Q70 148 60 160" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
          <path d="M100 148 Q120 160 135 168" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
          {/* Water droplets underground */}
          <circle cx="65" cy="105" r="4" fill="#38bdf8" />
          <circle cx="135" cy="120" r="4" fill="#38bdf8" />
          <circle cx="85" cy="155" r="3" fill="#38bdf8" />
        </svg>
      );

    case 'evaporation':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#eff6ff" />
          {/* Beaker / Pot */}
          <path d="M60 110 L60 160 Q60 170 70 170 L130 170 Q140 170 140 160 L140 110" stroke="#3b82f6" strokeWidth="4" fill="#dbeafe" />
          {/* Boiling water */}
          <path d="M62 135 Q80 130 100 135 T138 135 L138 165 Q138 168 130 168 L70 168 Q62 168 62 165 Z" fill="#60a5fa" />
          <circle cx="85" cy="150" r="3" fill="#ffffff" />
          <circle cx="115" cy="145" r="4" fill="#ffffff" />
          <circle cx="98" cy="140" r="2.5" fill="#ffffff" />
          {/* Steam / Uap Air */}
          <path d="M80 100 Q75 80 85 65 T80 40" stroke="#93c5fd" strokeWidth="4" strokeLinecap="round" strokeDasharray="3 3" />
          <path d="M100 95 Q105 75 95 60 T100 35" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" strokeDasharray="4 4" />
          <path d="M120 100 Q125 80 115 65 T120 40" stroke="#93c5fd" strokeWidth="4" strokeLinecap="round" strokeDasharray="3 3" />
          <text x="65" y="30" fill="#2563eb" fontSize="12" fontWeight="bold">Uap Air (Gas)</text>
        </svg>
      );

    case 'square':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#fdf2f8" />
          <rect x="50" y="50" width="100" height="100" rx="8" fill="#f43f5e" fillOpacity="0.15" stroke="#e11d48" strokeWidth="5" />
          {/* Equal side ticks */}
          <line x1="45" y1="100" x2="55" y2="100" stroke="#be123c" strokeWidth="3" />
          <line x1="145" y1="100" x2="155" y2="100" stroke="#be123c" strokeWidth="3" />
          <line x1="100" y1="45" x2="100" y2="55" stroke="#be123c" strokeWidth="3" />
          <line x1="100" y1="145" x2="100" y2="155" stroke="#be123c" strokeWidth="3" />
          {/* 90 deg corner markers */}
          <path d="M50 65 L65 65 L65 50" stroke="#be123c" strokeWidth="2" fill="none" />
          <path d="M135 50 L135 65 L150 65" stroke="#be123c" strokeWidth="2" fill="none" />
          <text x="75" y="106" fill="#be123c" fontSize="15" fontWeight="bold">4 Sisi Sama</text>
        </svg>
      );

    case 'triangle':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#f0fdf4" />
          <polygon points="100,45 45,155 155,155" fill="#16a34a" fillOpacity="0.2" stroke="#15803d" strokeWidth="5" strokeLinejoin="round" />
          <circle cx="100" cy="45" r="5" fill="#15803d" />
          <circle cx="45" cy="155" r="5" fill="#15803d" />
          <circle cx="155" cy="155" r="5" fill="#15803d" />
          <text x="65" y="125" fill="#166534" fontSize="14" fontWeight="bold">3 Sudut & Sisi</text>
        </svg>
      );

    case 'circle':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#f5f3ff" />
          <circle cx="100" cy="100" r="60" fill="#8b5cf6" fillOpacity="0.2" stroke="#7c3aed" strokeWidth="5" />
          {/* Radius line */}
          <line x1="100" y1="100" x2="160" y2="100" stroke="#6d28d9" strokeWidth="3" strokeDasharray="4 3" />
          <circle cx="100" cy="100" r="4" fill="#5b21b6" />
          <text x="110" y="93" fill="#6d28d9" fontSize="12" fontWeight="bold">Jari-jari (r)</text>
          <text x="70" y="135" fill="#5b21b6" fontSize="14" fontWeight="bold">Tanpa Sudut</text>
        </svg>
      );

    case 'pancasila_star':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shield background (black) */}
          <circle cx="100" cy="100" r="90" fill="#1e1e24" />
          {/* Golden 5-pointed star */}
          <polygon
            points="100,35 119,75 163,80 130,110 139,155 100,132 61,155 70,110 37,80 81,75"
            fill="#eab308"
            stroke="#ca8a04"
            strokeWidth="4"
          />
          {/* Glow rays */}
          <polygon
            points="100,50 114,80 148,84 123,107 130,140 100,123 70,140 77,107 52,84 86,80"
            fill="#fef08a"
            fillOpacity="0.5"
          />
          <text x="68" y="180" fill="#facc15" fontSize="13" fontWeight="bold">Sila ke-1</text>
        </svg>
      );

    case 'banyan_tree':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#ecfdf5" />
          {/* Trunk */}
          <path d="M92 165 L94 110 L106 110 L108 165 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
          {/* Tree Canopy */}
          <ellipse cx="100" cy="90" rx="60" ry="45" fill="#15803d" stroke="#166534" strokeWidth="3" />
          <ellipse cx="65" cy="85" rx="30" ry="25" fill="#16a34a" />
          <ellipse cx="135" cy="85" rx="30" ry="25" fill="#16a34a" />
          <ellipse cx="100" cy="65" rx="35" ry="25" fill="#22c55e" />
          {/* Hanging roots */}
          <line x1="75" y1="100" x2="75" y2="155" stroke="#92400e" strokeWidth="2.5" />
          <line x1="125" y1="100" x2="125" y2="155" stroke="#92400e" strokeWidth="2.5" />
          <line x1="60" y1="95" x2="60" y2="145" stroke="#92400e" strokeWidth="2" />
          <line x1="140" y1="95" x2="140" y2="145" stroke="#92400e" strokeWidth="2" />
          <text x="70" y="182" fill="#15803d" fontSize="13" fontWeight="bold">Sila ke-3</text>
        </svg>
      );

    case 'rice_cotton':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#fffbeb" />
          {/* Rice stalk (left) */}
          <path d="M90 160 Q65 110 75 45" stroke="#eab308" strokeWidth="3" fill="none" />
          <ellipse cx="73" cy="50" rx="5" ry="8" fill="#facc15" transform="rotate(-30 73 50)" />
          <ellipse cx="68" cy="70" rx="5" ry="8" fill="#facc15" transform="rotate(-20 68 70)" />
          <ellipse cx="65" cy="90" rx="5" ry="8" fill="#facc15" transform="rotate(-15 65 90)" />
          <ellipse cx="66" cy="110" rx="5" ry="8" fill="#facc15" transform="rotate(-10 66 110)" />
          <ellipse cx="70" cy="130" rx="5" ry="8" fill="#facc15" transform="rotate(-5 70 130)" />
          {/* Cotton branch (right) */}
          <path d="M110 160 Q135 110 125 45" stroke="#15803d" strokeWidth="3" fill="none" />
          <circle cx="125" cy="55" r="10" fill="#ffffff" stroke="#15803d" strokeWidth="2" />
          <circle cx="132" cy="80" r="10" fill="#ffffff" stroke="#15803d" strokeWidth="2" />
          <circle cx="134" cy="105" r="10" fill="#ffffff" stroke="#15803d" strokeWidth="2" />
          <circle cx="130" cy="130" r="10" fill="#ffffff" stroke="#15803d" strokeWidth="2" />
          <text x="70" y="182" fill="#b45309" fontSize="13" fontWeight="bold">Sila ke-5</text>
        </svg>
      );

    case 'place_value':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#f0f9ff" />
          {/* Place Value Chart */}
          <rect x="25" y="55" width="150" height="90" rx="10" fill="#ffffff" stroke="#0284c7" strokeWidth="3" />
          <line x1="75" y1="55" x2="75" y2="145" stroke="#bae6fd" strokeWidth="2" />
          <line x1="125" y1="55" x2="125" y2="145" stroke="#bae6fd" strokeWidth="2" />
          <line x1="25" y1="90" x2="175" y2="90" stroke="#0284c7" strokeWidth="2" />
          {/* Header text */}
          <text x="32" y="78" fill="#0369a1" fontSize="10" fontWeight="bold">Ratusan Ribu</text>
          <text x="82" y="78" fill="#0369a1" fontSize="10" fontWeight="bold">Puluhan Ribu</text>
          <text x="138" y="78" fill="#0369a1" fontSize="10" fontWeight="bold">Ribuan</text>
          {/* Numbers */}
          <text x="44" y="125" fill="#0c4a6e" fontSize="24" fontWeight="black">7</text>
          <text x="94" y="125" fill="#0c4a6e" fontSize="24" fontWeight="black">5</text>
          <text x="144" y="125" fill="#0c4a6e" fontSize="24" fontWeight="black">0</text>
          <text x="38" y="172" fill="#0369a1" fontSize="11" fontWeight="bold">Nilai Tempat s.d. 1.000.000</text>
        </svg>
      );

    case 'fractions':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#fff7ed" />
          {/* Fraction Circle: 3/4 colored */}
          <circle cx="100" cy="95" r="55" fill="#fed7aa" stroke="#ea580c" strokeWidth="4" />
          {/* Slices */}
          <path d="M100 95 L100 40 A55 55 0 0 1 155 95 Z" fill="#f97316" stroke="#ea580c" strokeWidth="2" />
          <path d="M100 95 L155 95 A55 55 0 0 1 100 150 Z" fill="#f97316" stroke="#ea580c" strokeWidth="2" />
          <path d="M100 95 L100 150 A55 55 0 0 1 45 95 Z" fill="#f97316" stroke="#ea580c" strokeWidth="2" />
          <path d="M100 95 L45 95 A55 55 0 0 1 100 40 Z" fill="#ffffff" stroke="#ea580c" strokeWidth="2" />
          <text x="88" y="99" fill="#9a3412" fontSize="13" fontWeight="bold">3/4</text>
          <text x="45" y="175" fill="#c2410c" fontSize="12" fontWeight="bold">3/4 = 0,75 (Pecahan & Desimal)</text>
        </svg>
      );

    case 'ratio_scale':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#f5f3ff" />
          {/* Balance Scale / Ratio diagram */}
          <rect x="40" y="60" width="45" height="45" rx="8" fill="#a855f7" stroke="#7e22ce" strokeWidth="3" />
          <text x="54" y="88" fill="#ffffff" fontSize="18" fontWeight="black">2</text>
          <text x="96" y="88" fill="#6b21a8" fontSize="22" fontWeight="black">:</text>
          <rect x="115" y="50" width="55" height="55" rx="8" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3" />
          <text x="136" y="85" fill="#ffffff" fontSize="20" fontWeight="black">3</text>
          {/* Balance bar below */}
          <line x1="30" y1="125" x2="170" y2="125" stroke="#7e22ce" strokeWidth="4" strokeLinecap="round" />
          <polygon points="100,125 90,145 110,145" fill="#581c87" />
          <text x="52" y="172" fill="#6b21a8" fontSize="12" fontWeight="bold">Konsep Rasio & Perbandingan</text>
        </svg>
      );

    case 'cube_net':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#fefce8" />
          {/* Net of a cube (Cross shape) */}
          <rect x="85" y="30" width="30" height="30" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" rx="2" />
          <rect x="55" y="60" width="30" height="30" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" rx="2" />
          <rect x="85" y="60" width="30" height="30" fill="#facc15" stroke="#ca8a04" strokeWidth="2" rx="2" />
          <rect x="115" y="60" width="30" height="30" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" rx="2" />
          <rect x="85" y="90" width="30" height="30" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" rx="2" />
          <rect x="85" y="120" width="30" height="30" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" rx="2" />
          <text x="48" y="174" fill="#854d0e" fontSize="12" fontWeight="bold">Jaring-Jaring Kubus (6 Sisi)</text>
        </svg>
      );

    case 'dice_probability':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#fdf2f8" />
          {/* Die */}
          <rect x="40" y="55" width="55" height="55" rx="10" fill="#ffffff" stroke="#db2777" strokeWidth="4" />
          <circle cx="53" cy="68" r="4" fill="#db2777" />
          <circle cx="82" cy="68" r="4" fill="#db2777" />
          <circle cx="67.5" cy="82.5" r="4" fill="#db2777" />
          <circle cx="53" cy="97" r="4" fill="#db2777" />
          <circle cx="82" cy="97" r="4" fill="#db2777" />
          {/* Coin */}
          <circle cx="135" cy="82" r="28" fill="#facc15" stroke="#eab308" strokeWidth="4" />
          <circle cx="135" cy="82" r="23" fill="#fef08a" />
          <text x="127" y="89" fill="#854d0e" fontSize="20" fontWeight="black">A</text>
          <text x="40" y="155" fill="#be185d" fontSize="12" fontWeight="bold">Peluang Muncul = n(A) / n(S)</text>
          <text x="65" y="175" fill="#9d174d" fontSize="11" fontWeight="bold">Skala: 0 s.d. 1</text>
        </svg>
      );

    case 'bull_head':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" fill="#fef2f2" />
          {/* Horns */}
          <path d="M70 85 C40 50 40 25 35 25 C45 40 60 55 75 75" fill="#1e293b" />
          <path d="M130 85 C160 50 160 25 165 25 C155 40 140 55 125 75" fill="#1e293b" />
          {/* Bull head face */}
          <path d="M68 85 L132 85 L125 140 Q100 160 75 140 Z" fill="#0f172a" />
          {/* Ears */}
          <ellipse cx="55" cy="95" rx="15" ry="7" fill="#334155" transform="rotate(-15 55 95)" />
          <ellipse cx="145" cy="95" rx="15" ry="7" fill="#334155" transform="rotate(15 145 95)" />
          {/* Snout */}
          <ellipse cx="100" cy="135" rx="20" ry="12" fill="#475569" />
          <circle cx="92" cy="135" r="3" fill="#0f172a" />
          <circle cx="108" cy="135" r="3" fill="#0f172a" />
          {/* Eyes */}
          <circle cx="85" cy="105" r="4" fill="#ffffff" />
          <circle cx="115" cy="105" r="4" fill="#ffffff" />
          <text x="70" y="180" fill="#991b1b" fontSize="13" fontWeight="bold">Sila ke-4</text>
        </svg>
      );

    default:
      return (
        <div className="w-48 h-48 rounded-2xl bg-amber-100 flex items-center justify-center text-4xl">
          🎨
        </div>
      );
  }
};

export const MascotAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg'; emotion?: 'happy' | 'thinking' | 'cheering' }> = ({
  size = 'md',
  emotion = 'happy',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }[size];

  return (
    <div className={`${sizeClasses} relative inline-block select-none animate-bounce-subtle`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Soft back shadow */}
        <ellipse cx="50" cy="90" rx="30" ry="6" fill="#000000" fillOpacity="0.1" />
        {/* Bird Body (Cyan / Sky) */}
        <ellipse cx="50" cy="52" rx="36" ry="34" fill="#38bdf8" />
        {/* Belly (Cream/White) */}
        <ellipse cx="50" cy="58" rx="24" ry="22" fill="#f0f9ff" />
        {/* Wings */}
        {emotion === 'cheering' ? (
          <>
            <path d="M16 45 Q5 25 15 20 Q24 30 20 45" fill="#0284c7" />
            <path d="M84 45 Q95 25 85 20 Q76 30 80 45" fill="#0284c7" />
          </>
        ) : (
          <>
            <ellipse cx="18" cy="55" rx="8" ry="16" fill="#0284c7" transform="rotate(15 18 55)" />
            <ellipse cx="82" cy="55" rx="8" ry="16" fill="#0284c7" transform="rotate(-15 82 55)" />
          </>
        )}
        {/* Graduation / Student Cap */}
        <polygon points="50,12 80,24 50,34 20,24" fill="#6366f1" />
        <rect x="42" y="24" width="16" height="10" fill="#4f46e5" rx="2" />
        <circle cx="50" cy="24" r="3" fill="#fbbf24" />
        <path d="M50 24 Q65 26 72 35" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
        <circle cx="72" cy="35" r="2.5" fill="#f59e0b" />
        {/* Eyes */}
        <circle cx="40" cy="46" r="6" fill="#0f172a" />
        <circle cx="42" cy="44" r="2" fill="#ffffff" />
        <circle cx="60" cy="46" r="6" fill="#0f172a" />
        <circle cx="62" cy="44" r="2" fill="#ffffff" />
        {/* Cute Cheeks */}
        <ellipse cx="32" cy="55" rx="4" ry="2.5" fill="#f43f5e" fillOpacity="0.4" />
        <ellipse cx="68" cy="55" rx="4" ry="2.5" fill="#f43f5e" fillOpacity="0.4" />
        {/* Beak */}
        <polygon points="50,50 42,56 50,62 58,56" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
        {/* Expression Detail */}
        {emotion === 'thinking' && (
          <path d="M36 38 Q42 35 46 38" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
};
