'use client';

import { useState, useRef, useEffect } from 'react';

import { AppHeader } from '@/components/app-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AddLeaderModal } from '@/components/group-leader/AddLeaderModal';
import { ChooseLeaderModal } from '@/components/group-leader/ChooseLeaderModal';
import { useRouter } from 'next/navigation';
import { TripStepperHeader } from '@/components/create-trip/tripStepperHeader';
import {
  LearningGradient,
  JungleGradient,
  MountainGradient,
  SkygazyGradient,
  BeachGradient,
  DesertGradient,
  WellnessGradient,
  HeritageGradient,
  AdventureGradient,
  TrekkingGradient,
  MotorSportsGradient,
  WeekendGradient,
  WomenOnlyGradient,
  PartyGradient,
} from '@/components/library/SvgComponents/GradientsOfMoods';
import {
  BeachIcon,
  CalenderIcon,
  CampingIcon,
  CompassIcon,
  DesertIcon,
  FemaleIcon,
  ForestIcon,
  HeritageIcon,
  Hiking1Icon,
  LearningIcon,
  MotorSportsIcon,
  MountainIcon,
  NightIcon,
  PartiesIcon,
  WellnessIcon,
} from '@/components/library/SvgComponents/Icons';
import { CampingGradient } from '@/components/library/SvgComponents/GradientsOfMoods/campingGradient';
import { SpiritualGradient } from '@/components/library/SvgComponents/GradientsOfMoods/spiritualGradient';
import { GradientIconButton } from '@/components/library/customButtons/GradientIconButton';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { AddTripLeaderForm } from '@/components/library/AddTripLeaderForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LibrarySelectModal } from '@/components/library/LibrarySelectModal';
import { OrganizerSidebar } from '@/components/organizer/organizer-sidebar';
import { useCreateTripMutation } from '@/lib/services/organizer/trip/library/create-trip';
import { CustomDateTimePicker } from '@/components/ui/date-time-picker';
import { useSelector } from 'react-redux';
import { selectAuthState } from '@/lib/slices/auth';

export default function CreateTripPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leaderModalOpen, setLeaderModalOpen] = useState(false);
  const [chooseModalOpen, setChooseModalOpen] = useState(false);
  const [selectedGroupLeaderId, setSelectedGroupLeaderId] = useState("");
  const [leaders, setLeaders] = useState<any[]>([]); // ✅ Store added/selected leaders
  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;


  const router = useRouter();

  const tags = [
    {
      id: 'mountain',
      label: 'Mountain',
      icon: MountainIcon,
      gradient: MountainGradient,
    },
    {
      id: 'skygaze',
      label: 'Skygaze',
      icon: NightIcon,
      gradient: SkygazyGradient,
    },
    { id: 'beach', label: 'Beach', icon: BeachIcon, gradient: BeachGradient },
    {
      id: 'desert',
      label: 'Desert',
      icon: DesertIcon,
      gradient: DesertGradient,
    },
    {
      id: 'jungle',
      label: 'Jungle',
      icon: ForestIcon,
      gradient: JungleGradient,
    },
    {
      id: 'wellness',
      label: 'Wellness',
      icon: WellnessIcon,
      gradient: WellnessGradient,
    },
    {
      id: 'heritage',
      label: 'Heritage',
      icon: HeritageIcon,
      gradient: HeritageGradient,
    },
    {
      id: 'adventure',
      label: 'Adventure',
      icon: CompassIcon,
      gradient: AdventureGradient,
    },
    {
      id: 'trekking',
      label: 'Trekking',
      icon: Hiking1Icon,
      gradient: TrekkingGradient,
    },
    {
      id: 'motorsports',
      label: 'Motorsports',
      icon: MotorSportsIcon,
      gradient: MotorSportsGradient,
    },
    {
      id: 'weekends',
      label: 'Weekends',
      icon: CalenderIcon,
      gradient: WeekendGradient,
    },
    {
      id: 'women-only',
      label: 'Women-Only',
      icon: FemaleIcon,
      gradient: WomenOnlyGradient,
    },
    {
      id: 'parties',
      label: 'Parties',
      icon: PartiesIcon,
      gradient: PartyGradient,
    },
    {
      id: 'learning',
      label: 'Learning',
      icon: LearningIcon,
      gradient: LearningGradient,
    },
    {
      id: 'camping',
      label: 'Camping',
      icon: CampingIcon,
      gradient: CampingGradient,
    },
    {
      id: 'spiritual',
      label: 'Spiritual',
      icon: FemaleIcon,
      gradient: SpiritualGradient,
    },
  ];

  const [cityTags, setCityTags] = useState<string[]>([
    'Jaipur',
    'Mumbai',
    'Pune',
  ]);
  const [cityInput, setCityInput] = useState('');

  const today = new Date();
  const formattedDateISO = today.toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    tripTitle: 'Himalayan group',
    startDate: "",
    endDate: "",
    totalDays: 1, // default 1 day
    minGroupSize: 2,
    maxGroupSize: 20,
    minAge: 18,
    maxAge: 50,
    tripHighlights: '',
  });

  const [createTrip, { isLoading }] = useCreateTripMutation();

  const handleSaveTrip = async () => {
    try {

      // ✅ Convert start and end into proper Date objects
      const startDateObj = new Date(formData.startDate);
      const endDateObj = new Date(formData.endDate);

      // ✅ Extract date parts in yyyy-mm-dd
      const startDateOnly = startDateObj.toISOString().split("T")[0];
      const endDateOnly = endDateObj.toISOString().split("T")[0];

     const formatTime = (date: Date) => {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    };

    const startTime = formatTime(startDateObj);
    const endTime = formatTime(endDateObj);



      // ✅ prepare your payload as FormData
      const data = new FormData();
      data.append("name", formData.tripTitle);
      data.append("startDate", startDateOnly);
      data.append("endDate", endDateOnly);
      // ✅ Send time in required nested object format (stringified)
      data.append("startTime",JSON.stringify(startTime));
      data.append("endTime",JSON.stringify(endTime));
      data.append("totalDays", formData.totalDays.toString());
      data.append("minGroupSize", formData.minGroupSize.toString());
      data.append("maxGroupSize", formData.maxGroupSize.toString());
      data.append("minAge", formData.minAge.toString());
      data.append("maxAge", formData.maxAge.toString());
      data.append("highlights", formData.tripHighlights);
      // ✅ Add arrays (convert to JSON string for FormData)
      data.append("moodTags", JSON.stringify(selectedTags));
      data.append("groupLeaderId", selectedGroupLeaderId); // <-- ensure you have this variable set
      data.append("cityTags", JSON.stringify(cityTags)); // backend specifically expects 'cityTags'

      // ✅ call RTK mutation
      const response = await createTrip({
        organizationId,
        data,
      }).unwrap();

      console.log("✅ Trip created:", response);

      // ✅ redirect after success
      router.push(
        `/organizer/create-trip/Itinerary?startDate=${encodeURIComponent(
          formData.startDate
        )}&endDate=${encodeURIComponent(formData.endDate)}&totalDays=${formData.totalDays}`
      );
    } catch (error) {
      console.error("❌ Trip creation failed:", error);
      alert("Failed to create trip. Please try again.");
    }
  };




  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field: string, increment: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: increment
        ? (prev[field as keyof typeof prev] as number) + 1
        : Math.max(0, (prev[field as keyof typeof prev] as number) - 1),
    }));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const addCityTag = () => {
    if (cityInput.trim() && !cityTags.includes(cityInput.trim())) {
      setCityTags((prev) => [...prev, cityInput.trim()]);
      setCityInput('');
    }
  };

  const removeCityTag = (tagToRemove: string) => {
    setCityTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  // Auto-calculate totalDays whenever startDate or endDate changes

  useEffect(() => {
    if (!formData.startDate || !formData.endDate) return;

    // Convert dd/MM/yyyy to yyyy-MM-dd
    const parseDate = (dateStr: string) => {
      const parts = dateStr.split('/');
      if (parts.length === 3)
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      return new Date(dateStr);
    };

    const start = parseDate(formData.startDate);
    const end = parseDate(formData.endDate);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    setFormData((prev) => ({ ...prev, totalDays: diffDays }));
  }, [formData.startDate, formData.endDate]);

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
        <div className='p-8 bg-white min-h-screen '>
          <div className='max-w-auto mx-auto bg-white shadow rounded-2xl p-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
              Trip Overview
            </h2>

            {/* Trip Title */}
            <div className='mb-6'>
              <Label className='block text-gray-600 mb-2 font-medium'>
                Trip Title <span className='text-black'>*</span>
              </Label>
              <div className='relative'>
                <Input
                  type='text'
                  placeholder='Enter trip title'
                  maxLength={80}
                  value={formData.tripTitle}
                  onChange={(e) =>
                    handleInputChange('tripTitle', e.target.value)
                  }
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500'
                />
                <span className='absolute right-4 top-1/2 -translate-y-1/2 text-sm text-orange-500'>
                  {formData.tripTitle.length}/80 Characters
                </span>
              </div>
            </div>

            {/* Start and End Dates */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Start Date */}
              <div className="flex flex-col gap-1">
                <Label className="text-gray-600 font-medium">
                  Start Date<span className='text-black'>*</span>
                </Label>
                <CustomDateTimePicker
                  value={formData.startDate}
                  onChange={(val) => handleInputChange('startDate', val)}
                  placeholder="Select start date & time"
                />
              </div>

              {/* End Date */}
              <div className="flex flex-col gap-1">
                <Label className="text-gray-600 font-medium">
                  End Date<span className='text-black'>*</span>
                </Label>
                <CustomDateTimePicker
                  value={formData.endDate}
                  onChange={(val) => handleInputChange('endDate', val)}
                  placeholder="Select end date & time"
                />
              </div>
            </div>


            {/* Total Days */}
            <div>
              <Label
                htmlFor='totalDays'
                className='text-sm font-medium text-gray-700 mb-2 block'
              >
                Total Days
              </Label>
              <div className='flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2'>
                <span className='text-gray-500'>{formData.totalDays}</span>
                <span className='text-gray-900 font-medium'>
                  {formData.totalDays} Days | {formData.totalDays - 1} Nights
                </span>
              </div>
            </div>

            {/* Group Size */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-5'>
              <div>
                <Label className='text-sm font-medium text-gray-700 mb-2 block'>
                  Minimum Group Size <span className='text-black'>*</span>
                </Label>
                <div className='relative'>
                  <Input
                    value={formData.minGroupSize.toString().padStart(2, '0')}
                    readOnly
                    className='pr-8 text-center'
                  />
                  <div className='absolute right-2 top-1/2 -translate-y-1/2 flex flex-col'>
                    <button
                      onClick={() => handleNumberChange('minGroupSize', true)}
                      className='h-3 w-3 flex items-center justify-center hover:bg-gray-100 rounded text-xs'
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleNumberChange('minGroupSize', false)}
                      className='h-3 w-3 flex items-center justify-center hover:bg-gray-100 rounded text-xs'
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <Label className='text-sm font-medium text-gray-700 mb-2 block'>
                  Maximum Group Size <span className='text-black'>*</span>
                </Label>
                <div className='relative'>
                  <Input
                    value={formData.maxGroupSize.toString()}
                    readOnly
                    className='pr-8 text-center'
                  />
                  <div className='absolute right-2 top-1/2 -translate-y-1/2 flex flex-col'>
                    <button
                      onClick={() => handleNumberChange('maxGroupSize', true)}
                      className='h-3 w-3 flex items-center justify-center hover:bg-gray-100 rounded text-xs'
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleNumberChange('maxGroupSize', false)}
                      className='h-3 w-3 flex items-center justify-center hover:bg-gray-100 rounded text-xs'
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Age Range */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <Label className='text-sm font-medium text-gray-700 mb-2 block'>
                  Minimum Age (18yrs or above){' '}
                  <span className='text-black'>*</span>
                </Label>
                <div className='relative'>
                  <Input
                    value={formData.minAge.toString()}
                    readOnly
                    className='pr-8 text-center'
                  />
                  <div className='absolute right-2 top-1/2 -translate-y-1/2 flex flex-col'>
                    <button
                      onClick={() => handleNumberChange('minAge', true)}
                      className='h-3 w-3 flex items-center justify-center hover:bg-gray-100 rounded text-xs'
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleNumberChange('minAge', false)}
                      className='h-3 w-3 flex items-center justify-center hover:bg-gray-100 rounded text-xs'
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <Label className='text-sm font-medium text-gray-700 mb-2 block'>
                  Maximum Age <span className='text-black'>*</span>
                </Label>
                <div className='relative'>
                  <Input
                    value={formData.maxAge.toString()}
                    readOnly
                    className='pr-8 text-center'
                  />
                  <div className='absolute right-2 top-1/2 -translate-y-1/2 flex flex-col'>
                    <button
                      onClick={() => handleNumberChange('maxAge', true)}
                      className='h-3 w-3 flex items-center justify-center hover:bg-gray-100 rounded text-xs'
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleNumberChange('maxAge', false)}
                      className='h-3 w-3 flex items-center justify-center hover:bg-gray-100 rounded text-xs'
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mood Tags */}
            <div className='mb-6 mt-6'>
              <Label className='block text-gray-600 mb-3 font-medium'>
                Mood Tags<span className='text-black'>*</span>
              </Label>
              <div className='flex flex-wrap gap-3'>
                {tags.map((tag) => (
                  <GradientIconButton
                    key={tag.id}
                    label={tag.label}
                    className={` hover:border-orange-300`}
                    Icon={tag.icon}
                    selected={selectedTags.includes(tag.id)} // ✅ highlight selected
                    onClick={() => toggleTag(tag.id)} // ✅ toggle on click
                    iconColor={
                      selectedTags.includes(tag.id) ? 'Orange' : 'black'
                    }
                    labelColor={
                      selectedTags.includes(tag.id) ? 'Orange' : 'black'
                    }
                  />
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className='mb-6'>
              <Label className='block text-gray-600 mb-2 font-medium'>
                City Tags<span className='text-black'>*</span>
              </Label>
              <div className='space-y-3'>
                <div className='flex gap-2'>
                  <Input
                    id='cityTags'
                    placeholder='Add cities/destinations'
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCityTag()}
                    className='flex-1'
                  />

                </div>

                {cityTags.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {cityTags.map((tag) => (
                      <span
                        key={tag}
                        onClick={() => setCityInput(tag)} // ✅ click to move tag text back to input
                        className='inline-flex items-center gap-1 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-sm cursor-pointer hover:bg-blue-100 transition'
                      >
                        {tag}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // ❗ stop click bubbling (so delete doesn’t trigger input fill)
                            removeCityTag(tag);
                          }}
                          className='ml-1 text-blue-500 hover:text-blue-700'
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>


            {/* Highlights */}
            <div className='mb-8'>
              <Label className='block text-gray-600 mb-2 font-medium'>
                Trip Highlights
              </Label>
              <div className='border border-gray-200 rounded-2xl'>

                <RichTextEditor
                  value={formData.tripHighlights}
                  onChange={(val) =>
                    handleInputChange('tripHighlights', val ?? '')
                  }
                // Can be 'edit', 'live', or 'preview'

                />


              </div>
            </div>
          </div>
          {/* Bottom Buttons */}
          <div className='max-w-auto mx-auto bg-white shadow rounded-2xl p-8 mt-4 '>
            <div className='flex items-center justify-between mb-1'>
              <span className='font-semibold text-xl'>Group Leaders</span>
              <div className='flex gap-3'>
                <Button
                  onClick={() => setLeaderModalOpen(true)}
                  className='border border-orange-500 bg-white text-orange-500 px-5 py-2 rounded-md font-medium hover:bg-orange-50 transition-all flex items-center gap-2'
                >
                  <span className='text-lg leading-none'>+</span> Add Leader
                </Button>
                <Button
                  onClick={() => setChooseModalOpen(true)}
                  className='bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-2 rounded-md font-medium shadow hover:from-orange-500 hover:to-pink-600 transition-all'
                >
                  Choose from Library
                </Button>
              </div>
            </div>
            <p className='text-gray-400 text-base'>
              Select from existing leaders or add new
            </p>

            {leaders.map((leader, index) => (
              <div
                key={leader.id || index}
                className="flex items-center justify-between gap-3 border rounded-xl p-3 shadow-sm bg-gray-50 hover:bg-gray-100 transition"
              >
                {/* Left side: Leader info */}
                <div className="flex items-center gap-3">
                  {/* Image */}
                  {leader.imageUrl || leader.profileImageUrl ? (
                    <img
                      src={leader.imageUrl || leader.profileImageUrl}
                      alt={leader.name || leader.title || "Leader"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      <span className="text-xs">No Img</span>
                    </div>
                  )}

                  {/* Details */}
                  <div>
                    <p className="font-medium text-gray-800">
                      {leader.name || leader.title || "Unnamed"}
                    </p>
                    {(leader.tagline || leader.description) && (
                      <p className="text-xs text-gray-500">
                        {leader.tagline || leader.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side: Remove button */}
                <button
                  onClick={() =>
                    setLeaders((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                  className="text-gray-400 hover:text-red-500 transition text-xl font-bold"
                  title="Remove Leader"
                >
                  ×
                </button>
              </div>
            ))}




          </div>

          <div className='flex items-center gap-4 mt-10 justify-end-safe'>
            <Button className='px-8 py-2 rounded-full border border-gray-300 text-gray-500 font-medium bg-white hover:bg-gray-50 transition'>
              Save as Draft
            </Button>
            <Button

              onClick={handleSaveTrip}
              className='px-8 py-2 rounded-full font-medium text-white bg-gradient-to-r from-orange-400 to-pink-500 shadow hover:from-orange-500 hover:to-pink-600 transition flex items-center gap-2'
            >
              {isLoading ? "Saving..." : "Save & Next"}
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                viewBox='0 0 24 24'
              >
                <path
                  d='M9 5l7 7-7 7'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </Button>
          </div>
        </div>
        {/* ✅ Add Leader Modal */}
        <Dialog open={leaderModalOpen} onOpenChange={setLeaderModalOpen}>
          <DialogContent
            className="max-w-3xl w-full h-[90vh] p-0 overflow-hidden flex flex-col rounded-2xl"
          >
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold px-6 pt-6">
                Add New Group Leader
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
              <AddTripLeaderForm
                onCancel={() => setLeaderModalOpen(false)}
                onSave={(leaderData) => {
                  console.log("✅ Leader Saved:", leaderData);

                  // ✅ Save in state so it shows in UI
                  // setLeaders((prev) => [...prev, leaderData]);

                  // ✅ Also store ID for backend
                  if (leaderData.id) {
                    setSelectedGroupLeaderId(leaderData.id);
                  }

                  setLeaderModalOpen(false);
                }}
              />

            </div>
          </DialogContent>
        </Dialog>

        {/* ✅ Choose Leader Modal */}
        <LibrarySelectModal
          open={chooseModalOpen}
          onClose={() => setChooseModalOpen(false)}
          category="trip-leaders"
          onSelect={(item) => {
            console.log("✅ Selected Leader from Library:", item);

            // ✅ Save selected leader’s ID for backend
            setSelectedGroupLeaderId(item.id);

            // (Optional) If you want to show the name somewhere:
            // setSelectedLeaderName(item.name);
            setLeaders((prev) => [...prev, item]);
            setChooseModalOpen(false);
          }}
        />

      </div>
    </div>
  );
}
