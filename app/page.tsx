"use client"

import EnhancedRichTextEditor from "@/components/enhanced-rich-text-editor"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        {/* <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rich Editor</h1>
          <p className="text-gray-600">
            A comprehensive rich text editor with advanced table creation, drawing tools, shape insertion, mathematical
            symbols, and robust error handling for educational content creation.
          </p>
        </div> */}
        <EnhancedRichTextEditor />
      </div>
    </div>
  )
}
