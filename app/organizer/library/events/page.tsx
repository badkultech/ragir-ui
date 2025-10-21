'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { OrganizerSidebar } from '@/components/organizer/organizer-sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  PlusCircle,
  MapPin,
  Pencil,
  Eye,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { AddNewItemModal } from '@/components/library/AddNewItemModal';
import { LibraryHeader } from '@/components/library/LibraryHeader';
import Link from 'next/link';
import {
  useCreateOrganizerDayDescriptionMutation,
  useDeleteOrganizerDayDescriptionMutation,
  useGetOrganizerDayDescriptionQuery,
} from '@/lib/services/organizer/library/day-description';
import { useSelector } from 'react-redux';
import { selectAuthState } from '@/lib/slices/auth';
import { ViewDayDescriptionModal } from '@/components/library/ViewDayDescriptionModal';

const mockEvents = [
  {
    id: 1,
    title: 'Rajasthan Folk Festival',
    location: 'Jodhpur, Rajasthan',
    description:
      'Traditional music and dance performances with local artisans and cultural workshops',
    image: null,
  },
  {
    id: 2,
    title: 'Goa Carnival',
    location: 'Goa',
    description: 'Colorful parades, music, dance, and festive celebrations',
    image: null,
  },
  {
    id: 3,
    title: 'Diwali Festival',
    location: 'Jaipur, Rajasthan',
    description: 'Festival of lights with cultural shows and fireworks',
    image: null,
  },
];

export default function EventsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updateId, setUpdateId] = useState<number | null>(null);

  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<any>(null);

  const { data: dayDescriptions } = useGetOrganizerDayDescriptionQuery({
    organizationId,
  });
  const [deleteOrganizerDayDescription] =
    useDeleteOrganizerDayDescriptionMutation();
  console.log(organizationId, dayDescriptions);

  const filtered = mockEvents.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (

    <div className='flex min-h-screen bg-gray-50'>

      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        <AppHeader title='Events' />

        <main className='flex-1 p-6 md:p-4'>
          {/* Header */}
          <LibraryHeader
            title='Ragir Library'
            buttonLabel='Add Event'
            onAddClick={() => {
              setUpdateId(null);
              setModalOpen(true);
            }}
          />
          {/* Search */}
          {/* <div className="mb-6">
            <Input
              placeholder='Search Library...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full sm:w-80 border-orange-300 focus:border-orange-500 focus:ring-orange-500'
            />
          </div> */}

          {/* Card Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {dayDescriptions?.map((dayDescription) => (
              <div
                key={dayDescription.id}
                className='bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col'
              >
                {/* Image */}
                <div className='h-32 bg-gray-100 flex items-center justify-center'>
                  {dayDescription.documents ? (
                    <img
                      src={dayDescription.documents[0].url}
                      alt={dayDescription.name}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <span className='text-gray-400 text-sm'>No Image</span>
                  )}
                </div>

                {/* Content */}
                <div className='p-4 flex-1 flex flex-col'>
                  <h3 className='font-semibold text-gray-900'>
                    {dayDescription.name}
                  </h3>
                  <div className='flex items-center text-gray-600 text-sm mt-1'>
                    <MapPin className='w-4 h-4 mr-1 text-gray-500' />
                    {dayDescription.location}
                  </div>
                  <p
                    className="text-sm text-gray-500 mt-2 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: dayDescription.description || "" }}
                  ></p>

                  {/* Actions */}
                  <div className='mt-4 flex justify-end gap-3 text-gray-500'>
                    <button
                      className="hover:text-orange-500"
                      onClick={() => {
                        setSelectedDay(dayDescription);
                        setViewModalOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      className='hover:text-orange-500'
                      onClick={() => {
                        setUpdateId(dayDescription.id);
                        setModalOpen(true);
                      }}
                    >
                      <Pencil className='w-4 h-4' />
                    </button>
                    <button
                      className='hover:text-red-500'
                      onClick={() => {
                        deleteOrganizerDayDescription({
                          dayDescriptionId: dayDescription.id,
                          organizationId,
                        }).unwrap();
                      }}
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </div>


              </div>
            ))}

            {filtered.length === 0 && (
              <div className='col-span-full text-center text-gray-500 py-10'>
                No events found.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add New Item Modal */}
      <AddNewItemModal
        open={modalOpen}
        updateId={updateId}
        onClose={() => setModalOpen(false)}
        initialStep='event' // 👈 opens AddStayForm directly
      />
      <ViewDayDescriptionModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        data={selectedDay}
      />

    </div>
  );
}
