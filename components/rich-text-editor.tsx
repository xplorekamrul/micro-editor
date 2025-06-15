"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { FontSize } from "./font-size-extension";

import EditorToolbar from "./editor-toolbar";
import { useState } from "react";
import { MathExtension } from "./math-extension";

const RichTextEditor = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      FontSize.configure({
        types: ["textStyle"],
      }),
      Color,
      Highlight.configure({ multicolor: true }).extend({
        renderHTML({ HTMLAttributes }) {
          return ["mark", HTMLAttributes, 0];
        },
      }),
      FontFamily.configure({
        types: ["textStyle"],
      }),
      Superscript,
      Subscript,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      MathExtension,
    ],
    content: `
      <h1>Welcome to the Digital Classroom Editor</h1>
      <p>This is a fully-featured rich text editor with mathematical equation support. Try the following features:</p>
      
      <h2>Text Formatting</h2>
      <p>You can make text <strong>bold</strong>, <em>italic</em>, <u>underlined</u>, or <s>strikethrough</s>.</p>
      <p>You can also use <sup>superscript</sup> and <sub>subscript</sub> formatting.</p>
      
      <h2>Mathematical Equations</h2>
      <p>Here's the quadratic formula:</p>
      <p><span class="math-equation" data-latex="x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}">x = (-b ± √(b² - 4ac)) / 2a</span></p>
      
      <p>And here's Einstein's famous equation:</p>
      <p><span class="math-equation" data-latex="E = mc^2">E = mc²</span></p>
      
      <p>More examples:</p>
      <p><span class="math-equation" data-latex="\\sum_{i=1}^{n} x_i">∑(i=1 to n) xᵢ</span></p>
      <p><span class="math-equation" data-latex="\\int_{a}^{b} f(x) dx">∫[a to b] f(x) dx</span></p>
      
      <h2>Lists and Alignment</h2>
      <ul>
        <li>Bulleted lists work great</li>
        <li>Perfect for organizing content</li>
        <li>Easy to create and modify</li>
      </ul>
      
      <ol>
        <li>Numbered lists too</li>
        <li>Great for step-by-step instructions</li>
        <li>Automatically numbered</li>
      </ol>
      
      <h2>Tables</h2>
      <table>
        <tbody>
          <tr>
            <th>Subject</th>
            <th>Grade</th>
            <th>Notes</th>
          </tr>
          <tr>
            <td>Mathematics</td>
            <td>A+</td>
            <td>Excellent work on equations</td>
          </tr>
          <tr>
            <td>Physics</td>
            <td>A</td>
            <td>Good understanding of concepts</td>
          </tr>
        </tbody>
      </table>
    `,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-4",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-lg ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      <EditorToolbar
        editor={editor}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
      />
      <div className={`border-t ${isFullscreen ? "h-full overflow-auto" : ""}`}>
        <EditorContent
          editor={editor}
          className={isFullscreen ? "h-full" : "min-h-[600px]"}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
