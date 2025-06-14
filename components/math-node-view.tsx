"use client"

import type React from "react"

import { NodeViewWrapper } from "@tiptap/react"
import { useState } from "react"

interface MathNodeViewProps {
  node: {
    attrs: {
      latex: string
    }
  }
  updateAttributes: (attrs: any) => void
  selected: boolean
}

const MathNodeView = ({ node, updateAttributes, selected }: MathNodeViewProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(node.attrs.latex)

  // Convert LaTeX to readable math notation
  const convertLatexToReadable = (latex: string): string => {
    if (!latex) return ""

    let readable = latex

    // Common LaTeX conversions
    const conversions = [
      // Fractions
      [/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1) / ($2)"],

      // Square roots
      [/\\sqrt\{([^}]+)\}/g, "√($1)"],

      // Powers
      [/\^(\d+)/g, "^$1"],
      [/\^{([^}]+)}/g, "^($1)"],

      // Subscripts
      [/_(\d+)/g, "₁₂₃₄₅₆₇₈₉₀"[Number.parseInt("$1")] || "₍$1₎"],
      [/_{([^}]+)}/g, "₍$1₎"],

      // Greek letters
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

      // Math symbols
      [/\\pm/g, "±"],
      [/\\mp/g, "∓"],
      [/\\times/g, "×"],
      [/\\div/g, "÷"],
      [/\\neq/g, "≠"],
      [/\\leq/g, "≤"],
      [/\\geq/g, "≥"],
      [/\\approx/g, "≈"],
      [/\\equiv/g, "≡"],
      [/\\infty/g, "∞"],
      [/\\partial/g, "∂"],
      [/\\nabla/g, "∇"],

      // Integrals and sums
      [/\\int_{([^}]+)}\^{([^}]+)}/g, "∫[$1 to $2]"],
      [/\\int/g, "∫"],
      [/\\sum_{([^}]+)}\^{([^}]+)}/g, "∑($1 to $2)"],
      [/\\sum/g, "∑"],
      [/\\lim_{([^}]+)}/g, "lim($1)"],

      // Matrices
      [/\\begin\{pmatrix\}([^}]+)\\end\{pmatrix\}/g, "[$1]"],
      [/\\\\/g, "; "],
      [/&/g, ", "],

      // Clean up extra spaces and backslashes
      [/\\/g, ""],
      [/\s+/g, " "],
    ]

    conversions.forEach(([pattern, replacement]) => {
      readable = readable.replace(pattern as RegExp, replacement as string)
    })

    return readable.trim()
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
    setEditValue(node.attrs.latex)
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
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <NodeViewWrapper as="span" className="inline-block">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="px-2 py-1 border border-blue-300 rounded text-sm font-mono bg-white"
          autoFocus
          placeholder="Enter LaTeX equation"
        />
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper
      as="span"
      className={`math-node inline-block mx-1 px-2 py-1 rounded cursor-pointer transition-colors ${
        selected ? "bg-blue-100 ring-2 ring-blue-300" : "bg-gray-100 hover:bg-gray-200"
      }`}
      onDoubleClick={handleDoubleClick}
      title={`LaTeX: ${node.attrs.latex}`}
    >
      <span className="math-content font-serif text-lg">
        {convertLatexToReadable(node.attrs.latex) || node.attrs.latex}
      </span>
    </NodeViewWrapper>
  )
}

export default MathNodeView
