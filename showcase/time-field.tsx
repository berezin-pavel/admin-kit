import { TimeFieldView } from "./time-field-view"
import type { ShowcaseEntry } from "./types"

export const timeFieldEntry: ShowcaseEntry = {
  item: "time-field",
  title: "Time field",
  description:
    "A time-picker field on a native input type=time: value and onChange give back a 24-hour HH:mm string, and an empty string means no time is selected. Controlled, holds no state of its own. step is the increment in minutes (5 by default), converted internally to seconds as the native element requires. min and max bound the selection in the same HH:mm format. label draws a caption via Label and links it to the field by id.",
  views: [
    {
      id: "empty",
      name: "Empty value",
      render: () => <TimeFieldView initialValue="" label="Time" />,
    },
    {
      id: "filled",
      name: "Filled value",
      render: () => <TimeFieldView initialValue="14:30" label="Time" />,
    },
    {
      id: "label",
      name: "With a label",
      render: () => (
        <TimeFieldView initialValue="09:00" label="Meeting time" />
      ),
    },
    {
      id: "step",
      name: "15-minute step",
      render: () => (
        <TimeFieldView initialValue="10:00" label="Every 15 minutes" step={15} />
      ),
    },
    {
      id: "bounds",
      name: "min/max bounds",
      render: () => (
        <TimeFieldView
          initialValue="12:00"
          label="Business hours"
          min="09:00"
          max="18:00"
        />
      ),
    },
    {
      id: "disabled",
      name: "Disabled",
      render: () => (
        <TimeFieldView initialValue="11:15" label="Unavailable" disabled />
      ),
    },
  ],
}
