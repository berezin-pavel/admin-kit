"use client"

import { useState } from "react"

import { FileField } from "@/registry/file-field/file-field"

interface SeedFile {
  name: string
  size: number
  type?: string
}

function buildSeedFile(seed: SeedFile): File {
  return new File([new Uint8Array(seed.size)], seed.name, {
    type: seed.type,
  })
}

export function FileFieldView({
  label,
  hint,
  error,
  disabled = false,
  accept,
  initialFile,
}: {
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  accept?: string
  initialFile?: SeedFile
}) {
  const [file, setFile] = useState<File | null>(() =>
    initialFile ? buildSeedFile(initialFile) : null
  )

  return (
    <FileField
      value={file}
      onChange={setFile}
      label={label}
      hint={hint}
      error={error}
      disabled={disabled}
      accept={accept}
    />
  )
}
