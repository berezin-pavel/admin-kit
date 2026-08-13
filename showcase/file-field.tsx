import { FileFieldView } from "./file-field-view"
import type { ShowcaseEntry } from "./types"

export const fileFieldEntry: ShowcaseEntry = {
  item: "file-field",
  title: "File field",
  description:
    "A single-file picker: a button opening the hidden native input, the selected file's name and size, and drag-and-drop onto the row. The one deliberate exception to the kit's string-value convention — value is a File | null and onChange hands back a File | null, since a File can't be serialized to a string without leaking an object URL.",
  views: [
    {
      id: "empty",
      name: "No file",
      render: () => <FileFieldView label="Attachment" />,
    },
    {
      id: "selected",
      name: "File selected",
      render: () => (
        <FileFieldView
          label="Attachment"
          initialFile={{
            name: "invoice-4187.pdf",
            size: 482_000,
            type: "application/pdf",
          }}
        />
      ),
    },
    {
      id: "with-hint",
      name: "With a hint",
      render: () => (
        <FileFieldView
          label="Attachment"
          hint="PDF or image, up to 10 MB"
          accept="application/pdf,image/*"
        />
      ),
    },
    {
      id: "error",
      name: "With an error",
      render: () => (
        <FileFieldView
          label="Attachment"
          error="Choose a file before submitting"
        />
      ),
    },
    {
      id: "disabled",
      name: "Disabled",
      render: () => <FileFieldView label="Attachment" disabled />,
    },
  ],
}
