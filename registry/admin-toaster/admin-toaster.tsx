"use client"

import type { ReactNode } from "react"
import {
  CircleCheckIcon,
  InfoIcon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toast,
  useToastManager,
} from "@/components/ui/toast"

export type NotifyTone = "info" | "success" | "warning" | "danger"

export interface NotifyOptions {
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export interface AdminToasterProps {
  className?: string
}

const toastTypeByTone: Record<NotifyTone, string> = {
  info: "info",
  success: "success",
  warning: "warning",
  danger: "error",
}

const toastIconByType: Record<string, ReactNode> = {
  info: <InfoIcon aria-hidden="true" />,
  success: <CircleCheckIcon aria-hidden="true" />,
  warning: <TriangleAlertIcon aria-hidden="true" />,
  error: <OctagonXIcon aria-hidden="true" />,
}

const toastClassNameByType: Record<string, string> = {
  info: "border-transparent bg-foreground text-background",
  success: "border-transparent bg-success text-success-foreground",
  warning: "border-transparent bg-warning text-warning-foreground",
  error: "border-transparent bg-destructive text-white",
}

const TONED_TOAST_PARTS =
  "[&_[data-slot=toast-description]]:text-current [&_[data-slot=toast-description]]:opacity-80 [&_[data-slot=toast-close]]:text-current [&_[data-slot=toast-close]]:opacity-70 [&_[data-slot=toast-close]]:hover:bg-current/15 [&_[data-slot=toast-close]]:hover:text-current [&_[data-slot=toast-close]]:hover:opacity-100 [&_[data-slot=toast-action]]:border-current/40 [&_[data-slot=toast-action]]:bg-transparent [&_[data-slot=toast-action]]:text-current [&_[data-slot=toast-action]]:hover:bg-current/15 [&_[data-slot=toast-action]]:hover:text-current"

function notifyTone(tone: NotifyTone, title: string, options?: NotifyOptions) {
  toast.add({
    title,
    description: options?.description,
    type: toastTypeByTone[tone],
    actionProps: options?.actionLabel
      ? { children: options.actionLabel, onClick: options.onAction }
      : undefined,
  })
}

export const notify = {
  info: (title: string, options?: NotifyOptions) =>
    notifyTone("info", title, options),
  success: (title: string, options?: NotifyOptions) =>
    notifyTone("success", title, options),
  warning: (title: string, options?: NotifyOptions) =>
    notifyTone("warning", title, options),
  danger: (title: string, options?: NotifyOptions) =>
    notifyTone("danger", title, options),
}

function AdminToastIcon({ type }: { type: string | undefined }) {
  const icon = type ? toastIconByType[type] : undefined

  if (!icon) {
    return null
  }

  return (
    <span className="shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4">
      {icon}
    </span>
  )
}

function AdminToastList() {
  const { toasts } = useToastManager()

  return toasts.map((item) => (
    <Toast
      key={item.id}
      toast={item}
      className={cn(
        item.type ? toastClassNameByType[item.type] : undefined,
        item.type ? TONED_TOAST_PARTS : undefined
      )}
    >
      <ToastContent>
        <AdminToastIcon type={item.type} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  ))
}

export function AdminToaster({ className }: AdminToasterProps) {
  return (
    <ToastProvider toastManager={toast}>
      <ToastPortal>
        <ToastViewport className={className}>
          <AdminToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  )
}
