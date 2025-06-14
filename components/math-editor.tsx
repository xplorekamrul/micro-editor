"use client"

import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface MathEditorProps {
  editor: Editor
  isOpen: boolean
  onClose: () => void
}

const MathEditor = ({ editor, isOpen, onClose }: MathEditorProps) => {
  const [latex, setLatex] = useState("")

  const mathTemplates = [
    { name: "Fraction", latex: "\\frac{a}{b}", preview: "a/b" },
    { name: "Square Root", latex: "\\sqrt{x}", preview: "√x" },
    { name: "Power", latex: "x^{n}", preview: "x^n" },
    { name: "Subscript", latex: "x_{n}", preview: "x₍ₙ₎" },
    { name: "Sum", latex: "\\sum_{i=1}^{n} x_i", preview: "∑(i=1 to n) xᵢ" },
    { name: "Integral", latex: "\\int_{a}^{b} f(x) dx", preview: "∫[a to b] f(x) dx" },
    { name: "Limit", latex: "\\lim_{x \\to \\infty} f(x)", preview: "lim(x → ∞) f(x)" },
    { name: "Matrix", latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}", preview: "[a, b; c, d]" },
    {
      name: "Quadratic Formula",
      latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
      preview: "x = (-b ± √(b² - 4ac)) / 2a",
    },
    { name: "Einstein's Equation", latex: "E = mc^2", preview: "E = mc²" },
  ]

  const symbolGroups = [
    {
      name: "Greek Letters",
      symbols: [
        { latex: "\\alpha", symbol: "α" },
        { latex: "\\beta", symbol: "β" },
        { latex: "\\gamma", symbol: "γ" },
        { latex: "\\delta", symbol: "δ" },
        { latex: "\\epsilon", symbol: "ε" },
        { latex: "\\theta", symbol: "θ" },
        { latex: "\\lambda", symbol: "λ" },
        { latex: "\\mu", symbol: "μ" },
        { latex: "\\pi", symbol: "π" },
        { latex: "\\sigma", symbol: "σ" },
        { latex: "\\phi", symbol: "φ" },
        { latex: "\\omega", symbol: "ω" },
      ],
    },
    {
      name: "Math Operators",
      symbols: [
        { latex: "\\pm", symbol: "±" },
        { latex: "\\mp", symbol: "∓" },
        { latex: "\\times", symbol: "×" },
        { latex: "\\div", symbol: "÷" },
        { latex: "\\neq", symbol: "≠" },
        { latex: "\\leq", symbol: "≤" },
        { latex: "\\geq", symbol: "≥" },
        { latex: "\\approx", symbol: "≈" },
        { latex: "\\equiv", symbol: "≡" },
        { latex: "\\infty", symbol: "∞" },
        { latex: "\\partial", symbol: "∂" },
        { latex: "\\nabla", symbol: "∇" },
      ],
    },
  ]

  const insertMath = () => {
    if (latex.trim()) {
      editor.chain().focus().setMath(latex).run()
      setLatex("")
      onClose()
    }
  }

  const insertTemplate = (template: string) => {
    setLatex(template)
  }

  const insertSymbol = (symbol: string) => {
    setLatex(latex + symbol + " ")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Math Equation Editor</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="latex-input">LaTeX Input</Label>
              <Textarea
                id="latex-input"
                placeholder="Enter LaTeX equation (e.g., x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a})"
                value={latex}
                onChange={(e) => setLatex(e.target.value)}
                className="font-mono"
                rows={4}
              />
            </div>

            <div>
              <Label>Quick Templates</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {mathTemplates.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => insertTemplate(template.latex)}
                    className="text-left justify-start h-auto p-3"
                  >
                    <div>
                      <div className="font-semibold text-xs">{template.name}</div>
                      <div className="text-xs text-gray-600 font-serif">{template.preview}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {symbolGroups.map((group, groupIndex) => (
              <Card key={groupIndex}>
                <CardContent className="p-4">
                  <Label>{group.name}</Label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {group.symbols.map((item, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => insertSymbol(item.latex)}
                        className="text-lg font-serif h-10 w-10 p-0"
                        title={item.latex}
                      >
                        {item.symbol}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <div>
              <Label>Examples</Label>
              <div className="space-y-2 mt-2">
                <Card>
                  <CardContent className="p-3">
                    <p className="text-sm font-semibold">Quadratic Formula:</p>
                    <p className="text-sm font-serif">x = (-b ± √(b² - 4ac)) / 2a</p>
                    <code className="text-xs text-gray-600">{"x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"}</code>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-sm font-semibold">Einstein's Equation:</p>
                    <p className="text-sm font-serif">E = mc²</p>
                    <code className="text-xs text-gray-600">E = mc^2</code>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-sm font-semibold">Integral:</p>
                    <p className="text-sm font-serif">∫[0 to 1] x² dx = 1/3</p>
                    <code className="text-xs text-gray-600">{"\\int_0^1 x^2 dx = \\frac{1}{3}"}</code>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={insertMath} disabled={!latex.trim()}>
            Insert Equation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default MathEditor
