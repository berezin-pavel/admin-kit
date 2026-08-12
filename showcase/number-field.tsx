import { NumberFieldView } from "./number-field-view"
import type { ShowcaseEntry } from "./types"

export const numberFieldEntry: ShowcaseEntry = {
  item: "number-field",
  title: "Number field",
  description:
    "A numeric input built on input type=number. The value is deliberately a string, not a number: mid-typing it can hold states like \"1.\" or \"-\" that a number value can't represent, so the field passes the raw string through and the consumer parses it on submit. min, max, and step forward straight to the native input.",
  views: [
    {
      id: "empty",
      name: "Empty",
      render: () => (
        <NumberFieldView label="Quantity" placeholder="0" min={0} />
      ),
    },
    {
      id: "filled",
      name: "Filled",
      render: () => <NumberFieldView label="Amount" initialValue="2340" />,
    },
    {
      id: "hint",
      name: "With a hint",
      render: () => (
        <NumberFieldView
          label="Discount"
          placeholder="e.g. 12"
          min={0}
          max={100}
          hint="Percent applied before tax, not to the retail price"
        />
      ),
    },
    {
      id: "error",
      name: "With an error",
      render: () => (
        <NumberFieldView
          label="Quantity"
          initialValue="-3"
          min={0}
          error="Quantity can't be negative"
        />
      ),
    },
    {
      id: "disabled",
      name: "Disabled",
      render: () => (
        <NumberFieldView label="Amount" initialValue="4200" disabled />
      ),
    },
  ],
}
