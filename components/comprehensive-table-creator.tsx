"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Table, Grid, Palette, Settings, Eye, Check, RotateCcw } from "lucide-react"
import type { Editor } from "@tiptap/react"

interface ComprehensiveTableCreatorProps {
  editor: Editor
  isOpen: boolean
  onClose: () => void
}

interface TableStyle {
  id: string
  name: string
  description: string
  headerStyle: React.CSSProperties
  cellStyle: React.CSSProperties
  tableStyle: React.CSSProperties
  preview: string
}

const ComprehensiveTableCreator = ({ editor, isOpen, onClose }: ComprehensiveTableCreatorProps) => {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [hasHeader, setHasHeader] = useState(true)
  const [tableWidth, setTableWidth] = useState([100])
  const [cellPadding, setCellPadding] = useState([8])
  const [borderWidth, setBorderWidth] = useState([1])
  const [selectedStyle, setSelectedStyle] = useState("plain")
  const [customBorderColor, setCustomBorderColor] = useState("#000000")
  const [customBackgroundColor, setCustomBackgroundColor] = useState("#ffffff")

  const tableStyles: TableStyle[] = [
    {
      id: "plain",
      name: "Plain Table",
      description: "Simple table with basic borders",
      headerStyle: { backgroundColor: "#f8f9fa", fontWeight: "bold", border: "1px solid #dee2e6" },
      cellStyle: { border: "1px solid #dee2e6", backgroundColor: "#ffffff" },
      tableStyle: { borderCollapse: "collapse", width: "100%" },
      preview: "Basic black borders on white background",
    },
    {
      id: "modern",
      name: "Modern Grid",
      description: "Clean modern design with subtle borders",
      headerStyle: { backgroundColor: "#f1f3f4", fontWeight: "bold", border: "1px solid #e8eaed", color: "#202124" },
      cellStyle: { border: "1px solid #e8eaed", backgroundColor: "#ffffff" },
      tableStyle: { borderCollapse: "collapse", width: "100%", borderRadius: "8px", overflow: "hidden" },
      preview: "Modern design with rounded corners",
    },
    {
      id: "professional",
      name: "Professional",
      description: "Corporate-style table with header emphasis",
      headerStyle: { backgroundColor: "#2563eb", color: "#ffffff", fontWeight: "bold", border: "1px solid #1d4ed8" },
      cellStyle: { border: "1px solid #d1d5db", backgroundColor: "#ffffff" },
      tableStyle: { borderCollapse: "collapse", width: "100%" },
      preview: "Blue header with professional styling",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Clean design with minimal borders",
      headerStyle: { borderBottom: "2px solid #374151", fontWeight: "bold", backgroundColor: "#ffffff" },
      cellStyle: { borderBottom: "1px solid #e5e7eb", backgroundColor: "#ffffff" },
      tableStyle: { borderCollapse: "collapse", width: "100%" },
      preview: "Minimal horizontal lines only",
    },
    {
      id: "striped",
      name: "Striped Rows",
      description: "Alternating row colors for better readability",
      headerStyle: { backgroundColor: "#f3f4f6", fontWeight: "bold", border: "1px solid #d1d5db" },
      cellStyle: { border: "1px solid #d1d5db", backgroundColor: "#ffffff" },
      tableStyle: { borderCollapse: "collapse", width: "100%" },
      preview: "Alternating row background colors",
    },
    {
      id: "colorful",
      name: "Colorful",
      description: "Vibrant design with colored accents",
      headerStyle: { backgroundColor: "#10b981", color: "#ffffff", fontWeight: "bold", border: "1px solid #059669" },
      cellStyle: { border: "1px solid #d1fae5", backgroundColor: "#ffffff" },
      tableStyle: { borderCollapse: "collapse", width: "100%" },
      preview: "Green theme with colored borders",
    },
    {
      id: "dark",
      name: "Dark Theme",
      description: "Dark background with light text",
      headerStyle: { backgroundColor: "#1f2937", color: "#ffffff", fontWeight: "bold", border: "1px solid #374151" },
      cellStyle: { border: "1px solid #4b5563", backgroundColor: "#374151", color: "#ffffff" },
      tableStyle: { borderCollapse: "collapse", width: "100%" },
      preview: "Dark theme for modern interfaces",
    },
    {
      id: "elegant",
      name: "Elegant",
      description: "Sophisticated design with subtle shadows",
      headerStyle: {
        backgroundColor: "#f9fafb",
        fontWeight: "bold",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      },
      cellStyle: { border: "1px solid #e5e7eb", backgroundColor: "#ffffff" },
      tableStyle: { borderCollapse: "collapse", width: "100%", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
      preview: "Elegant design with subtle shadows",
    },
  ]

  const borderColors = [
    "#000000",
    "#374151",
    "#6b7280",
    "#9ca3af",
    "#d1d5db",
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#10b981",
    "#06b6d4",
    "#0ea5e9",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
  ]

  const backgroundColors = [
    "#ffffff",
    "#f9fafb",
    "#f3f4f6",
    "#e5e7eb",
    "#d1d5db",
    "#fef2f2",
    "#fef7ed",
    "#fffbeb",
    "#fefce8",
    "#f7fee7",
    "#f0fdf4",
    "#ecfdf5",
    "#f0fdfa",
    "#ecfeff",
    "#eff6ff",
    "#eef2ff",
    "#f5f3ff",
    "#faf5ff",
    "#fdf4ff",
    "#fdf2f8",
  ]

  const generatePreviewTable = () => {
    const style = tableStyles.find((s) => s.id === selectedStyle) || tableStyles[0]
    const previewRows = Math.min(rows, 4)
    const previewCols = Math.min(cols, 4)

    return (
      <div className="border rounded-lg p-4 bg-gray-50">
        <table
          style={{
            ...style.tableStyle,
            fontSize: "12px",
            width: `${tableWidth[0]}%`,
          }}
        >
          <tbody>
            {hasHeader && (
              <tr>
                {Array.from({ length: previewCols }, (_, i) => (
                  <th
                    key={i}
                    style={{
                      ...style.headerStyle,
                      padding: `${cellPadding[0]}px`,
                      borderWidth: `${borderWidth[0]}px`,
                      borderColor: customBorderColor,
                    }}
                  >
                    Header {i + 1}
                  </th>
                ))}
              </tr>
            )}
            {Array.from({ length: previewRows - (hasHeader ? 1 : 0) }, (_, i) => (
              <tr key={i}>
                {Array.from({ length: previewCols }, (_, j) => (
                  <td
                    key={j}
                    style={{
                      ...style.cellStyle,
                      padding: `${cellPadding[0]}px`,
                      borderWidth: `${borderWidth[0]}px`,
                      borderColor: customBorderColor,
                      backgroundColor:
                        selectedStyle === "striped" && i % 2 === 1 ? "#f9fafb" : style.cellStyle.backgroundColor,
                    }}
                  >
                    Cell {i + 1}-{j + 1}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Preview: {previewRows} x {previewCols} table
          {rows > 4 || cols > 4 ? ` (showing first ${previewRows}x${previewCols})` : ""}
        </p>
      </div>
    )
  }

  const insertTable = () => {
    try {
      const style = tableStyles.find((s) => s.id === selectedStyle) || tableStyles[0]

      // Create table HTML with applied styles
      let tableHTML = `<table style="border-collapse: collapse; width: ${tableWidth[0]}%;">`

      // Add header row if enabled
      if (hasHeader) {
        tableHTML += "<tr>"
        for (let j = 0; j < cols; j++) {
          tableHTML += `<th style="border: ${borderWidth[0]}px solid ${customBorderColor}; padding: ${cellPadding[0]}px; background-color: ${style.headerStyle.backgroundColor}; font-weight: bold;">Header ${j + 1}</th>`
        }
        tableHTML += "</tr>"
      }

      // Add data rows
      const dataRows = hasHeader ? rows - 1 : rows
      for (let i = 0; i < dataRows; i++) {
        tableHTML += "<tr>"
        for (let j = 0; j < cols; j++) {
          const bgColor =
            selectedStyle === "striped" && i % 2 === 1
              ? "#f9fafb"
              : style.cellStyle.backgroundColor || customBackgroundColor
          tableHTML += `<td style="border: ${borderWidth[0]}px solid ${customBorderColor}; padding: ${cellPadding[0]}px; background-color: ${bgColor};">Cell ${i + 1}-${j + 1}</td>`
        }
        tableHTML += "</tr>"
      }

      tableHTML += "</table>"

      // Insert the table
      editor.chain().focus().insertContent(tableHTML).run()
      onClose()
    } catch (error) {
      console.error("Error inserting table:", error)
    }
  }

  const resetToDefaults = () => {
    setRows(3)
    setCols(3)
    setHasHeader(true)
    setTableWidth([100])
    setCellPadding([8])
    setBorderWidth([1])
    setSelectedStyle("plain")
    setCustomBorderColor("#000000")
    setCustomBackgroundColor("#ffffff")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Table className="h-5 w-5" />
            Create Table
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="style" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Style
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Advanced
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Table Dimensions</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rows">Number of Rows</Label>
                    <Input
                      id="rows"
                      type="number"
                      min="1"
                      max="50"
                      value={rows}
                      onChange={(e) => setRows(Math.max(1, Math.min(50, Number(e.target.value))))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cols">Number of Columns</Label>
                    <Input
                      id="cols"
                      type="number"
                      min="1"
                      max="20"
                      value={cols}
                      onChange={(e) => setCols(Math.max(1, Math.min(20, Number(e.target.value))))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasHeader"
                    checked={hasHeader}
                    onChange={(e) => setHasHeader(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="hasHeader">Include header row</Label>
                </div>

                <div>
                  <Label>Table Width: {tableWidth[0]}%</Label>
                  <Slider
                    value={tableWidth}
                    onValueChange={setTableWidth}
                    min={25}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Quick Setup</h3>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setRows(2)
                      setCols(2)
                      setHasHeader(true)
                    }}
                    className="h-auto p-3 flex flex-col items-center"
                  >
                    <div className="text-sm font-medium">2x2</div>
                    <div className="text-xs text-gray-500">Small table</div>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setRows(3)
                      setCols(3)
                      setHasHeader(true)
                    }}
                    className="h-auto p-3 flex flex-col items-center"
                  >
                    <div className="text-sm font-medium">3x3</div>
                    <div className="text-xs text-gray-500">Standard</div>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setRows(5)
                      setCols(4)
                      setHasHeader(true)
                    }}
                    className="h-auto p-3 flex flex-col items-center"
                  >
                    <div className="text-sm font-medium">5x4</div>
                    <div className="text-xs text-gray-500">Data table</div>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setRows(10)
                      setCols(6)
                      setHasHeader(true)
                    }}
                    className="h-auto p-3 flex flex-col items-center"
                  >
                    <div className="text-sm font-medium">10x6</div>
                    <div className="text-xs text-gray-500">Large table</div>
                  </Button>
                </div>

                <Separator />

                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    <strong>Current selection:</strong> {rows} rows × {cols} columns
                  </p>
                  <p>
                    <strong>Total cells:</strong> {rows * cols}
                  </p>
                  {hasHeader && (
                    <p>
                      <strong>Header row:</strong> Included
                    </p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Predefined Styles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tableStyles.map((style) => (
                  <Card
                    key={style.id}
                    className={`cursor-pointer transition-all ${
                      selectedStyle === style.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedStyle(style.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{style.name}</h4>
                        {selectedStyle === style.id && <Check className="h-4 w-4 text-blue-600" />}
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{style.description}</p>

                      {/* Mini preview */}
                      <div className="border rounded overflow-hidden">
                        <table style={{ ...style.tableStyle, fontSize: "10px", width: "100%" }}>
                          <tbody>
                            <tr>
                              <th style={{ ...style.headerStyle, padding: "4px" }}>Header</th>
                              <th style={{ ...style.headerStyle, padding: "4px" }}>Header</th>
                            </tr>
                            <tr>
                              <td style={{ ...style.cellStyle, padding: "4px" }}>Cell</td>
                              <td style={{ ...style.cellStyle, padding: "4px" }}>Cell</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Spacing & Borders</h3>

                <div>
                  <Label>Cell Padding: {cellPadding[0]}px</Label>
                  <Slider
                    value={cellPadding}
                    onValueChange={setCellPadding}
                    min={0}
                    max={20}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Border Width: {borderWidth[0]}px</Label>
                  <Slider
                    value={borderWidth}
                    onValueChange={setBorderWidth}
                    min={0}
                    max={5}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="borderColor">Border Color</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="color"
                      id="borderColor"
                      value={customBorderColor}
                      onChange={(e) => setCustomBorderColor(e.target.value)}
                      className="w-12 h-8 border rounded"
                    />
                    <Input
                      value={customBorderColor}
                      onChange={(e) => setCustomBorderColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Colors</h3>

                <div>
                  <Label>Border Colors</Label>
                  <div className="grid grid-cols-10 gap-1 mt-2">
                    {borderColors.map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded border-2 ${
                          customBorderColor === color ? "border-gray-800" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setCustomBorderColor(color)}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Background Colors</Label>
                  <div className="grid grid-cols-10 gap-1 mt-2">
                    {backgroundColors.map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded border-2 ${
                          customBackgroundColor === color ? "border-gray-800" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setCustomBackgroundColor(color)}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <Button variant="outline" onClick={resetToDefaults} className="w-full flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Table Preview</h3>
              {generatePreviewTable()}

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Table Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <strong>Dimensions:</strong> {rows} rows × {cols} columns
                    </p>
                    <p>
                      <strong>Total cells:</strong> {rows * cols}
                    </p>
                    <p>
                      <strong>Header row:</strong> {hasHeader ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Style:</strong> {tableStyles.find((s) => s.id === selectedStyle)?.name}
                    </p>
                    <p>
                      <strong>Width:</strong> {tableWidth[0]}%
                    </p>
                    <p>
                      <strong>Cell padding:</strong> {cellPadding[0]}px
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetToDefaults}>
              Reset
            </Button>
            <Button onClick={insertTable} className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Insert Table
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ComprehensiveTableCreator
