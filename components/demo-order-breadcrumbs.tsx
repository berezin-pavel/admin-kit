"use client"

import Link from "next/link"

import {
  Breadcrumbs,
  type BreadcrumbsLinkRenderer,
} from "@/registry/breadcrumbs/breadcrumbs"
import { localeRu } from "@/registry/locale-ru/locale-ru"

import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"

const renderDemoBreadcrumbLink: BreadcrumbsLinkRenderer = ({
  href,
  className,
  children,
}) => (
  <Link href={href} className={className}>
    {children}
  </Link>
)

export function DemoOrderBreadcrumbs() {
  const locale = useDemoLocale()
  const strings = demoDictionary[locale]

  const items = [
    { label: strings.nav.orders, href: "/demo/orders" },
    { label: strings.nav.order },
  ]

  return (
    <Breadcrumbs
      items={items}
      renderLink={renderDemoBreadcrumbLink}
      label={locale === "ru" ? localeRu.breadcrumbs.label : undefined}
    />
  )
}
