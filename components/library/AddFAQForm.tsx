"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";

type AddFAQFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any) => void;
};

export function AddFAQForm({
  mode = "library",
  onCancel,
  onSave,
}: AddFAQFormProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);

  const handleLibrarySelect = (item: any) => {
    setQuestion(item.title || "");
    setAnswer(item.description || "");
  };

  const handleSubmit = () => {
    onSave({ question, answer, mode });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top-right button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          className="text-orange-500 border-orange-500 hover:bg-orange-50"
          onClick={() => setLibraryOpen(true)}
        >
          Choose from Library
        </Button>
      </div>

      {/* Question */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question *
        </label>
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter question"
          maxLength={200}
        />
        <p className="text-xs text-right text-gray-400 mt-1">
          {question.length}/200 Characters
        </p>
      </div>

      {/* Answer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Answer *
        </label>
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter answer"
          rows={5}
          maxLength={1000}
        />
        <p className="text-xs text-right text-gray-400 mt-1">
          {answer.length}/1000 Characters
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center gap-4 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="rounded-full px-6 bg-gradient-to-r from-orange-400 to-pink-500 text-white"
        >
          Save
        </Button>
      </div>

      {/* Library Modal */}
      <LibrarySelectModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={handleLibrarySelect}
        category="faqs"
      />
    </div>
  );
}
