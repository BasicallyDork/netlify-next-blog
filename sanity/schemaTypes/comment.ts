import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const comment = defineType({
  name: "comment",
  title: "Comment",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "blog",
      type: "reference",
      to: { type: "blog" },
    }),
    defineField({
      name: "userID",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "comment",
      type: "string",
    }),
  ],
});
