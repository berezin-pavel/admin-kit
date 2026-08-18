"use client"

import type { ComponentProps, ReactElement } from "react"
import { Ban, Brush, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import {
  setBlockAppearance,
  useAppearance,
  useBlockAppearance,
  type AppearanceContextValue,
} from "./appearance-provider"
import { gradientPalette, type BlockHeading, type GradientId } from "./appearance-palette"

export interface BlockProps extends ComponentProps<typeof Card> {
  id?: string
  gradient?: GradientId
  headings?: boolean
}

const headingChoices: readonly {
  value: BlockHeading
  labelKey: "headingMuted" | "headingProminent" | "headingNone"
}[] = [
  { value: "muted", labelKey: "headingMuted" },
  { value: "prominent", labelKey: "headingProminent" },
  { value: "none", labelKey: "headingNone" },
]

export function Block({
  id,
  gradient,
  headings = false,
  className,
  children,
  ...rest
}: BlockProps): ReactElement {
  const appearance = useAppearance()
  const stored = useBlockAppearance(id)

  const resolvedGradient =
    stored.gradient === null ? undefined : (stored.gradient ?? gradient)

  const showMenu = Boolean(appearance?.editable) && id !== undefined

  return (
    <Card
      data-block=""
      data-block-id={id}
      data-gradient={resolvedGradient}
      className={cn("group/block relative", className)}
      {...rest}
    >
      {children}
      {showMenu && appearance && id !== undefined ? (
        <BlockMenu
          id={id}
          gradient={stored.gradient}
          heading={stored.heading}
          headings={headings}
          value={appearance.value}
          onChange={appearance.onChange}
          labels={appearance.labels}
        />
      ) : null}
    </Card>
  )
}

interface BlockMenuProps {
  id: string
  gradient: GradientId | null | undefined
  heading: BlockHeading | undefined
  headings: boolean
  value: AppearanceContextValue["value"]
  onChange: AppearanceContextValue["onChange"]
  labels: AppearanceContextValue["labels"]
}

function BlockMenu({
  id,
  gradient,
  heading,
  headings,
  value,
  onChange,
  labels,
}: BlockMenuProps) {
  const selectGradient = (next: GradientId | null) => {
    onChange(setBlockAppearance(value, id, { gradient: next }))
  }

  const selectHeading = (next: BlockHeading) => {
    onChange(setBlockAppearance(value, id, { heading: next }))
  }

  return (
    <Popover>
      <PopoverTrigger
        aria-label={labels.blockMenu}
        render={
          <Button
            variant="outline"
            size="icon"
            className="absolute -top-2.5 -right-2.5 z-10 size-7 rounded-full opacity-0 shadow-sm transition-opacity group-hover/block:opacity-100 focus-visible:opacity-100 data-popup-open:opacity-100"
          />
        }
      >
        <Brush className="size-3.5" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent aria-label={labels.blockMenu} className="w-auto">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            {labels.gradient}
          </span>
          <div role="radiogroup" aria-label={labels.gradient} className="grid grid-cols-5 gap-1.5">
            <button
              type="button"
              role="radio"
              aria-checked={gradient === null}
              aria-label={labels.none}
              onClick={() => selectGradient(null)}
              className="flex size-8 items-center justify-center rounded-md bg-muted ring-1 ring-foreground/10"
            >
              <Ban className="size-3.5 text-muted-foreground" aria-hidden="true" />
            </button>
            {gradientPalette.map((entry) => {
              const selected = gradient === entry.id
              const name = labels.gradients[entry.id] ?? entry.name
              return (
                <button
                  key={entry.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={name}
                  onClick={() => selectGradient(entry.id)}
                  className="flex size-8 items-center justify-center rounded-md ring-1 ring-foreground/10"
                  style={{ backgroundImage: `var(--gradient-${entry.id})` }}
                >
                  {selected ? (
                    <Check
                      className="size-3.5"
                      style={{ color: `var(--gradient-${entry.id}-foreground)` }}
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              )
            })}
          </div>
          {headings ? (
            <>
              <span className="mt-1 text-xs font-medium text-muted-foreground">
                {labels.heading}
              </span>
              <div role="radiogroup" aria-label={labels.heading} className="flex gap-1.5">
                {headingChoices.map((choice) => (
                  <Button
                    key={choice.value}
                    type="button"
                    role="radio"
                    aria-checked={heading === choice.value}
                    variant="outline"
                    size="sm"
                    onClick={() => selectHeading(choice.value)}
                  >
                    {labels[choice.labelKey]}
                  </Button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  )
}
