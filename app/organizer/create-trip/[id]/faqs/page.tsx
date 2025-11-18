'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { TripStepperHeader } from '@/components/create-trip/tripStepperHeader';
import { SectionCard } from '@/components/create-trip/section-card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { RichTextarea } from '@/components/create-trip/rich-textarea';
import { Input } from '@/components/ui/input';
import { WizardFooter } from '@/components/create-trip/wizard-footer';
import { AppHeader } from '@/components/app-header';
import { OrganizerSidebar } from '@/components/organizer/organizer-sidebar';

import {
  useCreateFaqMutation,
  useUpdateFaqMutation,
} from '@/lib/services/organizer/trip/faqs/index';
import { useGetOrganizerFaqsQuery } from '@/lib/services/organizer/trip/library/faq';
import { useSelector } from 'react-redux';
import { selectAuthState } from '@/lib/slices/auth';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const DEFAULT_FAQS: FAQ[] = [
  {
    id: '10',
    question: "What's included in the trip?",
    answer: 'Add details about inclusions here...',
  },
  {
    id: '11',
    question: 'What should I pack?',
    answer: 'Add packing recommendations here...',
  },
  {
    id: '12',
    question: 'What is the cancellation policy?',
    answer: 'Add cancellation policy details here...',
  },
  {
    id: '13',
    question: 'Fitness Requirements',
    answer: 'Add fitness requirements here...',
  },
];

export default function FAQsPage() {
  const router = useRouter();
  const { id: tripId } = useParams();
  const [faqs, setFaqs] = useState<FAQ[]>(DEFAULT_FAQS);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isChooseFromLibrary, setChooseFromLibrary] = useState(false);

  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;

  const [createFaq] = useCreateFaqMutation();
  // const [updateFaq] = useUpdateFaqMutation();
  const {
    data: faqsData = [],
    isLoading,
    refetch,
  } = useGetOrganizerFaqsQuery(organizationId ? { organizationId } : skipToken);
  console.log('faqs', faqsData);

  const handleAddFromLibrary = (item: any) => {
    // Map library FAQ shape to local FAQ shape and close dialog
    setFaqs((prev) => [
      ...prev,
      {
        id: `lib-${item.id}`,
        question: item.name ?? '',
        answer: item.answer ?? '',
      },
    ]);
    setChooseFromLibrary(false);
  };

  const updateAnswer = (id: string, answer: string | undefined) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, answer: answer ?? '' } : f)),
    );
  };

  const handleRemoveFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAddFaq = () => {
    if (!newQuestion.trim()) return;

    setFaqs((prev) => [
      ...prev,
      {
        id: 'local-' + Date.now(),
        question: newQuestion,
        answer: newAnswer,
      },
    ]);

    setNewQuestion('');
    setNewAnswer('');
  };

  const handleNext = async () => {
    try {
      const fd = new FormData();
      faqs.forEach((faq, index) => {
        fd.append(`details[${index}].name`, faq.question);
        fd.append(`details[${index}].answer`, faq.answer);
        fd.append(`details[${index}].category`, 'DEFAULT');
      });
      await createFaq({
        organizationId: organizationId,
        tripPublicId: tripId as string,
        data: fd,
      });

      router.push(`/organizer/create-trip/${tripId}/pricing`);
    } catch (error) {
      console.error('Error saving FAQs:', error);
    }
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Dialog open={isChooseFromLibrary} onOpenChange={setChooseFromLibrary}>
        <DialogContent className='sm:max-w-[40%]'>
          <div className='relative'>
            <DialogHeader>
              <DialogTitle>Add From Library</DialogTitle>
            </DialogHeader>

            {/* Scrollable list of library FAQs shown as rows */}
            <div className='mt-3 max-h-[60vh] overflow-y-auto space-y-2 pr-2'>
              {faqsData && faqsData.length > 0 ? (
                faqsData.map((faq: any) => (
                  <div
                    key={faq.id}
                    role='button'
                    tabIndex={0}
                    onClick={() => handleAddFromLibrary(faq)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleAddFromLibrary(faq);
                      }
                    }}
                    className='flex items-start gap-3 p-3 rounded-md border bg-white hover:bg-sky-50 hover:shadow-sm transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-200'
                  >
                    <div className='flex-1 min-w-0'>
                      <div className='font-medium text-sm text-gray-900 truncate'>
                        {faq.name}
                      </div>
                      <div className='text-sm text-muted-foreground mt-1 line-clamp-3'>
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-sm text-muted-foreground p-3'>
                  No library FAQs found.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className='flex-1'>
        <AppHeader title='Create New Trip' />
        <TripStepperHeader activeStep={4} />

        <SectionCard title='Trip Preparation & FAQs'>
          <div className='space-y-6'>
            {/* FAQ LIST */}
            <Accordion type='single' collapsible className='w-full space-y-2'>
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className='relative group rounded-lg border bg-background px-2 sm:px-4'
                >
                  <AccordionTrigger className='text-left hover:no-underline'>
                    {faq.question}
                  </AccordionTrigger>

                  {/* Remove (X) icon in the top-right of the item */}
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFaq(faq.id);
                    }}
                    aria-label={`Remove ${faq.question}`}
                    className='absolute top-[-10px] right-[-9px] p-1 rounded hover:bg-red-50 text-gray-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto'
                  >
                    <X className='h-4 w-4' />
                  </button>

                  <AccordionContent className='pt-2 pb-4'>
                    <div className='border border-gray-200 rounded-lg p-2'>
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
            <div className='rounded-lg border bg-background p-3 sm:p-4'>
              <Input
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder='Enter your question..'
                className='mb-3'
              />

              <div className='border border-gray-200 rounded-lg p-2'>
                <RichTextarea
                  value={newAnswer}
                  onChange={(val) => setNewAnswer(val ?? '')}
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className='flex gap-2'>
              <Button
                variant='outline'
                className='px-8 py-2 text-orange-500 border-orange-400'
                onClick={handleAddFaq}
              >
                + Add Question
              </Button>

              <Button
                onClick={() => {
                  setChooseFromLibrary(true);
                }}
                className='px-8 py-2 text-white bg-gradient-to-r from-orange-400 to-pink-500'
              >
                Choose from Library
              </Button>
            </div>
          </div>
        </SectionCard>

        <WizardFooter
          onPrev={() =>
            router.push(`/organizer/create-trip/${tripId}/exclusions`)
          }
          onDraft={() => console.log('Draft saved')}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}
