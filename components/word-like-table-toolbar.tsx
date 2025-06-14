"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Table,
  ChevronDown,
  Plus,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Grid3X3,
  Merge,
  Split,
  RotateCcw,
  Trash2,
  Settings,
  Grid,
  Square,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Move,
  Columns,
  Rows,
} from "lucide-react"
import type { Editor } from "@tiptap/react"

interface WordLikeTableToolbarProps {
  editor: Editor
}

const WordLikeTableToolbar = ({ editor }: WordLikeTableToolbarProps) => {
  const [showTableMenu, setShowTableMenu] = useState(false)
  const [showTableDesign, setShowTableDesign] = useState(false)
  const [showTableLayout, setShowTableLayout] = useState(false)
  const [showCellProperties, setShowCellProperties] = useState(false)
  const [tableRows, setTableRows] = useState(3)
  const [tableCols, setTableCols] = useState(3)
  const [cellPadding, setCellPadding] = useState([8])
  const [cellSpacing, setCellSpacing] = useState([0])
  const [borderWidth, setBorderWidth] = useState([1])

  const tableStyles = [
    {
      name: "Plain Table",
      style: { border: "1px solid #000", backgroundColor: "#fff" },
      preview: "Simple black border",
    },
    {
      name: "Grid Table",
      style: { border: "2px solid #000", backgroundColor: "#f8f9fa" },
      preview: "Bold grid with light background",
    },
    {
      name: "Light Shading",
      style: { border: "1px solid #dee2e6", backgroundColor: "#f8f9fa" },
      preview: "Light gray shading",
    },
    {
      name: "Medium Shading",
      style: { border: "1px solid #adb5bd", backgroundColor: "#e9ecef" },
      preview: "Medium gray shading",
    },
    {
      name: "Dark Shading",
      style: { border: "1px solid #495057", backgroundColor: "#6c757d", color: "#fff" },
      preview: "Dark theme with white text",
    },
    {
      name: "Colorful Grid",
      style: { border: "2px solid #0d6efd", backgroundColor: "#cfe2ff" },
      preview: "Blue themed table",
    },
    {
      name: "Professional",
      style: { border: "1px solid #495057", backgroundColor: "#fff" },
      preview: "Clean professional look",
    },
    {
      name: "Minimal",
      style: { borderTop: "2px solid #000", borderBottom: "1px solid #dee2e6", backgroundColor: "#fff" },
      preview: "Minimal top/bottom borders",
    },
  ]

  const borderStyles = [
    { name: "All Borders", value: "all", icon: Grid },
    { name: "Outside Borders", value: "outside", icon: Square },
    { name: "Inside Borders", value: "inside", icon: Grid3X3 },
    { name: "Top Border", value: "top", icon: ArrowUp },
    { name: "Bottom Border", value: "bottom", icon: ArrowDown },
    { name: "Left Border", value: "left", icon: ArrowLeft },
    { name: "Right Border", value: "right", icon: ArrowRight },
    { name: "No Border", value: "none", icon: Square },
  ]

  const cellColors = [
    "#FFFFFF",
    "#F8F9FA",
    "#E9ECEF",
    "#DEE2E6",
    "#CED4DA",
    "#ADB5BD",
    "#6C757D",
    "#495057",
    "#343A40",
    "#212529",
    "#FFF3CD",
    "#FFEAA7",
    "#FDCB6E",
    "#E17055",
    "#D63031",
    "#74B9FF",
    "#0984E3",
    "#00B894",
    "#00CEC9",
    "#6C5CE7",
    "#A29BFE",
    "#FD79A8",
    "#FDCB6E",
    "#E84393",
  ]

  const alignmentOptions = [
    { name: "Left", value: "left", icon: AlignLeft },
    { name: "Center", value: "center", icon: AlignCenter },
    { name: "Right", value: "right", icon: AlignRight },
  ]

  const insertTable = () => {
    try {
      editor
        .chain()
        .focus()
        .insertTable({
          rows: tableRows,
          cols: tableCols,
          withHeaderRow: true,
        })
        .run()
      setShowTableMenu(false)
    } catch (error) {
      console.error("Error inserting table:", error)
    }
  }

  const handleTableAction = (action: () => boolean, actionName: string) => {
    try {
      const result = action()
      if (!result) {
        console.warn(`${actionName} action could not be performed`)
      }
    } catch (error) {
      console.error(`Error performing ${actionName}:`, error)
    }
  }

  const applyTableStyle = (style: any) => {
    try {
      // Apply style to current table
      // This would need custom table styling implementation
      console.log("Applying table style:", style)
      setShowTableDesign(false)
    } catch (error) {
      console.error("Error applying table style:", error)
    }
  }

  const setCellBackgroundColor = (color: string) => {
    try {
      // Apply background color to selected cells
      editor.chain().focus().run()
      console.log("Setting cell background color:", color)
    } catch (error) {
      console.error("Error setting cell background color:", error)
    }
  }

  const isInTable = () => {
    return editor.isActive("table")
  }

  return (
    <div className="flex items-center gap-1">
      {/* Insert Table */}
      <Popover open={showTableMenu} onOpenChange={setShowTableMenu}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" title="Insert Table">
            <Table className="h-4 w-4 mr-1" />
            Table
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Insert Table</h4>

              {/* Visual Table Selector */}
              <div className="mb-4">
                <div className="grid grid-cols-10 gap-1 p-2 border rounded bg-gray-50">
                  {Array.from({ length: 100 }, (_, i) => {
                    const row = Math.floor(i / 10) + 1
                    const col = (i % 10) + 1
                    const isSelected = row <= tableRows && col <= tableCols
                    return (
                      <div
                        key={i}
                        className={`w-4 h-4 border cursor-pointer transition-colors ${
                          isSelected ? "bg-blue-500 border-blue-600" : "bg-white border-gray-300 hover:bg-gray-100"
                        }`}
                        onMouseEnter={() => {
                          setTableRows(row)
                          setTableCols(col)
                        }}
                        onClick={insertTable}
                      />
                    )
                  })}
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  {tableRows} x {tableCols} Table
                </p>
              </div>

              {/* Manual Input */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="rows">Rows</Label>
                  <Input
                    id="rows"
                    type="number"
                    min="1"
                    max="20"
                    value={tableRows}
                    onChange={(e) => setTableRows(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="cols">Columns</Label>
                  <Input
                    id="cols"
                    type="number"
                    min="1"
                    max="20"
                    value={tableCols}
                    onChange={(e) => setTableCols(Number(e.target.value))}
                  />
                </div>
              </div>

              <Button onClick={insertTable} className="w-full">
                Insert Table
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Table Tools (only show when in table) */}
      {isInTable() && (
        <>
          <Separator orientation="vertical" className="h-6" />

          {/* Table Design */}
          <Popover open={showTableDesign} onOpenChange={setShowTableDesign}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" title="Table Design">
                <Palette className="h-4 w-4 mr-1" />
                Design
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[500px] p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Table Styles</h4>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {tableStyles.map((style, index) => (
                      <button
                        key={index}
                        className="p-3 border rounded hover:bg-gray-50 text-left transition-colors"
                        onClick={() => applyTableStyle(style.style)}
                      >
                        <div className="text-sm font-medium mb-1">{style.name}</div>
                        <div className="text-xs text-gray-600 mb-2">{style.preview}</div>
                        <div className="w-full h-6 rounded border" style={style.style} />
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Cell Background Colors</h4>
                  <div className="grid grid-cols-8 gap-1">
                    {cellColors.map((color, index) => (
                      <button
                        key={index}
                        className="w-8 h-8 border border-gray-300 hover:border-gray-500 transition-colors rounded"
                        style={{ backgroundColor: color }}
                        onClick={() => setCellBackgroundColor(color)}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Borders</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {borderStyles.map((border, index) => {
                      const Icon = border.icon
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="flex flex-col items-center gap-1 h-auto p-2"
                          onClick={() => console.log("Apply border:", border.value)}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-xs">{border.name}</span>
                        </Button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Table Layout */}
          <Popover open={showTableLayout} onOpenChange={setShowTableLayout}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" title="Table Layout">
                <Settings className="h-4 w-4 mr-1" />
                Layout
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Row Operations</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleTableAction(() => editor.chain().focus().addRowBefore().run(), "add row before")
                      }
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Insert Above
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleTableAction(() => editor.chain().focus().addRowAfter().run(), "add row after")
                      }
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Insert Below
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTableAction(() => editor.chain().focus().deleteRow().run(), "delete row")}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <Minus className="h-4 w-4" />
                      Delete Row
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log("Select row")}
                      className="flex items-center gap-2"
                    >
                      <Rows className="h-4 w-4" />
                      Select Row
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Column Operations</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleTableAction(() => editor.chain().focus().addColumnBefore().run(), "add column before")
                      }
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4 rotate-90" />
                      Insert Left
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleTableAction(() => editor.chain().focus().addColumnAfter().run(), "add column after")
                      }
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4 rotate-90" />
                      Insert Right
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleTableAction(() => editor.chain().focus().deleteColumn().run(), "delete column")
                      }
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <Minus className="h-4 w-4 rotate-90" />
                      Delete Column
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log("Select column")}
                      className="flex items-center gap-2"
                    >
                      <Columns className="h-4 w-4" />
                      Select Column
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Cell Operations</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTableAction(() => editor.chain().focus().mergeCells().run(), "merge cells")}
                      className="flex items-center gap-2"
                    >
                      <Merge className="h-4 w-4" />
                      Merge Cells
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTableAction(() => editor.chain().focus().splitCell().run(), "split cell")}
                      className="flex items-center gap-2"
                    >
                      <Split className="h-4 w-4" />
                      Split Cell
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Table Operations</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleTableAction(() => editor.chain().focus().deleteTable().run(), "delete table")
                      }
                      className="w-full flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Table
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Cell Properties */}
          <Popover open={showCellProperties} onOpenChange={setShowCellProperties}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" title="Cell Properties">
                <Grid3X3 className="h-4 w-4 mr-1" />
                Properties
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Cell Alignment</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {alignmentOptions.map((align, index) => {
                      const Icon = align.icon
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => editor.chain().focus().setTextAlign(align.value).run()}
                          className="flex items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {align.name}
                        </Button>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Cell Padding: {cellPadding[0]}px</h4>
                  <Slider
                    value={cellPadding}
                    onValueChange={setCellPadding}
                    min={0}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-3">Cell Spacing: {cellSpacing[0]}px</h4>
                  <Slider
                    value={cellSpacing}
                    onValueChange={setCellSpacing}
                    min={0}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-3">Border Width: {borderWidth[0]}px</h4>
                  <Slider
                    value={borderWidth}
                    onValueChange={setBorderWidth}
                    min={0}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log("Auto-fit contents")}
                      className="w-full flex items-center gap-2"
                    >
                      <Move className="h-4 w-4" />
                      Auto-fit Contents
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log("Distribute rows evenly")}
                      className="w-full flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Distribute Rows Evenly
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log("Distribute columns evenly")}
                      className="w-full flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4 rotate-90" />
                      Distribute Columns Evenly
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </>
      )}
    </div>
  )
}

export default WordLikeTableToolbar
