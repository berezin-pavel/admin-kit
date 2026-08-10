import type { ReactNode } from "react"

export function PrimitiveSection({
  file,
  name,
  description,
  requiredBy,
  children,
}: {
  file: string
  name: string
  description: string
  requiredBy: readonly string[]
  children: ReactNode
}) {
  const id = file.replace(/\.tsx$/, "")

  return (
    <section id={id} className="flex scroll-mt-20 flex-col gap-4">
      <header className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="text-xl font-semibold">{name}</h3>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            components/ui/{file}
          </code>
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground">
          Required by: {requiredBy.join(", ")}
        </p>
      </header>
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border p-6">
        {children}
      </div>
    </section>
  )
}
