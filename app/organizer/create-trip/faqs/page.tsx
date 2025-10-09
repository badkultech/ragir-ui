"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { tripSteps } from "@/lib/common/stepperConfig";
import { Stepper } from "@/components/trip/stepper";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { AppHeader } from "@/components/app-header";
import MDEditor from "@uiw/react-md-editor";

const defaultFaqs = [
  { question: "What's included in the trip?", answer: "" },
  { question: "What should I pack?", answer: "" },
  { question: "What is the cancellation policy?", answer: "" },
  { question: "Fitness Requirements", answer: "" },
];

const suggestedFaqs = [
  "Do I need travel insurance?",
  "What type of accommodation is provided?",
  "Are meals included?",
  "Is Wi-Fi available during the trip?",
];

export default function FaqPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [faqs, setFaqs] = useState(defaultFaqs);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [customQuestion, setCustomQuestion] = useState("");

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleAnswerChange = (index: number, value: string | undefined) => {
    const updated = [...faqs];
    updated[index].answer = (value || "").slice(0, 500); // limit to 500 chars
    setFaqs(updated);
  };

  const handleAddCustom = () => {
    if (customQuestion.trim()) {
      setFaqs([...faqs, { question: customQuestion, answer: "" }]);
      setCustomQuestion("");
      setExpandedIndex(faqs.length); // expand new one
    }
  };

  const handleAddFromLibrary = (q: string) => {
    if (!faqs.some((f) => f.question === q)) {
      setFaqs([...faqs, { question: q, answer: "" }]);
    }
  };

  const handleSaveAndNext = () => {
    const currentIndex = tripSteps.findIndex((s) => s.path === pathname);
    if (currentIndex < tripSteps.length - 1) {
      router.push(tripSteps[currentIndex + 1].path);
    }
  };

  const handlePrevious = () => {
    const currentIndex = tripSteps.findIndex((s) => s.path === pathname);
    if (currentIndex > 0) {
      router.push(tripSteps[currentIndex - 1].path);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OrganizerSidebar />

      <div className="flex-1 flex flex-col">
        <AppHeader title="Create New Trip" />
        <main className="flex-1 p-8">
          <Stepper />

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">
              Trip Preparation & FAQs
            </h2>

            {/* Accordion */}
            <div className="space-y-3 mb-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border rounded-lg">
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full text-left p-3 font-medium flex justify-between items-center"
                  >
                    {faq.question}
                    <span>{expandedIndex === idx ? "−" : "+"}</span>
                  </button>

                  {expandedIndex === idx && (
                    <div className="p-4 border-t" data-color-mode="light">
                      <MDEditor
                        value={faq.answer}
                        onChange={(val) => handleAnswerChange(idx, val)}
                        preview="edit"
                        hideToolbar={false}
                      />
                       <span className="bottom-3 right-3 text-sm text-orange-500">
                      {
                        faq.answer.length
                      }
                      /500 Words
                    </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Custom Question */}
            <div className="mb-6" data-color-mode="light">
              <Input
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Enter your question..."
              />
              <div className="mt-2">
                <MDEditor value="" preview="edit" hideToolbar={false} />
              </div>
              <Button
                variant="outline"
                className="mt-2"
                onClick={handleAddCustom}
              >
                + Add Question
              </Button>
            </div>

            {/* Suggested FAQs */}
            <div>
              <h3 className="font-medium mb-2">Choose from Library</h3>
              <div className="grid grid-cols-2 gap-3">
                {suggestedFaqs.map((item) => (
                  <div
                    key={item}
                    className="flex justify-between items-center border rounded-lg p-2 cursor-pointer"
                    onClick={() => handleAddFromLibrary(item)}
                  >
                    <span>{item}</span>
                    <span className="text-orange-500 text-xl font-bold">+</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              className="px-6 py-2 rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-100"
              onClick={handlePrevious}
            >
              ← Previous
            </Button>

            <div className="space-x-3">
              <Button
                variant="outline"
                className="px-6 py-2 rounded-full border"
              >
                Save as Draft
              </Button>
              <Button
                className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                onClick={handleSaveAndNext}
              >
                Save & Next →
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
