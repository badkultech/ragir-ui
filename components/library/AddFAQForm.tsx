"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";
import {
  useCreateOrganizerFaqMutation,
  useUpdateOrganizerFaqMutation,
  useGetOrganizerFaqByIdQuery,
} from "@/lib/services/organizer/trip/library/faq";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { skipToken } from "@reduxjs/toolkit/query";

type AddFAQFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any) => void;
  updateId?: number | null; // 👈 added for edit mode
};

export function AddFAQForm({
  mode = "library",
  onCancel,
  onSave,
  updateId,
}: AddFAQFormProps) {
  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);

  // Mutations
  const [createFaq, { isLoading: creating }] = useCreateOrganizerFaqMutation();
  const [updateFaq, { isLoading: updating }] = useUpdateOrganizerFaqMutation();

  // 👇 Fetch FAQ by ID if editing
  const {
    data: existingFaq,
    isLoading: loadingFaq,
  } = useGetOrganizerFaqByIdQuery(
    updateId && organizationId
      ? { organizationId, faqId: updateId }
      : skipToken
  );

  // 👇 Prefill when data arrives
  useEffect(() => {
    if (existingFaq) {
      setQuestion(existingFaq.name || "");
      setAnswer(existingFaq.answer || "");
    }
  }, [existingFaq]);

  const handleLibrarySelect = (item: any) => {
    setQuestion(item.title || "");
    setAnswer(item.answer || "");
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", question);
    formData.append("answer", answer);

    try {
      if (updateId) {
        await updateFaq({
          organizationId,
          faqId: updateId,
          data: formData,
        }).unwrap();
      } else {
        await createFaq({
          organizationId,
          data: formData,
        }).unwrap();
      }
      onSave({ question, answer });
    } catch (err) {
      console.error("Error saving FAQ:", err);
    }
  };

  if (loadingFaq) {
    return (
      <div className="text-center text-gray-500 py-10">
        Loading FAQ details...
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-6"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
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
        <label className="block text-[0.95rem] font-medium mb-2">
          Question *
        </label>
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter question"
          maxLength={200}
        />
        <p className="text-xs text-right text-orange-500 mt-1">
          {question.length}/200 Characters
        </p>
      </div>

      {/* Answer */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Answer *
        </label>
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter answer"
          rows={5}
          maxLength={1000}
        />
        <p className="text-xs text-right text-orange-500 mt-1">
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
          disabled={creating || updating}
          className="rounded-full px-6 bg-gradient-to-r from-[#FEA901] via-[#FD6E34] to-[#FE336A] hover:bg-gradient-to-t text-white"
        >
          {creating || updating
            ? "Saving..."
            : updateId
            ? "Update"
            : "Save"}
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
