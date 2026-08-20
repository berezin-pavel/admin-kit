import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  NotificationsMenu,
  type NotificationItem,
} from "./notifications-menu"

const notifications: readonly NotificationItem[] = [
  {
    id: "order",
    title: "Order #1042 paid",
    description: "The payment cleared a minute ago",
    timestamp: "12:04",
  },
  { id: "stock", title: "Espresso beans are running low", read: false },
  { id: "digest", title: "Weekly digest is ready", read: true },
]

async function openMenu(name: string | RegExp = /Notifications/) {
  const user = userEvent.setup()
  await user.click(screen.getByRole("button", { name }))
  await screen.findByRole("menu")
  return user
}

describe("NotificationsMenu trigger", () => {
  it("counts the unread ones in the badge and the label", () => {
    render(<NotificationsMenu notifications={notifications} />)

    expect(
      screen.getByRole("button", { name: "Notifications, 2 unread" })
    ).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
  })

  it("caps the badge at 9+ while the label keeps the number", () => {
    const many = Array.from({ length: 12 }, (_, index) => ({
      id: `n${index}`,
      title: `Notification ${index}`,
    }))
    render(<NotificationsMenu notifications={many} />)

    expect(screen.getByText("9+")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Notifications, 12 unread" })
    ).toBeInTheDocument()
  })

  it("drops the badge and the count when everything is read", () => {
    render(
      <NotificationsMenu
        notifications={[{ id: "digest", title: "Read one", read: true }]}
      />
    )

    expect(
      screen.getByRole("button", { name: "Notifications" })
    ).toBeInTheDocument()
    expect(screen.queryByText("1")).not.toBeInTheDocument()
  })
})

describe("NotificationsMenu list", () => {
  it("lists every notification with its description and timestamp", async () => {
    render(<NotificationsMenu notifications={notifications} />)

    await openMenu()

    expect(screen.getByText("Order #1042 paid")).toBeInTheDocument()
    expect(
      screen.getByText("The payment cleared a minute ago")
    ).toBeInTheDocument()
    expect(screen.getByText("12:04")).toBeInTheDocument()
    expect(screen.getAllByRole("menuitem")).toHaveLength(3)
  })

  it("reports the picked notification", async () => {
    const onSelect = vi.fn()
    render(
      <NotificationsMenu notifications={notifications} onSelect={onSelect} />
    )

    const user = await openMenu()
    await user.click(screen.getByRole("menuitem", { name: /Weekly digest/ }))

    expect(onSelect).toHaveBeenCalledWith("digest")
  })

  it("shows the empty label with no notifications", async () => {
    render(<NotificationsMenu notifications={[]} />)

    await openMenu("Notifications")

    expect(screen.getByText("You're all caught up")).toBeInTheDocument()
    expect(screen.queryAllByRole("menuitem")).toHaveLength(0)
  })
})

describe("NotificationsMenu unread marking", () => {
  it("gives an unread item a screen-reader-only Unread marker", async () => {
    render(<NotificationsMenu notifications={notifications} />)

    await openMenu()

    const unread = screen.getByRole("menuitem", {
      name: /Espresso beans are running low/,
    })
    expect(unread).toHaveTextContent("Unread")

    const read = screen.getByRole("menuitem", { name: /Weekly digest/ })
    expect(read).not.toHaveTextContent("Unread")
  })

  it("uses a custom unreadItem label", async () => {
    render(
      <NotificationsMenu
        notifications={notifications}
        labels={{ unreadItem: "New" }}
      />
    )

    await openMenu()

    expect(
      screen.getByRole("menuitem", { name: /Espresso beans are running low/ })
    ).toHaveTextContent("New")
  })
})

describe("NotificationsMenu mark all as read", () => {
  it("calls back from the header button", async () => {
    const onMarkAllRead = vi.fn()
    render(
      <NotificationsMenu
        notifications={notifications}
        onMarkAllRead={onMarkAllRead}
      />
    )

    const user = await openMenu()
    await user.click(screen.getByRole("menuitem", { name: "Mark all as read" }))

    expect(onMarkAllRead).toHaveBeenCalledTimes(1)
  })

  it("hides the button when nothing is unread", async () => {
    render(
      <NotificationsMenu
        notifications={[{ id: "digest", title: "Read one", read: true }]}
        onMarkAllRead={() => {}}
      />
    )

    await openMenu("Notifications")

    expect(
      screen.queryByRole("menuitem", { name: "Mark all as read" })
    ).not.toBeInTheDocument()
  })

  it("is reachable from the trigger with the keyboard alone, as the menu's first item", async () => {
    const onMarkAllRead = vi.fn()
    const user = userEvent.setup()
    render(
      <NotificationsMenu
        notifications={notifications}
        onMarkAllRead={onMarkAllRead}
      />
    )

    await user.tab()
    expect(screen.getByRole("button", { name: /Notifications/ })).toHaveFocus()
    await user.keyboard("{Enter}")
    await screen.findByRole("menu")

    const markAllRead = screen.getByRole("menuitem", {
      name: "Mark all as read",
    })
    expect(markAllRead).toHaveFocus()
  })

  it("activates with Enter without closing the menu", async () => {
    const onMarkAllRead = vi.fn()
    const user = userEvent.setup()
    render(
      <NotificationsMenu
        notifications={notifications}
        onMarkAllRead={onMarkAllRead}
      />
    )

    await user.tab()
    await user.keyboard("{Enter}")
    await screen.findByRole("menu")
    expect(
      screen.getByRole("menuitem", { name: "Mark all as read" })
    ).toHaveFocus()

    await user.keyboard("{Enter}")

    expect(onMarkAllRead).toHaveBeenCalledTimes(1)
    expect(screen.getByRole("menu")).toBeInTheDocument()
  })

  it("is still reachable with ArrowDown after opening the menu with a click", async () => {
    const onMarkAllRead = vi.fn()
    render(
      <NotificationsMenu
        notifications={notifications}
        onMarkAllRead={onMarkAllRead}
      />
    )

    const user = await openMenu()
    const markAllRead = screen.getByRole("menuitem", {
      name: "Mark all as read",
    })

    let reached = markAllRead === document.activeElement
    for (let step = 0; step < 5 && !reached; step++) {
      await user.keyboard("{ArrowDown}")
      reached = markAllRead === document.activeElement
    }
    expect(reached).toBe(true)
  })
})
