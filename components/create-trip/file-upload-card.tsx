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
    <div className="relative w-full max-w-full mb-4 overflow-hidden">
      <Label className="mb-2 block text-sm">{label}</Label>

      <div
        className="flex flex-col items-center justify-center gap-3 
                 rounded-lg border border-dashed border-gray-300 
                 bg-gray-50 p-6 cursor-pointer 
                 w-full max-w-full overflow-hidden box-border"
        onClick={handleDropAreaClick}
      >
        <img
          src="/itinerary.jpg"
          alt=""
          className="h-14 w-14 object-contain flex-shrink-0"
        />

        <div className="text-sm text-gray-600 text-center break-words max-w-full px-2">
          {file ? `Selected: ${file.name}` : "No file selected"}
        </div>

        {error && (
          <div className="text-red-500 text-xs text-center">{error}</div>
        )}

        <div className="flex gap-3 flex-wrap justify-center max-w-full">
          <Input
            ref={inputRef}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={onFileChange}
            aria-label={label}
          />
          {!file ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={(e) => e.stopPropagation()}
            >
              Choose File
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="rounded-full"
            >
              Clear
            </Button>
          )}
        </div>

        <p className="text-center text-gray-500 text-sm mt-2">
          Or create itinerary below
        </p>
      </div>
    </div>
  );
}
