import { cn } from "@/lib/utils"

import type { IllustrationProps } from "./shared"

/** Messy old CRM vs calm, organized Nula */
export function WhyNulaIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 480 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-auto w-full max-w-xl mx-auto", className)}
      aria-hidden
    >
      {/* Old way — tangled */}
      <g transform="translate(0 20)">
        <rect width="200" height="160" rx="20" fill="#F7F6FB" stroke="#E3E1EB" strokeWidth="1.5" />
        <text x="100" y="28" textAnchor="middle" fill="#8B87A3" fontSize="11" fontWeight="600">
          Before
        </text>
        <path
          d="M40 60c30 20 50-10 80 10s50 30 80 0"
          stroke="#8B87A3"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          d="M50 90c20 30 60-20 90 10s40 20 60-10"
          stroke="#E5484D"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M60 120c40-20 50 30 80 10s30-40 50-10"
          stroke="#8B87A3"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.35"
        />
        <rect x="36" y="48" width="48" height="32" rx="8" fill="white" stroke="#E3E1EB" transform="rotate(-8 60 64)" />
        <rect x="100" y="72" width="48" height="32" rx="8" fill="white" stroke="#E3E1EB" transform="rotate(12 124 88)" />
        <rect x="60" y="108" width="48" height="32" rx="8" fill="white" stroke="#E3E1EB" transform="rotate(-6 84 124)" />
        <text x="100" y="152" textAnchor="middle" fill="#8B87A3" fontSize="10">
          Overwhelming
        </text>
      </g>

      {/* Arrow */}
      <g transform="translate(220 88)">
        <circle cx="20" cy="12" r="20" fill="#EEECFE" />
        <path
          d="M12 12h16M20 6l8 6-8 6"
          stroke="#4F3DF5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Nula way — clean */}
      <g transform="translate(280 20)">
        <rect width="200" height="160" rx="20" fill="white" stroke="#4F3DF5" strokeWidth="1.5" opacity="0.9" />
        <text x="100" y="28" textAnchor="middle" fill="#4F3DF5" fontSize="11" fontWeight="600">
          With Nula
        </text>
        <rect x="28" y="48" width="144" height="28" rx="10" fill="#EEECFE" />
        <circle cx="44" cy="62" r="8" fill="#33E5C4" />
        <rect x="58" y="56" width="80" height="5" rx="2.5" fill="#4F3DF5" opacity="0.25" />
        <rect x="58" y="66" width="56" height="4" rx="2" fill="#E3E1EB" />

        <rect x="28" y="84" width="144" height="28" rx="10" fill="#D8FAF4" />
        <circle cx="44" cy="98" r="8" fill="#4F3DF5" opacity="0.3" />
        <rect x="58" y="92" width="72" height="5" rx="2.5" fill="#1B1533" opacity="0.15" />
        <rect x="58" y="102" width="48" height="4" rx="2" fill="#33E5C4" opacity="0.5" />

        <rect x="28" y="120" width="144" height="28" rx="10" fill="#F7F6FB" stroke="#E3E1EB" strokeWidth="1" />
        <circle cx="44" cy="134" r="8" fill="#EEECFE" />
        <rect x="58" y="128" width="64" height="5" rx="2.5" fill="#E3E1EB" />
        <rect x="58" y="138" width="40" height="4" rx="2" fill="#EEECFE" />
        <circle cx="152" cy="134" r="8" fill="#33E5C4" />
        <path d="M149 134l2 2 4-4" stroke="#1B1533" strokeWidth="1.2" strokeLinecap="round" />

        <text x="100" y="168" textAnchor="middle" fill="#4F3DF5" fontSize="10" fontWeight="500">
          Calm & clear
        </text>
      </g>
    </svg>
  )
}
