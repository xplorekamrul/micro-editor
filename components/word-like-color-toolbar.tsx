"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, Type, Highlighter } from "lucide-react"
import type { Editor } from "@tiptap/react"

interface WordLikeColorToolbarProps {
  editor: Editor
}

const WordLikeColorToolbar = ({ editor }: WordLikeColorToolbarProps) => {
  const [showTextColorPicker, setShowTextColorPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)

  // Standard Word-like color palette
  const themeColors = [
    { name: "White", color: "#FFFFFF" },
    { name: "Black", color: "#000000" },
    { name: "Dark Red", color: "#C00000" },
    { name: "Red", color: "#FF0000" },
    { name: "Orange", color: "#FFC000" },
    { name: "Yellow", color: "#FFFF00" },
    { name: "Light Green", color: "#92D050" },
    { name: "Green", color: "#00B050" },
    { name: "Light Blue", color: "#00B0F0" },
    { name: "Blue", color: "#0070C0" },
    { name: "Dark Blue", color: "#002060" },
    { name: "Purple", color: "#7030A0" },
  ]

  const standardColors = [
    "#C00000",
    "#FF0000",
    "#FFC000",
    "#FFFF00",
    "#92D050",
    "#00B050",
    "#00B0F0",
    "#0070C0",
    "#002060",
    "#7030A0",
    "#FFFFFF",
    "#000000",
    "#EEECE1",
    "#1F497D",
    "#4F81BD",
    "#C0504D",
    "#9BBB59",
    "#8064A2",
    "#4BACC6",
    "#F79646",
    "#FFFF99",
    "#800000",
    "#008000",
    "#000080",
  ]

  const recentColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
  ]

  const highlightColors = [
    { name: "No Color", color: "transparent" },
    { name: "Yellow", color: "#FFFF00" },
    { name: "Bright Green", color: "#00FF00" },
    { name: "Turquoise", color: "#00FFFF" },
    { name: "Pink", color: "#FF00FF" },
    { name: "Blue", color: "#0000FF" },
    { name: "Red", color: "#FF0000" },
    { name: "Dark Blue", color: "#000080" },
    { name: "Teal", color: "#008080" },
    { name: "Green", color: "#008000" },
    { name: "Violet", color: "#800080" },
    { name: "Dark Red", color: "#800000" },
    { name: "Dark Yellow", color: "#808000" },
    { name: "Gray 50%", color: "#808080" },
    { name: "Gray 25%", color: "#C0C0C0" },
    { name: "Black", color: "#000000" },
  ]

  const applyTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run()
    setShowTextColorPicker(false)
  }

  const applyHighlight = (color: string) => {
    if (color === "transparent") {
      editor.chain().focus().unsetHighlight().run()
    } else {
      editor.chain().focus().setHighlight({ color }).run()
    }
    setShowHighlightPicker(false)
  }

  const getCurrentTextColor = () => {
    return editor.getAttributes("textStyle").color || "#000000"
  }

  const getCurrentHighlightColor = () => {
    return editor.getAttributes("highlight").color || "transparent"
  }

  return (
    <div className="flex items-center gap-1">
      {/* Text Color */}
      <div className="flex">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyTextColor(getCurrentTextColor())}
          className="px-2 border-r-0 rounded-r-none"
          title="Text Color"
        >
          <div className="flex flex-col items-center">
            <Type className="h-4 w-4" />
            <div className="w-4 h-1 mt-0.5" style={{ backgroundColor: getCurrentTextColor() }} />
          </div>
        </Button>
        <Popover open={showTextColorPicker} onOpenChange={setShowTextColorPicker}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="px-1 border-l-0 rounded-l-none" title="More Text Colors">
              <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Theme Colors</h4>
                <div className="grid grid-cols-6 gap-1">
                  {themeColors.map((colorItem, index) => (
                    <button
                      key={index}
                      className="w-8 h-8 border border-gray-300 hover:border-gray-500 transition-colors"
                      style={{ backgroundColor: colorItem.color }}
                      onClick={() => applyTextColor(colorItem.color)}
                      title={colorItem.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Standard Colors</h4>
                <div className="grid grid-cols-12 gap-1">
                  {standardColors.map((color, index) => (
                    <button
                      key={index}
                      className="w-6 h-6 border border-gray-300 hover:border-gray-500 transition-colors"
                      style={{ backgroundColor: color }}
                      onClick={() => applyTextColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Recent Colors</h4>
                <div className="grid grid-cols-10 gap-1">
                  {recentColors.map((color, index) => (
                    <button
                      key={index}
                      className="w-6 h-6 border border-gray-300 hover:border-gray-500 transition-colors"
                      style={{ backgroundColor: color }}
                      onClick={() => applyTextColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              <Button
                variant="outline"
                size="sm"
                onClick={() => editor.chain().focus().unsetColor().run()}
                className="w-full"
              >
                Remove Color
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Text Highlight */}
      <div className="flex">
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            applyHighlight(getCurrentHighlightColor() === "transparent" ? "#FFFF00" : getCurrentHighlightColor())
          }
          className="px-2 border-r-0 rounded-r-none"
          title="Text Highlight Color"
        >
          <div className="flex flex-col items-center">
            <Highlighter className="h-4 w-4" />
            <div
              className="w-4 h-1 mt-0.5"
              style={{
                backgroundColor: getCurrentHighlightColor() === "transparent" ? "#FFFF00" : getCurrentHighlightColor(),
              }}
            />
          </div>
        </Button>
        <Popover open={showHighlightPicker} onOpenChange={setShowHighlightPicker}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="px-1 border-l-0 rounded-l-none" title="More Highlight Colors">
              <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Highlight Colors</h4>
              <div className="grid grid-cols-4 gap-2">
                {highlightColors.map((colorItem, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 border border-gray-300 hover:border-gray-500 transition-colors flex items-center justify-center ${
                      colorItem.color === "transparent" ? "bg-white" : ""
                    }`}
                    style={{
                      backgroundColor: colorItem.color === "transparent" ? "white" : colorItem.color,
                    }}
                    onClick={() => applyHighlight(colorItem.color)}
                    title={colorItem.name}
                  >
                    {colorItem.color === "transparent" && <span className="text-xs text-red-500">✕</span>}
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default WordLikeColorToolbar
