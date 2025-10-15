"use client";

import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

export function FileUploadCard({
  label = "Upload PDF Itinerary",
  accept = ".pdf",
}: {
  label?: string;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB limit

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0] ?? null;

    if (selectedFile) {
      if (!selectedFile.type.includes("pdf")) {
        setError("Please select a PDF file.");
        setFile(null);
        return;
      }
      if (selectedFile.size > maxSizeInBytes) {
        setError("File size exceeds 5MB limit.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDropAreaClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="rounded-xl bg-card p-4">
      <Label className="mb-2 block text-sm">{label}</Label>
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-gray-50 p-6 cursor-pointer"
        onClick={handleDropAreaClick}
      >
        <img src="/itinerary.jpg" alt="" className="h-14 w-14" />
        <div className="text-sm text-muted-foreground">
          {file ? `Selected: ${file.name}` : "No file selected"}
        </div>
        {error && <div className="text-red-500 text-xs">{error}</div>}
        <div className="flex gap-3">
          <Input
            ref={inputRef}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={onFileChange}
            aria-label={label}
          />
          {!file ? (
            <Button variant="outline" className="rounded-full">
              Choose File
            </Button>
          ) : (
            <Button variant="outline" onClick={clearFile} className="rounded-full">
              Clear
            </Button>
          )}
        </div>
        <p className="text-center text-gray-500 mt-4">
                  Or create itinerary below
                </p>
      </div>
    </div>
  );
}
