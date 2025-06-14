import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import EnhancedMathNodeView from "./enhanced-math-node-view"

export interface MathOptions {
  HTMLAttributes: Record<string, any>
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    math: {
      setMath: (latex: string) => ReturnType
      setBlockMath: (latex: string) => ReturnType
    }
  }
}

export const MathExtension = Node.create<MathOptions>({
  name: "math",

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  group: "inline",

  inline: true,

  atom: true,

  addAttributes() {
    return {
      latex: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-latex"),
        renderHTML: (attributes) => ({
          "data-latex": attributes.latex,
        }),
      },
      display: {
        default: false,
        parseHTML: (element) => element.getAttribute("data-display") === "true",
        renderHTML: (attributes) => ({
          "data-display": attributes.display ? "true" : "false",
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "span[class=math-equation]",
        getAttrs: (element) => ({
          latex: element.getAttribute("data-latex") || element.textContent,
          display: element.getAttribute("data-display") === "true",
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: "math-equation",
      }),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(EnhancedMathNodeView)
  },

  addCommands() {
    return {
      setMath:
        (latex: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { latex, display: false },
          })
        },
      setBlockMath:
        (latex: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { latex, display: true },
          })
        },
    }
  },
})
