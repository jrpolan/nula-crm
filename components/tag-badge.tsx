import type { CSSProperties } from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const DEFAULT_TAG_COLOR = "#4F3DF5"

/**
 * Renders a tag as a colored chip using the tag's own color (tint background +
 * border + a solid dot), so the color a user picks is actually reflected.
 * color-mix keeps it legible for any valid CSS color (hex or oklch).
 */
export function TagBadge({
  name,
  color,
  onRemove,
  removeDisabled,
  className,
}: {
  name: string
  color?: string | null
  onRemove?: () => void
  removeDisabled?: boolean
  className?: string
}) {
  const c = color?.trim() || DEFAULT_TAG_COLOR
  return (
    <span
      className={cn(
        "tag-badge inline-flex h-5 items-center gap-1 rounded-full border px-2 text-xs font-medium",
        className,
      )}
      // The tint/border/text mixes are theme-aware in globals.css `.tag-badge`
      // (mix toward ink in light mode, toward white in dark) so the chip stays
      // legible on both backgrounds for any tag color.
      style={{ "--tag-color": c } as CSSProperties}
    >
      <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: c }} />
      {name}
      {onRemove ? (
        <button
          type="button"
          className="-mr-1 rounded-sm p-0.5 hover:bg-foreground/15"
          disabled={removeDisabled}
          onClick={onRemove}
          aria-label={`Remove ${name}`}
        >
          <X className="size-3" />
        </button>
      ) : null}
    </span>
  )
}
