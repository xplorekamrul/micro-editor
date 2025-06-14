"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Square, Circle, Triangle, Diamond, Hexagon, Star, ArrowRight, Heart } from "lucide-react"
import type { Editor } from "@tiptap/react"

interface ShapeInsertionToolProps {
  editor: Editor
}

interface Shape {
  id: string
  name: string
  icon: React.ComponentType<any>
  svg: string
}

const shapes: Shape[] = [
  {
    id: "square",
    name: "Square",
    icon: Square,
    svg: '<rect x="10" y="10" width="80" height="80" fill="currentColor" stroke="currentColor" strokeWidth="2"/>',
  },
  {
    id: "circle",
    name: "Circle",
    icon: Circle,
    svg: '<circle cx="50" cy="50" r="40" fill="currentColor" stroke="currentColor" strokeWidth="2"/>',
  },
  {
    id: "triangle",
    name: "Triangle",
    icon: Triangle,
    svg: '<polygon points="50,10 90,90 10,90" fill="currentColor" stroke="currentColor" strokeWidth="2"/>',
  },
  {
    id: "diamond",
    name: "Diamond",
    icon: Diamond,
    svg: '<polygon points="50,10 90,50 50,90 10,50" fill="currentColor" stroke="currentColor" strokeWidth="2"/>',
  },
  {
    id: "hexagon",
    name: "Hexagon",
    icon: Hexagon,
    svg: '<polygon points="30,10 70,10 90,50 70,90 30,90 10,50" fill="currentColor" stroke="currentColor" strokeWidth="2"/>',
  },
  {
    id: "star",
    name: "Star",
    icon: Star,
    svg: '<polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="currentColor" stroke="currentColor" strokeWidth="2"/>',
  },
  {
    id: "arrow",
    name: "Arrow",
    icon: ArrowRight,
    svg: '<polygon points="10,40 10,60 70,60 70,80 90,50 70,20 70,40" fill="currentColor" stroke="currentColor" strokeWidth="2"/>',
  },
  {
    id: "heart",
    name: "Heart",
    icon: Heart,
    svg: '<path d="M50,85 C50,85 20,60 20,40 C20,25 30,15 45,15 C47,15 50,20 50,20 C50,20 53,15 55,15 C70,15 80,25 80,40 C80,60 50,85 50,85 Z" fill="currentColor" stroke="currentColor" strokeWidth="2"/>',
  },
]

const ShapeInsertionTool = ({ editor }: ShapeInsertionToolProps) => {
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null)
  const [shapeColor, setShapeColor] = useState("#3B82F6")
  const [shapeSize, setShapeSize] = useState([100])
  const [fillOpacity, setFillOpacity] = useState([0.7])

  const colors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#6366F1",
    "#14B8A6",
    "#F43F5E",
    "#8B5A2B",
    "#6B7280",
    "#000000",
  ]

  const insertShape = (shape: Shape) => {
    try {
      const size = shapeSize[0]
      const opacity = fillOpacity[0]

      const svgContent = `
        <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g style="color: ${shapeColor}; opacity: ${opacity};">
            ${shape.svg}
          </g>
        </svg>
      `

      // Convert SVG to data URL
      const svgBlob = new Blob([svgContent], { type: "image/svg+xml" })
      const url = URL.createObjectURL(svgBlob)

      // Insert as image
      editor
        .chain()
        .focus()
        .setImage({
          src: url,
          alt: shape.name,
          title: shape.name,
        })
        .run()
    } catch (error) {
      console.error("Error inserting shape:", error)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Square className="h-4 w-4" />
          Insert Shape
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Select Shape</h4>
            <div className="grid grid-cols-4 gap-2">
              {shapes.map((shape) => {
                const Icon = shape.icon
                return (
                  <Button
                    key={shape.id}
                    variant={selectedShape?.id === shape.id ? "default" : "outline"}
                    size="sm"
                    className="h-12 w-12 p-0"
                    onClick={() => setSelectedShape(shape)}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                )
              })}
            </div>
          </div>

          {selectedShape && (
            <>
              <div>
                <h4 className="font-medium mb-2">Color</h4>
                <div className="grid grid-cols-5 gap-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                        shapeColor === color ? "border-gray-800" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setShapeColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Size: {shapeSize[0]}px</h4>
                <Slider value={shapeSize} onValueChange={setShapeSize} min={50} max={300} step={10} />
              </div>

              <div>
                <h4 className="font-medium mb-2">Opacity: {Math.round(fillOpacity[0] * 100)}%</h4>
                <Slider value={fillOpacity} onValueChange={setFillOpacity} min={0.1} max={1} step={0.1} />
              </div>

              <div>
                <h4 className="font-medium mb-2">Preview</h4>
                <Card className="p-4 bg-gray-50">
                  <div
                    className="mx-auto"
                    style={{ width: Math.min(shapeSize[0], 80), height: Math.min(shapeSize[0], 80) }}
                    dangerouslySetInnerHTML={{
                      __html: `
                        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                          <g style="color: ${shapeColor}; opacity: ${fillOpacity[0]};">
                            ${selectedShape.svg}
                          </g>
                        </svg>
                      `,
                    }}
                  />
                </Card>
              </div>

              <Button onClick={() => insertShape(selectedShape)} className="w-full">
                Insert {selectedShape.name}
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ShapeInsertionTool
