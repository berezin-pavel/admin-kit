import { render, screen } from "@testing-library/react"
import type { ReactElement } from "react"
import { describe, expect, it } from "vitest"

import { CheckboxField } from "@/registry/checkbox-field/checkbox-field"
import { ColorField } from "@/registry/color-field/color-field"
import { ComboboxField } from "@/registry/combobox-field/combobox-field"
import { DateField } from "@/registry/date-field/date-field"
import { DateRangeField } from "@/registry/date-range-field/date-range-field"
import { DateTimeField } from "@/registry/date-time-field/date-time-field"
import { FileField } from "@/registry/file-field/file-field"
import { ImageField } from "@/registry/image-field/image-field"
import { MultiSelectField } from "@/registry/multi-select-field/multi-select-field"
import { NumberField } from "@/registry/number-field/number-field"
import { SelectField } from "@/registry/select-field/select-field"
import { TagsField } from "@/registry/tags-field/tags-field"
import { TextField } from "@/registry/text-field/text-field"
import { TextareaField } from "@/registry/textarea-field/textarea-field"
import { TimeField } from "@/registry/time-field/time-field"

const noop = () => {}

interface FieldCase {
  name: string
  render: (props: { label: string; hint?: string; error?: string }) => ReactElement
  control?: () => HTMLElement
}

function labelledControl(field: FieldCase) {
  return field.control ? field.control() : screen.getByLabelText("Field label")
}

const options = [{ value: "a", label: "First option" }]

const fields: readonly FieldCase[] = [
  {
    name: "text-field",
    render: (p) => <TextField value="" onChange={noop} {...p} />,
  },
  {
    name: "number-field",
    render: (p) => <NumberField value="1" onChange={noop} {...p} />,
  },
  {
    name: "textarea-field",
    render: (p) => <TextareaField value="" onChange={noop} {...p} />,
  },
  {
    name: "select-field",
    render: (p) => (
      <SelectField value="" onChange={noop} options={options} {...p} />
    ),
  },
  {
    name: "combobox-field",
    render: (p) => (
      <ComboboxField value="" onChange={noop} options={options} {...p} />
    ),
  },
  {
    name: "multi-select-field",
    render: (p) => (
      <MultiSelectField value={[]} onChange={noop} options={options} {...p} />
    ),
  },
  {
    name: "checkbox-field",
    render: (p) => <CheckboxField checked={false} onChange={noop} {...p} />,
    control: () => screen.getByRole("checkbox"),
  },
  {
    name: "date-field",
    render: (p) => <DateField value="" onChange={noop} {...p} />,
  },
  {
    name: "date-time-field",
    render: (p) => <DateTimeField value="" onChange={noop} {...p} />,
  },
  {
    name: "date-range-field",
    render: (p) => <DateRangeField value="" onChange={noop} {...p} />,
  },
  {
    name: "time-field",
    render: (p) => <TimeField value="" onChange={noop} {...p} />,
  },
  {
    name: "color-field",
    render: (p) => <ColorField value="#336699" onChange={noop} {...p} />,
  },
  {
    name: "file-field",
    render: (p) => <FileField value={null} onChange={noop} {...p} />,
  },
  {
    name: "image-field",
    render: (p) => (
      <ImageField value={[]} onChange={noop} onSelect={noop} {...p} />
    ),
  },
  {
    name: "tags-field",
    render: (p) => <TagsField value={[]} onChange={noop} {...p} />,
  },
]

describe("every field shares one label, hint and error anatomy", () => {
  it.each(fields.map((field) => [field.name, field] as const))(
    "%s labels its control",
    (_name, field) => {
      render(field.render({ label: "Field label" }))

      expect(labelledControl(field)).toBeInTheDocument()
    }
  )

  it.each(fields.map((field) => [field.name, field] as const))(
    "%s describes its control with the hint",
    (_name, field) => {
      render(field.render({ label: "Field label", hint: "Some guidance" }))

      const control = labelledControl(field)
      const hint = screen.getByText("Some guidance")

      expect(control).toHaveAccessibleDescription("Some guidance")
      expect(hint).toHaveAttribute("id", control.getAttribute("aria-describedby"))
    }
  )

  it.each(fields.map((field) => [field.name, field] as const))(
    "%s replaces the hint with the error and marks the control invalid",
    (_name, field) => {
      render(
        field.render({
          label: "Field label",
          hint: "Some guidance",
          error: "Something is wrong",
        })
      )

      const control = labelledControl(field)

      expect(screen.queryByText("Some guidance")).not.toBeInTheDocument()
      expect(control).toHaveAccessibleDescription("Something is wrong")
      expect(control).toHaveAttribute("aria-invalid", "true")
    }
  )
})
