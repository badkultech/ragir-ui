'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TripStepperHeader } from '@/components/create-trip/tripStepperHeader';
import { SectionCard } from '@/components/create-trip/section-card';
import { TripSummaryCard } from '@/components/create-trip/trip-summary-card';
import { WizardFooter } from '@/components/create-trip/wizard-footer';
import { AppHeader } from '@/components/app-header';
import { OrganizerSidebar } from '@/components/organizer/organizer-sidebar';
import {
  useGetReviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
} from '@/lib/services/organizer/trip/review';

interface ReviewPageState {
  tripName: string;
  travelDates: string;
  duration: string;
  groupSize: string;
  ageRange: string;
  leader: string;
  itineraryType: string;
  confirmed: boolean;
}

export default function ReviewPage() {
  const router = useRouter();
  const { id: tripId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: reviewData } = useGetReviewQuery({
    organizationId: '1',
    tripPublicId: 'x1',
  });

  const [createReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();

  const [state, setState] = useState<ReviewPageState>({
    tripName: 'Himalaya',
    travelDates: '25-09-25 to 29-09-25',
    duration: '5 Days | 6 Nights',
    groupSize: '8 - 12 people',
    ageRange: '18 - 56 years',
    leader: 'Not Assigned',
    itineraryType: 'Advanced',
    confirmed: false,
  });

  useEffect(() => {
    if (reviewData) {
      setState((prev) => ({
        ...prev,
        confirmed: reviewData.confirmed ?? false,
      }));
    }
  }, [reviewData]);
  const handleDraft = () => {
    console.log('Review draft saved:', state);
  };
  const handleSubmit = async () => {
    if (!state.confirmed) {
      alert('Please confirm the information before submitting');
      return;
    }

    try {
      const payload = { confirmed: true };

      if (!reviewData) {
        await createReview({
          organizationId: '1',
          tripPublicId: 'x1',
          data: payload,
        });
      } else {
        await updateReview({
          organizationId: '1',
          tripPublicId: 'x1',
          data: payload,
        });
      }

      alert('Trip submitted successfully ✅');
      router.push('/organizer');
    } catch (e) {
      console.error('Review submit error:', e);
    }
  };

  const handlePrevious = () => {
    router.push(`/organizer/create-trip/${tripId}/pricing`);
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className='flex-1 h-auto'>
        <AppHeader title='Create New Trip' />
        <TripStepperHeader activeStep={6} />

        <SectionCard title='Review & Submit'>
          <TripSummaryCard
            data={{
              tripName: state.tripName,
              travelDates: state.travelDates,
              duration: state.duration,
              groupSize: state.groupSize,
              ageRange: state.ageRange,
              leader: state.leader,
              itineraryType: state.itineraryType,
            }}
            confirmed={state.confirmed}
            onConfirmedChange={(confirmed) => setState({ ...state, confirmed })}
          />
        </SectionCard>

        <WizardFooter
          nextLabel='Submit'
          onPrev={handlePrevious}
          onDraft={handleDraft}
          onNext={handleSubmit}
        />
      </div>
    </div>
  );
}
