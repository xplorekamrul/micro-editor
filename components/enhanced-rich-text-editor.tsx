"use client"

import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import FontFamily from "@tiptap/extension-font-family"
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import Underline from "@tiptap/extension-underline"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import TableCell from "@tiptap/extension-table-cell"
import Image from "@tiptap/extension-image"
import ListItem from "@tiptap/extension-list-item"
import { FontSize } from "./font-size-extension"
import { MathExtension } from "./math-extension"
import { IndentExtension } from "./indent-extension"

import EnhancedEditorToolbar from "./enhanced-editor-toolbar"
import MultiPageEditor from "./multi-page-editor"
import ErrorBoundary from "./error-boundary"
import { useState } from "react"

const EnhancedRichTextEditor = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: "list-item",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle.configure({
        HTMLAttributes: {
          class: "text-style",
        },
      }),
      FontSize.configure({
        types: ["textStyle"],
      }),
      Color.configure({
        types: ["textStyle"],
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: "highlight",
        },
      }),
      FontFamily.configure({
        types: ["textStyle"],
      }),
      Underline.configure({
        HTMLAttributes: {
          class: "underline",
        },
      }),
      Superscript,
      Subscript,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "table",
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        HTMLAttributes: {
          class: "editor-image",
        },
        allowBase64: true,
      }),
      MathExtension,
      IndentExtension.configure({
        types: ["paragraph", "heading"],
        minLevel: 0,
        maxLevel: 8,
      }),
    ],
    content: `
      <h1>Microsoft Word-like Rich Text Editor</h1>
      <p>Welcome to a comprehensive rich text editor with Microsoft Word-like functionality.</p>
      
      <h2>🎨 Advanced Color Features</h2>
      <p>This editor includes <span style="color: #FF0000;">comprehensive text coloring</span> and <mark style="background-color: #FFFF00;">highlighting capabilities</mark> similar to Microsoft Word.</p>
      
      <h2>📄 Multi-Page Support</h2>
      <p>Create and manage multiple pages within a single document. Each page maintains its own content and can be easily navigated using the sidebar.</p>
      
      <h2>📊 Advanced Table Features</h2>
      <p>Insert and format tables with Microsoft Word-like functionality:</p>
      
      <table>
        <tbody>
          <tr>
            <th style="background-color: #f8f9fa; font-weight: bold;">Feature</th>
            <th style="background-color: #f8f9fa; font-weight: bold;">Description</th>
            <th style="background-color: #f8f9fa; font-weight: bold;">Status</th>
          </tr>
          <tr>
            <td>Visual Table Insertion</td>
            <td>Click and drag to select table size</td>
            <td style="color: #00B050;">✓ Available</td>
          </tr>
          <tr>
            <td>Table Styles</td>
            <td>Pre-designed table formatting options</td>
            <td style="color: #00B050;">✓ Available</td>
          </tr>
          <tr>
            <td>Border Controls</td>
            <td>Customize table and cell borders</td>
            <td style="color: #00B050;">✓ Available</td>
          </tr>
          <tr>
            <td>Cell Alignment</td>
            <td>Align content within table cells</td>
            <td style="color: #00B050;">✓ Available</td>
          </tr>
        </tbody>
      </table>
      
      <h2>🔧 Key Features</h2>
      <ul>
        <li><strong>Word-like Color Picker:</strong> Theme colors, standard colors, and recent colors</li>
        <li><strong>Advanced Highlighting:</strong> Multiple highlight colors with easy removal</li>
        <li><strong>Multi-Page Documents:</strong> Create, manage, and navigate between pages</li>
        <li><strong>Professional Tables:</strong> Insert, style, and format tables like in Word</li>
        <li><strong>Mathematical Equations:</strong> Insert and edit mathematical expressions</li>
        <li><strong>Drawing Tools:</strong> Create diagrams and illustrations</li>
        <li><strong>Export Options:</strong> Save in multiple formats</li>
      </ul>
      
      <h2>🚀 Getting Started</h2>
      <p>Use the toolbar above to access all features. The color tools work just like Microsoft Word - select text and choose colors from the dropdown menus. Create new pages using the sidebar, and insert tables using the visual table selector.</p>
    `,
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[500px] p-8",
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
              case "s":
                event.preventDefault()
                return true
              case "z":
                if (event.shiftKey) {
                  event.preventDefault()
                  editor?.chain().focus().redo().run()
                } else {
                  event.preventDefault()
                  editor?.chain().focus().undo().run()
                }
                return true
            }
          }
          return false
        },
      },
    },
    onError: (error) => {
      console.error("Editor error:", error)
    },
  })

  if (!editor) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Microsoft Word-like Editor...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className={`bg-white rounded-lg shadow-lg ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
        <EnhancedEditorToolbar editor={editor} isFullscreen={isFullscreen} setIsFullscreen={setIsFullscreen} />
        <div className={`border-t ${isFullscreen ? "h-full overflow-hidden" : ""}`}>
          <MultiPageEditor editor={editor} isFullscreen={isFullscreen} />
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default EnhancedRichTextEditor
