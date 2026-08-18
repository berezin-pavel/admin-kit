"use client"

import type { ReactNode } from "react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { CheckboxField } from "@/registry/checkbox-field/checkbox-field"
import { PageAuth } from "@/registry/page-auth/page-auth"
import type { GradientId } from "@/registry/admin-appearance/appearance-palette"
import { TextField } from "@/registry/text-field/text-field"

export function PageAuthView({
  simulateError,
  aside,
  gradient,
}: {
  simulateError?: boolean
  aside?: ReactNode
  gradient?: GradientId
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>()

  return (
    <PageAuth
      appName="Northwind Admin"
      title="Sign in"
      description="Use your work email to continue"
      submitting={submitting}
      error={error}
      aside={aside}
      gradient={gradient}
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitting(true)
        setError(undefined)
        window.setTimeout(() => {
          setSubmitting(false)
          setError(simulateError ? "Incorrect email or password" : undefined)
        }, 700)
      }}
      footer={
        <div className="flex flex-col items-center gap-2">
          <a
            href="#"
            className={cn("underline", gradient ? undefined : "text-primary")}
          >
            Forgot your password?
          </a>
          <p>
            No account?{" "}
            <a
              href="#"
              className={cn(
                "underline",
                gradient ? undefined : "text-primary"
              )}
            >
              Request access
            </a>
          </p>
        </div>
      }
    >
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
      />
      <CheckboxField
        label="Remember me"
        checked={remember}
        onChange={setRemember}
      />
    </PageAuth>
  )
}

export function PageAuthAside() {
  return (
    <div className="flex max-w-sm flex-col gap-3">
      <p className="text-2xl font-semibold tracking-tight">
        Run the whole storefront from one screen.
      </p>
      <p className="text-sm text-foreground/80">
        Orders, inventory, and customers stay in sync the moment they change
        — no refresh, no second tab.
      </p>
    </div>
  )
}
