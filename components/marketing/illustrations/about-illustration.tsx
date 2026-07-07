import { cn } from "@/lib/utils"

import type { IllustrationProps } from "./shared"

/** Small team building something helpful together */
export function AboutIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 360 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-auto w-full max-w-sm mx-auto", className)}
      aria-hidden
    >
      <ellipse cx="180" cy="210" rx="120" ry="16" fill="#1B1533" opacity="0.05" />
      <circle cx="180" cy="100" r="80" fill="#EEECFE" opacity="0.6" />

      {/* Shared product / heart */}
      <g transform="translate(148 52)">
        <rect x="0" y="24" width="64" height="48" rx="14" fill="white" stroke="#4F3DF5" strokeWidth="1.5" />
        <circle cx="32" cy="44" r="14" fill="#D8FAF4" />
        <path
          d="M32 40c-4-6-12-2-12 4 0 8 12 14 12 14s12-6 12-14c0-6-8-10-12-4z"
          fill="#33E5C4"
          opacity="0.85"
        />
      </g>

      {/* Team member left */}
      <g transform="translate(56 100)">
        <circle cx="28" cy="24" r="22" fill="#F5D0B5" />
        <path d="M6 24c0-10 10-18 22-18s22 8 22 18" fill="#4F3DF5" opacity="0.75" />
        <circle cx="22" cy="26" r="2.5" fill="#1B1533" />
        <circle cx="34" cy="26" r="2.5" fill="#1B1533" />
        <path d="M24 34c3 3 6 3 8 0" stroke="#1B1533" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 48h24v52H16z" fill="#4F3DF5" opacity="0.85" />
        <path d="M4 64h14l-5 36H4z" fill="#4F3DF5" opacity="0.7" />
        <path d="M38 64h14l5 36H38z" fill="#4F3DF5" opacity="0.7" />
        <path d="M52 36 L148 72" stroke="#4F3DF5" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
      </g>

      {/* Team member center */}
      <g transform="translate(152 128)">
        <circle cx="28" cy="24" r="22" fill="#F5D0B5" />
        <path d="M6 24c0-10 10-18 22-18s22 8 22 18" fill="#33E5C4" opacity="0.65" />
        <circle cx="22" cy="26" r="2.5" fill="#1B1533" />
        <circle cx="34" cy="26" r="2.5" fill="#1B1533" />
        <path d="M24 34c3 3 6 3 8 0" stroke="#1B1533" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 48h24v44H16z" fill="#33E5C4" opacity="0.8" />
      </g>

      {/* Team member right */}
      <g transform="translate(248 100)">
        <circle cx="28" cy="24" r="22" fill="#F5D0B5" />
        <path d="M6 24c0-10 10-18 22-18s22 8 22 18" fill="#EEECFE" />
        <circle cx="22" cy="26" r="2.5" fill="#1B1533" />
        <circle cx="34" cy="26" r="2.5" fill="#1B1533" />
        <path d="M24 34c3 3 6 3 8 0" stroke="#1B1533" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 48h24v52H16z" fill="#EEECFE" />
        <path d="M4 64h14l-5 36H4z" fill="#D8FAF4" />
        <path d="M38 64h14l5 36H38z" fill="#D8FAF4" />
        <path d="M4 36 L108 72" stroke="#4F3DF5" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
      </g>

      <path d="M72 48l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" fill="#33E5C4" opacity="0.7" />
      <path d="M288 56l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#4F3DF5" opacity="0.4" />
    </svg>
  )
}
