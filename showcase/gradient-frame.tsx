import type { CSSProperties, ReactNode } from "react"

import {
  gradientCss,
  gradientForeground,
} from "@/registry/admin-theme-tokens/admin-theme-css"
import type { GradientStops } from "@/registry/admin-theme-tokens/admin-theme-tokens"

interface GradientFrameProps {
  id: string
  stops: GradientStops
  className?: string
  children: ReactNode
}

export function GradientFrame({
  id,
  stops,
  className,
  children,
}: GradientFrameProps) {
  const style: CSSProperties & Record<string, string> = {
    [`--gradient-${id}`]: gradientCss(stops),
    [`--gradient-${id}-foreground`]: gradientForeground(stops),
  }

  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}
