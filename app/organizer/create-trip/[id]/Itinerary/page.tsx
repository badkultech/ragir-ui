'use client';

import { useState, useEffect } from 'react';
import { TripStepperHeader } from '@/components/create-trip/tripStepperHeader';
import { AppHeader } from '@/components/app-header';
import { DetailsOptions } from '@/components/create-trip/detailsOption/addDetails';
import { WizardFooter } from '@/components/create-trip/wizard-footer';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FileUploadCard } from '@/components/create-trip/file-upload-card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CustomDateTimePicker } from '@/components/ui/date-time-picker';
import { OrganizerSidebar } from '@/components/organizer/organizer-sidebar';
import { useLazyGetTripByIdQuery } from '@/lib/services/organizer/trip/create-trip';
import {
  useLazyGetItineraryByTripIdQuery,
  useUpdateItineraryMutation,
} from '@/lib/services/organizer/trip/itinerary';
import { useSelector } from 'react-redux';
import { selectAuthState } from '@/lib/slices/auth';
import {
  useLazyGetItineraryDayDetailsQuery,
  useLazyGetItineraryDayDetailByIdQuery,
  useUpdateItineraryDayDetailMutation,
} from '@/lib/services/organizer/trip/itinerary/day-details';

interface Day {
  day: number;
  date: string;
}

export default function ItineraryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id: tripId } = useParams();
  const { userData } = useSelector(selectAuthState);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [days, setDays] = useState<Day[]>([]);
  const [showDetails, setShowDetails] = useState<boolean[]>([]);
  const [startingPoint, setStartingPoint] = useState('Mumbai');
  const [endPoint, setEndPoint] = useState('Goa');
  const [startDate, setStartDate] = useState(
    searchParams.get('startDate') || new Date().toISOString(),
  );
  const [endDate, setEndDate] = useState(
    searchParams.get('endDate') || new Date().toISOString(),
  );
  const [dayDetailIds, setDayDetailIds] = useState<Record<number, string>>({});
  // Local file state for itinerary PDF (multipart upload)
  const [itineraryFile, setItineraryFile] = useState<File | null>(null);
  const [itineraryMeta, setItineraryMeta] = useState<{
    id?: number;
    type?: string;
    url?: string;
    markedForDeletion?: boolean;
  } | null>(null);

  const totalDaysParam = parseInt(searchParams.get('totalDays') || '1', 10);

  const [updateItinerary] = useUpdateItineraryMutation();
  const [triggerGetItineraryByTripId] = useLazyGetItineraryByTripIdQuery();
  const [triggerGetAllDayDetails] = useLazyGetItineraryDayDetailsQuery();
  const [triggerGetDayDetailById] = useLazyGetItineraryDayDetailByIdQuery();
  const [updateDayDetail] = useUpdateItineraryDayDetailMutation();
  const [triggerGetTrip] = useLazyGetTripByIdQuery();

  // ✅ Fetch itinerary & all day details initially
  useEffect(() => {
    const organizationId = userData?.organizationPublicId ?? '';

    if (!organizationId || !tripId) return;

    (async () => {
      try {
        console.log('🔄 Fetching itinerary and all day details...');
        await triggerGetItineraryByTripId({
          organizationId,
          tripPublicId: tripId as string,
        });

        const response = await triggerGetAllDayDetails({
          organizationId,
          tripPublicId: tripId as string,
        }).unwrap();

        if (response?.data && Array.isArray(response.data)) {
          const idsMap: Record<number, string> = {};
          response.data.forEach((detail: any) => {
            if (detail.dayNumber && detail.id) {
              idsMap[detail.dayNumber] = String(detail.id);
            }
          });
          setDayDetailIds(idsMap);
          console.log('🧩 Day detail IDs mapped (fixed):', idsMap);
        } else {
          console.warn('⚠️ No valid day details found in response');
        }
      } catch (err) {
        console.error('❌ Failed to fetch all day details:', err);
      }
    })();
  }, [tripId, userData]);

  // ✅ Format time helper
  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // ✅ Update itinerary day detail
  const handleUpdateDayDetail = async (
    dayDetailId: string,
    dayNumber: number,
  ) => {
    const organizationId = userData?.organizationPublicId;

    if (!organizationId || !tripId || !dayDetailId) return;

    const now = new Date();

    const payload = {
      dayNumber,
      title: `Updated Day ${dayNumber} Detail`,
      description: `Auto update test for day ${dayNumber}`,
      startDate: now.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
      startTime: formatTime(now),
      endTime: formatTime(now),
    };

    try {
      console.log('📤 Updating Day Detail:', payload);
      const response = await updateDayDetail({
        organizationId,
        tripPublicId: tripId as string,
        dayDetailId,
        data: payload,
      }).unwrap();

      console.log('✅ Day detail updated successfully:', response);
    } catch (err) {
      console.error('❌ Failed to update day detail:', err);
    }
  };

  // ✅ Add Details button → first get all, then get single by id
  const handleAddDetails = async (idx: number) => {
    const organizationId = userData?.organizationPublicId ?? '';

    const dayNumber = idx + 1;

    // Show Details section immediately
    setShowDetails((prev) => prev.map((v, i) => (i === idx ? true : v)));

    if (!organizationId || !tripId) return;

    try {
      const res = await triggerGetAllDayDetails({
        organizationId,
        tripPublicId: tripId as string,
      }).unwrap();
      const list = Array.isArray(res) ? res : [];

      const found = list.find((item: any) => item.dayNumber === dayNumber);
      if (!found?.id) {
        return;
      }

      console.log(`✅ Day ${dayNumber} id =`, found.id);
      setDayDetailIds((prev) => ({ ...prev, [dayNumber]: String(found.id) }));
    } catch (e) {
      console.error('❌ handleAddDetails error:', e);
    }
  };

  // ✅ Update itinerary data
  const handleUpdateItinerary = async () => {
    const organizationId = userData?.organizationPublicId;
    if (!organizationId || !tripId) return;

    // Build multipart form data so we can include a PDF/document with the JSON fields
    const fd = new FormData();

    // basic fields
    fd.append('startPoint', startingPoint);
    fd.append('endPoint', endPoint);
    fd.append('startDate', startDate.split('T')[0]);
    fd.append('endDate', endDate.split('T')[0]);

    // nested time fields using dot notation (backend should parse accordingly)
    const start = new Date(startDate);
    fd.append('startTime', formatTime(start));

    const end = new Date(endDate);
    fd.append('endTime', formatTime(end));

    // itineraryPdf object fields
    if (itineraryFile) {
      // actual file
      fd.append('itineraryPdf.file', itineraryFile);
    }
    if (itineraryMeta?.type) {
      fd.append('itineraryPdf.type', itineraryMeta.type);
    }
    if (typeof itineraryMeta?.markedForDeletion !== 'undefined') {
      fd.append(
        'itineraryPdf.markedForDeletion',
        String(itineraryMeta.markedForDeletion),
      );
    }
    if (typeof itineraryMeta?.id !== 'undefined') {
      fd.append('itineraryPdf.id', String(itineraryMeta.id));
    }

    try {
      console.log('📤 Updating itinerary (multipart): sending FormData');
      const response = await updateItinerary({
        organizationId,
        tripPublicId: tripId as string,
        // cast to any because API expects a typed JSON object; we're sending FormData (multipart)
        data: fd as unknown as any,
      }).unwrap();

      console.log('✅ Itinerary updated:', response);
      router.push(`/organizer/create-trip/${tripId}/exclusions`);
    } catch (err) {
      console.error('❌ Failed to update itinerary:', err);
    }
  };

  // ✅ Generate days dynamically
  useEffect(() => {
    if (!startDate) return;
    const start = new Date(startDate);
    if (isNaN(start.getTime())) return;

    const generatedDays: Day[] = [];
    for (let i = 0; i < totalDaysParam; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const formatted = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      generatedDays.push({ day: i + 1, date: formatted });
    }
    setDays(generatedDays);
    setShowDetails(Array(generatedDays.length).fill(false));
  }, [startDate, totalDaysParam]);

  // ✅ Go to previous page
  const handlePrevClick = async () => {
    const organizationId = localStorage.getItem('organizationId');

    if (tripId && organizationId) {
      console.log('🔄 Fetching trip before going back...');
      await triggerGetTrip({ organizationId, tripId: tripId as string });
    }

    router.push(`/organizer/create-trip/${tripId}`);
  };

  return (
    <div className='flex min-h-screen bg-gray-50 overflow-x-hidden'>
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className='flex-1 w-full min-h-screen flex flex-col'>
        <AppHeader title='Create New Trip' />
        <TripStepperHeader activeStep={2} />

        <div className='p-8 bg-white'>
          <div className='max-w-full mx-auto bg-white shadow rounded-2xl p-8 overflow-x-hidden'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
              Itinerary
            </h2>
            <FileUploadCard
              accept='application/pdf'
              maxSizeMB={10}
              initialMeta={itineraryMeta}
              onSelect={(f) => setItineraryFile(f)}
              onMetaChange={(m) => setItineraryMeta(m)}
            />

            {days.map((d, dayIdx) => (
              <div key={d.day} className='mb-4'>
                <div className='rounded-lg bg-orange-50 px-4 py-2 font-semibold text-orange-700 mb-2 text-[15px]'>
                  Day {d.day}{' '}
                  <span className='text-gray-400 font-normal ml-2'>
                    {d.date}
                  </span>
                </div>

                {dayIdx === 0 && (
                  <div className='bg-gray-50 rounded-lg px-4 py-3 mb-2 flex flex-col sm:flex-row gap-2'>
                    <div className='flex-1'>
                      <Label className='text-sm block mb-1 font-medium'>
                        Start Point *
                      </Label>
                      <Input
                        type='text'
                        value={startingPoint}
                        onChange={(e) => setStartingPoint(e.target.value)}
                        placeholder='Enter starting location'
                        className='w-full border px-3 py-2 rounded-lg outline-none text-sm'
                      />
                    </div>
                    <CustomDateTimePicker
                      value={startDate}
                      onChange={setStartDate}
                      placeholder='Select start date & time'
                      className='mt-3 self-end w-full'
                    />
                  </div>
                )}

                {!showDetails[dayIdx] ? (
                  // ✅ Default button
                  <button
                    className='rounded-full px-5 py-1.5 mt-2 text-white bg-gradient-to-r from-orange-400 to-pink-500 font-medium shadow'
                    onClick={() => handleAddDetails(dayIdx)}
                  >
                    + Add Details
                  </button>
                ) : (
                  // ✅ Show loader or details after ID fetch
                  <>
                    {!dayDetailIds[d.day] ? (
                      <p className='text-gray-400 text-sm italic mt-2'>
                        ⏳ Loading day details for Day {d.day}...
                      </p>
                    ) : (
                      <DetailsOptions
                        key={dayDetailIds[d.day]} // important for re-render
                        organizationId={
                          userData?.organizationPublicId ||
                          localStorage.getItem('organizationId') ||
                          '00000000-0000-0000-0000-000000000000'
                        }
                        tripPublicId={tripId as string}
                        dayDetailId={dayDetailIds[d.day]}
                      />
                    )}
                  </>
                )}
              </div>
            ))}

            <div className='bg-gray-50 rounded-lg px-4 py-3 mb-4 flex flex-col sm:flex-row gap-2 max-w-full'>
              <div className='flex-1 min-w-0'>
                <label className='text-sm block mb-1 font-medium'>
                  End Point *
                </label>
                <Input
                  type='text'
                  value={endPoint}
                  onChange={(e) => setEndPoint(e.target.value)}
                  placeholder='Enter ending location'
                  className='w-full max-w-full'
                />
              </div>
              <CustomDateTimePicker
                value={endDate}
                onChange={setEndDate}
                placeholder='Select end date & time'
                className='mt-3 self-end w-full'
              />
            </div>
          </div>

          <div className='pr-9'>
            <WizardFooter
              onPrev={handlePrevClick}
              onDraft={() => console.log('Draft itinerary saved')}
              onNext={handleUpdateItinerary}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
