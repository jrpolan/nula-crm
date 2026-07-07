import { cn } from "@/lib/utils"

import type { IllustrationProps } from "./shared"

/** Conversation-first CRM — plain language in, organized contacts out */
export function WhatIsNulaIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-auto w-full", className)}
      aria-hidden
    >
      <rect x="20" y="20" width="360" height="280" rx="24" fill="#F7F6FB" />
      <circle cx="340" cy="60" r="40" fill="#D8FAF4" opacity="0.7" />
      <circle cx="60" cy="260" r="32" fill="#EEECFE" />

      {/* Main app window */}
      <rect x="48" y="48" width="220" height="200" rx="18" fill="white" stroke="#E3E1EB" strokeWidth="1.5" />
      <rect x="48" y="48" width="220" height="36" rx="18" fill="#EEECFE" />
      <rect x="48" y="66" width="220" height="18" fill="#EEECFE" />
      <circle cx="68" cy="66" r="5" fill="#E5484D" opacity="0.5" />
      <circle cx="84" cy="66" r="5" fill="#F5A524" opacity="0.5" />
      <circle cx="100" cy="66" r="5" fill="#33E5C4" opacity="0.7" />

      {/* User message */}
      <rect x="64" y="96" width="140" height="40" rx="14" fill="#4F3DF5" />
      <rect x="76" y="108" width="88" height="5" rx="2.5" fill="white" opacity="0.9" />
      <rect x="76" y="118" width="108" height="5" rx="2.5" fill="white" opacity="0.55" />

      {/* AI response */}
      <rect x="64" y="148" width="168" height="52" rx="14" fill="#D8FAF4" />
      <rect x="76" y="160" width="120" height="5" rx="2.5" fill="#1B1533" opacity="0.2" />
      <rect x="76" y="172" width="100" height="5" rx="2.5" fill="#1B1533" opacity="0.15" />
      <rect x="76" y="184" width="72" height="5" rx="2.5" fill="#33E5C4" opacity="0.5" />

      {/* Contact list preview */}
      <rect x="64" y="212" width="188" height="24" rx="8" fill="#F7F6FB" stroke="#E3E1EB" strokeWidth="1" />
      <circle cx="78" cy="224" r="7" fill="#EEECFE" />
      <rect x="92" y="220" width="48" height="4" rx="2" fill="#E3E1EB" />
      <rect x="92" y="228" width="32" height="3" rx="1.5" fill="#D8FAF4" />
      <circle cx="232" cy="224" r="8" fill="#33E5C4" />
      <path d="M229 224l2 2 4-4" stroke="#1B1533" strokeWidth="1.2" strokeLinecap="round" />

      {/* Person typing */}
      <g transform="translate(268 140)">
        <circle cx="48" cy="36" r="28" fill="#F5D0B5" />
        <path d="M20 36c0-14 12-24 28-24s28 10 28 24" fill="#1B1533" opacity="0.75" />
        <circle cx="38" cy="38" r="3.5" fill="#1B1533" />
        <circle cx="58" cy="38" r="3.5" fill="#1B1533" />
        <path d="M42 48c4 4 8 4 12 0" stroke="#1B1533" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M28 72h40v52H28z" fill="#33E5C4" opacity="0.85" />
        <path d="M16 88h16l-6 36H16z" fill="#33E5C4" />
        <path d="M64 88h16l6 36H64z" fill="#33E5C4" />
        {/* Speech hint */}
        <path
          d="M8 20c0-8 16-14 32-14"
          stroke="#4F3DF5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 4"
          opacity="0.4"
        />
      </g>

      <path d="M300 100l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#4F3DF5" opacity="0.6" />
    </svg>
  )
}
