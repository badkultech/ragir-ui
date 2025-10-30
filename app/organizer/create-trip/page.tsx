"use client";

import { useState} from 'react';
import { AppHeader } from '@/components/app-header';
import { useParams } from 'next/navigation';
import { TripStepperHeader } from '@/components/create-trip/tripStepperHeader';

import { OrganizerSidebar } from '@/components/organizer/organizer-sidebar';
import { CreateTrip } from '@/components/create-trip/create-trip';

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className='flex-1'>
        <AppHeader title='Organizers' />
        <TripStepperHeader activeStep={1} />
       <CreateTrip />
      </div>
    </div>
  );
}
