# SixthGear Docs style guide

## Voice

- Write directly to the reader using "you."
- Use active voice.
- Sound like an experienced colleague explaining the system.
- Stay professional, calm, practical, and specific.
- Explain a technical term when a non-developer may encounter it.
- Use the exact interface labels shown in Shopify, Sanity, Vercel, GitHub, and the SixthGear website.

## Avoid AI-style writing

Do not use: "seamlessly," "effortlessly," "robust," "powerful solution," "leverage," "unlock," "delve into," "navigate the complexities," "comprehensive suite," "it is important to note," "in order to," "simply," "as mentioned earlier," "in conclusion," "whether you are," or "this documentation aims to."

Do not praise ordinary functionality, repeat the introduction in a conclusion, add generic summaries, use vague marketing language, or add text only to make a page longer.

## Structure

- Use sentence case for headings.
- Do not add a manual H1 inside an MDX page. The frontmatter title supplies it.
- Keep most sentences below 25 words.
- Keep paragraphs between two and four sentences.
- Cover one main task or reference subject per page.
- Use numbered steps for procedures and tables for reference material.
- Use code blocks only for exact commands, syntax, or structures readers need.
- Put paths, commands, variables, file names, and identifiers in backticks.
- Bold exact interface labels such as **Products**, **Save**, and **Settings**.

## Page types

### How-to guide

Include purpose, prerequisites, steps, verification, common problems, and related tasks.

### Reference

Prioritize exact fields, ownership, dependencies, defaults, statuses, and edge cases in tables.

### Explanation

Explain how and why the system works. Do not turn architecture or caching pages into broad tutorials.

## Components

Use `<Steps>` for sequences, `<Warning>` for destructive or sensitive actions, `<Tip>` for practical shortcuts, and `<Info>` for definitions. Use cards only for real navigation and Mermaid only when relationships are clearer visually.
