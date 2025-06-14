"use client"

import type React from "react"
import { NodeViewWrapper } from "@tiptap/react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Edit, Check, X } from "lucide-react"

interface MathNodeViewProps {
  node: {
    attrs: {
      latex: string
    }
  }
  updateAttributes: (attrs: any) => void
  selected: boolean
}

const EnhancedMathNodeView = ({ node, updateAttributes, selected }: MathNodeViewProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(node.attrs.latex)
  const [cursorPosition, setCursorPosition] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Convert LaTeX to readable math notation
  const convertLatexToReadable = (latex: string): string => {
    if (!latex) return ""

    let readable = latex

    const conversions = [
      [/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1) / ($2)"],
      [/\\sqrt\{([^}]+)\}/g, "√($1)"],
      [/\\sqrt\[([^]]+)\]\{([^}]+)\}/g, "$1√($2)"],
      [/\^(\d+)/g, "^$1"],
      [/\^{([^}]+)}/g, "^($1)"],
      [/_(\d+)/g, "₍$1₎"],
      [/_{([^}]+)}/g, "₍$1₎"],
      [/\\alpha/g, "α"],
      [/\\beta/g, "β"],
      [/\\gamma/g, "γ"],
      [/\\delta/g, "δ"],
      [/\\epsilon/g, "ε"],
      [/\\theta/g, "θ"],
      [/\\lambda/g, "λ"],
      [/\\mu/g, "μ"],
      [/\\pi/g, "π"],
      [/\\sigma/g, "σ"],
      [/\\phi/g, "φ"],
      [/\\omega/g, "ω"],
      [/\\Delta/g, "Δ"],
      [/\\Sigma/g, "Σ"],
      [/\\Omega/g, "Ω"],
      [/\\pm/g, "±"],
      [/\\times/g, "×"],
      [/\\div/g, "÷"],
      [/\\neq/g, "≠"],
      [/\\leq/g, "≤"],
      [/\\geq/g, "≥"],
      [/\\approx/g, "≈"],
      [/\\infty/g, "∞"],
      [/\\partial/g, "∂"],
      [/\\nabla/g, "∇"],
      [/\\rightarrow/g, "→"],
      [/\\leftarrow/g, "←"],
      [/\\leftrightarrow/g, "↔"],
      [/\\Rightarrow/g, "⇒"],
      [/\\Leftarrow/g, "⇐"],
      [/\\Leftrightarrow/g, "⇔"],
      [/\\int/g, "∫"],
      [/\\sum/g, "∑"],
      [/\\lim/g, "lim"],
      [/\\sin/g, "sin"],
      [/\\cos/g, "cos"],
      [/\\tan/g, "tan"],
      [/\\cup/g, "∪"],
      [/\\cap/g, "∩"],
      [/\\subseteq/g, "⊆"],
      [/\\in/g, "∈"],
      [/\\land/g, "∧"],
      [/\\lor/g, "∨"],
      [/\\begin\{bmatrix\}([^}]+)\\end\{bmatrix\}/g, "[$1]"],
      [/\\begin\{matrix\}([^}]+)\\end\{matrix\}/g, "[$1]"],
      [/\\\\/g, "; "],
      [/&/g, ", "],
      [/\\/g, ""],
      [/\s+/g, " "],
    ]

    conversions.forEach(([pattern, replacement]) => {
      readable = readable.replace(pattern as RegExp, replacement as string)
    })

    return readable.trim()
  }

  // Convert readable format back to LaTeX
  const convertReadableToLatex = (readable: string): string => {
    if (!readable) return ""

    let latex = readable

    const conversions = [
      [/$$([^)]+)$$\s*\/\s*$$([^)]+)$$/g, "\\frac{$1}{$2}"],
      [/([^/\s]+)\s*\/\s*([^/\s]+)/g, "\\frac{$1}{$2}"],
      [/√$$([^)]+)$$/g, "\\sqrt{$1}"],
      [/√([^\s+\-*/]+)/g, "\\sqrt{$1}"],
      [/([a-zA-Z0-9]+)\^([0-9]+)/g, "$1^{$2}"],
      [/([a-zA-Z0-9]+)\^$$([^)]+)$$/g, "$1^{$2}"],
      [/([a-zA-Z0-9]+)₍([^₎]+)₎/g, "$1_{$2}"],
      [/±/g, "\\pm"],
      [/×/g, "\\times"],
      [/÷/g, "\\div"],
      [/≠/g, "\\neq"],
      [/≤/g, "\\leq"],
      [/≥/g, "\\geq"],
      [/≈/g, "\\approx"],
      [/∞/g, "\\infty"],
      [/π/g, "\\pi"],
      [/α/g, "\\alpha"],
      [/β/g, "\\beta"],
      [/γ/g, "\\gamma"],
      [/δ/g, "\\delta"],
      [/θ/g, "\\theta"],
      [/λ/g, "\\lambda"],
      [/μ/g, "\\mu"],
      [/σ/g, "\\sigma"],
      [/φ/g, "\\phi"],
      [/ω/g, "\\omega"],
    ]

    conversions.forEach(([pattern, replacement]) => {
      latex = latex.replace(pattern as RegExp, replacement as string)
    })

    return latex.trim()
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditValue(node.attrs.latex)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.setSelectionRange(editValue.length, editValue.length)
      }
    }, 0)
  }

  const handleSave = () => {
    updateAttributes({ latex: editValue })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(node.attrs.latex)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      e.preventDefault()
      handleCancel()
    } else if (e.key === "Tab") {
      e.preventDefault()
      // Navigate to next placeholder (simplified)
      const placeholders = editValue.match(/\{[^}]*\}/g) || []
      if (placeholders.length > 0) {
        const nextPlaceholder = editValue.indexOf("{", cursorPosition)
        if (nextPlaceholder !== -1) {
          const endBrace = editValue.indexOf("}", nextPlaceholder)
          if (endBrace !== -1) {
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.setSelectionRange(nextPlaceholder + 1, endBrace)
                setCursorPosition(endBrace + 1)
              }
            }, 0)
          }
        }
      }
    }
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      const input = inputRef.current
      const handleCursorChange = () => {
        setCursorPosition(input.selectionStart || 0)
      }
      input.addEventListener("click", handleCursorChange)
      input.addEventListener("keyup", handleCursorChange)
      return () => {
        input.removeEventListener("click", handleCursorChange)
        input.removeEventListener("keyup", handleCursorChange)
      }
    }
  }, [isEditing])

  if (isEditing) {
    return (
      <NodeViewWrapper as="span" className="inline-block">
        <Card className="p-2 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              type="text"
              value={convertLatexToReadable(editValue)}
              onChange={(e) => setEditValue(convertReadableToLatex(e.target.value))}
              onKeyDown={handleKeyDown}
              className="font-serif text-sm min-w-[200px]"
              placeholder="Enter equation (e.g., x² + 2x + 1)"
            />
            <Button size="sm" onClick={handleSave}>
              <Check className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="h-3 w-3" />
            </Button>
          </div>
          {editValue && (
            <div className="mt-2 text-xs text-gray-600">
              LaTeX: <code className="bg-gray-100 px-2 py-1 rounded">{editValue}</code>
            </div>
          )}
        </Card>
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper
      as="span"
      className={`math-node inline-flex items-center gap-1 mx-1 px-2 py-1 rounded cursor-pointer transition-all duration-200 ${
        selected ? "bg-blue-100 ring-2 ring-blue-300 shadow-sm" : "bg-gray-100 hover:bg-gray-200 hover:shadow-sm"
      }`}
      onClick={handleEdit}
      title={`LaTeX: ${node.attrs.latex}`}
    >
      <span className="math-content font-serif text-lg leading-tight">
        {convertLatexToReadable(node.attrs.latex) || node.attrs.latex}
      </span>
      {selected && (
        <Button size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={handleEdit}>
          <Edit className="h-3 w-3" />
        </Button>
      )}
    </NodeViewWrapper>
  )
}

export default EnhancedMathNodeView
