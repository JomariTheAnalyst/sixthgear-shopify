import { defineArrayMember, defineField, defineType } from "sanity"

export default defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Post Title",
      type: "string",
      description:
        "Write the main title of the article. This appears at the top of the blog post and in article cards across the website. Keep it clear and easy to understand.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Page Link",
      type: "slug",
      description:
        'This creates the website link for the article. You can generate it from the post title. Use short, readable words such as "helmet-care-guide". Avoid spaces and special characters.',
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Short Summary",
      type: "text",
      rows: 3,
      description:
        "Write a short preview of the article. This appears on blog cards, homepage previews, and search results. Keep it to 1 to 2 short sentences.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featuredImage",
      title: "Main Article Image",
      type: "image",
      description:
        "Upload the main image for the article. This appears on the blog card and at the top of the article page. Use a clear, high-quality image that represents the story.",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Image Description",
          type: "string",
          description:
            "Optional short description of the image for accessibility and screen readers.",
        }),
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      description:
        "Choose the date this article should appear as published. This date is shown on the website and helps readers know when the article was posted.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "authorName",
      title: "Author Name",
      type: "string",
      description:
        'Write the name of the person or team credited for this article. For example, "SixthGearMoto Team".',
    }),
    defineField({
      name: "category",
      title: "Blog Category",
      type: "reference",
      description:
        "Choose the main category for this article. This helps organize blog posts and makes it easier for readers to browse related topics.",
      to: [{ type: "blogCategory" }],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      description:
        'Add optional keywords related to the article, such as "helmets", "maintenance", "riding tips", or "events". Tags help with organization but should be used sparingly.',
      of: [
        defineArrayMember({
          type: "string",
        }),
      ],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "body",
      title: "Article Content",
      type: "array",
      description:
        "Write the full article here. You can add headings, paragraphs, lists, links, and images inside the content. Keep the writing clear and helpful for riders.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Heading 4", value: "h4" },
          ],
          lists: [
            { title: "Bullet List", value: "bullet" },
            { title: "Numbered List", value: "number" },
          ],
          marks: {
            decorators: [],
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "Link Address",
                    type: "url",
                    description:
                      "Paste the page or website address you want readers to open.",
                    validation: (rule) =>
                      rule.uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          title: "Article Image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Image Description",
              type: "string",
              description:
                "Use this when you want to add an image inside the article, not as the main article image. Add a short description if needed.",
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seoTitle",
      title: "Search Result Title",
      type: "string",
      description:
        "Optional title for search engines and social previews. If left empty, the Post Title will be used. Keep it clear and under about 60 characters if possible.",
    }),
    defineField({
      name: "seoDescription",
      title: "Search Result Description",
      type: "text",
      rows: 3,
      description:
        "Optional short description for search engines. If left empty, the Short Summary will be used. Keep it helpful and around 1 to 2 sentences.",
    }),
    defineField({
      name: "socialImage",
      title: "Social Sharing Image",
      type: "image",
      description:
        "Optional image used when this article is shared on social media. If left empty, the Main Article Image will be used.",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "featured",
      title: "Show on Homepage",
      type: "boolean",
      description:
        "Turn this on if this article should be prioritized in homepage story sections. If turned off, the article can still appear on the main blog listing page.",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
      media: "featuredImage",
    },
    prepare(selection) {
      const subtitle = selection.subtitle
        ? new Date(selection.subtitle).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "Draft"

      return {
        title: selection.title,
        subtitle,
        media: selection.media,
      }
    },
  },
})
