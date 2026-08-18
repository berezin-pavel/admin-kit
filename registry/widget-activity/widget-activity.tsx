import type { ComponentType, ReactNode } from "react"
import { format, isSameDay, subDays } from "date-fns"
import type { Locale } from "date-fns"
import { enUS } from "date-fns/locale"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Block } from "@/registry/admin-appearance/block"
import type { GradientId } from "@/registry/admin-appearance/appearance-palette"
import { StateEmpty } from "@/registry/state-empty/state-empty"

export interface WidgetActivityEntry {
  id: string
  title: ReactNode
  meta?: string
  icon?: ComponentType<{ className?: string }>
  timestamp: string
}

export interface WidgetActivityLabels {
  today?: string
  yesterday?: string
  emptyTitle?: string
}

export type WidgetActivityHeading = "regular" | "large"

export interface WidgetActivityProps {
  title?: string
  entries: readonly WidgetActivityEntry[]
  labels?: WidgetActivityLabels
  locale?: Locale
  dayFormat?: string
  timeFormat?: string
  heading?: WidgetActivityHeading
  summary?: ReactNode
  loading?: boolean
  gradient?: GradientId
  blockId?: string
  className?: string
}

const headingClassName: Record<WidgetActivityHeading, string> = {
  regular: "text-[0.84375rem] font-semibold text-foreground",
  large: "text-[1.15rem] font-semibold text-foreground",
}

export interface WidgetActivityGroup {
  dayKey: string
  date: Date
  entries: readonly WidgetActivityEntry[]
}

export function parseActivityTimestamp(value: string): Date | undefined {
  const [datePart, timePart] = value.split("T")
  const [year, month, day] = (datePart ?? "").split("-").map(Number)

  if (!year || !month || !day) {
    return undefined
  }

  const [hours = 0, minutes = 0] = (timePart ?? "").split(":").map(Number)

  if (hours > 23 || minutes > 59) {
    return undefined
  }

  const date = new Date(year, month - 1, day, hours, minutes)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hours ||
    date.getMinutes() !== minutes
  ) {
    return undefined
  }

  return date
}

function formatDayKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function groupActivityEntries(
  entries: readonly WidgetActivityEntry[]
): readonly WidgetActivityGroup[] {
  const groups = new Map<string, WidgetActivityGroup>()

  for (const entry of entries) {
    const date = parseActivityTimestamp(entry.timestamp)

    if (!date) {
      continue
    }

    const dayKey = formatDayKey(date)
    const existing = groups.get(dayKey)

    if (existing) {
      groups.set(dayKey, { ...existing, entries: [...existing.entries, entry] })
    } else {
      groups.set(dayKey, { dayKey, date, entries: [entry] })
    }
  }

  return [...groups.values()]
}

function groupHeading(
  date: Date,
  now: Date,
  locale: Locale,
  dayFormat: string,
  labels: WidgetActivityLabels
): string {
  if (isSameDay(date, now)) {
    return labels.today ?? "Today"
  }

  if (isSameDay(date, subDays(now, 1))) {
    return labels.yesterday ?? "Yesterday"
  }

  return format(date, dayFormat, { locale })
}

const skeletonEntryCount = 3

export function WidgetActivity({
  title,
  entries,
  labels = {},
  locale = enUS,
  dayFormat = "MMMM d",
  timeFormat = "HH:mm",
  heading = "regular",
  summary,
  loading = false,
  gradient,
  blockId,
  className,
}: WidgetActivityProps) {
  const groups = groupActivityEntries(entries)
  const now = new Date()

  return (
    <Block id={blockId} gradient={gradient} headings className={className}>
      {title || summary ? (
        <CardHeader
          className={
            summary ? "flex flex-wrap items-center justify-between gap-4" : undefined
          }
        >
          {title ? (
            <CardTitle className={headingClassName[heading]}>{title}</CardTitle>
          ) : null}
          {summary ? (
            <span className="text-sm text-muted-foreground">{summary}</span>
          ) : null}
        </CardHeader>
      ) : null}
      <CardContent aria-busy={loading || undefined}>
        {loading ? (
          <ul className="flex flex-col gap-3">
            {Array.from({ length: skeletonEntryCount }, (_, index) => (
              <li key={index} className="flex items-start gap-3">
                <Skeleton className="mt-0.5 h-3.5 w-11 shrink-0" />
                <Skeleton className="mt-0.5 size-4 shrink-0 rounded-full" />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3.5 w-24" />
                </div>
              </li>
            ))}
          </ul>
        ) : entries.length === 0 ? (
          <StateEmpty title={labels.emptyTitle ?? "No activity"} />
        ) : (
          <div className="flex flex-col gap-5">
            {groups.map((group) => (
              <div key={group.dayKey} className="flex flex-col gap-3">
                <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {groupHeading(group.date, now, locale, dayFormat, labels)}
                </span>
                <ul className="flex flex-col gap-3">
                  {group.entries.map((entry) => {
                    const Icon = entry.icon
                    const date = parseActivityTimestamp(entry.timestamp)

                    return (
                      <li key={entry.id} className="flex items-start gap-3">
                        <span className="w-11 shrink-0 text-sm text-muted-foreground tabular-nums">
                          {date ? format(date, timeFormat, { locale }) : ""}
                        </span>
                        {Icon ? (
                          <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        ) : null}
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="text-sm font-medium">
                            {entry.title}
                          </span>
                          {entry.meta ? (
                            <span className="text-sm text-muted-foreground">
                              {entry.meta}
                            </span>
                          ) : null}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Block>
  )
}
