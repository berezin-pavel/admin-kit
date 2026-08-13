"use client"

import { useState } from "react"

import { TagsField } from "@/registry/tags-field/tags-field"

export function TagsFieldView({
  label,
  initialTags = [],
  suggestions,
  hint,
  error,
  disabled = false,
}: {
  label?: string
  initialTags?: readonly string[]
  suggestions?: readonly string[]
  hint?: string
  error?: string
  disabled?: boolean
}) {
  const [tags, setTags] = useState<readonly string[]>(initialTags)

  return (
    <TagsField
      value={tags}
      onChange={setTags}
      label={label}
      suggestions={suggestions}
      hint={hint}
      error={error}
      disabled={disabled}
    />
  )
}
