import { cn } from "@/lib/utils"

import type { IllustrationProps } from "./shared"

/** Owner connecting with happy customers while Nula handles the rest */
export function HowWeHelpIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 380 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-auto w-full", className)}
      aria-hidden
    >
      <circle cx="190" cy="150" r="120" fill="#EEECFE" opacity="0.5" />
      <circle cx="300" cy="80" r="40" fill="#D8FAF4" opacity="0.6" />

      {/* Central owner */}
      <g transform="translate(142 72)">
        <ellipse cx="48" cy="168" rx="40" ry="10" fill="#1B1533" opacity="0.06" />
        <circle cx="48" cy="40" r="30" fill="#F5D0B5" />
        <path d="M18 40c0-16 13-26 30-26s30 10 30 26" fill="#4F3DF5" opacity="0.8" />
        <circle cx="38" cy="42" r="3.5" fill="#1B1533" />
        <circle cx="58" cy="42" r="3.5" fill="#1B1533" />
        <path d="M42 52c4 4 8 4 12 0" stroke="#1B1533" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M28 72h40v88H28z" fill="#4F3DF5" />
        <path d="M14 92h18l-6 44H14z" fill="#4F3DF5" opacity="0.85" />
        <path d="M64 92h18l6 44H64z" fill="#4F3DF5" opacity="0.85" />
      </g>

      {/* Customer left */}
      <g transform="translate(32 120)">
        <circle cx="32" cy="28" r="22" fill="#F5D0B5" />
        <path d="M10 28c0-10 10-18 22-18s22 8 22 18" fill="#33E5C4" opacity="0.7" />
        <circle cx="26" cy="30" r="2.5" fill="#1B1533" />
        <circle cx="38" cy="30" r="2.5" fill="#1B1533" />
        <path d="M28 38c3 3 6 3 8 0" stroke="#1B1533" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 52h24v40H20z" fill="#33E5C4" opacity="0.75" />
        <rect x="8" y="100" width="48" height="36" rx="10" fill="white" stroke="#33E5C4" strokeWidth="1.5" />
        <path d="M20 116h24M20 126h16" stroke="#E3E1EB" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Customer right */}
      <g transform="translate(280 108)">
        <circle cx="36" cy="28" r="22" fill="#F5D0B5" />
        <path d="M14 28c0-10 10-18 22-18s22 8 22 18" fill="#EEECFE" />
        <circle cx="30" cy="30" r="2.5" fill="#1B1533" />
        <circle cx="42" cy="30" r="2.5" fill="#1B1533" />
        <path d="M32 38c3 3 6 3 8 0" stroke="#1B1533" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M24 52h24v40H24z" fill="#EEECFE" />
        <rect x="12" y="100" width="48" height="36" rx="10" fill="white" stroke="#4F3DF5" strokeWidth="1.5" />
        <circle cx="36" cy="118" r="8" fill="#33E5C4" />
        <path d="M33 118l2 2 4-4" stroke="#1B1533" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Connection lines */}
      <path
        d="M108 148c24-8 40-8 64 0"
        stroke="#4F3DF5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="5 5"
        opacity="0.35"
      />
      <path
        d="M232 148c24-8 40-8 64 0"
        stroke="#4F3DF5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="5 5"
        opacity="0.35"
      />

      {/* Floating help badges */}
      <g transform="translate(48 48)">
        <rect width="72" height="28" rx="14" fill="white" stroke="#E3E1EB" strokeWidth="1.5" />
        <circle cx="18" cy="14" r="8" fill="#D8FAF4" />
        <path d="M15 14l2 2 4-4" stroke="#0d8a75" strokeWidth="1.2" strokeLinecap="round" />
        <rect x="30" y="10" width="32" height="4" rx="2" fill="#E3E1EB" />
        <rect x="30" y="18" width="24" height="3" rx="1.5" fill="#D8FAF4" />
      </g>
      <g transform="translate(260 220)">
        <rect width="88" height="32" rx="16" fill="#4F3DF5" />
        <rect x="14" y="12" width="48" height="4" rx="2" fill="white" opacity="0.85" />
        <rect x="14" y="20" width="36" height="3" rx="1.5" fill="white" opacity="0.5" />
        <circle cx="70" cy="16" r="8" fill="#33E5C4" />
      </g>

      {/* Growth arrow */}
      <g transform="translate(168 228)">
        <path
          d="M0 24 L40 0 L40 16 L80 16 L80 32 L40 32 L40 48 Z"
          fill="#33E5C4"
          opacity="0.7"
        />
      </g>

      <path d="M200 56l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#4F3DF5" opacity="0.45" />
    </svg>
  )
}
