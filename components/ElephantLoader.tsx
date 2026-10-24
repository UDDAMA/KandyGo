// components/ElephantLoader.tsx
// Cultural Kandy-inspired walking elephant loading indicator

import React from 'react';

interface ElephantLoaderProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ElephantLoader({
  label = 'Exploring Kandy…',
  size = 'md',
  className = '',
}: ElephantLoaderProps) {
  const sizeMap = {
    sm: { width: 44, height: 32, fontSize: '0.8rem' },
    md: { width: 64, height: 46, fontSize: '0.9rem' },
    lg: { width: 92, height: 66, fontSize: '1.05rem' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`elephant-loader-container elephant-loader-${size} ${className}`}
    >
      <svg
        className="elephant-svg"
        width={currentSize.width}
        height={currentSize.height}
        viewBox="0 0 100 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Shadow */}
        <ellipse
          cx="50"
          cy="68"
          rx="32"
          ry="3.5"
          fill="rgba(0,0,0,0.18)"
          className="elephant-shadow"
        />

        {/* Back Legs (Drawn behind body) */}
        <g className="elephant-leg-back-left">
          <rect x="30" y="42" width="9" height="24" rx="4.5" fill="#163c2c" />
          <ellipse cx="34.5" cy="65" rx="4" ry="1.8" fill="#122f23" />
        </g>
        <g className="elephant-leg-back-right">
          <rect x="60" y="42" width="9" height="24" rx="4.5" fill="#163c2c" />
          <ellipse cx="64.5" cy="65" rx="4" ry="1.8" fill="#122f23" />
        </g>

        {/* Elephant Body & Head Group */}
        <g className="elephant-body-group">
          {/* Tail */}
          <path
            d="M22 36C19 39 18 45 19 50"
            stroke="#1b4332"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="19.5" cy="50.5" r="2" fill="#b45309" />

          {/* Main Body */}
          <path
            d="M24 38C24 26 34 18 50 18C64 18 72 25 75 34C75 42 74 48 68 50C62 52 28 52 24 38Z"
            fill="#1b4332"
          />

          {/* Cultural Perahera Caparison / Ceremonial Blanket */}
          <path
            d="M36 21C42 19 55 19 61 21C64 26 65 37 63 42C58 45 39 45 34 42C33 36 34 26 36 21Z"
            fill="#b45309"
          />
          {/* Golden Embroidery Trim */}
          <path
            d="M35 40C44 43 53 43 62 40"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Decorative Gold Crest */}
          <circle cx="48.5" cy="31" r="3.5" fill="#fbbf24" />
          <circle cx="48.5" cy="31" r="1.8" fill="#b45309" />

          {/* Head */}
          <circle cx="75" cy="28" r="13" fill="#1b4332" />

          {/* Royal Headpiece (Nettipattama) */}
          <path
            d="M71 18C75 16 79 17 83 20C82 24 78 25 73 24Z"
            fill="#fbbf24"
          />
          <circle cx="77" cy="20" r="1.2" fill="#b45309" />

          {/* Ear */}
          <ellipse cx="68" cy="28" rx="6" ry="8" fill="#245540" />

          {/* Eye */}
          <circle cx="79" cy="25" r="1.6" fill="#ffffff" />
          <circle cx="79.5" cy="25" r="0.9" fill="#081c15" />

          {/* Tusk */}
          <path
            d="M81 33C84 35 88 34 89 31C87 31 84 31 82 31.5"
            fill="#ffffff"
          />

          {/* Raised Trunk (Sign of welcoming & good fortune) */}
          <path
            d="M84 30C87 34 90 35 91 32C92 28 88 23 85 24C83 24.5 83 26 84 27"
            fill="none"
            stroke="#1b4332"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </g>

        {/* Front Legs (Drawn in front of body) */}
        <g className="elephant-leg-front-left">
          <rect x="37" y="43" width="9.5" height="24" rx="4.5" fill="#245540" />
          <ellipse cx="41.75" cy="66" rx="4.2" ry="1.8" fill="#1b4332" />
        </g>
        <g className="elephant-leg-front-right">
          <rect x="53" y="43" width="9.5" height="24" rx="4.5" fill="#245540" />
          <ellipse cx="57.75" cy="66" rx="4.2" ry="1.8" fill="#1b4332" />
        </g>
      </svg>

      {label && <span className="elephant-loader-label">{label}</span>}
    </div>
  );
}
