import { cookies } from "next/headers"

import { DEMO_APPEARANCE_COOKIE, DEMO_LOCALE_COOKIE } from "./demo-cookie"

export interface DemoSettings {
  appearanceCookie?: string
  localeCookie?: string
}

export async function readDemoSettings(): Promise<DemoSettings> {
  const store = await cookies()

  return {
    appearanceCookie: store.get(DEMO_APPEARANCE_COOKIE)?.value,
    localeCookie: store.get(DEMO_LOCALE_COOKIE)?.value,
  }
}
