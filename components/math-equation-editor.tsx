"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Editor } from "@tiptap/react";
import { Calculator, Plus, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MathEquationEditorProps {
  editor: Editor;
  onInsert?: (equation: string) => void;
}

interface MathTemplate {
  id: string;
  name: string;
  latex: string;
  preview: string;
  description: string;
  category: string;
  keywords: string[];
  placeholders?: string[];
}

const mathTemplates: MathTemplate[] = [
  // Basic Math
  {
    id: "superscript",
    name: "Superscript",
    latex: "a^{b}",
    preview: "a^b",
    description: "Raise to power",
    category: "basic",
    keywords: ["power", "exponent", "superscript"],
    placeholders: ["base", "exponent"],
  },
  {
    id: "subscript",
    name: "Subscript",
    latex: "x_{n}",
    preview: "x_n",
    description: "Lower index",
    category: "basic",
    keywords: ["subscript", "index", "lower"],
    placeholders: ["variable", "index"],
  },
  {
    id: "fraction",
    name: "Fraction",
    latex: "\\frac{a}{b}",
    preview: "a/b",
    description: "Division fraction",
    category: "basic",
    keywords: ["fraction", "divide", "quotient"],
    placeholders: ["numerator", "denominator"],
  },
  {
    id: "sqrt",
    name: "Square Root",
    latex: "\\sqrt{x}",
    preview: "√x",
    description: "Square root",
    category: "basic",
    keywords: ["sqrt", "root", "radical"],
    placeholders: ["radicand"],
  },
  {
    id: "nthroot",
    name: "Nth Root",
    latex: "\\sqrt[n]{x}",
    preview: "ⁿ√x",
    description: "Nth root",
    category: "basic",
    keywords: ["root", "radical", "nth"],
    placeholders: ["index", "radicand"],
  },
  {
    id: "absolute",
    name: "Absolute Value",
    latex: "|x|",
    preview: "|x|",
    description: "Absolute value",
    category: "basic",
    keywords: ["absolute", "modulus", "bars"],
    placeholders: ["expression"],
  },

  // Algebra
  {
    id: "polynomial",
    name: "Polynomial",
    latex: "ax^2 + bx + c = 0",
    preview: "ax² + bx + c = 0",
    description: "Quadratic polynomial",
    category: "algebra",
    keywords: ["polynomial", "quadratic", "equation"],
    placeholders: ["a", "b", "c"],
  },
  {
    id: "factoring",
    name: "Factoring",
    latex: "(x + a)(x + b)",
    preview: "(x + a)(x + b)",
    description: "Factored form",
    category: "algebra",
    keywords: ["factor", "product", "multiply"],
    placeholders: ["a", "b"],
  },
  {
    id: "binomial",
    name: "Binomial Expansion",
    latex: "(a + b)^2 = a^2 + 2ab + b^2",
    preview: "(a + b)² = a² + 2ab + b²",
    description: "Binomial square",
    category: "algebra",
    keywords: ["binomial", "expansion", "square"],
    placeholders: ["a", "b"],
  },
  {
    id: "quadratic",
    name: "Quadratic Formula",
    latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    preview: "x = (-b ± √(b² - 4ac)) / 2a",
    description: "Quadratic formula",
    category: "algebra",
    keywords: ["quadratic", "formula", "solve"],
    placeholders: ["a", "b", "c"],
  },

  // Calculus
  {
    id: "derivative",
    name: "Derivative",
    latex: "\\frac{dy}{dx}",
    preview: "dy/dx",
    description: "Derivative notation",
    category: "calculus",
    keywords: ["derivative", "differentiation", "rate"],
    placeholders: ["y", "x"],
  },
  {
    id: "partial",
    name: "Partial Derivative",
    latex: "\\frac{\\partial y}{\\partial x}",
    preview: "∂y/∂x",
    description: "Partial derivative",
    category: "calculus",
    keywords: ["partial", "derivative", "multivariable"],
    placeholders: ["y", "x"],
  },
  {
    id: "definite_integral",
    name: "Definite Integral",
    latex: "\\int_a^b f(x) dx",
    preview: "∫[a to b] f(x) dx",
    description: "Definite integral",
    category: "calculus",
    keywords: ["integral", "definite", "area"],
    placeholders: ["a", "b", "f(x)"],
  },
  {
    id: "indefinite_integral",
    name: "Indefinite Integral",
    latex: "\\int f(x) dx",
    preview: "∫ f(x) dx",
    description: "Indefinite integral",
    category: "calculus",
    keywords: ["integral", "antiderivative"],
    placeholders: ["f(x)"],
  },
  {
    id: "limit",
    name: "Limit",
    latex: "\\lim_{x \\to a} f(x)",
    preview: "lim(x→a) f(x)",
    description: "Limit notation",
    category: "calculus",
    keywords: ["limit", "approaches", "tends"],
    placeholders: ["x", "a", "f(x)"],
  },
  {
    id: "sum",
    name: "Sigma Notation",
    latex: "\\sum_{i=1}^n a_i",
    preview: "∑(i=1 to n) aᵢ",
    description: "Summation",
    category: "calculus",
    keywords: ["sum", "sigma", "series"],
    placeholders: ["i", "1", "n", "a_i"],
  },

  // Geometry
  {
    id: "circle_area",
    name: "Area of Circle",
    latex: "A = \\pi r^2",
    preview: "A = πr²",
    description: "Circle area formula",
    category: "geometry",
    keywords: ["area", "circle", "pi"],
    placeholders: ["r"],
  },
  {
    id: "triangle_perimeter",
    name: "Triangle Perimeter",
    latex: "P = a + b + c",
    preview: "P = a + b + c",
    description: "Triangle perimeter",
    category: "geometry",
    keywords: ["perimeter", "triangle", "sides"],
    placeholders: ["a", "b", "c"],
  },
  {
    id: "pythagorean",
    name: "Pythagorean Theorem",
    latex: "c^2 = a^2 + b^2",
    preview: "c² = a² + b²",
    description: "Pythagorean theorem",
    category: "geometry",
    keywords: ["pythagorean", "triangle", "hypotenuse"],
    placeholders: ["a", "b", "c"],
  },
  {
    id: "trig_identity",
    name: "Trigonometric Identity",
    latex: "\\sin^2 x + \\cos^2 x = 1",
    preview: "sin²x + cos²x = 1",
    description: "Basic trig identity",
    category: "geometry",
    keywords: ["trigonometry", "identity", "sin", "cos"],
    placeholders: ["x"],
  },

  // Matrices
  {
    id: "matrix",
    name: "Matrix",
    latex: "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}",
    preview: "[a b; c d]",
    description: "2x2 matrix",
    category: "matrices",
    keywords: ["matrix", "array", "linear"],
    placeholders: ["a", "b", "c", "d"],
  },
  {
    id: "determinant",
    name: "Determinant",
    latex: "\\left| \\begin{matrix} a & b \\\\ c & d \\end{matrix} \\right|",
    preview: "|a b; c d|",
    description: "Matrix determinant",
    category: "matrices",
    keywords: ["determinant", "matrix", "det"],
    placeholders: ["a", "b", "c", "d"],
  },
  {
    id: "identity",
    name: "Identity Matrix",
    latex: "I = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}",
    preview: "I = [1 0; 0 1]",
    description: "Identity matrix",
    category: "matrices",
    keywords: ["identity", "matrix", "unit"],
    placeholders: [],
  },

  // Sets and Logic
  {
    id: "union",
    name: "Union",
    latex: "A \\cup B",
    preview: "A ∪ B",
    description: "Set union",
    category: "sets",
    keywords: ["union", "set", "or"],
    placeholders: ["A", "B"],
  },
  {
    id: "intersection",
    name: "Intersection",
    latex: "A \\cap B",
    preview: "A ∩ B",
    description: "Set intersection",
    category: "sets",
    keywords: ["intersection", "set", "and"],
    placeholders: ["A", "B"],
  },
  {
    id: "subset",
    name: "Subset",
    latex: "A \\subseteq B",
    preview: "A ⊆ B",
    description: "Subset relation",
    category: "sets",
    keywords: ["subset", "contained", "relation"],
    placeholders: ["A", "B"],
  },
  {
    id: "element",
    name: "Element",
    latex: "x \\in A",
    preview: "x ∈ A",
    description: "Element of set",
    category: "sets",
    keywords: ["element", "member", "in"],
    placeholders: ["x", "A"],
  },
  {
    id: "logical_and",
    name: "Logical AND",
    latex: "p \\land q",
    preview: "p ∧ q",
    description: "Logical conjunction",
    category: "sets",
    keywords: ["and", "logic", "conjunction"],
    placeholders: ["p", "q"],
  },
  {
    id: "logical_or",
    name: "Logical OR",
    latex: "p \\lor q",
    preview: "p ∨ q",
    description: "Logical disjunction",
    category: "sets",
    keywords: ["or", "logic", "disjunction"],
    placeholders: ["p", "q"],
  },
];

const symbolGroups = {
  greek: {
    name: "Greek Letters",
    symbols: [
      { latex: "\\alpha", symbol: "α", name: "alpha" },
      { latex: "\\beta", symbol: "β", name: "beta" },
      { latex: "\\gamma", symbol: "γ", name: "gamma" },
      { latex: "\\delta", symbol: "δ", name: "delta" },
      { latex: "\\epsilon", symbol: "ε", name: "epsilon" },
      { latex: "\\theta", symbol: "θ", name: "theta" },
      { latex: "\\lambda", symbol: "λ", name: "lambda" },
      { latex: "\\mu", symbol: "μ", name: "mu" },
      { latex: "\\pi", symbol: "π", name: "pi" },
      { latex: "\\sigma", symbol: "σ", name: "sigma" },
      { latex: "\\phi", symbol: "φ", name: "phi" },
      { latex: "\\omega", symbol: "ω", name: "omega" },
      { latex: "\\Delta", symbol: "Δ", name: "Delta" },
      { latex: "\\Sigma", symbol: "Σ", name: "Sigma" },
      { latex: "\\Omega", symbol: "Ω", name: "Omega" },
    ],
  },
  operators: {
    name: "Operators",
    symbols: [
      { latex: "\\pm", symbol: "±", name: "plus minus" },
      { latex: "\\times", symbol: "×", name: "times" },
      { latex: "\\div", symbol: "÷", name: "divide" },
      { latex: "\\neq", symbol: "≠", name: "not equal" },
      { latex: "\\leq", symbol: "≤", name: "less equal" },
      { latex: "\\geq", symbol: "≥", name: "greater equal" },
      { latex: "\\approx", symbol: "≈", name: "approximately" },
      { latex: "\\infty", symbol: "∞", name: "infinity" },
      { latex: "\\partial", symbol: "∂", name: "partial" },
      { latex: "\\nabla", symbol: "∇", name: "nabla" },
    ],
  },
  arrows: {
    name: "Arrows",
    symbols: [
      { latex: "\\rightarrow", symbol: "→", name: "right arrow" },
      { latex: "\\leftarrow", symbol: "←", name: "left arrow" },
      { latex: "\\leftrightarrow", symbol: "↔", name: "left right arrow" },
      { latex: "\\Rightarrow", symbol: "⇒", name: "right double arrow" },
      { latex: "\\Leftarrow", symbol: "⇐", name: "left double arrow" },
      {
        latex: "\\Leftrightarrow",
        symbol: "⇔",
        name: "left right double arrow",
      },
    ],
  },
};

const categories = [
  { id: "basic", name: "Basic Math", icon: "+" },
  { id: "algebra", name: "Algebra", icon: "x" },
  { id: "calculus", name: "Calculus", icon: "∫" },
  { id: "geometry", name: "Geometry", icon: "△" },
  { id: "matrices", name: "Matrices", icon: "[]" },
  { id: "sets", name: "Sets & Logic", icon: "∪" },
  { id: "symbols", name: "Symbols", icon: "α" },
];

const MathEquationEditor = ({ editor, onInsert }: MathEquationEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("basic");
  const [isEditing, setIsEditing] = useState(false);
  const [currentEquation, setCurrentEquation] = useState("");
  const [equationMode, setEquationMode] = useState<"inline" | "block">(
    "inline"
  );

  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Filter templates based on search
  const filteredTemplates = mathTemplates.filter((template) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      template.name.toLowerCase().includes(search) ||
      template.description.toLowerCase().includes(search) ||
      template.keywords.some((keyword) => keyword.includes(search)) ||
      template.latex.toLowerCase().includes(search)
    );
  });

  // Define a type for the symbol group keys
  type SymbolGroupKey = keyof typeof symbolGroups;

  // Filter symbols based on search
  const filteredSymbols = (
    Object.entries(symbolGroups) as [
      SymbolGroupKey,
      (typeof symbolGroups)[SymbolGroupKey]
    ][]
  ).reduce((acc, [key, group]) => {
    const filtered = group.symbols.filter((symbol) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        symbol.name.toLowerCase().includes(search) ||
        symbol.symbol.includes(search) ||
        symbol.latex.toLowerCase().includes(search)
      );
    });
    if (filtered.length > 0) {
      acc[key] = { ...group, symbols: filtered };
    }
    return acc;
  }, {} as Partial<typeof symbolGroups>);

  // Convert LaTeX to readable format
  const convertLatexToReadable = (latex: string): string => {
    let readable = latex;

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
    ];

    conversions.forEach(([pattern, replacement]) => {
      readable = readable.replace(pattern as RegExp, replacement as string);
    });

    return readable.trim();
  };

  // Convert readable format back to LaTeX
  const convertReadableToLatex = (readable: string): string => {
    if (!readable) return "";

    let latex = readable;

    const conversions = [
      // Reverse conversions - order matters!
      [/$$([^)]+)$$\s*\/\s*$$([^)]+)$$/g, "\\frac{$1}{$2}"],
      [/([^/\s]+)\s*\/\s*([^/\s]+)/g, "\\frac{$1}{$2}"],
      [/√$$([^)]+)$$/g, "\\sqrt{$1}"],
      [/√([^\s+\-*/]+)/g, "\\sqrt{$1}"],
      [/([a-zA-Z0-9]+)\^([0-9]+)/g, "$1^{$2}"],
      [/([a-zA-Z0-9]+)\^$$([^)]+)$$/g, "$1^{$2}"],
      [/([a-zA-Z0-9]+)₍([^₎]+)₎/g, "$1_{$2}"],
      [/∑$$([^)]+)$$/g, "\\sum_{$1}"],
      [/∫\[([^\]]+)\]/g, "\\int_{$1}"],
      [/lim$$([^)]+)$$/g, "\\lim_{$1}"],
      [/α/g, "\\alpha"],
      [/β/g, "\\beta"],
      [/γ/g, "\\gamma"],
      [/δ/g, "\\delta"],
      [/ε/g, "\\epsilon"],
      [/θ/g, "\\theta"],
      [/λ/g, "\\lambda"],
      [/μ/g, "\\mu"],
      [/π/g, "\\pi"],
      [/σ/g, "\\sigma"],
      [/φ/g, "\\phi"],
      [/ω/g, "\\omega"],
      [/Δ/g, "\\Delta"],
      [/Σ/g, "\\Sigma"],
      [/Ω/g, "\\Omega"],
      [/±/g, "\\pm"],
      [/×/g, "\\times"],
      [/÷/g, "\\div"],
      [/≠/g, "\\neq"],
      [/≤/g, "\\leq"],
      [/≥/g, "\\geq"],
      [/≈/g, "\\approx"],
      [/∞/g, "\\infty"],
      [/∂/g, "\\partial"],
      [/∇/g, "\\nabla"],
      [/→/g, "\\rightarrow"],
      [/←/g, "\\leftarrow"],
      [/↔/g, "\\leftrightarrow"],
      [/⇒/g, "\\Rightarrow"],
      [/⇐/g, "\\Leftarrow"],
      [/⇔/g, "\\Leftrightarrow"],
      [/∪/g, "\\cup"],
      [/∩/g, "\\cap"],
      [/⊆/g, "\\subseteq"],
      [/∈/g, "\\in"],
      [/∧/g, "\\land"],
      [/∨/g, "\\lor"],
      [/sin/g, "\\sin"],
      [/cos/g, "\\cos"],
      [/tan/g, "\\tan"],
    ];

    conversions.forEach(([pattern, replacement]) => {
      latex = latex.replace(pattern as RegExp, replacement as string);
    });

    return latex.trim();
  };

  const insertTemplate = (template: MathTemplate) => {
    if (editor) {
      editor.chain().focus().setMath(template.latex).run();
    }
    if (onInsert) {
      onInsert(template.latex);
    }
    setIsOpen(false);
  };

  const insertSymbol = (symbol: { latex: string; symbol: string }) => {
    if (currentEquation && isEditing) {
      setCurrentEquation(currentEquation + symbol.latex + " ");
    } else if (editor) {
      editor.chain().focus().setMath(symbol.latex).run();
      setIsOpen(false);
    }
  };

  const startCustomEquation = () => {
    setIsEditing(true);
    setCurrentEquation("");
  };

  const insertCustomEquation = () => {
    if (currentEquation.trim() && editor) {
      editor.chain().focus().setMath(currentEquation).run();
    }
    setIsEditing(false);
    setCurrentEquation("");
    setIsOpen(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setCurrentEquation("");
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        buttonRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Calculator className="h-4 w-4" />
        Insert Equation
      </Button>

      {isOpen && (
        <div
          ref={panelRef}
          className="absolute top-[50px] left-[50%] -translate-x-[50%] mt-2 w-[800px] max-h-[600px] bg-white border rounded-lg shadow-xl z-50 overflow-hidden"
        >
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search equations and symbols..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={equationMode === "inline" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEquationMode("inline")}
                >
                  Inline
                </Button>
                <Button
                  variant={equationMode === "block" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEquationMode("block")}
                >
                  Block
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {isEditing && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Custom Equation</span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={insertCustomEquation}>
                      Insert
                    </Button>
                    <Button variant="outline" size="sm" onClick={cancelEditing}>
                      Cancel
                    </Button>
                  </div>
                </div>
                <Input
                  value={convertLatexToReadable(currentEquation)}
                  onChange={(e) =>
                    setCurrentEquation(convertReadableToLatex(e.target.value))
                  }
                  placeholder="Enter equation (e.g., x = (-b ± √(b² - 4ac)) / 2a)"
                  className="font-serif mb-2"
                />
                {currentEquation && (
                  <div className="text-sm text-gray-600">
                    LaTeX:{" "}
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      {currentEquation}
                    </code>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex h-[500px]">
            <div className="w-48 border-r bg-gray-50">
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startCustomEquation}
                  className="w-full justify-start gap-2 mb-2"
                >
                  <Plus className="h-4 w-4" />
                  Custom Equation
                </Button>
              </div>
              <Tabs
                value={activeCategory}
                onValueChange={setActiveCategory}
                orientation="vertical"
              >
                <TabsList className="flex-col h-auto w-full bg-transparent">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="w-full justify-start gap-2 data-[state=active]:bg-white"
                    >
                      <span className="text-lg">{category.icon}</span>
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="flex-1 overflow-y-auto">
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                {categories.slice(0, -1).map((category) => (
                  <TabsContent
                    key={category.id}
                    value={category.id}
                    className="p-4"
                  >
                    <div className="grid grid-cols-1 gap-3">
                      {filteredTemplates
                        .filter((template) => template.category === category.id)
                        .map((template) => (
                          <Card
                            key={template.id}
                            className="hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-sm">
                                      {template.name}
                                    </h4>
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {template.category}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-600 mb-2">
                                    {template.description}
                                  </p>
                                  <div className="flex items-center gap-4">
                                    <div className="font-serif text-lg text-blue-600">
                                      {template.preview}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      LaTeX:{" "}
                                      <code className="bg-gray-100 px-1 py-0.5 rounded">
                                        {template.latex}
                                      </code>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => insertTemplate(template)}
                                  className="ml-4"
                                >
                                  Insert
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                ))}

                <TabsContent value="symbols" className="p-4">
                  <div className="space-y-6">
                    {Object.entries(filteredSymbols).map(([key, group]) => (
                      <div key={key}>
                        <h3 className="font-medium text-sm mb-3">
                          {group.name}
                        </h3>
                        <div className="grid grid-cols-8 gap-2">
                          {group.symbols.map((symbol, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => insertSymbol(symbol)}
                              className="h-12 w-12 text-lg font-serif hover:bg-blue-50"
                              title={`${symbol.name} (${symbol.latex})`}
                            >
                              {symbol.symbol}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MathEquationEditor;
