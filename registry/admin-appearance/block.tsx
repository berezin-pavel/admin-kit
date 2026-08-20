"use client"

import { useState, type ComponentProps, type ReactElement } from "react"
import { Ban, Check, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import {
  resolveBlockGradient,
  setBlockAppearance,
  useAppearance,
  useBlockAppearance,
  type AppearanceContextValue,
} from "./appearance-provider"
import {
  gradientFamilies,
  gradientPalette,
  type BlockHeading,
  type GradientId,
} from "./appearance-palette"
import { DragHandle, useDragOffset } from "./drag-handle"

export interface BlockProps extends ComponentProps<typeof Card> {
  id?: string
  gradient?: GradientId
  headings?: boolean
}

const headingChoices: readonly {
  value: BlockHeading
  labelKey: "headingRegular" | "headingLarge" | "headingNone"
}[] = [
  { value: "regular", labelKey: "headingRegular" },
  { value: "large", labelKey: "headingLarge" },
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

  const resolvedGradient = resolveBlockGradient(stored, gradient)

  const showMenu = Boolean(appearance?.editable) && id !== undefined

  return (
    <Card
      data-block=""
      data-block-id={id}
      data-gradient={resolvedGradient}
      data-heading={stored.heading}
      className={cn("group/block relative", className)}
      {...rest}
    >
      {children}
      {showMenu && appearance && id !== undefined ? (
        <BlockMenu
          id={id}
          gradient={stored.gradient}
          resolvedGradient={resolvedGradient}
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
  resolvedGradient: GradientId | undefined
  heading: BlockHeading | undefined
  headings: boolean
  value: AppearanceContextValue["value"]
  onChange: AppearanceContextValue["onChange"]
  labels: AppearanceContextValue["labels"]
}

function BlockMenu({
  id,
  gradient,
  resolvedGradient,
  heading,
  headings,
  value,
  onChange,
  labels,
}: BlockMenuProps) {
  const [open, setOpen] = useState(false)
  const { ref, start, reset, hideForExit } = useDragOffset()

  const selectGradient = (next: GradientId | null) => {
    onChange(setBlockAppearance(value, id, { gradient: next }))
  }

  const selectHeading = (next: BlockHeading) => {
    onChange(setBlockAppearance(value, id, { heading: next }))
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) {
          reset()
        } else {
          hideForExit()
        }
        setOpen(next)
      }}
    >
      <PopoverTrigger
        aria-label={labels.blockMenu}
        render={
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 z-10 size-5 rounded-tr-xl opacity-0 transition-opacity group-hover/block:opacity-100 focus-visible:opacity-100 data-popup-open:opacity-100"
          />
        }
      >
        <Settings2 className="size-3" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent
        ref={ref}
        aria-label={labels.blockMenu}
        data-gradient={resolvedGradient}
        finalFocus={false}
        className="max-h-[70vh] w-auto overflow-y-auto"
      >
        <DragHandle
          onPointerDown={start}
          onClose={() => {
            hideForExit()
            setOpen(false)
          }}
          closeLabel={labels.close}
        />
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            {labels.gradient}
          </span>
          <div
            role="radiogroup"
            aria-label={labels.gradient}
            className="flex flex-col gap-2"
          >
            <div className="grid grid-cols-8 gap-1.5">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      role="radio"
                      aria-checked={gradient === null}
                      aria-label={labels.none}
                      onClick={() => selectGradient(null)}
                      className="flex size-7 items-center justify-center rounded-md bg-muted ring-1 ring-foreground/10"
                    >
                      <Ban
                        className="size-3.5 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </button>
                  }
                />
                <TooltipContent>{labels.none}</TooltipContent>
              </Tooltip>
            </div>
            {gradientFamilies.map((family) => (
              <div key={family} className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">
                  {labels.families[family]}
                </span>
                <div className="grid grid-cols-8 gap-1.5">
                  {gradientPalette
                    .filter((entry) => entry.family === family)
                    .map((entry) => {
                      const selected = gradient === entry.id
                      const name = labels.gradients[entry.id] ?? entry.name
                      return (
                        <Tooltip key={entry.id}>
                          <TooltipTrigger
                            render={
                              <button
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                aria-label={name}
                                onClick={() => selectGradient(entry.id)}
                                className="flex size-7 items-center justify-center rounded-md ring-1 ring-foreground/10"
                                style={{
                                  backgroundImage: `var(--gradient-${entry.id})`,
                                }}
                              >
                                {selected ? (
                                  <Check
                                    className="size-3.5"
                                    style={{
                                      color: `var(--gradient-${entry.id}-foreground)`,
                                    }}
                                    aria-hidden="true"
                                  />
                                ) : null}
                              </button>
                            }
                          />
                          <TooltipContent>{name}</TooltipContent>
                        </Tooltip>
                      )
                    })}
                </div>
              </div>
            ))}
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
