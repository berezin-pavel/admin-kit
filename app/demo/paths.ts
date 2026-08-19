export const DEMO_FLUSH_BASE = "/demo-flush"
export const DEMO_CARD_BASE = "/demo"

export function demoBasePath(pathname: string): string {
  return pathname === DEMO_FLUSH_BASE || pathname.startsWith(`${DEMO_FLUSH_BASE}/`)
    ? DEMO_FLUSH_BASE
    : DEMO_CARD_BASE
}
