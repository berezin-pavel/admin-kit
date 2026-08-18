import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

interface Candidate {
  name: string
  family: string
  stops: readonly string[]
  angle?: number
  text?: "light" | "dark"
}

const candidates: readonly Candidate[] = [
  { name: "Ember", family: "Warm", stops: ["#7f1d1d", "#b91c1c", "#dc2626", "#ea580c", "#f59e0b"], text: "light" },
  { name: "Volcano", family: "Warm", stops: ["#3b0a0a", "#7f1d1d", "#c2410c", "#f97316", "#facc15"], text: "light" },
  { name: "Sunset", family: "Warm", stops: ["#c2410c", "#e11d48", "#be185d", "#7e22ce"], text: "light" },
  { name: "Sunrise", family: "Warm", stops: ["#f59e0b", "#f97316", "#ef4444", "#db2777"], text: "light" },
  { name: "Mango", family: "Warm", stops: ["#b45309", "#ea580c", "#f59e0b", "#84cc16"], text: "light" },
  { name: "Cherry", family: "Warm", stops: ["#881337", "#be123c", "#e11d48", "#f472b6"], text: "light" },
  { name: "Wine", family: "Warm", stops: ["#4a044e", "#831843", "#9f1239", "#7c2d12"], text: "light" },
  { name: "Copper", family: "Warm", stops: ["#431407", "#7c2d12", "#b45309", "#d97706", "#a16207"], text: "light" },
  { name: "Coral", family: "Warm", stops: ["#f43f5e", "#fb7185", "#f97316", "#facc15"], text: "dark" },
  { name: "Flamingo", family: "Warm", stops: ["#db2777", "#f472b6", "#fb923c", "#fde68a"], text: "dark" },
  { name: "Rose", family: "Pink & purple", stops: ["#9d174d", "#db2777", "#a21caf", "#6d28d9"], text: "light" },
  { name: "Berry", family: "Pink & purple", stops: ["#701a75", "#a21caf", "#e11d48", "#f97316"], text: "light" },
  { name: "Grape", family: "Pink & purple", stops: ["#312e81", "#5b21b6", "#9333ea", "#c026d3"], text: "light" },
  { name: "Plum", family: "Pink & purple", stops: ["#3b0764", "#6b21a8", "#be185d", "#0f172a"], angle: 160, text: "light" },
  { name: "Nebula", family: "Pink & purple", stops: ["#1e1b4b", "#7e22ce", "#db2777", "#f97316"], text: "light" },
  { name: "Dusk", family: "Pink & purple", stops: ["#0f172a", "#312e81", "#7e22ce", "#f472b6"], text: "light" },
  { name: "Storm", family: "Pink & purple", stops: ["#1f2937", "#4c1d95", "#6d28d9", "#64748b"], text: "light" },
  { name: "Candy", family: "Pink & purple", stops: ["#f9a8d4", "#c4b5fd", "#67e8f9", "#a7f3d0"], text: "dark" },
  { name: "Northern", family: "Blue", stops: ["#134e4a", "#0e7490", "#4338ca", "#7e22ce"], text: "light" },
  { name: "Midnight", family: "Blue", stops: ["#020617", "#1e3a8a", "#1d4ed8", "#0e7490"], text: "light" },
  { name: "Ocean", family: "Blue", stops: ["#1e3a8a", "#1d4ed8", "#0284c7", "#06b6d4", "#14b8a6"], text: "light" },
  { name: "Cobalt", family: "Blue", stops: ["#1e1b4b", "#3730a3", "#2563eb", "#38bdf8"], text: "light" },
  { name: "Denim", family: "Blue", stops: ["#0f172a", "#1e40af", "#334155", "#0ea5e9"], angle: 160, text: "light" },
  { name: "Lagoon", family: "Blue", stops: ["#134e4a", "#0f766e", "#0891b2", "#22d3ee", "#a3e635"], text: "light" },
  { name: "Steel", family: "Blue", stops: ["#1f2937", "#475569", "#0369a1", "#94a3b8"], text: "light" },
  { name: "Ice", family: "Blue", stops: ["#bae6fd", "#c7d2fe", "#e9d5ff", "#f0fdfa"], text: "dark" },
  { name: "Sky", family: "Blue", stops: ["#7dd3fc", "#38bdf8", "#818cf8", "#c4b5fd"], text: "dark" },
  { name: "Aurora", family: "Green", stops: ["#064e3b", "#0d9488", "#4f46e5", "#a21caf"], text: "light" },
  { name: "Tropic", family: "Green", stops: ["#facc15", "#84cc16", "#10b981", "#06b6d4"], text: "dark" },
  { name: "Meadow", family: "Green", stops: ["#14532d", "#15803d", "#65a30d", "#eab308"], text: "light" },
  { name: "Forest", family: "Green", stops: ["#022c22", "#065f46", "#166534", "#3f6212", "#0f766e"], text: "light" },
  { name: "Ivy", family: "Green", stops: ["#052e16", "#15803d", "#0f766e", "#155e75"], text: "light" },
  { name: "Moss", family: "Green", stops: ["#365314", "#4d7c0f", "#a16207", "#78350f"], text: "light" },
  { name: "Mint", family: "Green", stops: ["#a7f3d0", "#6ee7b7", "#67e8f9", "#bae6fd"], text: "dark" },
  { name: "Sage", family: "Green", stops: ["#d9f99d", "#bbf7d0", "#99f6e4", "#e0e7ff"], text: "dark" },
  { name: "Lemon", family: "Yellow", stops: ["#fef08a", "#fde047", "#bef264", "#86efac"], text: "dark" },
  { name: "Amber", family: "Yellow", stops: ["#fde68a", "#fbbf24", "#fb923c", "#fda4af"], text: "dark" },
  { name: "Peach", family: "Yellow", stops: ["#fed7aa", "#fdba74", "#fda4af", "#f9a8d4"], text: "dark" },
  { name: "Sand", family: "Yellow", stops: ["#fef3c7", "#e7e5e4", "#d6d3d1", "#fde68a"], text: "dark" },
  { name: "Gold", family: "Yellow", stops: ["#78350f", "#b45309", "#eab308", "#fde047"], text: "light" },
  { name: "Lavender", family: "Pastel", stops: ["#ddd6fe", "#c4b5fd", "#f5d0fe", "#bfdbfe"], text: "dark" },
  { name: "Rosewater", family: "Pastel", stops: ["#fecdd3", "#fbcfe8", "#e9d5ff", "#fef3c7"], text: "dark" },
  { name: "Slate", family: "Greys", stops: ["#0f172a", "#334155", "#475569", "#0369a1"], text: "light" },
  { name: "Graphite", family: "Greys", stops: ["#111827", "#374151", "#1f2937", "#4b5563", "#0f766e"], text: "light" },
  { name: "Charcoal", family: "Greys", stops: ["#18181b", "#3f3f46", "#52525b", "#7c2d12"], text: "light" },
  { name: "Onyx", family: "Greys", stops: ["#000000", "#1e1b4b", "#111827", "#312e81"], text: "light" },
  { name: "Pearl", family: "Greys", stops: ["#f5f5f4", "#e7e5e4", "#e0f2fe", "#fce7f3"], text: "dark" },
  { name: "Paprika", family: "Warm", stops: ["#7c2d12", "#c2410c", "#e11d48", "#fbbf24"], text: "light" },
  { name: "Brick", family: "Warm", stops: ["#450a0a", "#991b1b", "#9a3412", "#a16207"], text: "light" },
  { name: "Apricot", family: "Warm", stops: ["#fdba74", "#fb923c", "#fde68a", "#fecaca"], text: "dark" },
  { name: "Orchid", family: "Pink & purple", stops: ["#c026d3", "#e879f9", "#818cf8", "#38bdf8"], text: "light" },
  { name: "Amethyst", family: "Pink & purple", stops: ["#2e1065", "#6d28d9", "#a855f7", "#f0abfc"], text: "light" },
  { name: "Magenta", family: "Pink & purple", stops: ["#701a75", "#c026d3", "#db2777", "#fb7185"], text: "light" },
  { name: "Lilac", family: "Pink & purple", stops: ["#e9d5ff", "#f0abfc", "#f9a8d4", "#fecdd3"], text: "dark" },
  { name: "Sapphire", family: "Blue", stops: ["#172554", "#1e40af", "#4f46e5", "#a5b4fc"], text: "light" },
  { name: "Arctic", family: "Blue", stops: ["#0c4a6e", "#0369a1", "#38bdf8", "#e0f2fe"], text: "light" },
  { name: "Teal", family: "Blue", stops: ["#042f2e", "#0f766e", "#14b8a6", "#5eead4"], text: "light" },
  { name: "Cyan", family: "Blue", stops: ["#083344", "#155e75", "#06b6d4", "#a5f3fc"], text: "light" },
  { name: "Emerald", family: "Green", stops: ["#022c22", "#047857", "#10b981", "#a7f3d0"], text: "light" },
  { name: "Lime", family: "Green", stops: ["#1a2e05", "#3f6212", "#84cc16", "#d9f99d"], text: "light" },
  { name: "Jungle", family: "Green", stops: ["#052e16", "#166534", "#0d9488", "#facc15"], text: "light" },
  { name: "Pistachio", family: "Green", stops: ["#bef264", "#86efac", "#5eead4", "#fef9c3"], text: "dark" },
  { name: "Honey", family: "Yellow", stops: ["#a16207", "#d97706", "#fbbf24", "#fef08a"], text: "light" },
  { name: "Mustard", family: "Yellow", stops: ["#713f12", "#a16207", "#ca8a04", "#eab308"], text: "light" },
  { name: "Buttercup", family: "Yellow", stops: ["#fef9c3", "#fde68a", "#fcd34d", "#fdba74"], text: "dark" },
  { name: "Terracotta", family: "Earth", stops: ["#7c2d12", "#9a3412", "#c2410c", "#d6d3d1"], text: "light" },
  { name: "Mocha", family: "Earth", stops: ["#292524", "#57534e", "#78350f", "#a8a29e"], text: "light" },
  { name: "Clay", family: "Earth", stops: ["#78350f", "#b45309", "#a8a29e", "#fde68a"], text: "light" },
  { name: "Olive", family: "Earth", stops: ["#1a2e05", "#3f6212", "#65a30d", "#a3a3a3"], text: "light" },
  { name: "Cocoa", family: "Earth", stops: ["#1c1917", "#44403c", "#7c2d12", "#a16207"], text: "light" },
  { name: "Latte", family: "Earth", stops: ["#e7e5e4", "#d6d3d1", "#fde68a", "#fed7aa"], text: "dark" },
  { name: "Bronze", family: "Metal", stops: ["#451a03", "#92400e", "#d97706", "#fde68a"], text: "light" },
  { name: "Rose Gold", family: "Metal", stops: ["#9f1239", "#e11d48", "#fda4af", "#fef3c7"], text: "light" },
  { name: "Platinum", family: "Metal", stops: ["#a1a1aa", "#e4e4e7", "#f4f4f5", "#d4d4d8"], text: "dark" },
  { name: "Brass", family: "Metal", stops: ["#713f12", "#ca8a04", "#fde047", "#f5f5f4"], text: "light" },
  { name: "Neon", family: "Vivid", stops: ["#22d3ee", "#a855f7", "#ec4899", "#f97316"], text: "light" },
  { name: "Vapor", family: "Vivid", stops: ["#f472b6", "#c084fc", "#60a5fa", "#2dd4bf"], text: "light" },
  { name: "Sherbet", family: "Vivid", stops: ["#fdba74", "#f9a8d4", "#c4b5fd", "#a5f3fc"], text: "dark" },
  { name: "Grapefruit", family: "Vivid", stops: ["#dc2626", "#f97316", "#fbbf24", "#a3e635"], text: "light" },
  { name: "Prism", family: "Vivid", stops: ["#2563eb", "#7c3aed", "#db2777", "#f59e0b", "#84cc16"], text: "light" },
  { name: "Reef", family: "Vivid", stops: ["#0e7490", "#10b981", "#facc15", "#f97316"], text: "light" },
  { name: "Ruby", family: "Jewel", stops: ["#4c0519", "#9f1239", "#e11d48", "#fda4af"], text: "light" },
  { name: "Topaz", family: "Jewel", stops: ["#431407", "#c2410c", "#f59e0b", "#fef08a"], text: "light" },
  { name: "Jade", family: "Jewel", stops: ["#022c22", "#065f46", "#34d399", "#d1fae5"], text: "light" },
  { name: "Lapis", family: "Jewel", stops: ["#1e1b4b", "#1e3a8a", "#2563eb", "#93c5fd"], text: "light" },
  { name: "Garnet", family: "Jewel", stops: ["#450a0a", "#7f1d1d", "#be123c", "#7e22ce"], text: "light" },
  { name: "Ash", family: "Greys", stops: ["#1c1917", "#292524", "#44403c", "#57534e"], text: "light" },
  { name: "Basalt", family: "Greys", stops: ["#0a0a0a", "#171717", "#262626", "#404040"], text: "light" },
  { name: "Iron", family: "Greys", stops: ["#1e293b", "#334155", "#475569", "#64748b"], text: "light" },
  { name: "Pewter", family: "Greys", stops: ["#374151", "#4b5563", "#6b7280", "#9ca3af"], text: "light" },
  { name: "Smoke", family: "Greys", stops: ["#3f3f46", "#52525b", "#71717a", "#a1a1aa"], text: "light" },
  { name: "Ink", family: "Greys", stops: ["#020617", "#0f172a", "#1e293b", "#334155"], text: "light" },
  { name: "Mist", family: "Greys", stops: ["#cbd5e1", "#e2e8f0", "#f1f5f9", "#e2e8f0"], text: "dark" },
  { name: "Fog", family: "Greys", stops: ["#d6d3d1", "#e7e5e4", "#f5f5f4", "#e7e5e4"], text: "dark" },
  { name: "Silver", family: "Greys", stops: ["#a1a1aa", "#d4d4d8", "#f4f4f5", "#e4e4e7"], text: "dark" },
  { name: "Cloud", family: "Greys", stops: ["#f8fafc", "#f1f5f9", "#e2e8f0", "#f8fafc"], text: "dark" },
  { name: "Concrete", family: "Greys", stops: ["#78716c", "#a8a29e", "#d6d3d1", "#e7e5e4"], text: "dark" },
  { name: "Slate Mist", family: "Greys", stops: ["#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0"], text: "dark" },
  { name: "Cool Grey", family: "Greys", stops: ["#111827", "#1f2937", "#1e3a8a", "#374151"], text: "light" },
  { name: "Warm Grey", family: "Greys", stops: ["#292524", "#44403c", "#78350f", "#57534e"], text: "light" },
  { name: "Mono", family: "Greys", stops: ["#000000", "#262626", "#525252", "#737373"], text: "light" },
]

function gradientOf(candidate: Candidate): string {
  const step = 100 / (candidate.stops.length - 1)
  const stops = candidate.stops
    .map((stop, index) => `${stop} ${Math.round(index * step)}%`)
    .join(", ")
  return `linear-gradient(${candidate.angle ?? 135}deg, ${stops})`
}

const families = [...new Set(candidates.map((candidate) => candidate.family))]

export default function PaletteCandidatesPage() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Gradient candidates</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          {candidates.length} multi-stop gradients spread across hue families. Pick the ones
          that should make the palette; contrast is measured after the choice, so a light-text
          gradient may darken a little and a dark-text one may lighten before it ships.
        </p>
        <div>
          <Link href="/palette" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Current palette
          </Link>
        </div>
      </header>
      {families.map((family) => (
        <section key={family} className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">{family}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {candidates
              .filter((candidate) => candidate.family === family)
              .map((candidate) => (
                <div
                  key={candidate.name}
                  className="flex h-40 flex-col justify-between rounded-xl p-4 ring-1 ring-foreground/10"
                  style={{
                    backgroundImage: gradientOf(candidate),
                    color: candidate.text === "dark" ? "oklch(0.205 0 0)" : "oklch(0.985 0 0)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[0.84375rem] font-semibold">{candidate.name}</span>
                    <span
                      className="rounded-md px-2 py-0.5 text-xs"
                      style={{ background: "color-mix(in oklch, currentColor 16%, transparent)" }}
                    >
                      Hover
                    </span>
                  </div>
                  <div className="text-xs opacity-90">
                    Revenue 12,480 · +8.2% for the selected period
                  </div>
                  <div className="font-mono text-[10px] opacity-80">
                    {candidate.stops.join(" ")}
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}
    </main>
  )
}
