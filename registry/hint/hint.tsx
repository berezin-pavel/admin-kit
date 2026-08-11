"use client"

import * as React from "react"
import { CircleQuestionMark } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface HintProps {
  text: string
  children?: React.ReactNode
  render?: React.ReactElement
  side?: "top" | "right" | "bottom" | "left"
  className?: string
}

export function Hint({
  text,
  children,
  render,
  side,
  className,
}: HintProps): React.ReactElement {
  return (
    <Tooltip>
      {render ? (
        <TooltipTrigger render={render} />
      ) : (
        <TooltipTrigger
          aria-label={children ? undefined : text}
          className={cn(
            !children &&
              "inline-flex size-3.5 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
            className
          )}
        >
          {children ?? <CircleQuestionMark className="size-3.5" />}
        </TooltipTrigger>
      )}
      <TooltipContent side={side}>{text}</TooltipContent>
    </Tooltip>
  )
}
