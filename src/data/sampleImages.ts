export interface SampleFishImage {
  id: string;
  name: string;
  expectedClass: string;
  description: string;
  dataUrl: string;
}

function createFishSvgDataUrl(type: 'healthy' | 'red_disease' | 'saprolegnia' | 'white_tail' | 'gill_disease'): string {
  let bodyColor = '#3b82f6';
  let finColor = '#60a5fa';
  let pathologyOverlay = '';

  if (type === 'healthy') {
    bodyColor = 'url(#healthyGrad)';
    finColor = '#f59e0b';
  } else if (type === 'red_disease') {
    bodyColor = 'url(#sickGrad)';
    finColor = '#ef4444';
    pathologyOverlay = `
      <!-- Hemorrhages & Ulcers on flank and fin base -->
      <circle cx="160" cy="115" r="18" fill="#dc2626" opacity="0.85" filter="url(#blur)" />
      <circle cx="160" cy="115" r="10" fill="#991b1b" />
      <circle cx="120" cy="125" r="14" fill="#ef4444" opacity="0.75" filter="url(#blur)" />
      <circle cx="195" cy="130" r="12" fill="#b91c1c" opacity="0.8" />
      <!-- Ventral petechiae -->
      <ellipse cx="140" cy="140" rx="35" ry="8" fill="#ef4444" opacity="0.6" />
      <circle cx="130" cy="142" r="4" fill="#7f1d1d" />
      <circle cx="145" cy="139" r="5" fill="#991b1b" />
      <circle cx="155" cy="143" r="3" fill="#7f1d1d" />
    `;
  } else if (type === 'saprolegnia') {
    bodyColor = 'url(#sickGrad)';
    finColor = '#94a3b8';
    pathologyOverlay = `
      <!-- Cotton wool fungal mycelia tufts -->
      <g filter="url(#cottonBlur)">
        <circle cx="140" cy="95" r="22" fill="#f8fafc" opacity="0.95" />
        <circle cx="155" cy="90" r="16" fill="#f1f5f9" opacity="0.9" />
        <circle cx="130" cy="102" r="14" fill="#e2e8f0" opacity="0.85" />
        <circle cx="170" cy="100" r="18" fill="#ffffff" opacity="0.9" />
      </g>
      <!-- Necrotic border under fungus -->
      <path d="M 120 100 Q 150 115 180 95" stroke="#78716c" stroke-width="4" fill="none" opacity="0.7" />
    `;
  } else if (type === 'white_tail') {
    bodyColor = 'url(#healthyGrad)';
    finColor = '#cbd5e1';
    pathologyOverlay = `
      <!-- Opaque white tail necrosis -->
      <g filter="url(#cottonBlur)">
        <path d="M 190 105 L 260 80 L 255 160 L 190 135 Z" fill="#ffffff" opacity="0.95" />
        <ellipse cx="205" cy="120" rx="20" ry="18" fill="#f8fafc" opacity="0.9" />
      </g>
    `;
  } else if (type === 'gill_disease') {
    bodyColor = 'url(#sickGrad)';
    finColor = '#3b82f6';
    pathologyOverlay = `
      <!-- Flared, swollen, mucus-laden gills -->
      <path d="M 95 100 C 90 115 90 135 105 140 C 112 135 110 110 95 100 Z" fill="#b91c1c" opacity="0.9" />
      <path d="M 92 108 C 88 120 88 130 100 136" stroke="#fca5a5" stroke-width="2" fill="none" />
      <ellipse cx="100" cy="122" rx="6" ry="14" fill="#fee2e2" opacity="0.6" filter="url(#blur)" />
    `;
  }

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240" width="300" height="240">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>
      <linearGradient id="healthyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="50%" stop-color="#0284c7" />
        <stop offset="100%" stop-color="#0369a1" />
      </linearGradient>
      <linearGradient id="sickGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#94a3b8" />
        <stop offset="50%" stop-color="#64748b" />
        <stop offset="100%" stop-color="#475569" />
      </linearGradient>
      <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <filter id="cottonBlur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="5" />
      </filter>
    </defs>

    <!-- Aquarium background with water ripples -->
    <rect width="300" height="240" fill="url(#bgGrad)" />
    <circle cx="50" cy="50" r="140" fill="#0369a1" opacity="0.08" />
    <circle cx="250" cy="190" r="100" fill="#0284c7" opacity="0.05" />

    <!-- Bubbles -->
    <circle cx="45" cy="180" r="4" fill="#38bdf8" opacity="0.3" />
    <circle cx="52" cy="150" r="6" fill="#38bdf8" opacity="0.4" />
    <circle cx="48" cy="110" r="3" fill="#38bdf8" opacity="0.2" />

    <!-- Caudal Fin (Tail) -->
    <path d="M 215 120 L 275 70 C 265 105 265 135 275 170 Z" fill="${finColor}" opacity="0.85" />

    <!-- Dorsal Fin -->
    <path d="M 120 95 C 135 60 175 65 190 102 Z" fill="${finColor}" opacity="0.8" />

    <!-- Anal & Pelvic Fins -->
    <path d="M 160 142 L 180 175 L 195 136 Z" fill="${finColor}" opacity="0.8" />
    <path d="M 115 142 L 125 168 L 135 142 Z" fill="${finColor}" opacity="0.75" />

    <!-- Fish Body (Torpedo/Fusiform Teleost shape) -->
    <path d="M 55 120 C 70 85 150 85 220 120 C 150 155 70 155 55 120 Z" fill="${bodyColor}" stroke="#1e293b" stroke-width="1.5" />

    <!-- Scale texture lines -->
    <path d="M 110 102 Q 120 120 110 138" stroke="#ffffff" stroke-width="1" fill="none" opacity="0.25" />
    <path d="M 130 98 Q 140 120 130 142" stroke="#ffffff" stroke-width="1" fill="none" opacity="0.25" />
    <path d="M 150 98 Q 160 120 150 142" stroke="#ffffff" stroke-width="1" fill="none" opacity="0.25" />
    <path d="M 170 102 Q 180 120 170 138" stroke="#ffffff" stroke-width="1" fill="none" opacity="0.25" />
    <path d="M 190 108 Q 198 120 190 132" stroke="#ffffff" stroke-width="1" fill="none" opacity="0.25" />

    <!-- Operculum / Gill cover -->
    <path d="M 95 100 C 105 115 105 128 95 140" stroke="#0f172a" stroke-width="2" fill="none" opacity="0.6" />

    <!-- Pectoral Fin -->
    <ellipse cx="112" cy="126" rx="16" ry="7" transform="rotate(25 112 126)" fill="${finColor}" opacity="0.9" stroke="#ffffff" stroke-width="0.5" />

    <!-- Eye -->
    <circle cx="75" cy="112" r="7" fill="#ffffff" stroke="#334155" stroke-width="1" />
    <circle cx="74" cy="112" r="4.5" fill="#0f172a" />
    <circle cx="72" cy="110" r="1.5" fill="#ffffff" />

    <!-- Mouth -->
    <path d="M 55 120 Q 60 122 65 120" stroke="#0f172a" stroke-width="1.5" fill="none" />

    <!-- Pathological Features Overlay -->
    ${pathologyOverlay}
  </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_FISH_IMAGES: SampleFishImage[] = [
  {
    id: 'sample-healthy',
    name: 'Specimen A: Healthy Carp',
    expectedClass: 'Healthy Fish',
    description: 'Physiologically intact scales, clear cornea, clean fins, no dermal lesions.',
    dataUrl: createFishSvgDataUrl('healthy')
  },
  {
    id: 'sample-red-disease',
    name: 'Specimen B: Hemorrhagic Flank',
    expectedClass: 'Bacterial Red disease',
    description: 'Bright red petechial hemorrhages and cutaneous ulcerations on ventrum.',
    dataUrl: createFishSvgDataUrl('red_disease')
  },
  {
    id: 'sample-saprolegnia',
    name: 'Specimen C: Cotton-Wool Fungus',
    expectedClass: 'Fungal diseases Saprolegniasis',
    description: 'White cotton-like fluffy mycelia growth over dorsal integument.',
    dataUrl: createFishSvgDataUrl('saprolegnia')
  },
  {
    id: 'sample-white-tail',
    name: 'Specimen D: White Tail Necrosis',
    expectedClass: 'Viral diseases White tail disease',
    description: 'Opaque milky muscular necrosis focused at caudal peduncle and tail.',
    dataUrl: createFishSvgDataUrl('white_tail')
  }
];
