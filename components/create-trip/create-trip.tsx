'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LibrarySelectModal } from '@/components/library/LibrarySelectModal';
import {
  useCreateTripMutation,
  useLazyGetTripByIdQuery,
  useUpdateTripMutation,
} from '@/lib/services/organizer/trip/create-trip';
import { CustomDateTimePicker } from '@/components/ui/date-time-picker';
import { useDispatch, useSelector } from 'react-redux';
import {
  organizerState,
  setChooseModalOpen,
  setCityInput,
  setCityTags,
  setFormData,
  setLeaderModalOpen,
  setLeaders,
  setSelectedGroupLeaderId,
  setSelectedTags,
} from '@/app/organizer/-organizer-slice';
import { useSaveGroupLeaderMutation } from '@/lib/services/organizer/trip/library/leader';
import { useOrganizationId } from '@/hooks/useOrganizationId';
import { validateRequiredFields } from '@/lib/utils/validateRequiredFields';
import RequiredStar from '../common/RequiredStar';
import { toast } from "@/hooks/use-toast";

interface Props {
  tripId?: string;
}

export function CreateTrip({ tripId }: Props) {
  const dispatch = useDispatch();
  const state = useSelector(organizerState);
  const {
    leaderModalOpen,
    selectedTags,
    chooseModalOpen,
    selectedGroupLeaderId,
    leaders,
    cityInput,
    formData,
    cityTags,
  } = state;
  const organizationId = useOrganizationId();
  const router = useRouter();
  const [leaderSaving, setLeaderSaving] = useState(false);
  const [tripSaving, setTripSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saveDraftDisabled, setSaveDraftDisabled] = useState(false);




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

  const [createTrip, { isLoading: createTripLoading }] =
    useCreateTripMutation();
  const [updateTrip, { isLoading: updateTripLoading }] =
    useUpdateTripMutation();

  const [triggerGetTrip, { data: tripData }] =
    useLazyGetTripByIdQuery();
  const [saveLeader] = useSaveGroupLeaderMutation();

  useEffect(() => {
    setSaveDraftDisabled(false);
  }, [formData, selectedTags, cityTags, leaders]);

  useEffect(() => {
    if (!tripId || !organizationId) return;

    console.log("🔄 Fetching Trip...");
    triggerGetTrip({
      organizationId,
      tripId,
    });
  }, [tripId, organizationId]);


  useEffect(() => {
    if (!tripData?.data) return;

    const trip = tripData.data;
    const safeParseTags = (arr: any): string[] => {
      if (!arr) return [];
      if (Array.isArray(arr) && typeof arr[0] === "string" && !arr[0].includes(`[`)) {
        return arr;
      }
      try {
        const fixedString = arr.join("");
        const parsed = JSON.parse(fixedString);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) { }
      try {
        return JSON.parse(arr);
      } catch (e) { }

      return [];
    };
    const parsedMoods = safeParseTags(trip.moodTags);
    const parsedCities = safeParseTags(trip.cityTags);

    dispatch(
      setFormData({
        ...formData,
        tripTitle: trip.name ?? "",
        startDate: `${trip.startDate} ${trip.startTime}`,
        endDate: `${trip.endDate} ${trip.endTime}`,
        totalDays: trip.totalDays ?? 1,
        minGroupSize: trip.minGroupSize,
        maxGroupSize: trip.maxGroupSize,
        minAge: trip.minAge,
        maxAge: trip.maxAge,
        tripHighlights: trip.highlights,
      })
    );

    dispatch(setSelectedTags(parsedMoods));
    dispatch(setCityTags(parsedCities));

    if (trip.groupLeaders && trip.groupLeaders.length > 0) {
      const mapped = trip.groupLeaders.map((leader: any) => ({
        id: String(leader.id),
        name: leader.name,
        title: leader.name,
        tagline: leader.tagline,
        description: leader.tagline || leader.bio || "",
        imageUrl: leader.documents?.[0]?.url || "",
      }));

      dispatch(setLeaders(mapped));
      dispatch(setSelectedGroupLeaderId(mapped[0].id));
    }


  }, [tripData]);

  const getTodayStr = () => {
    const t = new Date()
    // t.setDate(t.getDate() + 1) // disable today as well
    const pad = (n: number) => n.toString().padStart(2, "0")
    return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`
  }

  const validateForm = () => {
    const baseErrors = validateRequiredFields([
      { key: "tripTitle", label: "Trip Title", value: formData.tripTitle },
      { key: "startDate", label: "Start Date", value: formData.startDate },
      { key: "endDate", label: "End Date", value: formData.endDate },
      { key: "moodTags", label: "Mood Tags", value: selectedTags },
      { key: "cityTags", label: "City Tags", value: cityTags },

    ]);

    const newErrors: any = { ...baseErrors };

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate).getTime();
      const end = new Date(formData.endDate).getTime();

      if (end < start) {
        newErrors.endDate = "End date cannot be before start date";
      }

      if (start === end) {
        newErrors.endDate = "End date & time cannot be same as start date & time";
      }
    }



    if (Number(formData.minGroupSize) <= 0) {
      newErrors.minGroupSize = "Minimum group size must be greater than 0";
    }
    if (Number(formData.maxGroupSize) <= 0) {
      newErrors.maxGroupSize = "Maximum group size must be greater than 0";
    }
    if (Number(formData.minGroupSize) > Number(formData.maxGroupSize)) {
      newErrors.minGroupSize = "Minimum group size cannot exceed maximum";
      newErrors.maxGroupSize = "Maximum group size must be greater than minimum";
    }
    if (Number(formData.minAge) < 18) {
      newErrors.minAge = "Minimum age must be 18 or above";
    }
    if (Number(formData.maxAge) <= 0) {
      newErrors.maxAge = "Maximum age must be greater than 0";
    }
    if (Number(formData.minAge) > Number(formData.maxAge)) {
      newErrors.minAge = "Minimum age cannot exceed maximum age";
      newErrors.maxAge = "Maximum age must be greater than minimum age";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };



  const handleSaveTrip = async (isDraft = false) => {
    if (!validateForm()) {
      setTripSaving(false);
      return;
    }
    setTripSaving(true);

    try {
      const startDateObj = new Date(formData.startDate);
      const endDateObj = new Date(formData.endDate);

      const startDateOnly = startDateObj.toISOString().split('T')[0];
      const endDateOnly = endDateObj.toISOString().split('T')[0];

      const formatTime = (date: Date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      };

      const startTime = formatTime(startDateObj);
      const endTime = formatTime(endDateObj);

      const data = new FormData();
      data.append('name', formData.tripTitle);
      data.append('startDate', startDateOnly);
      data.append('endDate', endDateOnly);
      data.append('startTime', startTime);
      data.append('endTime', endTime);
      data.append('totalDays', formData.totalDays.toString());
      data.append('minGroupSize', formData.minGroupSize.toString());
      data.append('maxGroupSize', formData.maxGroupSize.toString());
      data.append('minAge', formData.minAge.toString());
      data.append('maxAge', formData.maxAge.toString());
      data.append('highlights', formData.tripHighlights);
      selectedTags.forEach(tag => {
        data.append("moodTags[]", tag);
      });
      cityTags.forEach(city => {
        data.append("cityTags[]", city);
      });
      leaders.forEach((leader) => {
        data.append("groupLeaderIds", leader.id.toString());
      });

      let createdTripId = tripId;

      if (tripId) {
        await updateTrip({ organizationId, tripId, data }).unwrap();
      } else {
        const response = await createTrip({ organizationId, data }).unwrap();
        createdTripId = response?.data?.publicId;
      }
      if (!isDraft && createdTripId) {
        router.push(`/organizer/create-trip/${createdTripId}/Itinerary`);
      }

    } catch (err: any) {
      const backendMessage =
        err?.data?.message ||
        err?.data?.error ||
        err?.error ||
        "Something went wrong.";

      toast({
        toastType: "error",
        title: "Error",
        description: backendMessage,
      });
    } finally {
      setTripSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    dispatch(setFormData({ ...formData, [field]: value }));
  };

  const handleNumberChange = (field: string, increment: boolean) => {
    const currentValue = formData[field as keyof typeof formData] as number;

    let newValue = increment
      ? currentValue + 1
      : currentValue - 1;

    if (field === "minAge") {
      newValue = Math.max(18, Math.min(100, newValue));
    }
    else if (field === "maxAge") {
      newValue = Math.max(0, Math.min(100, newValue));
    }
    else if (field === "minGroupSize" || field === "maxGroupSize") {
      newValue = Math.max(0, Math.min(100, newValue));
    }


    dispatch(setFormData({ ...formData, [field]: newValue }));
  };


  const toggleTag = (tag: string) => {
    dispatch(
      setSelectedTags(
        selectedTags.includes(tag)
          ? selectedTags.filter((t) => t !== tag)
          : [...selectedTags, tag],
      ),
    );
  };

  const addCityTag = () => {
    if (cityInput.trim() && !cityTags.includes(cityInput.trim())) {
      dispatch(setCityTags([...cityTags, cityInput.trim()]));
      dispatch(setCityInput(''));
    }
  };

  const removeCityTag = (tagToRemove: string) => {
    dispatch(setCityTags(cityTags.filter((tag) => tag !== tagToRemove)));
  };

  useEffect(() => {
    if (!formData.startDate || !formData.endDate) return;

    const parseDateOnly = (dateStr: string) => {
      const d = new Date(dateStr);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()); // time removed
    };

    const start = parseDateOnly(formData.startDate);
    const end = parseDateOnly(formData.endDate);

    // Calculate pure DATE difference (no time)
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Ensure minimum 1 day always
    const finalDays = diffDays < 1 ? 1 : diffDays;

    dispatch(setFormData({ ...formData, totalDays: finalDays }));
  }, [formData.startDate, formData.endDate]);


  return (
    <div className='flex min-h-screen bg-gray-50'>
      <div className='flex-1'>
        <div className={`p-8 bg-white min-h-screen ${tripSaving ? "pointer-events-none opacity-50" : ""}`}>
          <div className='max-w-auto mx-auto bg-white shadow rounded-2xl p-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
              Trip Overview
            </h2>

            {/* Trip Title */}
            <div className='mb-6'>
              <Label className='block text-gray-600 mb-2 font-medium'>
                Trip Title <RequiredStar />
              </Label>
              <div className='relative'>
                <Input
                  type='text'
                  placeholder='Enter trip title'
                  maxLength={70}
                  value={formData.tripTitle}
                  onChange={(e) => {
                    {
                      handleInputChange('tripTitle', e.target.value);
                      clearError("tripTitle");;
                      clearError("tripTitle");
                    }
                  }}
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500'
                />


                <span className='absolute right-4 top-1/2 -translate-y-1/2 text-sm text-orange-500'>
                  {formData.tripTitle.length}/70 Characters
                </span>

              </div>
              {errors.tripTitle && (
                <p className="text-red-500 text-sm mt-1">{errors.tripTitle}</p>
              )}
            </div>

            {/* Start and End Dates */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Start Date */}
              <div className="flex flex-col gap-1 relative pb-5">
                <Label className='text-gray-600 font-medium'>
                  Start Date<RequiredStar />
                </Label>
                <CustomDateTimePicker
                  value={formData.startDate}
                  stepMinutes={15}
                  minDate={getTodayStr()}
                  onChange={(val) => {
                    handleInputChange('startDate', val);
                    clearError("startDate");
                    if (!formData.endDate) {
                      handleInputChange("endDate", val);
                    }

                  }}
                  placeholder="Select start date & time"
                  className="w-full"
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm absolute left-0 -bottom-2">
                    {errors.startDate}
                  </p>
                )}
              </div>
              {/* End Date */}
              <div className="flex flex-col gap-1 relative pb-5">
                <Label className='text-gray-600 font-medium'>
                  End Date<RequiredStar />
                </Label>
                <CustomDateTimePicker
                  value={formData.endDate}
                  onChange={(val) => {
                    handleInputChange('endDate', val);
                    clearError("endDate");
                  }}
                  minDate={formData.startDate || getTodayStr()}
                  stepMinutes={15}
                  placeholder="Select end date & time"
                  className="w-full"
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm absolute left-0 top-15">
                    {errors.endDate}
                  </p>
                )}
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
                  Minimum Group Size <RequiredStar />
                </Label>
                <div className='relative'>
                  <Input
                    value={formData.minGroupSize.toString().padStart(2, '0')}
                    min={2}
                    max={100}
                    onChange={(e) => {
                      let val = Number(e.target.value);
                      if (val > 100) val = 100;
                      handleInputChange('minGroupSize', val);
                      clearError("minGroupSize");
                      clearError("maxGroupSize");
                    }}
                    className='pr-8 text-center'
                  />

                  <div className='absolute right-2 top-1/2 -translate-y-1/2 flex flex-col'>
                    <button
                      onClick={() => handleNumberChange('minGroupSize', true)}
                      className="h-4 flex items-center justify-center hover:bg-gray-100 rounded text-xs cursor-pointer"
                    >
                      <span className="scale-[0.9]">▲</span>
                    </button>
                    <button
                      onClick={() => handleNumberChange('minGroupSize', false)}
                      className="h-4 flex items-center justify-center hover:bg-gray-100 rounded text-xs cursor-pointer"
                    >
                      <span className="scale-[0.9]">▼</span>
                    </button>
                  </div>

                </div>
                {errors.minGroupSize && (
                  <p className="text-red-500 text-sm mt-1">{errors.minGroupSize}</p>
                )}
              </div>

              <div>
                <Label className='text-sm font-medium text-gray-700 mb-2 block'>
                  Maximum Group Size <RequiredStar />
                </Label>
                <div className='relative'>
                  <Input
                    value={formData.maxGroupSize.toString().padStart(2, '0')}
                    min={formData.minGroupSize}
                    max={100}
                    onChange={(e) => {
                      let val = Number(e.target.value);
                      if (val > 100) val = 100;
                      handleInputChange('maxGroupSize', val);
                      clearError("maxGroupSize");
                      clearError("minGroupSize");
                    }}
                    className='pr-8 text-center'
                  />

                  <div className='absolute right-2 top-1/2 -translate-y-1/2 flex flex-col'>
                    <button
                      onClick={() => handleNumberChange('maxGroupSize', true)}
                      className="h-4 flex items-center justify-center hover:bg-gray-100 rounded text-xs cursor-pointer"
                    >
                      <span className="scale-[0.9]">▲</span>
                    </button>
                    <button
                      onClick={() => handleNumberChange('maxGroupSize', false)}
                      className="h-4 flex items-center justify-center hover:bg-gray-100 rounded text-xs cursor-pointer"
                    >
                      <span className="scale-[0.9]">▼</span>
                    </button>
                  </div>

                </div>
                {errors.maxGroupSize && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxGroupSize}</p>
                )}
              </div>
            </div>

            {/* Age Range */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <Label className='text-sm font-medium text-gray-700 mb-2 block'>
                  Minimum Age (18yrs or above){' '}
                  <RequiredStar />
                </Label>
                <div className='relative'>
                  <Input
                    value={formData.minAge.toString().padStart(2, '0')}
                    min={18}
                    max={100}
                    onChange={(e) => {
                      let val = Number(e.target.value);
                      if (val > 100) val = 100;
                      handleInputChange("minAge", val);
                      clearError("minAge");
                      clearError("maxAge");
                    }}
                    className='pr-8 text-center'
                  />

                  <div className='absolute right-2 top-1/2 -translate-y-1/2 flex flex-col'>
                    <button
                      onClick={() => {
                        handleNumberChange('minAge', true);
                      }}
                      className="h-4 flex items-center justify-center hover:bg-gray-100 rounded text-xs cursor-pointer"
                    >
                      <span className="scale-[0.9]">▲</span>
                    </button>
                    <button
                      onClick={() => {
                        handleNumberChange('minAge', false);
                      }}

                      disabled={formData.minAge <= 18}
                      className="h-4 flex items-center justify-center hover:bg-gray-100 rounded text-xs cursor-pointer"
                    >
                      <span className="scale-[0.9]">▼</span>
                    </button>
                  </div>
                </div>
                {errors.minAge && (
                  <p className="text-red-500 text-sm mt-1">{errors.minAge}</p>
                )}
              </div>

              <div>
                <Label className='text-sm font-medium text-gray-700 mb-2 block'>
                  Maximum Age <RequiredStar />
                </Label>
                <div className='relative'>
                  <Input
                    value={formData.maxAge.toString().padStart(2, '0')}
                    min={formData.minAge}
                    max={100}
                    onChange={(e) => {
                      let val = Number(e.target.value);
                      if (val > 100) val = 100;
                      handleInputChange("maxAge", val);
                      clearError("minAge");
                      clearError("maxAge");
                    }}
                    className='pr-8 text-center'
                  />

                  <div className='absolute right-2 top-1/2 -translate-y-1/2 flex flex-col'>
                    <button
                      onClick={() => {
                        handleNumberChange('maxAge', true);
                      }}
                      className="h-4 flex items-center justify-center hover:bg-gray-100 rounded text-xs cursor-pointer"
                    >
                      <span className="scale-[0.9]">▲</span>
                    </button>
                    <button
                      onClick={() => {
                        handleNumberChange('maxAge', false);
                      }}

                      disabled={formData.maxAge <= 18}
                      className="h-4 flex items-center justify-center hover:bg-gray-100 rounded text-xs cursor-pointer"
                    >
                      <span className="scale-[0.9]">▼</span>
                    </button>
                  </div>
                </div>
                {errors.maxAge && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxAge}</p>
                )}
              </div>
            </div>

            {/* Mood Tags */}
            <div className='mb-6 mt-6'>
              <Label className='block text-gray-600 mb-3 font-medium'>
                Mood Tags<RequiredStar />{errors.moodTags && (
                  <span className="text-red-500 text-sm mt-1">({errors.moodTags})</span>
                )}
              </Label>
              <div className='flex flex-wrap gap-3'>
                {tags.map((tag) => (
                  <GradientIconButton
                    key={tag.id}
                    label={tag.label}
                    className={` hover:border-orange-300`}
                    Icon={tag.icon}
                    selected={selectedTags.includes(tag.id)} // ✅ highlight selected
                    onClick={() => {
                      toggleTag(tag.id);
                      clearError("moodTags");
                    }}

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
                City Tags<RequiredStar />
              </Label>
              <div className='space-y-3'>
                <div className='flex gap-2'>
                  <Input
                    id='cityTags'
                    placeholder='Add cities/destinations'
                    value={cityInput}
                    onChange={(e) => {
                      dispatch(setCityInput(e.target.value));
                      clearError("cityTags");
                    }}

                    onKeyPress={(e) => e.key === 'Enter' && addCityTag()}
                    className='flex-1'
                  />

                </div>

                {cityTags.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {cityTags.map((tag) => (
                      <span
                        key={tag}
                        className='inline-flex items-center gap-1 px-3 py-1 bg-blue-50 border border-blue-200 
               text-blue-700 rounded-full text-sm cursor-default hover:bg-blue-100 transition'
                      >
                        {tag}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCityTag(tag);
                          }}
                          className='ml-1 text-blue-500 hover:text-blue-700 cursor-pointer'
                        >
                          ×
                        </button>
                      </span>
                    ))}

                  </div>
                )}
                {errors.cityTags && (
                  <p className="text-red-500 text-sm mt-1">{errors.cityTags}</p>
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
                  onChange={(val) => {
                    handleInputChange('tripHighlights', val ?? '');
                  }}

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
                  onClick={() => dispatch(setLeaderModalOpen(true))}
                  className='border border-orange-500 bg-white text-orange-500 px-5 py-2 rounded-md font-medium hover:bg-orange-50 transition-all flex items-center gap-2'
                >
                  <span className='text-lg leading-none'>+</span> Add Leader
                </Button>
                <Button
                  onClick={() => {
                    dispatch(setChooseModalOpen(true));
                  }}
                  className='bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-2 rounded-md font-medium shadow hover:from-orange-500 hover:to-pink-600 transition-all'
                >
                  Choose from Library
                </Button>
              </div>
            </div>
            <p className='text-gray-400 text-base'>
              Select from existing leaders or add new
            </p>
            <div className="flex flex-col gap-4 mt-4">
              {leaders.map((leader, index) => (
                <div
                  key={leader.id || index}
                  className='flex items-center justify-between gap-3 border rounded-xl p-3 shadow-sm bg-gray-50 hover:bg-gray-100 transition'
                >
                  {/* Left side: Leader info */}
                  <div className='flex items-center gap-3'>
                    {/* Image */}
                    {leader.imageUrl || leader.profileImageUrl ? (
                      <img
                        src={leader.imageUrl || leader.profileImageUrl}
                        alt={leader.name || leader.title || 'Leader'}
                        className='w-10 h-10 rounded-full object-cover'
                      />
                    ) : (
                      <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500'>
                        <span className='text-xs'>No Img</span>
                      </div>
                    )}

                    {/* Details */}
                    <div>
                      <p className='font-medium text-gray-800'>
                        {leader.name || leader.title || 'Unnamed'}
                      </p>
                      {(leader.tagline || leader.description) && (
                        <p className='text-xs text-gray-500'>
                          {leader.tagline || leader.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right side: Remove button */}
                  <button
                    onClick={() => {
                      const updated = leaders.filter((_, i) => i !== index);
                      dispatch(setLeaders(updated));
                      if (updated.length === 0) {
                        dispatch(setSelectedGroupLeaderId(""));
                      }
                    }}

                    className='text-gray-400 hover:text-red-500 transition text-xl font-bold'
                    title='Remove Leader'
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className='flex items-center gap-4 mt-10 justify-end-safe'>
            <Button
              onClick={async () => {
                if (saveDraftDisabled) return;

                setSaveDraftDisabled(true);

                if (tripSaving) return;
                setTripSaving(true);

                await handleSaveTrip(true);
              }}

              disabled={saveDraftDisabled}
              className='px-8 py-2 rounded-full border border-gray-300 text-gray-500 font-medium bg-white hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Save as Draft
            </Button>
            <Button
              onClick={async () => {
                if (tripSaving) return;
                setTripSaving(true);
                await handleSaveTrip(false);
              }}
              disabled={tripSaving || createTripLoading || updateTripLoading}
              className={`
                          px-8 py-2 rounded-full font-medium text-white 
                          bg-gradient-to-r from-orange-400 to-pink-500 shadow
                          flex items-center gap-2 transition
                          ${tripSaving || createTripLoading || updateTripLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-orange-500 hover:to-pink-600"
                }
                        `}
            >
              {tripSaving || createTripLoading || updateTripLoading ? "Saving..." : "Save & Next"}

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
        <Dialog
          open={leaderModalOpen}
          onOpenChange={(data) => {
            dispatch(setLeaderModalOpen(data));
          }}
        >
          <DialogContent className="max-w-3xl w-full h-[90vh] p-0 overflow-hidden flex flex-col rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold px-6 pt-6">
                Add New Group Leader
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
              <AddTripLeaderForm
                mode="trip"
                onCancel={() => dispatch(setLeaderModalOpen(false))}
                parentLoading={leaderSaving}
                onSave={async (formValues, documents, done) => {

                  if (leaderSaving) return;
                  setLeaderSaving(true);

                  try {
                    const fd = new FormData();
                    fd.append("name", formValues.name);
                    fd.append("tagline", formValues.tagline ?? "");
                    fd.append("bio", formValues.bio ?? "");
                    fd.append("organizationId", organizationId);
                    if (documents?.[0]?.file) {
                      fd.append("documents[0].file", documents[0].file);
                      fd.append("documents[0].type", "IMAGE");
                    }

                    const savedLeader = await saveLeader({
                      organizationId,
                      data: fd,
                    }).unwrap();

                    dispatch(
                      setLeaders([
                        ...leaders.filter(l => String(l.id) !== String(savedLeader.id)),
                        {
                          id: String(savedLeader.id),
                          title: savedLeader.name || "Untitled",
                          name: savedLeader.name,
                          tagline: savedLeader.tagline,
                          description: savedLeader.bio,
                          imageUrl: documents?.[0]?.file
                            ? URL.createObjectURL(documents[0].file)
                            : savedLeader.documents?.[0]?.url || "",
                        },
                      ])
                    );


                    dispatch(setSelectedGroupLeaderId(String(savedLeader.id)));
                    clearError("groupLeaderId");
                    dispatch(setLeaderModalOpen(false));
                  } catch (error) {
                    console.error("❌ Error saving leader:", error);
                  } finally {
                    setLeaderSaving(false);
                    done?.();
                  }
                }}
              />
            </div>
          </DialogContent>
        </Dialog>


        {/* ✅ Choose Leader Modal */}
        <LibrarySelectModal
          open={chooseModalOpen}
          onClose={() => {
            dispatch(setChooseModalOpen(false));
          }}
          category='trip-leaders'
          onSelect={(item) => {
            const image =
              item.image ||
              item.imageUrl ||
              item.profileImageUrl ||
              "";

            dispatch(
              setLeaders([
                ...leaders.filter(l => String(l.id) !== String(item.id)), // 🔥 remove duplicate if exists
                {
                  id: String(item.id),
                  name: item.name || item.title || "",
                  title: item.title || item.name || "",
                  tagline: item.tagline || "",
                  description: item.description || "",
                  imageUrl: image,
                },
              ])
            );

            dispatch(setSelectedGroupLeaderId(String(item.id)));
            clearError("groupLeaderId");
            dispatch(setChooseModalOpen(false));

          }}

        />
      </div>
    </div >
  );
}
