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
import { ChooseFromLibraryButton } from "./ChooseFromLibraryButton";
import { useToast } from "@/components/ui/use-toast";
import { showSuccess, showApiError } from "@/lib/utils/toastHelpers";

type AddFAQFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any) => void;
  updateId?: number | null; // 👈 added for edit mode
};

export function AddFAQForm({
  mode = "trip",
  onCancel,
  onSave,
  updateId,
}: AddFAQFormProps) {
  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  // Mutations
  const [createFaq, { isLoading: creating }] = useCreateOrganizerFaqMutation();
  const [updateFaq, { isLoading: updating }] = useUpdateOrganizerFaqMutation();

  // 👇 Fetch FAQ by ID if editing
  const { data: existingFaq, isLoading: loadingFaq } =
    useGetOrganizerFaqByIdQuery(
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!answer.trim()) newErrors.answer = "Answer is required";
    if (!question.trim()) newErrors.question = "Question required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) return;

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
      showSuccess("FAQ saved successfully!");
    } catch (err) {
      showApiError("destructive");
    }
  };

  if (loadingFaq) {
    return (
      <div className="text-center text-gray-500 py-10">
        Loading FAQ details...
      </div>
    );
  }
  const isTripMode = mode === "trip";
  return (
    <div
      className="flex flex-col gap-6"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {/* Top-right button */}
      {isTripMode ? (
        <ChooseFromLibraryButton onClick={() => setLibraryOpen(true)} />
      ) : (
        <div className="mt-2" /> // ✅ Keeps consistent spacing when no button
      )}

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
        {errors.question && (
          <p className="text-xs text-red-500 mt-1">{errors.question}</p>
        )}
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
        {errors.answer && (
          <p className="text-xs text-red-500 mt-1">{errors.answer}</p>
        )}
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
          {creating || updating ? "Saving..." : updateId ? "Update" : "Save"}
        </Button>
      </div>

      {/* Library Modal */}
      {mode === "trip" && (
        <LibrarySelectModal
          open={libraryOpen}
          onClose={() => setLibraryOpen(false)}
          onSelect={handleLibrarySelect}
          category="faqs"
        />
      )}
    </div>
  );
}
