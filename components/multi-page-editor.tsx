"use client"

import { useState, useRef, useEffect } from "react"
import { EditorContent } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, FileText, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import type { Editor } from "@tiptap/react"

interface Page {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

interface MultiPageEditorProps {
  editor: Editor
  isFullscreen: boolean
}

const MultiPageEditor = ({ editor, isFullscreen }: MultiPageEditorProps) => {
  const [pages, setPages] = useState<Page[]>([
    {
      id: "page-1",
      title: "Page 1",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])
  const [currentPageId, setCurrentPageId] = useState("page-1")
  const [pageContents, setPageContents] = useState<Record<string, string>>({})
  const editorRef = useRef<HTMLDivElement>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const currentPage = pages.find((page) => page.id === currentPageId)

  useEffect(() => {
    if (editor && currentPage) {
      // Save current content before switching
      if (currentPageId && pageContents[currentPageId] !== editor.getHTML()) {
        setPageContents((prev) => ({
          ...prev,
          [currentPageId]: editor.getHTML(),
        }))
      }

      // Load content for current page
      const content =
        pageContents[currentPageId] ||
        currentPage.content ||
        `
        <h1>${currentPage.title}</h1>
        <p>Start writing your content here...</p>
      `

      if (editor.getHTML() !== content) {
        editor.commands.setContent(content)
      }
    }
  }, [currentPageId, editor])

  useEffect(() => {
    if (editor) {
      const handleUpdate = () => {
        const content = editor.getHTML()
        setPageContents((prev) => ({
          ...prev,
          [currentPageId]: content,
        }))

        // Update page updated time
        setPages((prev) => prev.map((page) => (page.id === currentPageId ? { ...page, updatedAt: new Date() } : page)))
      }

      editor.on("update", handleUpdate)
      return () => {
        editor.off("update", handleUpdate)
      }
    }
  }, [editor, currentPageId])

  const addNewPage = () => {
    const newPageId = `page-${Date.now()}`
    const newPage: Page = {
      id: newPageId,
      title: `Page ${pages.length + 1}`,
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setPages((prev) => [...prev, newPage])
    setCurrentPageId(newPageId)
  }

  const deletePage = (pageId: string) => {
    if (pages.length <= 1) return // Don't delete the last page

    setPages((prev) => prev.filter((page) => page.id !== pageId))
    setPageContents((prev) => {
      const newContents = { ...prev }
      delete newContents[pageId]
      return newContents
    })

    if (currentPageId === pageId) {
      setCurrentPageId(pages[0].id === pageId ? pages[1].id : pages[0].id)
    }
  }

  const updatePageTitle = (pageId: string, newTitle: string) => {
    setPages((prev) =>
      prev.map((page) => (page.id === pageId ? { ...page, title: newTitle, updatedAt: new Date() } : page)),
    )
  }

  return (
    <div className={`flex ${isFullscreen ? "h-full" : "h-[600px]"}`}>
      {/* Page Navigation Sidebar */}
      <div
        className={`${isSidebarCollapsed ? "w-12" : "w-64"} border-r bg-gray-50 flex flex-col transition-all duration-300`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-medium transition-opacity ${isSidebarCollapsed ? "opacity-0" : "opacity-100"}`}>
              {!isSidebarCollapsed && "Pages"}
            </h3>
            <div className="flex items-center gap-2">
              {!isSidebarCollapsed && (
                <Button size="sm" onClick={addNewPage} title="Add New Page">
                  <Plus className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="px-2"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4 " />}
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {pages.map((page, index) => (
              <Card
                key={page.id}
                className={`${isSidebarCollapsed ? "p-2" : "p-3"} cursor-pointer transition-colors hover:bg-gray-100 ${
                  currentPageId === page.id ? "bg-blue-50 border-blue-200" : ""
                }`}
                onClick={() => setCurrentPageId(page.id)}
                title={isSidebarCollapsed ? page.title : undefined}
              >
                {isSidebarCollapsed ? (
                  <div className="flex flex-col items-center gap-1">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-medium">{index + 1}</span>
                    {pages.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          deletePage(page.id)
                        }}
                        className="h-5 w-5 p-0 text-gray-400 hover:text-red-500"
                        title="Delete Page"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <input
                          type="text"
                          value={page.title}
                          onChange={(e) => updatePageTitle(page.id, e.target.value)}
                          className="bg-transparent border-none outline-none text-sm font-medium truncate w-full"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <p className="text-xs text-gray-500">Updated {page.updatedAt.toLocaleTimeString()}</p>
                    </div>

                    {pages.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          deletePage(page.id)
                        }}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                        title="Delete Page"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                )}

                {/* Page Preview - only show when expanded */}
                {!isSidebarCollapsed && (
                  <div className="mt-2 text-xs text-gray-600 line-clamp-2">
                    {pageContents[page.id]
                      ? pageContents[page.id].replace(/<[^>]*>/g, "").substring(0, 100) + "..."
                      : "Empty page"}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-white">
          <div className="text-xs text-gray-500">
            {isSidebarCollapsed ? (
              <div className="text-center">{pages.length}</div>
            ) : (
              <div>
                {pages.length} page{pages.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>
      </div>

      {isSidebarCollapsed && (
        <div className="hidden">
          <Button size="sm" onClick={addNewPage} title="Add New Page" className="shadow-lg">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Editor Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto">
          <div className="max-w-full mx-auto p-8">
            {/* Page Header */}
            {/* <div className="mb-6 pb-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">{currentPage?.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Created {currentPage?.createdAt.toLocaleDateString()} • Last updated{" "}
                {currentPage?.updatedAt.toLocaleString()}
              </p>
            </div> */}

            {/* Editor */}
            <div ref={editorRef} className="min-h-[500px] bg-white shadow-sm border rounded-lg">
              <EditorContent
                editor={editor}
                className="prose prose-lg max-w-none p-2 min-h-[500px] focus:outline-none"
              />
            </div>

            {/* Page Footer */}
            <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
              Page {pages.findIndex((p) => p.id === currentPageId) + 1} of {pages.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MultiPageEditor
