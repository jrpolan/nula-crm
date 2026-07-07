import { cn } from "@/lib/utils"

import type { IllustrationProps } from "./shared"

/** Owner at ease while Nula organizes customers in the background */
export function HeroIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 420 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-auto w-full max-w-md", className)}
      aria-hidden
    >
      <circle cx="210" cy="170" r="130" fill="#EEECFE" opacity="0.7" />
      <circle cx="320" cy="80" r="48" fill="#D8FAF4" opacity="0.8" />
      <circle cx="90" cy="240" r="36" fill="#4F3DF5" opacity="0.08" />

      {/* Floating contact cards */}
      <g transform="translate(48 52)">
        <rect width="88" height="56" rx="14" fill="white" stroke="#E3E1EB" strokeWidth="1.5" />
        <circle cx="22" cy="28" r="12" fill="#EEECFE" />
        <circle cx="22" cy="25" r="5" fill="#4F3DF5" opacity="0.35" />
        <rect x="40" y="18" width="36" height="6" rx="3" fill="#E3E1EB" />
        <rect x="40" y="30" width="28" height="5" rx="2.5" fill="#D8FAF4" />
      </g>
      <g transform="translate(290 44)">
        <rect width="88" height="56" rx="14" fill="white" stroke="#E3E1EB" strokeWidth="1.5" />
        <circle cx="22" cy="28" r="12" fill="#D8FAF4" />
        <circle cx="22" cy="25" r="5" fill="#33E5C4" opacity="0.6" />
        <rect x="40" y="18" width="36" height="6" rx="3" fill="#E3E1EB" />
        <rect x="40" y="30" width="32" height="5" rx="2.5" fill="#EEECFE" />
      </g>
      <g transform="translate(300 220)">
        <rect width="96" height="60" rx="14" fill="white" stroke="#4F3DF5" strokeWidth="1.5" opacity="0.9" />
        <circle cx="24" cy="30" r="13" fill="#EEECFE" />
        <circle cx="24" cy="27" r="5" fill="#4F3DF5" opacity="0.4" />
        <rect x="44" y="20" width="40" height="6" rx="3" fill="#E3E1EB" />
        <rect x="44" y="32" width="30" height="5" rx="2.5" fill="#33E5C4" opacity="0.35" />
        <circle cx="78" cy="14" r="8" fill="#33E5C4" />
        <path d="M75 14l2 2 4-4" stroke="#1B1533" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Chat bubble */}
      <g transform="translate(56 200)">
        <rect width="120" height="72" rx="18" fill="#4F3DF5" />
        <rect x="14" y="16" width="72" height="6" rx="3" fill="white" opacity="0.85" />
        <rect x="14" y="30" width="92" height="6" rx="3" fill="white" opacity="0.55" />
        <rect x="14" y="44" width="56" height="6" rx="3" fill="white" opacity="0.55" />
        <circle cx="98" cy="58" r="10" fill="#33E5C4" />
        <path
          d="M95 58l2 2 4-4"
          stroke="#1B1533"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Friendly owner */}
      <g transform="translate(148 108)">
        <ellipse cx="62" cy="168" rx="70" ry="14" fill="#1B1533" opacity="0.06" />
        <path d="M32 168c0-44 26-72 62-72s62 28 62 72" fill="#EEECFE" />
        <circle cx="62" cy="52" r="34" fill="#F5D0B5" />
        <path
          d="M28 52c0-18 15-32 34-32s34 14 34 32"
          fill="#4F3DF5"
          opacity="0.85"
        />
        <circle cx="50" cy="54" r="4" fill="#1B1533" />
        <circle cx="74" cy="54" r="4" fill="#1B1533" />
        <path
          d="M54 66c6 6 10 6 16 0"
          stroke="#1B1533"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M38 96h48v72H38z" fill="#4F3DF5" />
        <path d="M20 120h24l-8 48H20z" fill="#4F3DF5" opacity="0.85" />
        <path d="M80 120h24l8 48H80z" fill="#4F3DF5" opacity="0.85" />
        {/* Tablet */}
        <rect x="44" y="108" width="36" height="48" rx="6" fill="white" stroke="#E3E1EB" strokeWidth="1.5" />
        <rect x="50" y="118" width="24" height="4" rx="2" fill="#33E5C4" opacity="0.6" />
        <rect x="50" y="128" width="20" height="3" rx="1.5" fill="#E3E1EB" />
        <rect x="50" y="136" width="16" height="3" rx="1.5" fill="#E3E1EB" />
      </g>

      {/* Sparkle accents */}
      <path
        d="M248 118l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"
        fill="#33E5C4"
      />
      <path
        d="M168 88l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z"
        fill="#4F3DF5"
        opacity="0.5"
      />
    </svg>
  )
}
