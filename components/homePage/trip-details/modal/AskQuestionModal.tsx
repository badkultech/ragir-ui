import { X } from "lucide-react";
import { useState } from "react";
import { TRIP_DETAILS } from "@/lib/constants/strings";
import { useCreatePublicTripQueryMutation } from "@/lib/services/organizer/trip/queries";

export default function AskQuestionModal({
  onClose,
  tripPublicId,
}: {
  onClose: () => void;
  tripPublicId: string;
}) {
  const [question, setQuestion] = useState("");
  const [createQuery, { isLoading }] =
    useCreatePublicTripQueryMutation();

  const handleSubmit = async () => {
    if (!question.trim()) return;

    try {
      await createQuery({
        tripPublicId,
        question,
      }).unwrap();

      onClose();
    } catch (err) {
      console.error("Failed to submit query", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="border-b px-6 py-4 flex justify-between">
          <h3 className="font-bold">
            {TRIP_DETAILS.ASK_MODAL.TITLE}
          </h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-6">
          <textarea
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={TRIP_DETAILS.ASK_MODAL.DESC as string}
            className="w-full border rounded-lg p-3 resize-none"
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={onClose}
              className="flex-1 border py-3 rounded-lg"
              disabled={isLoading}
            >
              {TRIP_DETAILS.ASK_MODAL.CANCEL}
            </button>

            <button
              onClick={handleSubmit}
              disabled={isLoading || !question.trim()}
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg disabled:opacity-50"
            >
              {isLoading
                ? "Submitting..."
                : TRIP_DETAILS.ASK_MODAL.SUBMIT}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
