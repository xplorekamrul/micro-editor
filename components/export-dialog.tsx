"use client"

import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDown, FileText, Globe, Code } from "lucide-react"

interface ExportDialogProps {
  editor: Editor
  isOpen: boolean
  onClose: () => void
}

const ExportDialog = ({ editor, isOpen, onClose }: ExportDialogProps) => {
  const exportAsHTML = () => {
    const html = editor.getHTML()
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "document.html"
    a.click()
    URL.revokeObjectURL(url)
    onClose()
  }

  const exportAsJSON = () => {
    const json = JSON.stringify(editor.getJSON(), null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "document.json"
    a.click()
    URL.revokeObjectURL(url)
    onClose()
  }

  const exportAsText = () => {
    const text = editor.getText()
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "document.txt"
    a.click()
    URL.revokeObjectURL(url)
    onClose()
  }

  const printDocument = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Document</title>
            <link href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css" rel="stylesheet">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
              .math-node { display: inline-block; }
              table { border-collapse: collapse; width: 100%; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            ${editor.getHTML()}
            <script src="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js"></script>
            <script>
              document.addEventListener('DOMContentLoaded', function() {
                const mathElements = document.querySelectorAll('[data-type="mathematics"]');
                mathElements.forEach(function(element) {
                  const latex = element.textContent;
                  katex.render(latex, element, { throwOnError: false });
                });
                setTimeout(() => window.print(), 500);
              });
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Document</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={exportAsHTML}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5" />
                HTML
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Export as HTML file with embedded styles and math equations</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={exportAsJSON}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Code className="h-5 w-5" />
                JSON
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Export as JSON format for re-importing into the editor</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={exportAsText}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Plain Text
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Export as plain text file (formatting will be removed)</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={printDocument}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileDown className="h-5 w-5" />
                Print/PDF
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Print document or save as PDF using browser print dialog</p>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ExportDialog
