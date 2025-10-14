"use client"

import type React from "react"

import { useMemo } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react"

type Props = {
  value: string
  onChange: (val: string) => void
  maxWords?: number
  placeholder?: string
  className?: string
}

export function RichTextarea({ value, onChange, maxWords = 500, placeholder = "Enter here", className }: Props) {
  const wordCount = useMemo(() => {
    const w = value.trim().split(/\s+/).filter(Boolean)
    return w.length
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value
    const words = next.trim().split(/\s+/).filter(Boolean)
    if (words.length <= maxWords) {
      onChange(next)
      return
    }
    // prevent exceeding max words by trimming
    const trimmed = words.slice(0, maxWords).join(" ")
    onChange(trimmed + (/\s$/.test(next) ? " " : ""))
  }

  return (
    <div className={`rounded-lg border bg-muted/30 ${className ?? ""}`}>
      {/* Toolbar (presentational, accessible, no formatting applied) */}
      <div className="flex items-center gap-1 border-b bg-muted px-2 py-1.5">
        <span className="sr-only">Formatting toolbar</span>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" aria-label="Bold">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" aria-label="Italic">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" aria-label="Underline">
          <Underline className="h-4 w-4" />
        </Button>
        <div className="mx-1 h-4 w-px bg-border" aria-hidden />
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" aria-label="Bulleted list">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" aria-label="Numbered list">
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative">
        <Textarea
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          className="min-h-[120px] border-0 bg-transparent p-3 focus-visible:ring-0"
        />
        <div className="pointer-events-none absolute bottom-2 right-3 text-xs text-muted-foreground">
          {wordCount}/{maxWords} Words
        </div>
      </div>
    </div>
  )
}
