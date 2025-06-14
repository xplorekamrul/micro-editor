"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Search, Type } from "lucide-react"
import type { Editor } from "@tiptap/react"

interface SymbolPaletteProps {
  editor: Editor
}

const symbolGroups = {
  mathematical: {
    name: "Mathematical",
    symbols: [
      { symbol: "±", name: "Plus-minus", code: "±" },
      { symbol: "×", name: "Multiplication", code: "×" },
      { symbol: "÷", name: "Division", code: "÷" },
      { symbol: "≠", name: "Not equal", code: "≠" },
      { symbol: "≤", name: "Less than or equal", code: "≤" },
      { symbol: "≥", name: "Greater than or equal", code: "≥" },
      { symbol: "≈", name: "Approximately", code: "≈" },
      { symbol: "∞", name: "Infinity", code: "∞" },
      { symbol: "∑", name: "Sum", code: "∑" },
      { symbol: "∏", name: "Product", code: "∏" },
      { symbol: "∫", name: "Integral", code: "∫" },
      { symbol: "∂", name: "Partial derivative", code: "∂" },
      { symbol: "∇", name: "Nabla", code: "∇" },
      { symbol: "√", name: "Square root", code: "√" },
      { symbol: "∛", name: "Cube root", code: "∛" },
      { symbol: "∜", name: "Fourth root", code: "∜" },
      { symbol: "°", name: "Degree", code: "°" },
      { symbol: "′", name: "Prime", code: "′" },
      { symbol: "″", name: "Double prime", code: "″" },
      { symbol: "‰", name: "Per mille", code: "‰" },
    ],
  },
  greek: {
    name: "Greek Letters",
    symbols: [
      { symbol: "α", name: "Alpha", code: "α" },
      { symbol: "β", name: "Beta", code: "β" },
      { symbol: "γ", name: "Gamma", code: "γ" },
      { symbol: "δ", name: "Delta", code: "δ" },
      { symbol: "ε", name: "Epsilon", code: "ε" },
      { symbol: "ζ", name: "Zeta", code: "ζ" },
      { symbol: "η", name: "Eta", code: "η" },
      { symbol: "θ", name: "Theta", code: "θ" },
      { symbol: "ι", name: "Iota", code: "ι" },
      { symbol: "κ", name: "Kappa", code: "κ" },
      { symbol: "λ", name: "Lambda", code: "λ" },
      { symbol: "μ", name: "Mu", code: "μ" },
      { symbol: "ν", name: "Nu", code: "ν" },
      { symbol: "ξ", name: "Xi", code: "ξ" },
      { symbol: "ο", name: "Omicron", code: "ο" },
      { symbol: "π", name: "Pi", code: "π" },
      { symbol: "ρ", name: "Rho", code: "ρ" },
      { symbol: "σ", name: "Sigma", code: "σ" },
      { symbol: "τ", name: "Tau", code: "τ" },
      { symbol: "υ", name: "Upsilon", code: "υ" },
      { symbol: "φ", name: "Phi", code: "φ" },
      { symbol: "χ", name: "Chi", code: "χ" },
      { symbol: "ψ", name: "Psi", code: "ψ" },
      { symbol: "ω", name: "Omega", code: "ω" },
    ],
  },
  arrows: {
    name: "Arrows",
    symbols: [
      { symbol: "←", name: "Left arrow", code: "←" },
      { symbol: "→", name: "Right arrow", code: "→" },
      { symbol: "↑", name: "Up arrow", code: "↑" },
      { symbol: "↓", name: "Down arrow", code: "↓" },
      { symbol: "↔", name: "Left-right arrow", code: "↔" },
      { symbol: "↕", name: "Up-down arrow", code: "↕" },
      { symbol: "⇐", name: "Left double arrow", code: "⇐" },
      { symbol: "⇒", name: "Right double arrow", code: "⇒" },
      { symbol: "⇑", name: "Up double arrow", code: "⇑" },
      { symbol: "⇓", name: "Down double arrow", code: "⇓" },
      { symbol: "⇔", name: "Left-right double arrow", code: "⇔" },
      { symbol: "⇕", name: "Up-down double arrow", code: "⇕" },
    ],
  },
  sets: {
    name: "Sets & Logic",
    symbols: [
      { symbol: "∈", name: "Element of", code: "∈" },
      { symbol: "∉", name: "Not element of", code: "∉" },
      { symbol: "∋", name: "Contains", code: "∋" },
      { symbol: "∌", name: "Does not contain", code: "∌" },
      { symbol: "⊂", name: "Subset", code: "⊂" },
      { symbol: "⊃", name: "Superset", code: "⊃" },
      { symbol: "⊆", name: "Subset or equal", code: "⊆" },
      { symbol: "⊇", name: "Superset or equal", code: "⊇" },
      { symbol: "∪", name: "Union", code: "∪" },
      { symbol: "∩", name: "Intersection", code: "∩" },
      { symbol: "∧", name: "Logical and", code: "∧" },
      { symbol: "∨", name: "Logical or", code: "∨" },
      { symbol: "¬", name: "Logical not", code: "¬" },
      { symbol: "∀", name: "For all", code: "∀" },
      { symbol: "∃", name: "There exists", code: "∃" },
      { symbol: "∄", name: "There does not exist", code: "∄" },
    ],
  },
  misc: {
    name: "Miscellaneous",
    symbols: [
      { symbol: "©", name: "Copyright", code: "©" },
      { symbol: "®", name: "Registered", code: "®" },
      { symbol: "™", name: "Trademark", code: "™" },
      { symbol: "§", name: "Section", code: "§" },
      { symbol: "¶", name: "Paragraph", code: "¶" },
      { symbol: "†", name: "Dagger", code: "†" },
      { symbol: "‡", name: "Double dagger", code: "‡" },
      { symbol: "•", name: "Bullet", code: "•" },
      { symbol: "‰", name: "Per mille", code: "‰" },
      { symbol: "‱", name: "Per ten thousand", code: "‱" },
      { symbol: "℃", name: "Celsius", code: "℃" },
      { symbol: "℉", name: "Fahrenheit", code: "℉" },
      { symbol: "Ω", name: "Ohm", code: "Ω" },
      { symbol: "℧", name: "Mho", code: "℧" },
      { symbol: "Å", name: "Angstrom", code: "Å" },
      { symbol: "℮", name: "Estimated", code: "℮" },
    ],
  },
}

const SymbolPalette = ({ editor }: SymbolPaletteProps) => {
  const [searchTerm, setSearchTerm] = useState("")

  const insertSymbol = (symbol: string) => {
    try {
      editor.chain().focus().insertContent(symbol).run()
    } catch (error) {
      console.error("Error inserting symbol:", error)
    }
  }

  const filteredGroups = Object.entries(symbolGroups).reduce(
    (acc, [key, group]) => {
      if (!searchTerm) {
        acc[key] = group
        return acc
      }

      const filteredSymbols = group.symbols.filter(
        (symbol) =>
          symbol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          symbol.symbol.includes(searchTerm) ||
          symbol.code.includes(searchTerm),
      )

      if (filteredSymbols.length > 0) {
        acc[key] = { ...group, symbols: filteredSymbols }
      }

      return acc
    },
    {} as typeof symbolGroups,
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Type className="h-4 w-4" />
          Insert Symbol
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 max-h-96 overflow-hidden">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search symbols..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs defaultValue="mathematical" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mathematical">Math</TabsTrigger>
              <TabsTrigger value="greek">Greek</TabsTrigger>
              <TabsTrigger value="misc">More</TabsTrigger>
            </TabsList>

            <div className="max-h-64 overflow-y-auto">
              {Object.entries(filteredGroups).map(([key, group]) => (
                <TabsContent key={key} value={key} className="mt-4">
                  <div className="grid grid-cols-6 gap-1">
                    {group.symbols.map((symbol, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 text-lg hover:bg-blue-50"
                        onClick={() => insertSymbol(symbol.symbol)}
                        title={symbol.name}
                      >
                        {symbol.symbol}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default SymbolPalette
