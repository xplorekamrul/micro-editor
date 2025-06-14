import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import EnhancedTableView from "./enhanced-table-view"

export interface EnhancedTableOptions {
  HTMLAttributes: Record<string, any>
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    enhancedTable: {
      insertEnhancedTable: (options: { rows: number; cols: number }) => ReturnType
      mergeCells: () => ReturnType
      splitCell: () => ReturnType
      setCellBackgroundColor: (color: string) => ReturnType
      setCellBorderStyle: (style: string) => ReturnType
    }
  }
}

export const EnhancedTableExtension = Node.create<EnhancedTableOptions>({
  name: "enhancedTable",

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  group: "block",

  content: "enhancedTableRow+",

  tableRole: "table",

  isolating: true,

  addAttributes() {
    return {
      rows: {
        default: 3,
      },
      cols: {
        default: 3,
      },
      tableStyle: {
        default: {},
        parseHTML: (element) => {
          const style = element.getAttribute("data-table-style")
          return style ? JSON.parse(style) : {}
        },
        renderHTML: (attributes) => ({
          "data-table-style": JSON.stringify(attributes.tableStyle),
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "table[data-type='enhanced-table']",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "table",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "enhanced-table",
        class: "enhanced-table",
      }),
      ["tbody", 0],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(EnhancedTableView)
  },

  addCommands() {
    return {
      insertEnhancedTable:
        ({ rows, cols }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { rows, cols },
            content: Array.from({ length: rows }, () => ({
              type: "enhancedTableRow",
              content: Array.from({ length: cols }, () => ({
                type: "enhancedTableCell",
                content: [{ type: "paragraph" }],
              })),
            })),
          })
        },
      mergeCells: () => () => {
        // Implementation for merging cells
        return true
      },
      splitCell: () => () => {
        // Implementation for splitting cells
        return true
      },
      setCellBackgroundColor: (color) => () => {
        // Implementation for setting cell background color
        return true
      },
      setCellBorderStyle: (style) => () => {
        // Implementation for setting cell border style
        return true
      },
    }
  },
})

export const EnhancedTableRow = Node.create({
  name: "enhancedTableRow",

  content: "enhancedTableCell+",

  tableRole: "row",

  parseHTML() {
    return [{ tag: "tr" }]
  },

  renderHTML({ HTMLAttributes }) {
    return ["tr", mergeAttributes(HTMLAttributes), 0]
  },
})

export const EnhancedTableCell = Node.create({
  name: "enhancedTableCell",

  content: "block+",

  addAttributes() {
    return {
      colspan: {
        default: 1,
      },
      rowspan: {
        default: 1,
      },
      colwidth: {
        default: null,
        parseHTML: (element) => {
          const colwidth = element.getAttribute("data-colwidth")
          const value = colwidth ? [Number.parseInt(colwidth, 10)] : null
          return value
        },
        renderHTML: (attributes) => {
          return attributes.colwidth ? { "data-colwidth": attributes.colwidth } : {}
        },
      },
      cellStyle: {
        default: {},
        parseHTML: (element) => {
          const style = element.getAttribute("data-cell-style")
          return style ? JSON.parse(style) : {}
        },
        renderHTML: (attributes) => ({
          "data-cell-style": JSON.stringify(attributes.cellStyle),
          style: Object.entries(attributes.cellStyle || {})
            .map(([key, value]) => `${key}: ${value}`)
            .join("; "),
        }),
      },
    }
  },

  tableRole: "cell",

  isolating: true,

  parseHTML() {
    return [{ tag: "td" }, { tag: "th" }]
  },

  renderHTML({ HTMLAttributes }) {
    return ["td", mergeAttributes(HTMLAttributes), 0]
  },
})
