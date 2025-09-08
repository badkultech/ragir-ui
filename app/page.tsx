'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  MapPin,
  Users,
  Star,
  TrendingUp,
  Navigation,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { selectAuthState } from '@/lib/slices/auth';

const moods = [
  { id: 'mountains', label: 'Mountains', icon: '🏔️' },
  { id: 'beach', label: 'Beach', icon: '🏖️' },
  { id: 'forest', label: 'Forest and Wildlife', icon: '🌲' },
  { id: 'stargazing', label: 'Sky and Stargazing', icon: '⭐' },
  { id: 'heritage', label: 'Heritage and Culture', icon: '🏛️' },
  { id: 'camping', label: 'Camping', icon: '⛺' },
  { id: 'productivity', label: 'Productivity and Creativity', icon: '💡' },
  { id: 'women-only', label: 'Women Only', icon: '👩' },
  { id: 'spiritual', label: 'Spiritual and Wellness', icon: '🧘' },
  { id: 'party', label: 'Party and Music', icon: '🎵' },
  { id: 'trekking', label: 'Trekking', icon: '🥾' },
  { id: 'adventure', label: 'Adventure', icon: '🎯' },
  { id: 'motorsports', label: 'Motorsports', icon: '🏎️' },
  { id: 'weekender', label: 'Weekender', icon: '📅' },
  { id: 'solo-escape', label: 'Solo Escape', icon: '🎒' },
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const popularSearches = [
  'Trips under 10k in August',
  'Weekend treks from Bangalore',
  'Beach holidays for couples in Goa',
  'Ladakh adventure in September',
  'Kerala backwaters weekend',
];

const trendingDestinations = [
  'Manali',
  'Goa',
  'Ladakh',
  'Kerala',
  'Rajasthan',
  'Himachal Pradesh',
];

export default function LandingPage() {
  const [universalQuery, setUniversalQuery] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [destinationMonth, setDestinationMonth] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchMode, setSearchMode] = useState<'mood' | 'destination'>('mood');
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>('');
  const router = useRouter();
  const dispatch = useDispatch();

  const handleMoodToggle = (moodId: string) => {
    if (selectedMoods.includes(moodId)) {
      setSelectedMoods(selectedMoods.filter((id) => id !== moodId));
    } else if (selectedMoods.length < 3) {
      setSelectedMoods([...selectedMoods, moodId]);
    }
  };

  const parseUniversalQuery = (query: string) => {
    const lowerQuery = query.toLowerCase().replace(/\s+/g, ' ').trim();
    const params: any = {};
    const detectedTokens: string[] = [];

    // --- Activity / Mood Keywords ---
    const activityMap: Record<string, string[]> = {
      trekking: ['trek', 'trekking', 'hiking', 'mountain climbing', 'trekker'],
      beach: ['beach', 'coastal', 'seaside', 'ocean', 'shore'],
      adventure: ['adventure', 'thrill', 'extreme', 'adrenaline'],
      heritage: [
        'heritage',
        'historical',
        'culture',
        'monument',
        'palace',
        'fort',
        'ancient',
      ],
      spiritual: [
        'spiritual',
        'temple',
        'pilgrimage',
        'meditation',
        'yoga',
        'ashram',
      ],
      camping: ['camping', 'camp', 'outdoor', 'wilderness'],
      weekender: ['weekend', 'short trip', '2 days', '3 days', 'overnight'],
      party: ['party', 'nightlife', 'club', 'music', 'festival'],
      motorsports: [
        'bike',
        'biking',
        'motorcycle',
        'road trip',
        'drive',
        'driving',
      ],
      mountains: ['mountain', 'hill', 'peak', 'valley', 'himalaya', 'ghat'],
      forest: ['forest', 'jungle', 'wildlife', 'safari', 'nature'],
      luxury: ['luxury', '5-star', 'premium', 'resort stay'],
      budget: ['budget', 'cheap', 'affordable', 'low cost'],
      honeymoon: ['honeymoon', 'romantic getaway', 'just married'],
      photography: ['photography', 'photo tour', 'camera trip'],
      wellness: ['wellness', 'spa', 'detox', 'retreat'],
    };

    const detectedMoods = Object.entries(activityMap)
      .filter(([mood, keywords]) =>
        keywords.some((k) => lowerQuery.includes(k)),
      )
      .map(([mood]) => mood);

    if (detectedMoods.length) {
      params.moods = [...new Set(detectedMoods)].slice(0, 5).join(',');
      detectedTokens.push(...detectedMoods);
    }

    // --- Locations ---
    const locationKeywords = [
      'ladakh',
      'manali',
      'goa',
      'kerala',
      'rajasthan',
      'himachal',
      'kashmir',
      'uttarakhand',
      'sikkim',
      'meghalaya',
      'andaman',
      'lakshadweep',
      'mumbai',
      'delhi',
      'bangalore',
      'chennai',
      'kolkata',
      'pune',
      'hyderabad',
      'jaipur',
      'udaipur',
      'jodhpur',
      'rishikesh',
      'haridwar',
      'dharamshala',
      'shimla',
      'darjeeling',
      'gangtok',
      'shillong',
      'coorg',
      'ooty',
      'munnar',
      'alleppey',
      'hampi',
      'mysore',
      'agra',
      'varanasi',
      'pushkar',
      'mount abu',
      'nainital',
      'mussoorie',
      'dehradun',
      'spiti',
      'kinnaur',
      'zanskar',
      'leh',
    ];

    const detectedLocations = locationKeywords.filter((loc) =>
      lowerQuery.includes(loc),
    );
    if (detectedLocations.length) {
      params.destination = detectedLocations.join(',');
      detectedTokens.push(...detectedLocations);
    }

    // --- Departure City ---
    const fromMatch = lowerQuery.match(/from\s+([a-zA-Z\s]+)/);
    if (fromMatch) {
      params.departureCity = fromMatch[1].trim();
      detectedTokens.push(params.departureCity);
    }

    // --- Month & Year ---
    const monthMap: Record<string, string> = {
      jan: 'January',
      feb: 'February',
      mar: 'March',
      apr: 'April',
      may: 'May',
      jun: 'June',
      jul: 'July',
      aug: 'August',
      sep: 'September',
      sept: 'September',
      oct: 'October',
      nov: 'November',
      dec: 'December',
    };
    const monthRegex = new RegExp(
      `\\b(${Object.keys(monthMap).join('|')}|${Object.values(monthMap).join(
        '|',
      )})\\b`,
      'i',
    );
    const monthMatch = lowerQuery.match(monthRegex);
    if (monthMatch) {
      const m = monthMatch[1].toLowerCase();
      params.month =
        monthMap[m as keyof typeof monthMap] ||
        m.charAt(0).toUpperCase() + m.slice(1);
      detectedTokens.push(params.month);
    }

    // --- Budget (supports "10k", "10,000", "Rs 10k", "between 5k and 15k") ---
    const budgetRangeMatch = lowerQuery.match(
      /(?:between|from)\s*₹?\s*(\d+)[kK]?\s*(?:and|to)\s*₹?\s*(\d+)[kK]?/,
    );
    if (budgetRangeMatch) {
      let min = parseInt(budgetRangeMatch[1]);
      let max = parseInt(budgetRangeMatch[2]);
      if (max < 500) {
        min *= 1000;
        max *= 1000;
      }
      params.minBudget = min;
      params.maxBudget = max;
      detectedTokens.push(`₹${min} - ₹${max}`);
    } else {
      const budgetMatch = lowerQuery.match(
        /(?:under|below|less than|within|upto|up to)\s*₹?\s*(\d+)[kK]?/,
      );
      if (budgetMatch) {
        let budget = parseInt(budgetMatch[1]);
        if (budget < 500) budget *= 1000;
        params.maxBudget = budget;
        detectedTokens.push(`Under ₹${budget}`);
      }
    }

    // --- Duration ---
    if (/weekend|2 day|3 day|overnight/.test(lowerQuery)) {
      params.duration = '2-3 days';
    } else if (/week|7 day/.test(lowerQuery)) {
      params.duration = '5-7 days';
    } else if (/long|extended|10 day/.test(lowerQuery)) {
      params.duration = '7+ days';
    }

    // --- Group Type ---
    if (/solo|alone/.test(lowerQuery)) {
      params.groupType = 'solo-friendly';
    } else if (/couple|romantic|honeymoon/.test(lowerQuery)) {
      params.groupType = 'couples';
    } else if (/family|kids/.test(lowerQuery)) {
      params.groupType = 'family-friendly';
    }

    return { ...params, tokens: detectedTokens };
  };

  const handleUniversalSearch = () => {
    if (universalQuery.trim()) {
      const parsedParams = parseUniversalQuery(universalQuery);
      const params = new URLSearchParams({
        q: universalQuery,
        type: 'universal',
        ...parsedParams,
      });
      router.push(`/user/search?${params.toString()}`);
    }
  };

  const handleMoodSearch = () => {
    if (selectedMoods.length > 0) {
      const params = new URLSearchParams({
        moods: selectedMoods.join(','),
        month: selectedMonth,
        type: 'mood',
      });
      router.push(`/user/search?${params.toString()}`);
    }
  };

  const handleDestinationSearch = () => {
    if (destinationQuery.trim()) {
      const params = new URLSearchParams({
        destination: destinationQuery,
        month: destinationMonth,
        type: 'destination',
      });
      router.push(`/user/search?${params.toString()}`);
    }
  };

  const getBackgroundTheme = () => {
    if (selectedMoods.length === 0) return 'from-blue-600 to-purple-700';

    const moodThemes: Record<string, string> = {
      mountains: 'from-slate-600 to-gray-800',
      beach: 'from-cyan-400 to-blue-600',
      forest: 'from-green-600 to-emerald-800',
      stargazing: 'from-indigo-900 to-purple-900',
      heritage: 'from-amber-600 to-orange-700',
      camping: 'from-green-700 to-teal-800',
      productivity: 'from-violet-600 to-purple-700',
      'women-only': 'from-pink-500 to-rose-600',
      spiritual: 'from-purple-600 to-indigo-700',
      party: 'from-red-500 to-pink-600',
      trekking: 'from-stone-600 to-slate-700',
      adventure: 'from-orange-600 to-red-700',
      motorsports: 'from-gray-800 to-black',
      weekender: 'from-blue-500 to-indigo-600',
      'solo-escape': 'from-teal-600 to-cyan-700',
    };

    return moodThemes[selectedMoods[0]] || 'from-blue-600 to-purple-700';
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );

          if (response.ok) {
            const data = await response.json();
            const city =
              data.city ||
              data.locality ||
              data.principalSubdivision ||
              'Unknown Location';
            setCurrentLocation(city);
            setDestinationQuery(city);
          } else {
            setLocationError('Unable to get location details');
          }
        } catch (error) {
          setLocationError('Error getting location details');
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        setIsLoadingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied by user');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out');
            break;
          default:
            setLocationError('An unknown error occurred');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  };
  const { isTokenExpired, accessToken } = useSelector(selectAuthState);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
                <MapPin className='w-5 h-5 text-white' />
              </div>
              <span className='text-xl font-bold text-gray-900'>
                <Link
                  href='/user/landing'
                  className='text-gray-600 hover:text-gray-900'
                >
                  TravelPortal
                </Link>
              </span>
            </div>
            <div className='flex items-center space-x-4'>
              <nav>
                {!accessToken ? (
                  <Link
                    href='/login'
                    className='text-gray-600 hover:text-gray-900'
                  >
                    Login
                  </Link>
                ) : (
                  // <UserProfileDropdown />
                  <></>
                )}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className={`relative bg-gradient-to-br ${getBackgroundTheme()} transition-all duration-1000`}
      >
        <div className='absolute inset-0 bg-black/20'></div>
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl md:text-6xl font-bold text-white mb-6'>
              Find Groups and Solo Escapes
            </h1>
            <p className='text-xl md:text-2xl text-white/90 mb-8'>
              Based on your moods
            </p>
          </div>

          {/* Universal Search Bar */}
          <div className='max-w-4xl mx-auto mb-12'>
            <div className='relative'>
              <div className='flex items-center bg-white rounded-2xl shadow-2xl p-2'>
                <Search className='w-6 h-6 text-gray-400 ml-4' />
                <Input
                  type='text'
                  placeholder="Try 'trekking in Ladakh in September under ₹25k' or 'weekend trips from Bangalore'"
                  value={universalQuery}
                  onChange={(e) => setUniversalQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  className='flex-1 border-0 text-lg px-4 py-4 focus:ring-0 focus:outline-none'
                />
                <Button
                  onClick={getCurrentLocation}
                  disabled={isLoadingLocation}
                  variant='ghost'
                  className='px-3 py-2 text-gray-500 hover:text-gray-700'
                  title='Use current location'
                >
                  {isLoadingLocation ? (
                    <Loader2 className='w-5 h-5 animate-spin' />
                  ) : (
                    <Navigation className='w-5 h-5' />
                  )}
                </Button>
                <Button
                  onClick={handleUniversalSearch}
                  className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold'
                >
                  Search
                </Button>
              </div>

              {currentLocation && (
                <div className='absolute top-full left-0 right-0 mt-1'>
                  <Badge
                    variant='secondary'
                    className='bg-green-100 text-green-800 border-green-200'
                  >
                    <MapPin className='w-3 h-3 mr-1' />
                    Current location: {currentLocation}
                  </Badge>
                </div>
              )}

              {locationError && (
                <div className='absolute top-full left-0 right-0 mt-1'>
                  <Badge
                    variant='destructive'
                    className='bg-red-100 text-red-800 border-red-200'
                  >
                    {locationError}
                  </Badge>
                </div>
              )}

              {/* Search Suggestions */}
              {showSuggestions && (
                <div className='absolute top-full left-0 right-0 bg-white rounded-xl shadow-xl mt-2 p-4 z-10'>
                  {currentLocation && (
                    <div className='mb-4'>
                      <h4 className='text-sm font-semibold text-gray-700 mb-2'>
                        Your Location
                      </h4>
                      <Badge
                        variant='outline'
                        className='cursor-pointer hover:bg-blue-100 bg-blue-50 border-blue-200'
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setUniversalQuery(
                            `weekend trips from ${currentLocation}`,
                          );
                          setShowSuggestions(false);
                        }}
                      >
                        <MapPin className='w-3 h-3 mr-1' />
                        Weekend trips from {currentLocation}
                      </Badge>
                    </div>
                  )}

                  <div className='mb-4'>
                    <h4 className='text-sm font-semibold text-gray-700 mb-2'>
                      Smart Search Examples
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {[
                        'trekking in Ladakh in September under 25k',
                        'weekend trips from Bangalore',
                        'beach holidays in Goa for couples',
                        'heritage tours in Rajasthan under 15k',
                        'adventure sports in Rishikesh',
                        'solo trips to Kerala backwaters',
                        'bike trips to Spiti Valley in June',
                        'yoga retreats in Dharamshala',
                      ].map((example, index) => (
                        <Badge
                          key={index}
                          variant='secondary'
                          className='cursor-pointer hover:bg-blue-100 text-xs'
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setUniversalQuery(example);
                            setShowSuggestions(false);
                          }}
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className='mb-4'>
                    <h4 className='text-sm font-semibold text-gray-700 mb-2'>
                      Popular Searches
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {popularSearches.map((search, index) => (
                        <Badge
                          key={index}
                          variant='secondary'
                          className='cursor-pointer hover:bg-blue-100'
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setUniversalQuery(search);
                            setShowSuggestions(false);
                          }}
                        >
                          {search}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className='text-sm font-semibold text-gray-700 mb-2'>
                      Trending Destinations
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {trendingDestinations.map((destination, index) => (
                        <Badge
                          key={index}
                          variant='outline'
                          className='cursor-pointer hover:bg-gray-100'
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setUniversalQuery(destination);
                            setShowSuggestions(false);
                          }}
                        >
                          <TrendingUp className='w-3 h-3 mr-1' />
                          {destination}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Mode Toggle */}
          <div className='flex justify-center mb-8'>
            <div className='bg-white/20 backdrop-blur-sm rounded-xl p-1'>
              <Button
                variant={searchMode === 'mood' ? 'default' : 'ghost'}
                onClick={() => setSearchMode('mood')}
                className={`px-6 py-2 rounded-lg ${
                  searchMode === 'mood'
                    ? 'bg-white text-gray-900'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Mood-Based Search
              </Button>
              <Button
                variant={searchMode === 'destination' ? 'default' : 'ghost'}
                onClick={() => setSearchMode('destination')}
                className={`px-6 py-2 rounded-lg ${
                  searchMode === 'destination'
                    ? 'bg-white text-gray-900'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Destination Search
              </Button>
            </div>
          </div>

          {/* Mood-Based Search */}
          {searchMode === 'mood' && (
            <div className='max-w-6xl mx-auto'>
              <Card className='bg-white/95 backdrop-blur-sm shadow-2xl'>
                <CardContent className='p-8'>
                  <div className='mb-6'>
                    <label className='block text-sm font-semibold text-gray-700 mb-3'>
                      Select Month
                    </label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className='w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    >
                      <option value=''>Any Month</option>
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='mb-6'>
                    <label className='block text-sm font-semibold text-gray-700 mb-3'>
                      Choose Your Moods (Select up to 3)
                    </label>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3'>
                      {moods.map((mood) => (
                        <Button
                          key={mood.id}
                          variant={
                            selectedMoods.includes(mood.id)
                              ? 'default'
                              : 'outline'
                          }
                          onClick={() => handleMoodToggle(mood.id)}
                          disabled={
                            !selectedMoods.includes(mood.id) &&
                            selectedMoods.length >= 3
                          }
                          className={`p-4 h-auto flex flex-col items-center space-y-2 text-center transition-all ${
                            selectedMoods.includes(mood.id)
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                              : 'hover:bg-gray-50 hover:scale-105'
                          }`}
                        >
                          <span className='text-2xl'>{mood.icon}</span>
                          <span className='text-xs font-medium leading-tight'>
                            {mood.label}
                          </span>
                        </Button>
                      ))}
                    </div>
                    {selectedMoods.length > 0 && (
                      <div className='mt-4 flex flex-wrap gap-2'>
                        <span className='text-sm text-gray-600'>Selected:</span>
                        {selectedMoods.map((moodId) => {
                          const mood = moods.find((m) => m.id === moodId);
                          return (
                            <Badge
                              key={moodId}
                              variant='secondary'
                              className='bg-blue-100 text-blue-800'
                            >
                              {mood?.icon} {mood?.label}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleMoodSearch}
                    disabled={selectedMoods.length === 0}
                    className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-xl'
                  >
                    Find Trips Based on Mood
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Destination-Based Search */}
          {searchMode === 'destination' && (
            <div className='max-w-4xl mx-auto'>
              <Card className='bg-white/95 backdrop-blur-sm shadow-2xl'>
                <CardContent className='p-8'>
                  <div className='grid md:grid-cols-2 gap-6 mb-6'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-3'>
                        Select Month
                      </label>
                      <select
                        value={destinationMonth}
                        onChange={(e) => setDestinationMonth(e.target.value)}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      >
                        <option value=''>Any Month</option>
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-3'>
                        Destination
                      </label>
                      <div className='relative'>
                        <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                        <Input
                          type='text'
                          placeholder='Enter city, state, or country'
                          value={destinationQuery}
                          onChange={(e) => setDestinationQuery(e.target.value)}
                          className='pl-10 pr-12 py-3 text-lg'
                        />
                        <Button
                          onClick={getCurrentLocation}
                          disabled={isLoadingLocation}
                          variant='ghost'
                          className='absolute right-1 top-1/2 transform -translate-y-1/2 px-2 py-1 text-gray-500 hover:text-gray-700'
                          title='Use current location'
                        >
                          {isLoadingLocation ? (
                            <Loader2 className='w-4 h-4 animate-spin' />
                          ) : (
                            <Navigation className='w-4 h-4' />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {currentLocation && (
                    <div className='mb-4'>
                      <Badge
                        variant='secondary'
                        className='bg-green-100 text-green-800 border-green-200'
                      >
                        <MapPin className='w-3 h-3 mr-1' />
                        Using current location: {currentLocation}
                      </Badge>
                    </div>
                  )}

                  {locationError && (
                    <div className='mb-4'>
                      <Badge
                        variant='destructive'
                        className='bg-red-100 text-red-800 border-red-200'
                      >
                        {locationError}
                      </Badge>
                    </div>
                  )}

                  <Button
                    onClick={handleDestinationSearch}
                    disabled={!destinationQuery.trim()}
                    className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-xl'
                  >
                    Search Destination
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              Why Choose TravelPortal?
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              Discover amazing group travel experiences with smart search,
              verified organizers, and seamless booking.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <Card className='text-center p-8 hover:shadow-lg transition-shadow'>
              <div className='w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <Search className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                Smart Search
              </h3>
              <p className='text-gray-600'>
                Find trips using natural language queries or mood-based filters.
                Our AI understands what you're looking for.
              </p>
            </Card>

            <Card className='text-center p-8 hover:shadow-lg transition-shadow'>
              <div className='w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <Users className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                Verified Groups
              </h3>
              <p className='text-gray-600'>
                Join trips organized by verified travel organizers with ratings
                and reviews from real travelers.
              </p>
            </Card>

            <Card className='text-center p-8 hover:shadow-lg transition-shadow'>
              <div className='w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <Star className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                Best Experiences
              </h3>
              <p className='text-gray-600'>
                Curated trips with detailed itineraries, transparent pricing,
                and 24/7 support for peace of mind.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-4 gap-8'>
            <div>
              <div className='flex items-center space-x-3 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
                  <MapPin className='w-5 h-5 text-white' />
                </div>
                <span className='text-xl font-bold'>TravelPortal</span>
              </div>
              <p className='text-gray-400'>
                Discover amazing group travel experiences and solo escapes based
                on your mood and preferences.
              </p>
            </div>

            <div>
              <h4 className='font-semibold mb-4'>For Travelers</h4>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Browse Trips
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Safety Guidelines
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='font-semibold mb-4'>For Organizers</h4>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <Link href='/organizer' className='hover:text-white'>
                    Create Trips
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Organizer Guidelines
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='font-semibold mb-4'>Support</h4>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Terms & Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
            <p>&copy; 2025 TravelPortal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
