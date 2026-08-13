import { TagsFieldView } from "./tags-field-view"
import type { ShowcaseEntry } from "./types"

const suggestions = [
  "Gift",
  "Priority",
  "Fragile",
  "Wholesale",
  "Repeat customer",
]

export const tagsFieldEntry: ShowcaseEntry = {
  item: "tags-field",
  title: "Tags field",
  description:
    "A free-form tag input: type and press Enter or comma to add a tag, click a tag's × or press Backspace on an empty input to remove the last one. suggestions filters down as you type and excludes tags already added; without it the field is a plain tag editor.",
  views: [
    {
      id: "empty",
      name: "No tags",
      render: () => <TagsFieldView label="Tags" />,
    },
    {
      id: "with-tags",
      name: "With tags",
      render: () => (
        <TagsFieldView label="Tags" initialTags={["Gift", "Priority"]} />
      ),
    },
    {
      id: "with-suggestions",
      name: "With suggestions",
      render: () => (
        <TagsFieldView
          label="Tags"
          initialTags={["Gift"]}
          suggestions={suggestions}
        />
      ),
    },
    {
      id: "error",
      name: "With an error",
      render: () => <TagsFieldView label="Tags" error="Add at least one tag" />,
    },
    {
      id: "disabled",
      name: "Disabled",
      render: () => (
        <TagsFieldView label="Tags" initialTags={["Archived"]} disabled />
      ),
    },
  ],
}
