"use client"

import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Undo,
  Redo,
  Superscript,
  Subscript,
  FileDown,
  Maximize,
  Minimize,
  Paintbrush,
  Table,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import MathEquationEditor from "./math-equation-editor"
import ExportDialog from "./export-dialog"
import DrawingTool from "./drawing-tool"
import WordLikeColorToolbar from "./word-like-color-toolbar"
import ComprehensiveTableCreator from "./comprehensive-table-creator"

interface EnhancedEditorToolbarProps {
  editor: Editor
  isFullscreen: boolean
  setIsFullscreen: (fullscreen: boolean) => void
}

const EnhancedEditorToolbar = ({ editor, isFullscreen, setIsFullscreen }: EnhancedEditorToolbarProps) => {
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showDrawingTool, setShowDrawingTool] = useState(false)
  const [showTableCreator, setShowTableCreator] = useState(false)

  const fontFamilies = [
    { value: "Inter", label: "Inter" },
    { value: "Arial", label: "Arial" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Cambria Math", label: "Cambria Math" },
    { value: "Georgia", label: "Georgia" },
    { value: "Helvetica", label: "Helvetica" },
    { value: "Courier New", label: "Courier New" },
    { value: "Verdana", label: "Verdana" },
  ]

  const fontSizes = [
    "8px",
    "9px",
    "10px",
    "11px",
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "28px",
    "32px",
    "36px",
    "48px",
    "72px",
  ]

  const handleAction = (action: () => void, actionName: string) => {
    try {
      action()
    } catch (error) {
      console.error(`Error performing ${actionName}:`, error)
    }
  }

  const handleIndent = () => {
    try {
      if (!editor) return

      if (editor.isActive("listItem")) {
        const result = editor.chain().focus().sinkListItem("listItem").run()
        if (!result) {
          console.warn("Could not indent list item")
        }
      } else {
        const result = editor.chain().focus().indent().run()
        if (!result) {
          console.warn("Could not indent content")
        }
      }
    } catch (error) {
      console.error("Error indenting:", error)
    }
  }

  const handleOutdent = () => {
    try {
      if (!editor) return

      if (editor.isActive("listItem")) {
        const result = editor.chain().focus().liftListItem("listItem").run()
        if (!result) {
          console.warn("Could not outdent list item")
        }
      } else {
        const result = editor.chain().focus().outdent().run()
        if (!result) {
          console.warn("Could not outdent content")
        }
      }
    } catch (error) {
      console.error("Error outdenting:", error)
    }
  }

  return (
    <div className="border-b bg-gray-50 p-2">
      <div className="flex flex-wrap items-center gap-1">
        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAction(() => editor.chain().focus().undo().run(), "undo")}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAction(() => editor.chain().focus().redo().run(), "redo")}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Font Family */}
        <Select
          value={editor.getAttributes("textStyle").fontFamily || "Inter"}
          onValueChange={(value) => {
            try {
              if (value === "unset") {
                editor.chain().focus().unsetFontFamily().run()
              } else {
                editor.chain().focus().setFontFamily(value).run()
              }
            } catch (error) {
              console.error("Error setting font family:", error)
            }
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Font Size */}
        <Select
          onValueChange={(value) => {
            try {
              editor.chain().focus().setFontSize(value).run()
            } catch (error) {
              console.error("Error setting font size:", error)
            }
          }}
        >
          <SelectTrigger className="w-16">
            <SelectValue placeholder="14px" />
          </SelectTrigger>
          <SelectContent>
            {fontSizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6" />

        {/* Text Formatting */}
        <Button
          variant={editor.isActive("bold") ? "default" : "ghost"}
          size="sm"
          onClick={() => handleAction(() => editor.chain().focus().toggleBold().run(), "bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("italic") ? "default" : "ghost"}
          size="sm"
          onClick={() => handleAction(() => editor.chain().focus().toggleItalic().run(), "italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("underline") ? "default" : "ghost"}
          size="sm"
          onClick={() => handleAction(() => editor.chain().focus().toggleUnderline().run(), "underline")}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("strike") ? "default" : "ghost"}
          size="sm"
          onClick={() => handleAction(() => editor.chain().focus().toggleStrike().run(), "strikethrough")}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        {/* Superscript/Subscript */}
        <Button
          variant={editor.isActive("superscript") ? "default" : "ghost"}
          size="sm"
          onClick={() => handleAction(() => editor.chain().focus().toggleSuperscript().run(), "superscript")}
          title="Superscript"
        >
          <Superscript className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("subscript") ? "default" : "ghost"}
          size="sm"
          onClick={() => handleAction(() => editor.chain().focus().toggleSubscript().run(), "subscript")}
          title="Subscript"
        >
          <Subscript className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Word-like Color Tools */}
        <WordLikeColorToolbar editor={editor} />

        <Separator orientation="vertical" className="h-6" />

        {/* Alignment */}
        <Button
          variant={editor.isActive({ textAlign: "left" }) ? "default" : "ghost"}
          size="sm"
          onClick={() => handleAction(() => editor.chain().focus().setTextAlign("left").run(), "align left")}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: "center" }) ? "default" : "ghost"}
          size="sm"
          onClick={() => handleAction(() => editor.chain().focus().setTextAlign("center").run(), "align center")}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: "right" }) ? "default" : "ghost"}
          size="sm"
          onClick={() => handleAction(() => editor.chain().focus().setTextAlign("right").run(), "align right")}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: "justify" }) ? "default" : "ghost"}
          size="sm"
          onClick={() => handleAction(() => editor.chain().focus().setTextAlign("justify").run(), "align justify")}
          title="Align Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <Button
          variant={editor.isActive("bulletList") ? "default" : "ghost"}
          size="sm"
          onClick={() => handleAction(() => editor.chain().focus().toggleBulletList().run(), "bullet list")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("orderedList") ? "default" : "ghost"}
          size="sm"
          onClick={() => handleAction(() => editor.chain().focus().toggleOrderedList().run(), "ordered list")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        {/* Indentation */}
        <Button variant="ghost" size="sm" onClick={handleIndent} title="Indent">
          <Indent className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleOutdent} title="Outdent">
          <Outdent className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Comprehensive Table Creator */}
        <Button variant="ghost" size="sm" onClick={() => setShowTableCreator(true)} title="Insert Table">
          <Table className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Math Equation Editor */}
        <MathEquationEditor editor={editor} />

        <Separator orientation="vertical" className="h-6" />

        {/* Drawing Tool */}
        <Button variant="ghost" size="sm" onClick={() => setShowDrawingTool(true)} title="Drawing Tool">
          <Paintbrush className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Export */}
        <Button variant="ghost" size="sm" onClick={() => setShowExportDialog(true)} title="Export Document">
          <FileDown className="h-4 w-4" />
        </Button>

        {/* Fullscreen */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>

      {/* Table Creator Dialog */}
      <ComprehensiveTableCreator editor={editor} isOpen={showTableCreator} onClose={() => setShowTableCreator(false)} />

      {/* Dialogs */}
      <ExportDialog editor={editor} isOpen={showExportDialog} onClose={() => setShowExportDialog(false)} />
      <DrawingTool editor={editor} isOpen={showDrawingTool} onClose={() => setShowDrawingTool(false)} />
    </div>
  )
}

export default EnhancedEditorToolbar
