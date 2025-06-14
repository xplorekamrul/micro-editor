"use client"

import { NodeViewWrapper } from "@tiptap/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Palette, Plus, Minus } from "lucide-react"

interface EnhancedTableViewProps {
  node: any
  updateAttributes: (attrs: any) => void
  selected: boolean
}

const EnhancedTableView = ({ node, updateAttributes, selected }: EnhancedTableViewProps) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)

  const colors = [
    "#ffffff",
    "#f8f9fa",
    "#e9ecef",
    "#dee2e6",
    "#ced4da",
    "#adb5bd",
    "#6c757d",
    "#495057",
    "#343a40",
    "#212529",
    "#fff3cd",
    "#ffeaa7",
    "#fdcb6e",
    "#e17055",
    "#d63031",
    "#74b9ff",
    "#0984e3",
    "#00b894",
    "#00cec9",
    "#6c5ce7",
    "#a29bfe",
    "#fd79a8",
    "#fdcb6e",
    "#e84393",
  ]

  const borderStyles = [
    { value: "solid", label: "Solid" },
    { value: "dashed", label: "Dashed" },
    { value: "dotted", label: "Dotted" },
    { value: "double", label: "Double" },
    { value: "none", label: "None" },
  ]

  // Create a simple table structure
  const createSimpleTable = () => {
    const { rows = 3, cols = 3 } = node.attrs
    const tableRows = []

    for (let i = 0; i < rows; i++) {
      const cells = []
      for (let j = 0; j < cols; j++) {
        cells.push({
          id: `${i}-${j}`,
          content: `Cell ${i + 1}-${j + 1}`,
          style: {
            backgroundColor: "#ffffff",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "#dee2e6",
            padding: "8px",
          },
        })
      }
      tableRows.push(cells)
    }
    return tableRows
  }

  const [tableData, setTableData] = useState(createSimpleTable())

  const updateCellStyle = (row: number, col: number, styleUpdate: any) => {
    const newTableData = [...tableData]
    if (newTableData[row] && newTableData[row][col]) {
      newTableData[row][col].style = { ...newTableData[row][col].style, ...styleUpdate }
      setTableData(newTableData)
    }
  }

  const addRow = () => {
    const newRow = Array.from({ length: tableData[0]?.length || 3 }, (_, j) => ({
      id: `${tableData.length}-${j}`,
      content: `Cell ${tableData.length + 1}-${j + 1}`,
      style: {
        backgroundColor: "#ffffff",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "#dee2e6",
        padding: "8px",
      },
    }))
    setTableData([...tableData, newRow])
    updateAttributes({ rows: (node.attrs.rows || 3) + 1 })
  }

  const addColumn = () => {
    const newTableData = tableData.map((row, i) => [
      ...row,
      {
        id: `${i}-${row.length}`,
        content: `Cell ${i + 1}-${row.length + 1}`,
        style: {
          backgroundColor: "#ffffff",
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "#dee2e6",
          padding: "8px",
        },
      },
    ])
    setTableData(newTableData)
    updateAttributes({ cols: (node.attrs.cols || 3) + 1 })
  }

  const removeRow = () => {
    if (tableData.length > 1) {
      setTableData(tableData.slice(0, -1))
      updateAttributes({ rows: Math.max(1, (node.attrs.rows || 3) - 1) })
    }
  }

  const removeColumn = () => {
    if (tableData[0]?.length > 1) {
      const newTableData = tableData.map((row) => row.slice(0, -1))
      setTableData(newTableData)
      updateAttributes({ cols: Math.max(1, (node.attrs.cols || 3) - 1) })
    }
  }

  return (
    <NodeViewWrapper className={`enhanced-table-wrapper ${selected ? "selected" : ""}`}>
      <div className="table-controls mb-2 flex gap-2 flex-wrap">
        <Button size="sm" onClick={addRow} variant="outline">
          <Plus className="h-3 w-3 mr-1" />
          Add Row
        </Button>
        <Button size="sm" onClick={addColumn} variant="outline">
          <Plus className="h-3 w-3 mr-1" />
          Add Column
        </Button>
        <Button size="sm" onClick={removeRow} variant="outline" disabled={tableData.length <= 1}>
          <Minus className="h-3 w-3 mr-1" />
          Remove Row
        </Button>
        <Button size="sm" onClick={removeColumn} variant="outline" disabled={tableData[0]?.length <= 1}>
          <Minus className="h-3 w-3 mr-1" />
          Remove Column
        </Button>

        {selectedCell && (
          <div className="flex gap-2 ml-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button size="sm" variant="outline">
                  <Palette className="h-3 w-3 mr-1" />
                  Cell Color
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid grid-cols-6 gap-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => updateCellStyle(selectedCell.row, selectedCell.col, { backgroundColor: color })}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Select
              onValueChange={(value) => updateCellStyle(selectedCell.row, selectedCell.col, { borderStyle: value })}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Border" />
              </SelectTrigger>
              <SelectContent>
                {borderStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="enhanced-table border-collapse w-full min-w-full">
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={cell.id}
                    className={`border cursor-pointer transition-colors ${
                      selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                    style={cell.style}
                    onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newTableData = [...tableData]
                      if (newTableData[rowIndex] && newTableData[rowIndex][colIndex]) {
                        newTableData[rowIndex][colIndex].content = e.target.textContent || ""
                        setTableData(newTableData)
                      }
                    }}
                  >
                    {cell.content}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </NodeViewWrapper>
  )
}

export default EnhancedTableView
