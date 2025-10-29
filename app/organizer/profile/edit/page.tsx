'use client';

import { AppHeader } from '@/components/app-header';
import { OrganizerSidebar } from '@/components/organizer/organizer-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  useLazyGetOrganizerProfileQuery,
  useUpdateOrganizerProfileMutation,
} from '@/lib/services/organizer';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthState } from '@/lib/slices/auth';
import { Trash2, X } from 'lucide-react';
import {
  Document,
  EMPTY_DOCUMENT,
  useDocumentsManager,
} from '@/hooks/useDocumentsManager';
import {
  organizerState,
  setBannerFile,
  setLogoFile,
  setProfile,
  setTestimonialScreenshotFile,
} from '../../-organizer-slice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrganizerProfileEditPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const state = useSelector(organizerState);

  const { logoFile, bannerFile, testimonialScreenshotFile, profile } = state;
  // Keep actual File objects in local component state (Files are non-serializable)
  const [logoUploadFile, setLogoUploadFile] = useState<File | null>(null);
  const [bannerUploadFile, setBannerUploadFile] = useState<File | null>(null);
  const [testimonialUploadFile, setTestimonialUploadFile] =
    useState<File | null>(null);
  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;

  const [updatedOrgProfile, { isLoading }] =
    useUpdateOrganizerProfileMutation();

  const {
    documents: certificationsDocuments,
    error: certificationsError,
    handleAddFiles: handleCertificationsAddFiles,
    handleMarkForDeletion: handleCertificationsMarkForDeletion,
    setDocuments: setCertificationsDocuments,
  } = useDocumentsManager();

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

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();

      // 🧱 1️⃣ Append simple string fields dynamically
      const textFields: Record<string, any> = {
        organizerName: profile.organizerName,
        tagline: profile.tagline,
        description: profile.description,
        websiteUrl: profile.websiteUrl,
        instagramHandle: profile.instagramHandle,
        youtubeChannel: profile.youtubeChannel,
        googleBusiness: profile.googleBusiness,
        testimonials: profile.testimonials,
      };

      Object.entries(textFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
      });

      // 🖼️ 2️⃣ Helper to append file-related data
      const appendFileData = (
        keyPrefix: string,

        uploadFile?: File | null,
      ) => {
        // Append actual file
        if (uploadFile) formData.append(`${keyPrefix}.file`, uploadFile);
      };

      // 🧩 3️⃣ Append file-related data using helper
      appendFileData('displayPicture', logoUploadFile);
      appendFileData('bannerImage', bannerUploadFile);
      appendFileData('testimonialScreenshot', testimonialUploadFile);

      // 📜 4️⃣ Append certifications
      certificationsDocuments.forEach((doc, index) => {
        if (!doc) return;

        const baseKey = `certifications[${index}]`;

        if (doc.file) formData.append(`${baseKey}.file`, doc.file);
        if (doc.id !== null) formData.append(`${baseKey}.id`, String(doc.id));
        if (typeof doc.markedForDeletion !== 'undefined')
          formData.append(
            `${baseKey}.markedForDeletion`,
            String(doc.markedForDeletion),
          );
        if (doc.type) formData.append(`${baseKey}.type`, doc.type);
      });

      // 🚀 5️⃣ API call
      const response = await updatedOrgProfile({
        organizationId,
        data: formData,
      }).unwrap();

      console.log('Profile updated successfully:', response);
      if (response) router.back();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleCertificationsAddFiles(e.target.files);
  };

  if (profileLoading)
    return (
      <div className='flex items-center justify-center min-h-screen bg-white'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid'></div>
      </div>
    );
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
              {logoFile.url && (
                <img
                  src={logoFile.url}
                  alt='Logo'
                  className='w-20 h-20 rounded-full border object-cover'
                />
              )}
              <div>
                <div className='flex items-center gap-2'>
                  <div className='relative inline-block'>
                    <Button variant='outline'>Upload New Image</Button>
                    <input
                      id='logo-upload'
                      type='file'
                      accept='image/*'
                      className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && validateImageFile(file)) {
                          // store raw File locally, and only store metadata in Redux
                          setLogoUploadFile(file);
                          dispatch(
                            setLogoFile({
                              ...logoFile,
                              type: file.type,
                              url: URL.createObjectURL(file),
                              file: null,
                              markedForDeletion: true,
                            } as Document),
                          );
                        }
                      }}
                    />
                  </div>
                  {logoFile.url && (
                    <Button
                      variant='outline'
                      className='hover:text-red-500'
                      onClick={() => {
                        dispatch(
                          setLogoFile({
                            ...logoFile,
                            markedForDeletion: true,
                            url: '',
                            file: null,
                          }),
                        );
                      }}
                    >
                      <Trash2 />
                    </Button>
                  )}
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
                value={profile?.organizerName}
                onChange={(e) => {
                  dispatch(
                    setProfile({
                      ...profile,
                      organizerName: e.target.value,
                    }),
                  );
                }}
                placeholder='Enter here'
              />
            </div>

            {/* Banner Upload */}
            <div>
              <label className='block text-sm mb-1'>Cover Image / Banner</label>
              <div className='border border-dashed rounded-lg p-6 text-center'>
                {bannerFile.url && (
                  <img
                    src={bannerFile.url}
                    alt='Banner'
                    className='w-full h-40 object-cover rounded-lg mb-4'
                  />
                )}
                <>
                  <div className='flex items-center gap-2 text-center justify-center'>
                    <div className='relative inline-block'>
                      <Button variant='outline'>Upload Banner Image</Button>{' '}
                      <input
                        id='banner-upload'
                        type='file'
                        accept='image/*'
                        className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && validateImageFile(file)) {
                            setBannerUploadFile(file);
                            dispatch(
                              setBannerFile({
                                ...bannerFile,
                                type: file.type,
                                url: URL.createObjectURL(file),
                                file: null,
                                markedForDeletion: true,
                              } as Document),
                            );
                          }
                        }}
                      />
                    </div>
                    {bannerFile.url && (
                      <Button
                        variant='outline'
                        className='hover:text-red-500'
                        onClick={() => {
                          dispatch(
                            setBannerFile({
                              ...bannerFile,
                              markedForDeletion: true,
                              url: '',
                              file: null,
                            }),
                          );
                        }}
                      >
                        <Trash2 />
                      </Button>
                    )}
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
                value={profile?.tagline}
                onChange={(e) =>
                  dispatch(setProfile({ ...profile, tagline: e.target.value }))
                }
                placeholder='Enter here'
              />
            </div>

            <div>
              <label className='block text-sm mb-1'>Description</label>
              <Textarea
                value={profile?.description}
                onChange={(e) =>
                  dispatch(
                    setProfile({ ...profile, description: e.target.value }),
                  )
                }
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
                  value={profile?.websiteUrl}
                  onChange={(e) =>
                    dispatch(
                      setProfile({ ...profile, websiteUrl: e.target.value }),
                    )
                  }
                  placeholder='https://'
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>Instagram Handle</label>
                <Input
                  value={profile?.instagramHandle}
                  onChange={(e) =>
                    dispatch(
                      setProfile({
                        ...profile,
                        instagramHandle: e.target.value,
                      }),
                    )
                  }
                  placeholder='@handle'
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>YouTube Channel</label>
                <Input
                  value={profile?.youtubeChannel}
                  onChange={(e) =>
                    dispatch(
                      setProfile({
                        ...profile,
                        youtubeChannel: e.target.value,
                      }),
                    )
                  }
                  placeholder='youtube.com/channel'
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>Google Business</label>
                <Input
                  value={profile.googleBusiness}
                  onChange={(e) =>
                    dispatch(
                      setProfile({
                        ...profile,
                        googleBusiness: e.target.value,
                      }),
                    )
                  }
                  placeholder='Business link'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm mb-1'>Testimonials</label>
              <Textarea
                value={profile?.testimonials}
                onChange={(e) =>
                  dispatch(
                    setProfile({ ...profile, testimonials: e.target.value }),
                  )
                }
                rows={2}
                placeholder='Optional'
              />
            </div>

            <div className='border border-dashed rounded-lg p-6 text-center'>
              {testimonialScreenshotFile?.url && (
                <img
                  src={testimonialScreenshotFile.url}
                  alt='Banner'
                  className='w-full h-40 object-cover rounded-lg mb-4'
                />
              )}
              <div className='flex items-center gap-2 text-center justify-center'>
                <div className='relative inline-block'>
                  <Button variant='outline'>Upload Screenshot</Button>
                  <input
                    id='testimonial-upload'
                    type='file'
                    accept='image/*'
                    className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && validateImageFile(file)) {
                        setTestimonialUploadFile(file);
                        dispatch(
                          setTestimonialScreenshotFile({
                            ...testimonialScreenshotFile,
                            type: file.type,
                            url: URL.createObjectURL(file),
                            file: null,
                            markedForDeletion: true,
                          } as Document),
                        );
                      }
                    }}
                  />
                </div>
                {testimonialScreenshotFile?.url && (
                  <Button
                    variant='outline'
                    className='hover:text-red-500'
                    onClick={() =>
                      dispatch(
                        setTestimonialScreenshotFile({
                          ...testimonialScreenshotFile,
                          markedForDeletion: true,
                          url: '',
                          file: null,
                        }),
                      )
                    }
                  >
                    <Trash2 />
                  </Button>
                )}
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              {/* {testimonialScreenshotFile && (
                <p className='text-sm text-gray-700 mt-2'>
                  Uploaded: <strong>{testimonialScreenshotFile.name}</strong>
                </p>
              )} */}
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
                  onChange={onFileChange}
                  multiple
                  accept='image/*'
                  className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                />
              </div>
              {certificationsError && (
                <p style={{ color: 'red' }}>{certificationsError}</p>
              )}
              <p className='text-xs text-gray-400 mt-1'>
                Accepted formats: PNG, JPG, WEBP (Max 2MB)
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {certificationsDocuments.map(
                (cert, idx) =>
                  cert.url && (
                    <div key={idx}>
                      {cert.url && (
                        <div className='hover:relative p-4'>
                          <img src={cert.url} alt='Failed.' width={80} />
                          <span
                            className='absolute top-0 right-0 cursor-pointer'
                            onClick={() =>
                              handleCertificationsMarkForDeletion(cert.id, idx)
                            }
                          >
                            <X className='w-4 h-4' />
                          </span>
                        </div>
                      )}
                    </div>
                  ),
              )}
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
