import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type IllustrationProps = {
  className?: string
  title?: string
}

export function IllustrationFrame({
  className,
  children,
  variant = "light",
}: {
  className?: string
  children: ReactNode
  variant?: "light" | "dark" | "transparent"
}) {
  const bg =
    variant === "dark"
      ? "bg-white/10"
      : variant === "transparent"
        ? "bg-transparent"
        : "bg-gradient-to-br from-white to-nula-paper/80"

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border border-border/50 p-4 md:p-6",
        bg,
        className,
      )}
    >
      {children}
    </div>
  )
}

export type { IllustrationProps }
