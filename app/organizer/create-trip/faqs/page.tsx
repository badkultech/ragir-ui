"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { TripStepperHeader } from "@/components/create-trip/tripStepperHeader"
import { SectionCard } from "@/components/create-trip/section-card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RichTextarea } from "@/components/create-trip/rich-textarea"
import { Input } from "@/components/ui/input"
import { WizardFooter } from "@/components/create-trip/wizard-footer"
import { Sidebar } from "@/components/organizer/sidebar"
import MDEditor from "@uiw/react-md-editor"
import { AppHeader } from "@/components/app-header"

interface FAQ {
  id: string
  question: string
  answer: string
}

const DEFAULT_FAQS: FAQ[] = [
  {
    id: "1",
    question: "What's included in the trip?",
    answer: "Add details about inclusions here...",
  },
  {
    id: "2",
    question: "What should I pack?",
    answer: "Add packing recommendations here...",
  },
  {
    id: "3",
    question: "What is the cancellation policy?",
    answer: "Add cancellation policy details here...",
  },
  {
    id: "4",
    question: "Fitness Requirements",
    answer: "Add fitness requirements here...",
  },
]

export default function FAQsPage() {
  const router = useRouter()
  const [faqs, setFaqs] = useState<FAQ[]>(DEFAULT_FAQS)
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")

  const handleAddFaq = () => {
    if (!newQuestion.trim()) return; // optional: prevent empty question
    setFaqs((prev) => [
      ...prev,
      { id: Date.now().toString(), question: newQuestion, answer: newAnswer }
    ]);
    setNewQuestion("");
    setNewAnswer("");
  }


  const updateAnswer = (id: string, answer: string | undefined) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, answer: answer ?? "" } : f))
    );
  };

  return (

    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 h-auto  ">
        <AppHeader title="Create New Trip" />
          <TripStepperHeader activeStep={4} />

          <SectionCard title="Trip Preparation & FAQs">
            <div className="space-y-6 h-auto">
              <Accordion type="single" collapsible className="w-full space-y-2" defaultValue={faqs[0]?.id}>
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="rounded-lg border bg-background px-2 sm:px-4">
                    <AccordionTrigger className="text-left hover:no-underline">{faq.question}</AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="border border-gray-200 rounded-lg p-2 relative">

                        <MDEditor
                          value={faq.answer}
                          onChange={(val) => updateAnswer(faq.id, val)}


                        />
                        <div className="absolute bottom-3 right-3 text-sm text-orange-500">
                          {faq.answer
                            ? faq.answer.split(/\s+/).filter((word) => word.length > 0).length
                            : 0}
                          /500 Words
                        </div>

                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="rounded-lg border bg-background p-3 sm:p-4">
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Enter your question.."
                  className="mb-3"
                />
                <div className="border border-gray-200 rounded-lg p-2 relative">
                  <MDEditor
                    value={newAnswer}
                    onChange={(val) => setNewAnswer(val ?? "")}
                  />

                  <div className="absolute bottom-3 right-3 text-sm text-orange-500">
                    {newAnswer
                      ? newAnswer.split(" ").filter((word) => word.length > 0).length
                      : 0}
                    /500 Words
                  </div>
                </div>


              </div>

              {/* Actions */}
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  className="rounded-full bg-transparent"
                  onClick={() => {
                    const q = newQuestion.trim()
                    if (!q) return
                    setFaqs((prev) => [...prev, { id: Date.now().toString(), question: q, answer: newAnswer }])
                    setNewQuestion("")
                    setNewAnswer("")
                  }}
                >
                  + Add Question
                </Button>
                <Button className="rounded-full">Choose from Library</Button>
              </div>
            </div>
          </SectionCard>
          <WizardFooter
            onPrev={() => router.push("/organizer/create-trip/exclusions")}
            onDraft={() => {
              // Persist draft later via server action; keeping inline for now
              console.log("Draft saved (placeholder)")
            }}
            onNext={() => router.push("/organizer/create-trip/pricing")}
          />
        
      </div>
    </div>
  )
}
