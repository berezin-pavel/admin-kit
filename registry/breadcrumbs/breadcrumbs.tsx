import { Fragment } from "react"
import type { ReactNode } from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const BREADCRUMB_LINK_CLASSNAME =
  "cursor-default transition-colors hover:text-foreground"

export interface BreadcrumbEntry {
  label: string
  href?: string
}

export type BreadcrumbsLinkRenderer = (props: {
  href: string
  className?: string
  children: ReactNode
}) => ReactNode

export interface BreadcrumbsProps {
  items: readonly BreadcrumbEntry[]
  renderLink?: BreadcrumbsLinkRenderer
  label?: string
  className?: string
}

const renderBreadcrumbsLink: BreadcrumbsLinkRenderer = ({
  href,
  className,
  children,
}) => (
  <a href={href} className={className}>
    {children}
  </a>
)

export function Breadcrumbs({
  items,
  renderLink,
  label = "Breadcrumb",
  className,
}: BreadcrumbsProps) {
  const renderItem = renderLink ?? renderBreadcrumbsLink

  return (
    <Breadcrumb aria-label={label} className={className}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <Fragment key={`${item.label}-${index}`}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : item.href ? (
                  renderItem({
                    href: item.href,
                    className: BREADCRUMB_LINK_CLASSNAME,
                    children: item.label,
                  })
                ) : (
                  <span>{item.label}</span>
                )}
              </BreadcrumbItem>
              {isLast ? null : <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
