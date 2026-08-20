import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { DragHandle, useDragOffset } from "./drag-handle"

function Harness() {
  const { ref, start } = useDragOffset<HTMLDivElement>()

  return (
    <div ref={ref} data-testid="popup">
      <DragHandle onPointerDown={start} />
    </div>
  )
}

function pointer(
  type: string,
  clientX: number,
  clientY: number,
  pointerId?: number
) {
  const event = new MouseEvent(type, { bubbles: true, clientX, clientY })
  if (pointerId !== undefined) {
    Object.defineProperty(event, "pointerId", { value: pointerId })
  }
  return event
}

describe("useDragOffset", () => {
  beforeEach(() => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0)
      return 0
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const handleOf = () => {
    const handle = document.querySelector('[data-slot="appearance-drag-handle"]')
    if (!(handle instanceof HTMLElement)) {
      throw new Error("the harness has no drag handle")
    }
    return handle
  }

  it("captures the pointer, so a release outside the window still ends the drag", () => {
    render(<Harness />)
    const handle = handleOf()
    const captured: number[] = []
    handle.setPointerCapture = (pointerId: number) => {
      captured.push(pointerId)
    }

    fireEvent(handle, pointer("pointerdown", 10, 10, 7))

    expect(captured).toEqual([7])
  })

  it("ends the drag when the capture is lost", () => {
    render(<Harness />)
    const handle = handleOf()
    handle.setPointerCapture = () => {}
    const popup = screen.getByTestId("popup")

    fireEvent(handle, pointer("pointerdown", 0, 0, 3))
    fireEvent(window, pointer("pointermove", 20, 30))
    fireEvent(window, pointer("lostpointercapture", 20, 30, 3))
    fireEvent(window, pointer("pointermove", 90, 90))

    expect(popup.style.transform).toBe("translate3d(20px, 30px, 0)")
  })

  it("drags on where the element cannot capture pointers at all", () => {
    render(<Harness />)
    const handle = handleOf()
    Object.defineProperty(handle, "setPointerCapture", {
      value: undefined,
      configurable: true,
    })
    const popup = screen.getByTestId("popup")

    fireEvent(handle, pointer("pointerdown", 0, 0, 1))
    fireEvent(window, pointer("pointermove", 15, 25))
    fireEvent(window, pointer("pointerup", 15, 25))

    expect(popup.style.transform).toBe("translate3d(15px, 25px, 0)")
  })
})
