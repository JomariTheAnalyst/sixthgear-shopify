import React from "react"

import { toRootRelativeHref } from "@lib/util/href"

type ShopifyRichTextNode = {
  type: string
  children?: ShopifyRichTextNode[]
  value?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  url?: string
  level?: number
  listType?: "ordered" | "unordered"
}

function collectText(node: ShopifyRichTextNode | undefined): string {
  if (!node) {
    return ""
  }

  if (node.type === "text") {
    return typeof node.value === "string" ? node.value : ""
  }

  return (node.children || []).map((child) => collectText(child)).join("")
}

function parseShopifyRichText(raw: string | null | undefined): ShopifyRichTextNode | null {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as ShopifyRichTextNode

    if (!parsed || parsed.type !== "root") {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

function renderTextNode(node: ShopifyRichTextNode, key: string): React.ReactNode {
  if (typeof node.value !== "string" || node.value.length === 0) {
    return null
  }

  let content: React.ReactNode = node.value

  if (node.bold) content = <strong>{content}</strong>
  if (node.italic) content = <em>{content}</em>
  if (node.underline) content = <u>{content}</u>
  if (node.strikethrough) content = <s>{content}</s>
  if (node.code) content = <code>{content}</code>

  return <React.Fragment key={key}>{content}</React.Fragment>
}

function renderNodes(nodes: ShopifyRichTextNode[] | undefined, parentKey: string): React.ReactNode[] {
  if (!Array.isArray(nodes)) {
    return []
  }

  return nodes.map((node, index) => renderNode(node, `${parentKey}-${index}`)).filter(Boolean) as React.ReactNode[]
}

function renderNode(node: ShopifyRichTextNode, key: string): React.ReactNode {
  switch (node.type) {
    case "root":
      return <React.Fragment key={key}>{renderNodes(node.children, key)}</React.Fragment>

    case "paragraph":
      return <p key={key}>{renderNodes(node.children, key)}</p>

    case "heading": {
      const level = Math.min(Math.max(node.level || 2, 1), 6)
      return React.createElement(`h${level}`, { key }, renderNodes(node.children, key))
    }

    case "list": {
      const ListTag = node.listType === "ordered" ? "ol" : "ul"
      return React.createElement(ListTag, { key }, renderNodes(node.children, key))
    }

    case "list-item":
      return <li key={key}>{renderNodes(node.children, key)}</li>

    case "text":
      return renderTextNode(node, key)

    case "link": {
      const href = typeof node.url === "string" ? toRootRelativeHref(node.url) : "#"
      const isExternal = /^https?:\/\//i.test(href)

      return (
        <a
          key={key}
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {renderNodes(node.children, key)}
        </a>
      )
    }

    case "image":
      return null

    default:
      return null
  }
}

export function renderShopifyRichText(
  raw: string | null | undefined
): React.ReactNode {
  const parsed = parseShopifyRichText(raw)

  if (!parsed) {
    return null
  }

  return <div className="prose prose-sm max-w-none">{renderNodes(parsed.children, "root")}</div>
}

export function extractShopifyRichTextRows(
  raw: string | null | undefined
): string[] {
  const parsed = parseShopifyRichText(raw)

  if (!parsed) {
    return []
  }

  const rows: string[] = []

  const visit = (node: ShopifyRichTextNode) => {
    if (node.type === "list-item" || node.type === "paragraph" || node.type === "heading") {
      const text = collectText(node).trim()

      if (text) {
        rows.push(text)
      }
    }

    ;(node.children || []).forEach((child) => visit(child))
  }

  ;(parsed.children || []).forEach((child) => visit(child))

  return rows
}
