"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter here",
  maxLength = 800,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    ul: false,
    ol: false,
  });
  const [activeHeading, setActiveHeading] = useState<"p" | "h1" | "h2" | "h3">("p");
  const isTransformingRef = useRef(false);

  // ✅ Ensure component only runs on client
  useEffect(() => {
    if (typeof window !== "undefined") setMounted(true);
  }, []);
  if (!mounted) return null;

  // === Sync editor from external value ===
  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = editorRef.current;
    if (!el) return;
    if (!isFocused && value !== el.innerHTML && !isTransformingRef.current) {
      el.innerHTML = value || "";
      const text = el.innerText || "";
      setCharCount(text.length);
    }
  }, [value, isFocused]);

  // === Update toolbar state (bold/italic/heading) ===
  const updateActiveFormats = useCallback(() => {
    if (typeof document === "undefined") return;
    const blockTag = (document.queryCommandValue("formatBlock") || "p").toString().toLowerCase();
    setActiveHeading(
      blockTag.includes("h1")
        ? "h1"
        : blockTag.includes("h2")
        ? "h2"
        : blockTag.includes("h3")
        ? "h3"
        : "p"
    );
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      ul: document.queryCommandState("insertUnorderedList"),
      ol: document.queryCommandState("insertOrderedList"),
    });
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const handler = () => updateActiveFormats();
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, [updateActiveFormats]);

  // === Handle input ===
  const handleInput = useCallback(() => {
    if (typeof document === "undefined") return;
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML.trim();
    const text = el.innerText || "";
    setCharCount(text.length);
    onChange(html);
    updateActiveFormats();
  }, [onChange, updateActiveFormats]);

  // === Helper: restore caret ===
  const placeCaretAtEnd = (el: HTMLElement) => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  // === Markdown shortcut transform ===
  const handleMarkdownKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (typeof document === "undefined" || typeof window === "undefined") return;
    if (e.key !== " " && e.key !== "Enter") return;
    const el = editorRef.current;
    if (!el) return;

    const selection = document.getSelection();
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const container = range.startContainer;
    const block =
      container.nodeType === 3 ? container.parentElement : (container as HTMLElement);
    if (!block) return;

    const text = block.innerText.trimStart();

    setTimeout(() => {
      if (/^#{1,3}\s/.test(text)) {
        isTransformingRef.current = true;
        const level = text.match(/^#{1,3}/)![0].length;
        const clean = text.replace(/^#{1,3}\s/, "");
        block.innerHTML = `<h${level}>${clean}</h${level}>`;
        placeCaretAtEnd(block.querySelector(`h${level}`)!);
        handleInput();
        isTransformingRef.current = false;
      } else if (/^(\*|-)\s/.test(text)) {
        isTransformingRef.current = true;
        const clean = text.replace(/^(\*|-)\s/, "");
        block.innerHTML = `<ul><li>${clean}</li></ul>`;
        placeCaretAtEnd(block.querySelector("li")!);
        handleInput();
        isTransformingRef.current = false;
      } else if (/^\d+\.\s/.test(text)) {
        isTransformingRef.current = true;
        const clean = text.replace(/^\d+\.\s/, "");
        block.innerHTML = `<ol><li>${clean}</li></ol>`;
        placeCaretAtEnd(block.querySelector("li")!);
        handleInput();
        isTransformingRef.current = false;
      }
    }, 0);
  };

  // === Formatting commands ===
  const applyFormat = (cmd: string) => {
    if (typeof document === "undefined") return;
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    document.execCommand(cmd, false);
    setTimeout(() => handleInput(), 0);
  };

  const applyBlockFormat = (tag: "p" | "h1" | "h2" | "h3") => {
    if (typeof document === "undefined") return;
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    document.execCommand("formatBlock", false, tag);
    setTimeout(() => handleInput(), 0);
  };

  const insertList = (type: "ul" | "ol") => {
    if (typeof document === "undefined") return;
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    document.execCommand(
      type === "ul" ? "insertUnorderedList" : "insertOrderedList",
      false
    );
    setTimeout(() => handleInput(), 50);
  };

  const setAlign = (align: "left" | "center" | "right") => {
    if (typeof document === "undefined") return;
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const cmd =
      align === "left"
        ? "justifyLeft"
        : align === "center"
        ? "justifyCenter"
        : "justifyRight";
    document.execCommand(cmd, false);
    setTimeout(() => handleInput(), 0);
  };

  // === Max length enforcement ===
  const handleBeforeInput = (e: InputEvent) => {
    if (typeof document === "undefined") return;
    const el = editorRef.current;
    if (!el) return;
    const text = el.innerText || "";
    const incoming = e.data ?? "";
    const sel = document.getSelection();
    const selectedText = sel?.toString() || "";
    const newLength = text.length - selectedText.length + incoming.length;
    if (newLength > maxLength) e.preventDefault();
  };

  // === Paste event ===
  const handlePaste = (e: ClipboardEvent) => {
    if (typeof document === "undefined") return;
    e.preventDefault();
    const el = editorRef.current;
    if (!el) return;
    const paste = e.clipboardData?.getData("text/plain") || "";
    document.execCommand("insertText", false, paste);
    setTimeout(() => handleInput(), 0);
  };

  // === Attach listeners ===
  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = editorRef.current;
    if (!el) return;
    el.addEventListener("beforeinput", (e) => handleBeforeInput(e as InputEvent));
    el.addEventListener("paste", (e) => handlePaste(e as ClipboardEvent));
  }, []);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-orange-400 transition">
      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-2 px-3 py-2 border-b border-gray-100 text-gray-600 text-sm bg-white">
        <ToolbarButton
          active={activeFormats.bold}
          onClick={() => applyFormat("bold")}
          icon={<Bold className="w-4 h-4" />}
        />
        <ToolbarButton
          active={activeFormats.italic}
          onClick={() => applyFormat("italic")}
          icon={<Italic className="w-4 h-4" />}
        />
        <ToolbarButton
          active={activeFormats.underline}
          onClick={() => applyFormat("underline")}
          icon={<Underline className="w-4 h-4" />}
        />

        <div className="h-4 w-px bg-gray-200 mx-1" />

        <ToolbarButton
          active={activeFormats.ul}
          onClick={() => insertList("ul")}
          icon={<List className="w-4 h-4" />}
        />
        <ToolbarButton
          active={activeFormats.ol}
          onClick={() => insertList("ol")}
          icon={<ListOrdered className="w-4 h-4" />}
        />

        <div className="h-4 w-px bg-gray-200 mx-1" />

        <ToolbarButton onClick={() => setAlign("left")} icon={<AlignLeft className="w-4 h-4" />} />
        <ToolbarButton onClick={() => setAlign("center")} icon={<AlignCenter className="w-4 h-4" />} />
        <ToolbarButton onClick={() => setAlign("right")} icon={<AlignRight className="w-4 h-4" />} />
        <ToolbarButton onClick={() => setShowPreview(true)} icon={<Eye className="w-4 h-4" />} />
      </div>

      {/* Editable Area */}
      <div className="relative bg-white">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => setTimeout(() => handleInput(), 0)}
          onKeyUp={handleMarkdownKey}
          onFocus={() => {
            setIsFocused(true);
            updateActiveFormats();
          }}
          onBlur={() => {
            setIsFocused(false);
            const el = editorRef.current;
            if (el) onChange(el.innerHTML);
            updateActiveFormats();
          }}
          className="w-full px-3 py-3 text-sm text-gray-800 focus:outline-none min-h-[120px] max-h-[250px] overflow-y-auto prose prose-sm max-w-none"
          data-placeholder={placeholder}
        />
        <span className="absolute bottom-2 right-3 text-xs text-orange-500">
          {charCount}/{maxLength} Characters
        </span>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-sm"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              Preview
            </h2>

            <div
              className="prose prose-sm max-w-none text-gray-800"
              dangerouslySetInnerHTML={{
                __html: value || "<p><em>No content yet</em></p>",
              }}
            />
          </div>
        </div>
      )}

      {/* === Inline Styling === */}
      <style jsx>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }

        /* Headings */
        :global(.prose h1) {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0.5rem 0;
          color: #111827;
        }
        :global(.prose h2) {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.4rem 0;
          color: #1f2937;
        }
        :global(.prose h3) {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0.3rem 0;
          color: #374151;
        }

        /* Lists */
        :global(.prose ul),
        :global(.prose ol) {
          margin-left: 1.5rem;
          padding-left: 0.5rem;
        }
        :global(.prose li) {
          margin-bottom: 0.25rem;
        }

        /* Focus */
        :global(div[contenteditable]:focus) {
          outline: none;
        }
      `}</style>
    </div>
  );
}

// === Toolbar Button Component ===
function ToolbarButton({
  icon,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded-md transition-colors ${
        active
          ? "bg-orange-100 text-orange-600"
          : "hover:bg-gray-100 active:bg-gray-200 text-gray-600"
      }`}
    >
      {icon}
    </button>
  );
}
