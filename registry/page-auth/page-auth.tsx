"use client"

import type { CSSProperties, FormEvent, ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface PageAuthProps {
  appName: string
  title: string
  description?: string
  children: ReactNode
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  submitLabel?: string
  submitting?: boolean
  error?: string
  footer?: ReactNode
  aside?: ReactNode
  gradient?: string
  className?: string
}

function gradientBackdropStyle(
  gradient?: string
): CSSProperties | undefined {
  return gradient
    ? { backgroundImage: `var(--gradient-${gradient})` }
    : undefined
}

function backdropTextStyle(gradient?: string): CSSProperties | undefined {
  return gradient
    ? { color: `var(--gradient-${gradient}-foreground)` }
    : undefined
}

export function PageAuth({
  appName,
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Sign in",
  submitting = false,
  error,
  footer,
  aside,
  gradient,
  className,
}: PageAuthProps) {
  return (
    <div
      className={cn("flex min-h-svh flex-col lg:flex-row", className)}
      style={gradientBackdropStyle(gradient)}
    >
      {aside ? (
        <div className="hidden bg-muted lg:flex lg:w-1/2 lg:items-center lg:justify-center lg:p-10">
          {aside}
        </div>
      ) : null}
      <div
        className={cn(
          "flex flex-1 items-center justify-center p-6",
          aside ? "lg:w-1/2" : undefined
        )}
      >
        <div className="flex w-full max-w-sm flex-col gap-6">
          <p
            className={cn(
              "text-center text-sm font-medium",
              gradient ? undefined : "text-muted-foreground"
            )}
            style={backdropTextStyle(gradient)}
          >
            {appName}
          </p>
          <Card>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              {description ? (
                <CardDescription>{description}</CardDescription>
              ) : null}
            </CardHeader>
            <CardContent>
              <form
                onSubmit={onSubmit}
                aria-busy={submitting || undefined}
                className="flex flex-col gap-4"
              >
                <fieldset
                  disabled={submitting}
                  className="m-0 flex min-w-0 flex-col gap-4 border-0 p-0"
                >
                  {children}
                  {error ? (
                    <p
                      role="alert"
                      aria-live="assertive"
                      className="text-sm text-destructive"
                    >
                      {error}
                    </p>
                  ) : null}
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitLabel}
                  </Button>
                </fieldset>
              </form>
            </CardContent>
          </Card>
          {footer ? (
            <div
              className={cn(
                "text-center text-sm",
                gradient ? undefined : "text-muted-foreground"
              )}
              style={backdropTextStyle(gradient)}
            >
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
