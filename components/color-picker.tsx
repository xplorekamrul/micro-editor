"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"

interface ColorPickerProps {
  currentColor?: string
  onColorChange: (color: string) => void
  onRemoveColor?: () => void
  title: string
  icon: React.ReactNode
  colors?: string[]
}

const defaultColors = [
  "#000000",
  "#FFFFFF",
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
  "#FFA500",
  "#A52A2A",
  "#DEB887",
  "#5F9EA0",
  "#7FFF00",
  "#D2691E",
  "#FF7F50",
  "#6495ED",
  "#DC143C",
  "#00FFFF",
  "#00008B",
  "#008B8B",
  "#B8860B",
  "#A9A9A9",
  "#006400",
  "#BDB76B",
  "#8B008B",
  "#556B2F",
  "#FF8C00",
  "#9932CC",
  "#8B0000",
  "#E9967A",
  "#8FBC8F",
  "#483D8B",
  "#2F4F4F",
  "#00CED1",
  "#9400D3",
  "#FF1493",
  "#00BFFF",
  "#696969",
  "#1E90FF",
  "#B22222",
  "#FFFAF0",
  "#228B22",
  "#FF00FF",
  "#DCDCDC",
  "#F8F8FF",
  "#FFD700",
  "#DAA520",
  "#808080",
]

const ColorPicker = ({
  currentColor,
  onColorChange,
  onRemoveColor,
  title,
  icon,
  colors = defaultColors,
}: ColorPickerProps) => {
  const [customColor, setCustomColor] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleColorSelect = (color: string) => {
    onColorChange(color)
    setIsOpen(false)
  }

  const handleCustomColorApply = () => {
    if (customColor) {
      onColorChange(customColor)
      setCustomColor("")
      setIsOpen(false)
    }
  }

  const handleRemove = () => {
    if (onRemoveColor) {
      onRemoveColor()
      setIsOpen(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" title={title} className="relative">
          {icon}
          {currentColor && (
            <div
              className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: currentColor }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">{title}</h4>

          {/* Predefined Colors */}
          <div className="grid grid-cols-8 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded border-2 hover:scale-110 transition-all duration-200 ${
                  currentColor === color
                    ? "border-blue-500 ring-2 ring-blue-200 shadow-md"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
                title={color}
              >
                {currentColor === color && <Check className="w-4 h-4 text-white drop-shadow-sm mx-auto" />}
              </button>
            ))}
          </div>

          {/* Custom Color Input */}
          <div className="space-y-2">
            <Label htmlFor="custom-color" className="text-sm">
              Custom Color
            </Label>
            <div className="flex gap-2">
              <Input
                id="custom-color"
                type="color"
                value={customColor || currentColor || "#000000"}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-16 h-8 p-1 border rounded"
              />
              <Input
                type="text"
                placeholder="#000000"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={handleCustomColorApply} disabled={!customColor}>
                Apply
              </Button>
            </div>
          </div>

          {/* Remove Color Button */}
          {onRemoveColor && (
            <Button variant="outline" size="sm" onClick={handleRemove} className="w-full">
              Remove {title}
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ColorPicker
