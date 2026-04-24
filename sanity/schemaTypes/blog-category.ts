import { defineField, defineType } from "sanity"

export default defineType({
  name: "blogCategory",
  title: "Blog Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Category Name",
      type: "string",
      description:
        "Write the name of this article category. Examples: Riding Tips, Events, Product Guides, Maintenance, or Community Stories.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Page Link",
      type: "slug",
      description:
        "This creates the website-friendly link for the category. You can generate it from the category name and keep it short and readable.",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Category Description",
      type: "text",
      rows: 3,
      description:
        "Optional short explanation of what this category is about. This can be shown on category pages in the future.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
    },
  },
})
