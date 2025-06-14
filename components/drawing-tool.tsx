"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Paintbrush, Square, Circle, Triangle, Minus, Eraser, Download, Trash2, Undo, Redo } from "lucide-react"
import type { Editor } from "@tiptap/react"

interface DrawingToolProps {
  editor: Editor
  isOpen: boolean
  onClose: () => void
}

interface DrawingState {
  tool: "pen" | "line" | "rectangle" | "circle" | "triangle" | "eraser"
  color: string
  lineWidth: number
  isDrawing: boolean
  startX: number
  startY: number
}

const DrawingTool = ({ editor, isOpen, onClose }: DrawingToolProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawingState, setDrawingState] = useState<DrawingState>({
    tool: "pen",
    color: "#000000",
    lineWidth: 2,
    isDrawing: false,
    startX: 0,
    startY: 0,
  })
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#800000",
    "#008000",
    "#000080",
    "#808000",
    "#800080",
    "#008080",
    "#C0C0C0",
    "#808080",
    "#9999FF",
    "#993366",
    "#FFFFCC",
    "#CCFFFF",
    "#660066",
    "#FF8080",
    "#0066CC",
    "#CCCCFF",
    "#000080",
  ]

  const tools = [
    { id: "pen", name: "Pen", icon: Paintbrush },
    { id: "line", name: "Line", icon: Minus },
    { id: "rectangle", name: "Rectangle", icon: Square },
    { id: "circle", name: "Circle", icon: Circle },
    { id: "triangle", name: "Triangle", icon: Triangle },
    { id: "eraser", name: "Eraser", icon: Eraser },
  ]

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Initialize canvas
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        saveToHistory()
      }
    }
  }, [isOpen])

  const saveToHistory = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(imageData)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      setHistoryIndex(historyIndex - 1)
      ctx.putImageData(history[historyIndex - 1], 0, 0)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      setHistoryIndex(historyIndex + 1)
      ctx.putImageData(history[historyIndex + 1], 0, 0)
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    saveToHistory()
  }

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e)
    setDrawingState((prev) => ({
      ...prev,
      isDrawing: true,
      startX: pos.x,
      startY: pos.y,
    }))

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.strokeStyle = drawingState.color
    ctx.lineWidth = drawingState.lineWidth
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    if (drawingState.tool === "pen") {
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
    } else if (drawingState.tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out"
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, drawingState.lineWidth, 0, 2 * Math.PI)
      ctx.fill()
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingState.isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const pos = getMousePos(e)

    if (drawingState.tool === "pen") {
      ctx.globalCompositeOperation = "source-over"
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    } else if (drawingState.tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out"
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, drawingState.lineWidth, 0, 2 * Math.PI)
      ctx.fill()
    }
  }

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingState.isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const pos = getMousePos(e)
    ctx.globalCompositeOperation = "source-over"

    switch (drawingState.tool) {
      case "line":
        ctx.beginPath()
        ctx.moveTo(drawingState.startX, drawingState.startY)
        ctx.lineTo(pos.x, pos.y)
        ctx.stroke()
        break

      case "rectangle":
        const width = pos.x - drawingState.startX
        const height = pos.y - drawingState.startY
        ctx.strokeRect(drawingState.startX, drawingState.startY, width, height)
        break

      case "circle":
        const radius = Math.sqrt(Math.pow(pos.x - drawingState.startX, 2) + Math.pow(pos.y - drawingState.startY, 2))
        ctx.beginPath()
        ctx.arc(drawingState.startX, drawingState.startY, radius, 0, 2 * Math.PI)
        ctx.stroke()
        break

      case "triangle":
        ctx.beginPath()
        ctx.moveTo(drawingState.startX, drawingState.startY)
        ctx.lineTo(pos.x, pos.y)
        ctx.lineTo(drawingState.startX - (pos.x - drawingState.startX), pos.y)
        ctx.closePath()
        ctx.stroke()
        break
    }

    setDrawingState((prev) => ({ ...prev, isDrawing: false }))
    saveToHistory()
  }

  const saveDrawing = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Convert canvas to image and insert into editor
    canvas.toBlob((blob) => {
      if (blob && editor) {
        const url = URL.createObjectURL(blob)
        editor.chain().focus().setImage({ src: url }).run()
        onClose()
      }
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[900px] h-[700px] max-w-[90vw] max-h-[90vh]">
        <CardContent className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Drawing Tool</h3>
            <div className="flex gap-2">
              <Button size="sm" onClick={saveDrawing}>
                <Download className="h-4 w-4 mr-1" />
                Insert Drawing
              </Button>
              <Button size="sm" variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            {/* Tools */}
            <div className="flex gap-1">
              {tools.map((tool) => {
                const Icon = tool.icon
                return (
                  <Button
                    key={tool.id}
                    size="sm"
                    variant={drawingState.tool === tool.id ? "default" : "outline"}
                    onClick={() => setDrawingState((prev) => ({ ...prev, tool: tool.id as any }))}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                )
              })}
            </div>

            {/* Colors */}
            <Popover>
              <PopoverTrigger asChild>
                <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                  <div className="w-4 h-4 rounded border" style={{ backgroundColor: drawingState.color }} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid grid-cols-6 gap-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => setDrawingState((prev) => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Line Width */}
            <div className="flex items-center gap-2">
              <span className="text-sm">Size:</span>
              <div className="w-24">
                <Slider
                  value={[drawingState.lineWidth]}
                  onValueChange={([value]) => setDrawingState((prev) => ({ ...prev, lineWidth: value }))}
                  min={1}
                  max={20}
                  step={1}
                />
              </div>
              <span className="text-sm w-6">{drawingState.lineWidth}</span>
            </div>

            {/* History Controls */}
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={undo} disabled={historyIndex <= 0}>
                <Undo className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={redo} disabled={historyIndex >= history.length - 1}>
                <Redo className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={clearCanvas}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 border rounded-lg overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="cursor-crosshair w-full h-full"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DrawingTool
