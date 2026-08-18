"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { DemoThemeStyle } from "@/components/demo-theme-style"
import { cn } from "@/lib/utils"
import { CheckboxField } from "@/registry/checkbox-field/checkbox-field"
import { PageAuth } from "@/registry/page-auth/page-auth"
import { TextField } from "@/registry/text-field/text-field"

import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"
import { useDemoGradientAssignment } from "@/app/demo/theme-store"

const VALID_EMAIL = "owner@example.com"
const VALID_PASSWORD = "demo"
const SUBMIT_DELAY_MS = 800

export default function DemoSignInPage() {
  const router = useRouter()
  const locale = useDemoLocale()
  const strings = demoDictionary[locale]
  const signIn = strings.signIn
  const assignment = useDemoGradientAssignment()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(undefined)

    window.setTimeout(() => {
      if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        router.push("/demo")
        return
      }

      setSubmitting(false)
      setError(signIn.errorMessage)
    }, SUBMIT_DELAY_MS)
  }

  return (
    <>
      <DemoThemeStyle />
      <PageAuth
        appName={strings.appName}
        title={signIn.title}
        description={signIn.description}
        submitting={submitting}
        submitLabel={signIn.submitLabel}
        error={error}
        onSubmit={handleSubmit}
        gradient={assignment.surfaces.signIn}
        footer={
          <Link
            href="/demo"
            className={cn(
              "underline",
              assignment.surfaces.signIn ? undefined : "text-primary"
            )}
          >
            {signIn.backToDemoLabel}
          </Link>
        }
      >
        <TextField
          label={signIn.emailLabel}
          type="email"
          value={email}
          onChange={setEmail}
          placeholder={signIn.emailPlaceholder}
        />
        <TextField
          label={signIn.passwordLabel}
          type="password"
          value={password}
          onChange={setPassword}
        />
        <CheckboxField
          label={signIn.rememberLabel}
          checked={remember}
          onChange={setRemember}
        />
      </PageAuth>
    </>
  )
}
