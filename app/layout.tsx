import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { AppearanceStyle } from "@/registry/admin-appearance/appearance-style"
import { defaultAdminAppearance } from "@/registry/admin-appearance/appearance-palette"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "admin-kit — admin panel parts",
  description:
    "Admin panel shell, widgets, and states you install into your project with the shadcn CLI and update whenever you decide.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <AppearanceStyle value={defaultAdminAppearance} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
