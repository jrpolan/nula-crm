import { cn } from "@/lib/utils"

import type { IllustrationProps } from "./shared"

/** Small business storefronts — med spa, wellness, local shop */
export function WhoItsForIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 360 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-auto w-full", className)}
      aria-hidden
    >
      <circle cx="180" cy="140" r="110" fill="white" opacity="0.12" />

      {/* Storefront */}
      <g transform="translate(24 80)">
        <rect x="0" y="48" width="100" height="88" rx="8" fill="white" opacity="0.95" />
        <path d="M0 56 L50 24 L100 56" fill="#33E5C4" opacity="0.9" />
        <rect x="16" y="72" width="32" height="48" rx="4" fill="#EEECFE" />
        <rect x="56" y="72" width="28" height="20" rx="4" fill="#D8FAF4" />
        <rect x="56" y="100" width="28" height="20" rx="4" fill="#EEECFE" />
        <circle cx="50" cy="44" r="6" fill="#33E5C4" />
      </g>

      {/* Wellness / spa */}
      <g transform="translate(130 60)">
        <rect x="0" y="56" width="100" height="96" rx="12" fill="white" opacity="0.95" />
        <rect x="0" y="56" width="100" height="28" rx="12" fill="#EEECFE" />
        <rect x="0" y="72" width="100" height="12" fill="#EEECFE" />
        <circle cx="50" cy="108" r="22" fill="#D8FAF4" />
        <path
          d="M50 96v24M38 108h24"
          stroke="#33E5C4"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect x="20" y="140" width="60" height="6" rx="3" fill="#E3E1EB" />
      </g>

      {/* Home services */}
      <g transform="translate(236 88)">
        <rect x="0" y="40" width="100" height="88" rx="8" fill="white" opacity="0.95" />
        <rect x="12" y="52" width="76" height="56" rx="6" fill="#EEECFE" />
        <rect x="36" y="68" width="28" height="24" rx="4" fill="#4F3DF5" opacity="0.25" />
        <path
          d="M28 108h44"
          stroke="#33E5C4"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="78" cy="32" r="14" fill="#F5D0B5" />
        <rect x="70" y="44" width="16" height="20" rx="4" fill="#33E5C4" opacity="0.8" />
      </g>

      {/* Friendly owner waving */}
      <g transform="translate(128 168)">
        <ellipse cx="52" cy="88" rx="44" ry="10" fill="#1B1533" opacity="0.15" />
        <circle cx="52" cy="32" r="26" fill="#F5D0B5" />
        <path d="M26 32c0-14 11-24 26-24s26 10 26 24" fill="#4F3DF5" opacity="0.7" />
        <circle cx="42" cy="34" r="3" fill="#1B1533" />
        <circle cx="62" cy="34" r="3" fill="#1B1533" />
        <path d="M46 44c4 3 8 3 12 0" stroke="#1B1533" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M32 60h40v48H32z" fill="white" opacity="0.95" />
        {/* Waving arm */}
        <path d="M72 68c16-12 28-8 32 4" stroke="#F5D0B5" strokeWidth="10" strokeLinecap="round" />
        <path d="M16 72h20l-6 36H16z" fill="white" opacity="0.9" />
        <path d="M68 72h20l6 36H68z" fill="white" opacity="0.9" />
      </g>

      {/* Hearts / connection dots */}
      <circle cx="48" cy="48" r="6" fill="#33E5C4" opacity="0.6" />
      <circle cx="312" cy="56" r="5" fill="white" opacity="0.5" />
      <circle cx="320" cy="200" r="8" fill="#33E5C4" opacity="0.4" />
      <path
        d="M100 200c20-16 40-16 60 0s40 16 60 0"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.25"
        strokeDasharray="6 6"
      />
    </svg>
  )
}
