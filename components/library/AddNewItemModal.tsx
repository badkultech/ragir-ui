'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Hotel,
  Bus,
  Utensils,
  Activity,
  Users,
  HelpCircle,
} from 'lucide-react';

import { AddStayForm } from '@/components/library/AddStayForm';
import { AddMealForm } from '@/components/library/AddMealForm';
import { AddActivityForm } from './AddActivityForm';
import { AddTripLeaderForm } from './AddTripLeaderForm';
import { AddEventForm } from '@/components/library/AddEventForm';
import { AddTransitForm } from './AddTransitForm';
import { AddFAQForm } from '@/components/library/AddFAQForm';
import {
  useCreateOrganizerDayDescriptionMutation,
  useUpdateOrganizerDayDescriptionMutation,
} from '@/lib/services/organizer/library/day-description';
import { useSelector } from 'react-redux';
import { selectAuthState } from '@/lib/slices/auth';
import { Document } from '@/lib/services/organizer/library/day-description/types';
import { update } from 'lodash';

/* ===== types ===== */
type Step =
  | 'select'
  | 'event'
  | 'stay'
  | 'transit'
  | 'meal'
  | 'activity'
  | 'trip-leader'
  | 'faq';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface CategoryItem {
  label: string;
  icon: IconType;
  step: Step;
}

/* ===== categories (typed) ===== */
const categories: CategoryItem[] = [
  { label: 'Events', icon: Calendar, step: 'event' },
  { label: 'Stays', icon: Hotel, step: 'stay' },
  { label: 'Transit', icon: Bus, step: 'transit' },
  { label: 'Meals', icon: Utensils, step: 'meal' },
  { label: 'Activities', icon: Activity, step: 'activity' },
  { label: 'Trip Leaders', icon: Users, step: 'trip-leader' },
  { label: 'FAQs', icon: HelpCircle, step: 'faq' },
];

/* small helper header */
function StepHeader({ title }: { title: string }) {
  return (
    <DialogHeader>
      <DialogTitle >{title}</DialogTitle>
    </DialogHeader>
  );
}

/* ===== main component ===== */
type AddNewItemModalProps = {
  open: boolean;
  onClose: () => void;
  updateId?: number | null;
  initialStep?: Step;
};

export function AddNewItemModal({
  open,
  onClose,
  updateId,
  initialStep = 'select',
}: AddNewItemModalProps) {
  const [step, setStep] = useState<Step>('select');
  const [selected, setSelected] = useState<CategoryItem | null>(null);

  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;

  const [createOrganizerDayDescription] =
    useCreateOrganizerDayDescriptionMutation();

  const [updateOrganizerDayDescription] =
    useUpdateOrganizerDayDescriptionMutation();

  const handleNext = () => {
    if (selected) setStep(selected.step);
  };

  React.useEffect(() => {
    if (open) {
      setStep(initialStep);
      setSelected(null);
    }
  }, [open, initialStep]);

  const handleSaveEvent = (data: any, replace?: boolean) => {
    const formData = new FormData();

    formData.append('name', data.title);
    formData.append('description', data.description);
    formData.append('location', data.location);
    formData.append('time', data.time);
    formData.append('packingSuggestion', data.packing);
    formData.append('addToLibrary', 'true');
    if (data.documents) {
      data.documents.forEach((document: Document, index: number) => {
        if (document.file)
          formData.append(`documents[${index}].file`, document.file);
        if (document.markedForDeletion)
          formData.append(
            `documents[${index}].markedForDeletion`,
            document.markedForDeletion.toString(),
          );
      });
    }
    if (updateId) {
      updateOrganizerDayDescription({
        organizationId,
        data: formData,
        dayDescriptionId: updateId.toString(),
      })
        .unwrap()
        .then(() => {
          onClose();
        });
    } else {
      createOrganizerDayDescription({ organizationId, data: formData })
        .unwrap()
        .then(() => {
          onClose();
        });
    }
  };

  const handleBack = () => {
    // If modal was opened directly with initialStep (not select), then close on back
    if (initialStep !== 'select') {
      onClose();
    } else {
      setStep('select');
      setSelected(null);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          // reset local state and call parent close once
          setStep('select');
          setSelected(null);
          onClose();
        }
      }}
    >
      <DialogContent className='w-full max-w-3xl rounded-2xl overflow-hidden'>
        {/* inner scroll container keeps outer border radius intact */}
        <div className='max-h-[90vh] overflow-y-auto'>
          {step === 'select' && (
            <>
              <StepHeader title='Add New Item' />

              <div className='grid grid-cols-2 gap-4 mt-4'>
                {categories
                  .slice(0, 6)
                  .map(({ label, icon: Icon, step: stepKey }) => (
                    <button
                      key={label}
                      onClick={() =>
                        setSelected({ label, icon: Icon, step: stepKey })
                      }
                      className={`flex flex-col justify-center items-center p-6 h-24 rounded-xl border transition ${
                        selected?.label === label
                          ? 'border-orange-500 shadow-md'
                          : 'border-gray-200 hover:border-orange-400'
                      }`}
                    >
                      <Icon className='h-6 w-6 text-gray-600 mb-2' />
                      <span className='text-sm font-medium text-gray-700'>
                        {label}
                      </span>
                    </button>
                  ))}
              </div>

              <div className='mt-4'>
                <button
                  onClick={() =>
                    setSelected({
                      label: 'FAQs',
                      icon: HelpCircle,
                      step: 'faq',
                    })
                  }
                  className={`flex flex-col justify-center items-center w-full p-6 h-20 rounded-xl border transition ${
                    selected?.label === 'FAQs'
                      ? 'border-orange-500 shadow-md'
                      : 'border-gray-200 hover:border-orange-400'
                  }`}
                >
                  <HelpCircle className='h-6 w-6 text-gray-600 mb-2' />
                  <span className='text-sm font-medium text-gray-700'>
                    FAQs
                  </span>
                </button>
              </div>

              <DialogFooter className='mt-6'>
                <DialogClose asChild>
                  <Button variant='outline' className='rounded-full px-6'>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleNext}
                  disabled={!selected}
                  className='rounded-full px-6 bg-gradient-to-r from-orange-400 to-pink-500 text-white'
                >
                  Next
                </Button>
              </DialogFooter>
            </>
          )}

          {step === 'stay' && (
            <>
              <StepHeader title='Add Stay' />
              <AddStayForm
                mode='library'
                onCancel={handleBack}
                onSave={(data: any) => {
                  console.log('Stay saved:', data);
                  onClose();
                }}
              />
            </>
          )}

          {step === 'meal' && (
            <>
              <StepHeader title='Add Meal' />
              <AddMealForm
                mode='library'
                onCancel={handleBack}
                onSave={(data: any) => {
                  console.log('Meal saved:', data);
                  onClose();
                }}
              />
            </>
          )}

          {step === 'activity' && (
            <>
              <StepHeader title='Add Activity' />
              <AddActivityForm
                mode='library'
                onCancel={handleBack}
                onSave={(data: any) => {
                  console.log('Activity saved:', data);
                  onClose();
                }}
              />
            </>
          )}

          {step === 'trip-leader' && (
            <>
              <StepHeader title='Add Trip Leader' />
              <AddTripLeaderForm
                mode='library'
                onCancel={handleBack}
                onSave={(data: any) => {
                  console.log('Trip Leader saved:', data);
                  onClose();
                }}
              />
            </>
          )}

          {step === 'event' && (
            <>
              <StepHeader title='Add Event' />
              <AddEventForm
                updateId={updateId}
                mode='library'
                onCancel={handleBack}
                onSave={handleSaveEvent}
              />
            </>
          )}

          {step === 'transit' && (
            <>
              <StepHeader title='Add Transit' />
              <AddTransitForm
                mode='library'
                onCancel={handleBack}
                onSave={(data: any) => {
                  console.log('Transit saved:', data);
                  onClose();
                }}
              />
            </>
          )}

          {step === 'faq' && (
            <>
              <StepHeader title='Add FAQ' />
              <AddFAQForm
                mode='library'
                onCancel={handleBack}
                onSave={(data: any) => {
                  console.log('FAQ saved:', data);
                  onClose();
                }}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
