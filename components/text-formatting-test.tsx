"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Editor } from "@tiptap/react"

interface TextFormattingTestProps {
  editor: Editor
}

const TextFormattingTest = ({ editor }: TextFormattingTestProps) => {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})

  const runTests = () => {
    const results: Record<string, boolean> = {}

    // Test 1: Text Color Application
    try {
      editor.chain().focus().selectAll().setColor("#FF0000").run()
      const hasColor = editor.getAttributes("textStyle").color === "#FF0000"
      results["Text Color"] = hasColor
    } catch (error) {
      results["Text Color"] = false
    }

    // Test 2: Highlight Application
    try {
      editor.chain().focus().selectAll().setHighlight({ color: "#FFFF00" }).run()
      const hasHighlight = editor.getAttributes("highlight").color === "#FFFF00"
      results["Highlight Color"] = hasHighlight
    } catch (error) {
      results["Highlight Color"] = false
    }

    // Test 3: Color Removal
    try {
      editor.chain().focus().selectAll().unsetColor().run()
      const colorRemoved = !editor.getAttributes("textStyle").color
      results["Color Removal"] = colorRemoved
    } catch (error) {
      results["Color Removal"] = false
    }

    // Test 4: Highlight Removal
    try {
      editor.chain().focus().selectAll().unsetHighlight().run()
      const highlightRemoved = !editor.isActive("highlight")
      results["Highlight Removal"] = highlightRemoved
    } catch (error) {
      results["Highlight Removal"] = false
    }

    setTestResults(results)
  }

  const insertTestText = () => {
    editor
      .chain()
      .focus()
      .clearContent()
      .insertContent(`
      <p>This is test text for color formatting.</p>
      <p>Select this text and try applying colors and highlights.</p>
      <p>The formatting should work immediately upon selection.</p>
    `)
      .run()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Color Formatting Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button onClick={insertTestText} className="w-full">
            Insert Test Text
          </Button>
          <Button onClick={runTests} variant="outline" className="w-full">
            Run Formatting Tests
          </Button>
        </div>

        {Object.keys(testResults).length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Test Results:</h4>
            {Object.entries(testResults).map(([test, passed]) => (
              <div key={test} className="flex items-center justify-between">
                <span className="text-sm">{test}</span>
                <span className={`text-sm font-medium ${passed ? "text-green-600" : "text-red-600"}`}>
                  {passed ? "✓ Pass" : "✗ Fail"}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-gray-600">
          <p>Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click "Insert Test Text"</li>
            <li>Select some text in the editor</li>
            <li>Try the color and highlight buttons</li>
            <li>Run tests to verify functionality</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}

export default TextFormattingTest
