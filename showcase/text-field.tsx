import { phoneFilter, textFilters } from "@/registry/text-field/text-filters"

import { TextFieldView } from "./text-field-view"
import type { ShowcaseEntry } from "./types"

export const textFieldEntry: ShowcaseEntry = {
  item: "text-field",
  title: "Text field",
  description:
    "A single-line text input: label, control, hint, and error follow the same anatomy across every field in the kit. type switches the native input between text/email/password/url/tel. filter sanitizes what is typed on every change — textFilters ships digits, phone (a # mask), email, slug (kebab-case with Cyrillic transliteration) and code — and sets the matching inputMode. Fully controlled — value and onChange are owned by the consumer, and the field holds no state of its own. When error is set the control gets aria-invalid and aria-describedby pointing at the error text; with only hint set, aria-describedby points at the hint instead.",
  views: [
    {
      id: "empty",
      name: "Empty",
      render: () => (
        <TextFieldView label="Product name" placeholder="e.g. Nova Sneakers" />
      ),
    },
    {
      id: "filled",
      name: "Filled",
      render: () => (
        <TextFieldView label="Customer" initialValue="Emily Carter" />
      ),
    },
    {
      id: "hint",
      name: "With a hint",
      render: () => (
        <TextFieldView
          label="SKU"
          placeholder="e.g. SKU-10234"
          hint="A unique product code in the inventory system, not the same as the barcode"
        />
      ),
    },
    {
      id: "error",
      name: "With an error",
      render: () => (
        <TextFieldView
          label="Email"
          type="email"
          initialValue="jane@example"
          error="Enter a valid email address"
        />
      ),
    },
    {
      id: "phone",
      name: "Phone filter",
      render: () => (
        <TextFieldView
          label="Phone"
          placeholder="+7 (999) 123-45-67"
          filter={phoneFilter("+7 (###) ###-##-##")}
        />
      ),
    },
    {
      id: "email-filter",
      name: "Email filter",
      render: () => (
        <TextFieldView
          label="Email"
          placeholder="name@example.com"
          filter={textFilters.email}
        />
      ),
    },
    {
      id: "slug",
      name: "Slug filter",
      render: () => (
        <TextFieldView
          label="URL slug"
          placeholder="nova-sneakers"
          hint="Lowercase latin letters, digits and dashes; Cyrillic is transliterated"
          filter={textFilters.slug}
        />
      ),
    },
    {
      id: "code",
      name: "Code filter",
      render: () => (
        <TextFieldView label="SKU" placeholder="FTW-SNK-001" filter={textFilters.code} />
      ),
    },
    {
      id: "disabled",
      name: "Disabled",
      render: () => (
        <TextFieldView label="Order number" initialValue="#4187" disabled />
      ),
    },
  ],
}
