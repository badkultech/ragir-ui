"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TripStepperHeader } from "@/components/create-trip/tripStepperHeader";
import { SectionCard } from "@/components/create-trip/section-card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RichTextarea } from "@/components/create-trip/rich-textarea";
import { Input } from "@/components/ui/input";
import { WizardFooter } from "@/components/create-trip/wizard-footer";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";

import {
  useCreateFaqMutation,
  useUpdateFaqMutation,
} from "@/lib/services/organizer/trip/faqs/index";

interface FAQ {
  id: string; 
  question: string;
  answer: string;
}

const DEFAULT_FAQS: FAQ[] = [
  { id: "10", question: "What's included in the trip?", answer: "Add details about inclusions here..." },
  { id: "11", question: "What should I pack?", answer: "Add packing recommendations here..." },
  { id: "12", question: "What is the cancellation policy?", answer: "Add cancellation policy details here..." },
  { id: "13", question: "Fitness Requirements", answer: "Add fitness requirements here..." },
];

export default function FAQsPage() {
  const router = useRouter();

  const [faqs, setFaqs] = useState<FAQ[]>(DEFAULT_FAQS);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [createFaq] = useCreateFaqMutation();
  const [updateFaq] = useUpdateFaqMutation();

  const updateAnswer = (id: string, answer: string | undefined) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, answer: answer ?? "" } : f))
    );
  };

  const handleAddFaq = () => {
    if (!newQuestion.trim()) return;

    setFaqs((prev) => [
      ...prev,
      {
        id: "local-" + Date.now(),
        question: newQuestion,
        answer: newAnswer,
      },
    ]);

    setNewQuestion("");
    setNewAnswer("");
  };

  const handleNext = async () => {
    try {
      for (const faq of faqs) {
        const isLocal = faq.id.startsWith("local-");

        if (isLocal) {
          await createFaq({
            organizationId: "1",
            tripPublicId: "x1",
            data: {
              question: faq.question,
              answer: faq.answer,
            },
          });
        } else {
          await updateFaq({
            organizationId: "1",
            tripPublicId: "x1",
            faqId: faq.id,
            data: {
              question: faq.question,
              answer: faq.answer,
            },
          });
        }
      }

      router.push("/organizer/create-trip/pricing");
    } catch (error) {
      console.error("Error saving FAQs:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1">
        <AppHeader title="Create New Trip" />
        <TripStepperHeader activeStep={4} />

        <SectionCard title="Trip Preparation & FAQs">
          <div className="space-y-6">

            {/* FAQ LIST */}
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="rounded-lg border bg-background px-2 sm:px-4"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>

                  <AccordionContent className="pt-2 pb-4">
                    <div className="border border-gray-200 rounded-lg p-2">
                      <RichTextarea
                        value={faq.answer}
                        onChange={(val) => updateAnswer(faq.id, val)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* ADD NEW FAQ */}
            <div className="rounded-lg border bg-background p-3 sm:p-4">
              <Input
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter your question.."
                className="mb-3"
              />

              <div className="border border-gray-200 rounded-lg p-2">
                <RichTextarea
                  value={newAnswer}
                  onChange={(val) => setNewAnswer(val ?? "")}
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="px-8 py-2 text-orange-500 border-orange-400"
                onClick={handleAddFaq}
              >
                + Add Question
              </Button>

              <Button className="px-8 py-2 text-white bg-gradient-to-r from-orange-400 to-pink-500">
                Choose from Library
              </Button>
            </div>
          </div>
        </SectionCard>

        <WizardFooter
          onPrev={() => router.push("/organizer/create-trip/exclusions")}
          onDraft={() => console.log("Draft saved")}
          onNext={handleNext} 
        />
      </div>
    </div>
  );
}
