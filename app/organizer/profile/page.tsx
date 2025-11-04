'use client';

import { AppHeader } from '@/components/app-header';
import { OrganizerSidebar } from '@/components/organizer/organizer-sidebar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  organizerState,
  setBannerFile,
  setCertificationsDocuments,
  setLogoFile,
  setProfile,
  setTestimonialScreenshotFile,
} from '../-organizer-slice';
import { useLazyGetOrganizerProfileQuery } from '@/lib/services/organizer';
import { selectAuthState } from '@/lib/slices/auth';
import { EMPTY_DOCUMENT } from '@/hooks/useDocumentsManager';

import {
  ImagePlaceHolder,
  InstagramIcon,
  YouTubeIcon,
} from '@/components/library/SvgComponents/GradientsOfMoods';

// fake profile toggle (replace with API data later)
const hasProfile = true;

export default function OrganizerProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const state = useSelector(organizerState);
  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;
  const dispatch = useDispatch();
  const { logoFile, bannerFile, testimonialScreenshotFile, profile } = state;

  const [getOrgProfile, { isLoading: profileLoading }] =
    useLazyGetOrganizerProfileQuery();

  useEffect(() => {
    if (organizationId) {
      getOrgProfile({ organizationId }).then((res) => {
        if (res.data) {
          const data = res.data as any;
          dispatch(
            setProfile({
              organizerName: data.organizerName || '',
              tagline: data.tagline || '',
              description: data.description || '',
              websiteUrl: data.websiteUrl || '',
              instagramHandle: data.instagramHandle || '',
              youtubeChannel: data.youtubeChannel || '',
              googleBusiness: data.googleBusiness || '',
              testimonials: data.testimonials || '',
            }),
          );
          dispatch(setLogoFile(data.displayPicture || EMPTY_DOCUMENT));
          dispatch(setBannerFile(data.bannerImage || EMPTY_DOCUMENT));
          dispatch(setTestimonialScreenshotFile(data.testimonialScreenshot));

          if (data.certifications) {
            setCertificationsDocuments(data.certifications);
          }
        }
      });
    }
  }, [organizationId]);
  if (profileLoading)
    return (
      <div className='flex items-center justify-center min-h-screen bg-white'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid'></div>
      </div>
    );
  return (
    <div className='flex min-h-screen bg-gray-50'>
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className='flex-1 flex flex-col'>
        <AppHeader title='Organizer Profile' />

        <main className='flex-1 p-10 md:p-10'>
          <div className='max-w-6xl mx-auto'>
            {/* Top row: page heading + buttons */}
            <div className='flex items-start justify-between mb-4'>
              <h1 className='text-3xl font-semibold'>Organizer Profile</h1>

              <div className='flex items-center space-x-3'>
                <Link href='/organizer/profile/edit'>
                  <Button className='rounded-full px-5 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white'>
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>

            {!hasProfile ? (
              // Empty state
              <div className='flex flex-col items-center justify-center h-72 text-center'>
                <h2 className='text-2xl font-semibold mb-2'>
                  Complete Your Profile
                </h2>
                <p className='text-gray-500 mb-6 max-w-md'>
                  Add your details to showcase your identity and manage your
                  events seamlessly.
                </p>

                <Link href='/organizer/profile/edit'>
                  <Button className='rounded-full px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white'>
                    Add Details +
                  </Button>
                </Link>
              </div>
            ) : (
              // Profile view
              <div className='space-y-6'>
                {/* Cover Image */}
                <div className='relative w-full h-56 rounded-xl overflow-hidden'>
                  {bannerFile.url ? (
                    <img
                      src={bannerFile.url ?? '/demo-cover.jpg'}
                      alt='Cover'
                      className='w-full h-full object-cover rounded-xl'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center bg-[#EFF1F3]'>
                      <ImagePlaceHolder width='240px' height='100%' />
                    </div>
                  )}
                </div>
                {/* Logo + Name + Socials (logo overlaps by negative margin) */}
                <div className='flex items-center -mt-12 px-2 '>
                  {logoFile.url ? (
                    <img
                      src={logoFile.url ?? '/demo-logo.png'}
                      alt='Logo'
                      className='w-28 h-28 rounded-full border-4 border-white shadow-md z-0'
                    />
                  ) : (
                    <ImagePlaceHolder
                      className='w-28 h-28 rounded-full border-4 border-white shadow-md z-0'
                      width='240px'
                      height='100px'
                    />
                  )}

                  <div className='ml-4'>
                    <p className='font-[Poppins] pt-8 font-medium text-2xl leading-[1.4] tracking-[0.005em]'>
                      {profile.organizerName}
                    </p>
                    <p className='font-[Poppins] pt-3 text[##757575] font-normal text-base leading-[1.4] tracking-[0.005em]'>
                      {profile.tagline}
                    </p>
                  </div>

                  <div className='ml-auto flex items-center space-x-4'>
                    <a href='#' target='_blank' rel='noreferrer'>
                      <YouTubeIcon />
                    </a>
                    <a
                      href='#'
                      aria-label='Follow us on Instagram'
                      className='hover:scale-110 transition-transform duration-200'
                    >
                      <InstagramIcon />
                    </a>
                  </div>
                </div>
                {/* Description */}
                <div className='mt-10 font-[Poppins] font-normal text-base leading-[1.4] tracking-[0.005em] rounded-lg bg-[#F7F7F7] p-6 text[#757575]  border border-[#E4E4E4]'>
                  {profile.description}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
