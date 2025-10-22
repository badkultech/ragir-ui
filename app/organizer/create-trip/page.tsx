'use client';

import { useState, useRef, useEffect } from 'react';
import { Sidebar } from '@/components/organizer/sidebar';
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

export default function CreateTripPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [leaderModalOpen, setLeaderModalOpen] = useState(false);
  const [chooseModalOpen, setChooseModalOpen] = useState(false);
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
  const formattedDate = today.toLocaleDateString('en-GB');

  const [formData, setFormData] = useState({
    tripTitle: 'Himalayan group',
    startDate: formattedDate,
    endDate: formattedDate,
    totalDays: 1, // default 1 day
    minGroupSize: 2,
    maxGroupSize: 20,
    minAge: 18,
    maxAge: 50,
    tripHighlights: '',
  });

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
      <Sidebar />
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
                Trip Title
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
            <div className='grid md:grid-cols-2 gap-6 mb-6'>
              <div>
                <Label className='block text-gray-600 mb-2 font-medium'>
                  Start Date
                </Label>
                <div className='relative'>
                  <input
                    type='datetime-local'
                    placeholder='dd-mm-yyyy --:--'
                    value={formData.startDate}
                    onChange={(value) =>
                      handleInputChange('startDate', value.target.value)
                    }
                    className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500'
                  />
                </div>
              </div>
              <div>
                <Label className='block text-gray-600 mb-2 font-medium'>
                  End Date
                </Label>
                <div className='relative'>
                  <input
                    value={formData.endDate}
                    onChange={(value) =>
                      handleInputChange('endDate', value.target.value)
                    }
                    type='datetime-local'
                    className='w-full border px-3 py-2  rounded-lg outline-none text-sm'
                  />
                </div>
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
                  Minimum Group Size <span className='text-red-500'>*</span>
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
                  Maximum Group Size <span className='text-red-500'>*</span>
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
                  <span className='text-red-500'>*</span>
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
                  Maximum Age <span className='text-red-500'>*</span>
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
                Mood Tags
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
                Trip Locations
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
          </div>

          <div className='flex items-center gap-4 mt-10 justify-end-safe'>
            <Button className='px-8 py-2 rounded-full border border-gray-300 text-gray-500 font-medium bg-white hover:bg-gray-50 transition'>
              Save as Draft
            </Button>
            <Button
              onClick={() => router.push('/organizer/create-trip/Itinerary')}
              className='px-8 py-2 rounded-full font-medium text-white bg-gradient-to-r from-orange-400 to-pink-500 shadow hover:from-orange-500 hover:to-pink-600 transition flex items-center gap-2'
            >
              Save & Next
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
        <AddLeaderModal
          open={leaderModalOpen}
          onClose={() => setLeaderModalOpen(false)}
        />
        <ChooseLeaderModal
          open={chooseModalOpen}
          onClose={() => setChooseModalOpen(false)}
        />
      </div>
    </div>
  );
}
