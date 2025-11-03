"use client";

import { useEffect, useState} from 'react';
import { AppHeader } from '@/components/app-header';
import { useParams } from 'next/navigation';
import { TripStepperHeader } from '@/components/create-trip/tripStepperHeader';

import { OrganizerSidebar } from '@/components/organizer/organizer-sidebar';
import { CreateTrip } from '@/components/create-trip/create-trip';
import { useLazyGetTripByIdQuery } from '@/lib/services/organizer/trip/create-trip';

export default function Page() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [getTripById] = useLazyGetTripByIdQuery()
    const { id } = useParams()

    useEffect(() => {
      if (id) {
        // Replace 'organizationId' with the actual organization ID as needed
        getTripById({ organizationId: 'org123', tripId: id as string })
          .then((response) => {
            console.log("Fetched trip by ID:", response);

            })
            .catch((error) => {
                console.error("Error fetching trip by ID:", error);
            });
        }
    }, [id, getTripById]);




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
