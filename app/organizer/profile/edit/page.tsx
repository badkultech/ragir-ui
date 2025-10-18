'use client';

import { useEffect, useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { OrganizerSidebar } from '@/components/organizer/organizer-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  useLazyGetOrganizerProfileQuery,
  useUpdateOrganizerProfileMutation,
} from '@/lib/services/organizer';
import { useSelector } from 'react-redux';
import { selectAuthState } from '@/lib/slices/auth';

export default function OrganizerProfileEditPage() {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [testimonialScreenshotFile, setTestimonialScreenshotFile] =
    useState<File | null>(null);
  const [certifications, setCertifications] = useState<File[]>([]);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const [organizerName, setOrganizerName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [youtubeChannel, setYoutubeChannel] = useState('');
  const [googleBusiness, setGoogleBusiness] = useState('');
  const [testimonials, setTestimonials] = useState('');

  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;
  const [updatedOrgProfile, { isLoading }] =
    useUpdateOrganizerProfileMutation();
  const [getOrgProfile, { isLoading: profileLoading }] =
    useLazyGetOrganizerProfileQuery();

  useEffect(() => {
    if (organizationId) {
      getOrgProfile({ organizationId }).then((res) => {
        console.log('Fetched profile:', res);
        if (res.data) {
          const data = res.data as any;
          setOrganizerName(data.organizerName || '');
          setTagline(data.tagline || '');
          setDescription(data.description || '');
          setWebsiteUrl(data.websiteUrl || '');
          setInstagramHandle(data.instagramHandle || '');
          setYoutubeChannel(data.youtubeChannel || '');
          setGoogleBusiness(data.googleBusiness || '');
          setTestimonials(data.testimonials || '');
          setLogoPreview(data.displayPicture?.url || null);
          setBannerPreview(data.bannerImage?.url || null);
          setTestimonialScreenshotFile(
            data.testimonialScreenshot?.file || null,
          );
          if (data.certifications) {
            const certFiles = data.certifications
              .filter((cert: any) => cert.file)
              .map((cert: any) => {
                // Create a dummy File object for display purposes
                return new File([], cert.file);
              });
            setCertifications(certFiles);
          }
        }
      });
    }
  }, [organizationId]);

  // Placeholder error function
  const showApiError = (msg: string) => alert(msg);

  const validateImageFile = (file: File): boolean => {
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) {
      showApiError('Please choose a PNG, JPG, or WEBP image');
      return false;
    }
    if (file.size > 2 * 1024 * 1024) {
      showApiError('Max file size is 2MB');
      return false;
    }
    return true;
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File) => void,
    previewSetter?: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file && validateImageFile(file)) {
      setter(file);
      if (previewSetter) previewSetter(URL.createObjectURL(file));
    }
  };

  const handleCertificationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(validateImageFile);
    setCertifications((prev) => [...prev, ...validFiles]);
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();

      formData.append('organizerName', organizerName);
      formData.append('tagline', tagline);
      formData.append('description', description);
      formData.append('websiteUrl', websiteUrl);
      formData.append('instagramHandle', instagramHandle);
      formData.append('youtubeChannel', youtubeChannel);
      formData.append('googleBusiness', googleBusiness);
      formData.append('testimonials', testimonials);

      if (logoFile) {
        formData.append('displayPicture.file', logoFile);
      }
      if (bannerFile) {
        formData.append('bannerImage.file', bannerFile);
      }
      if (testimonialScreenshotFile) {
        formData.append(
          'testimonialScreenshot.file',
          testimonialScreenshotFile,
        );
      }

      certifications.forEach((file, index) => {
        formData.append(`certifications[${index}].file`, file);
      });
      const response = await updatedOrgProfile({
        organizationId: organizationId,
        data: formData,
      });
      console.log('Profile updated successfully:', response);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <OrganizerSidebar
        isOpen={false}
        onClose={function (): void {
          throw new Error('Function not implemented.');
        }}
      />

      <div className='flex-1 flex flex-col'>
        <AppHeader title='Organizer Profile' />

        <main className='flex-1 p-6 md:p-8 space-y-8'>
          {/* ================= Basic Details ================= */}
          <section className='bg-white rounded-xl border p-6 space-y-6'>
            <h2 className='text-lg font-medium'>Basic Details</h2>

            {/* Logo Upload */}
            <div className='flex items-center space-x-6'>
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt='Logo'
                  className='w-20 h-20 rounded-full border object-cover'
                />
              )}
              <div>
                <div className='relative inline-block'>
                  <Button variant='outline'>Upload New Image</Button>
                  <input
                    id='logo-upload'
                    type='file'
                    accept='image/*'
                    className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                    onChange={(e) =>
                      handleFileChange(e, setLogoFile, setLogoPreview)
                    }
                  />
                </div>
                <p className='text-xs text-gray-400 mt-1'>
                  PNG, JPG, or WEBP up to 2MB
                </p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className='block text-sm mb-1'>Organizer Name</label>
              <Input
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
                placeholder='Enter here'
              />
            </div>

            {/* Banner Upload */}
            <div>
              <label className='block text-sm mb-1'>Cover Image / Banner</label>
              <div className='border border-dashed rounded-lg p-6 text-center'>
                {bannerPreview && (
                  <img
                    src={bannerPreview}
                    alt='Banner'
                    className='w-full h-40 object-cover rounded-lg mb-4'
                  />
                )}
                <>
                  <div className='relative inline-block'>
                    <Button variant='outline'>Upload Banner Image</Button>
                    <input
                      id='banner-upload'
                      type='file'
                      accept='image/*'
                      className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                      onChange={(e) =>
                        handleFileChange(e, setBannerFile, setBannerPreview)
                      }
                    />
                  </div>
                  <p className='text-xs text-gray-400 mt-1'>
                    1920px x 480px recommended
                  </p>
                </>
              </div>
            </div>
          </section>

          {/* ================= About the Organizer ================= */}
          <section className='bg-white rounded-xl border p-6 space-y-6'>
            <h2 className='text-lg font-medium'>About the Organizer</h2>

            <div>
              <label className='block text-sm mb-1'>Tagline</label>
              <Input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder='Enter here'
              />
            </div>

            <div>
              <label className='block text-sm mb-1'>Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder='Enter here'
              />
            </div>
          </section>

          {/* ================= Social Profiles ================= */}
          <section className='bg-white rounded-xl border p-6 space-y-6'>
            <h2 className='text-lg font-medium'>Social Profiles</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm mb-1'>Website URL</label>
                <Input
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder='https://'
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>Instagram Handle</label>
                <Input
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  placeholder='@handle'
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>YouTube Channel</label>
                <Input
                  value={youtubeChannel}
                  onChange={(e) => setYoutubeChannel(e.target.value)}
                  placeholder='youtube.com/channel'
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>Google Business</label>
                <Input
                  value={googleBusiness}
                  onChange={(e) => setGoogleBusiness(e.target.value)}
                  placeholder='Business link'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm mb-1'>Testimonials</label>
              <Textarea
                value={testimonials}
                onChange={(e) => setTestimonials(e.target.value)}
                rows={2}
                placeholder='Optional'
              />
            </div>

            <div className='border border-dashed rounded-lg p-6 text-center'>
              <div className='relative inline-block'>
                <Button variant='outline'>Upload Screenshot</Button>
                <input
                  id='testimonial-upload'
                  type='file'
                  accept='image/*'
                  className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                  onChange={(e) =>
                    handleFileChange(e, setTestimonialScreenshotFile)
                  }
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              {testimonialScreenshotFile && (
                <p className='text-sm text-gray-700 mt-2'>
                  Uploaded: <strong>{testimonialScreenshotFile.name}</strong>
                </p>
              )}
            </div>
          </section>

          {/* ================= Trust & Verification ================= */}
          <section className='bg-white rounded-xl border p-6 space-y-6'>
            <h2 className='text-lg font-medium'>Trust & Verification</h2>

            <div className='border border-dashed rounded-lg p-6 text-center'>
              <div className='relative inline-block'>
                <Button variant='outline'>Upload Certification</Button>
                <input
                  type='file'
                  onChange={handleCertificationChange}
                  multiple
                  accept='image/*'
                  className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                />
              </div>
              <p className='text-xs text-gray-400 mt-1'>
                Accepted formats: PNG, JPG, WEBP (Max 2MB)
              </p>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              {certifications.map((file, i) => (
                <div
                  key={i}
                  className='p-4 border rounded-lg text-center text-sm'
                >
                  {file.name}
                </div>
              ))}
            </div>
          </section>

          <div className='flex justify-end space-x-4'>
            <Button variant='outline'>Save as Draft</Button>
            <Button
              onClick={handleSaveProfile}
              className='bg-gradient-to-r from-orange-500 to-pink-500 text-white'
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
