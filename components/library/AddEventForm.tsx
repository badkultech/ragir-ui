'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { LibrarySelectModal } from '@/components/library/LibrarySelectModal';
import { update } from 'lodash';
import { useLazyGetOrganizerDayDescriptionByIdQuery } from '@/lib/services/organizer/trip/library/day-description';
import { useSelector } from 'react-redux';
import { selectAuthState } from '@/lib/slices/auth';
import {
  DayDescriptionByIdResponse,
  Document,
} from '@/lib/services/organizer/trip/library/day-description/types';
import RichTextEditor from '../editor/RichTextEditor';
import { ChooseFromLibraryButton } from './ChooseFromLibraryButton';

type AddEventFormProps = {
  mode?: 'library' | 'trip';
  updateId?: number | null;
  onCancel: () => void;
  onSave: (data: any, replace?: boolean) => void;
};

export function AddEventForm({
  mode = 'library',
  onCancel,
  updateId,
  onSave,
}: AddEventFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [packing, setPacking] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [documents, setDocuments] = useState<Array<Document>>([]);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);

  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments([
        ...documents,
        ...Array.from(e.target.files).map((file) => ({
          name: file.name,
          url: URL.createObjectURL(file),
          file: file,
          markedForDeletion: false,
        })),
      ]);
    }
  };
  const [getDayDescription] = useLazyGetOrganizerDayDescriptionByIdQuery();
  console.log('imagesPreview', documents);
  useEffect(() => {
    if (updateId) {
      getDayDescription({ organizationId, dayDescriptionId: updateId })
        .then((res) => {
          // RTK Query lazy trigger returns a union; narrow before using
          if ('data' in res && res.data) {
            const data = res.data as any;
            setTitle(data.name);
            setDescription(data.description);
            setLocation(data.location);
            setTime(data.time);
            setPacking(data.packingSuggestion);
            setDocuments(data.documents || []);
          } else {
            console.warn('Failed to load response', res);
          }
        })
        .catch((error) => {
          console.warn('Error to load dayDescription', error);
        });
    }
  }, [updateId]);

  const handleLibrarySelect = (item: any) => {
    setTitle(item.title || '');
    setLocation(item.location || '');
    setDescription(item.description || '');
  };

  const handleSubmit = (replace = false) => {
    onSave(
      { title, description, location, time, packing, documents, mode },
      replace,
    );
  };

  const isTripMode = mode === "trip";

  return (
    <div className='flex flex-col gap-6' style={{ fontFamily: "var(--font-poppins)" }}>
      {isTripMode ? (
        <ChooseFromLibraryButton onClick={() => setLibraryOpen(true)} />
      ) : (
        <div className="mt-2" /> // ✅ Keeps consistent spacing when no button
      )}

      {/* Title */}
      <div>
        <label
          className="block text-[0.95rem] font-medium mb-1"
        >
          Title *
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Enter title'
          maxLength={70}
        />
        <p className='text-xs text-right text-gray-400 mt-1'>
          {title.length}/70 Characters
        </p>
      </div>

      {/* Description */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Description *
        </label>
        {/* <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Enter here'
          rows={5}
          maxLength={800}
        /> */}
        <RichTextEditor
          value={description}
          onChange={setDescription}
          maxLength={800}
        />
        <p className='text-xs text-right text-gray-400 mt-1'>
          {description.length}/800 Words
        </p>
      </div>

      {/* Location + Time */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Location *
          </label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder='Location'
          />
        </div>

      </div>
      <div>
        <label className="block text-[0.95rem] font-[] font-medium mb-1">
          Time
        </label>
        <Input
          type='time'
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      {/* Packing Suggestions */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Packing Suggestions
        </label>
        {/* <Textarea
          value={packing}
          onChange={(e) => setPacking(e.target.value)}
          placeholder='Enter here'
          rows={5}
          maxLength={800}
        /> */}
        <RichTextEditor
          value={packing}
          onChange={setPacking}
          placeholder="Enter here"
          maxLength={800}
        />
        <p className='text-xs text-right text-gray-400 mt-1'>
          {packing.length}/800 Words
        </p>
      </div>

      {/* Image Upload */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Images (Max 6)
        </label>
        <label className='flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-orange-400 transition'>
          <Upload className='w-6 h-6 text-gray-400 mb-2' />
          <span className='text-sm text-gray-600'>Upload Images</span>
          <span className='text-xs text-gray-400'>PNG, JPG up to 10MB</span>
          <input
            type='file'
            accept='image/png,image/jpeg'
            multiple
            className='hidden'
            onChange={handleFileChange}
          />
        </label>
        {documents && documents.length > 0 && (
          <div className='flex gap-2 flex-wrap mt-2'>
            {documents
              .filter((document) => !document.markedForDeletion)
              .map((document, i) => (
                <div
                  key={i}
                  className='relative w-16 h-16 rounded overflow-hidden'
                >
                  <span
                    key={i}
                    className='absolute text-gray-500 top-0 right-0 cursor-pointer hover:text-white'
                    onClick={() => {
                      if (!document.file) {
                        setDocuments(
                          documents.map((document, index) => ({
                            ...document,
                            markedForDeletion: true,
                          })),
                        );
                      } else {
                        setDocuments(
                          documents.filter((_, index) => index !== i),
                        );
                      }
                    }}
                  >
                    <X className='w-4 h-4' />
                  </span>
                  <img
                    src={document.url}
                    alt='preview'
                    className='object-cover w-full h-full'
                  />
                </div>
              ))}
          </div>
        )}
      </div >

      {isTripMode && <div className="flex flex-col items-end gap-2">
        <div className="flex justify-end items-center gap-2">
          <Input type="checkbox" value="" className=" w-[22px]" />
          <label className="block text-[0.95rem] font-medium">
            Save in Library
          </label>
        </div>

        <Input type="text" value="" id="" placeholder="Save As" className="p-4 w-[12rem] right" />
      </div>}

      {/* Footer */}
      <div className='flex justify-end items-center gap-4 mt-6'>
        <Button variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => handleSubmit(false)}
          className='rounded-full px-6 bg-gradient-to-r from-orange-400 to-pink-500 text-white'
        >
          Save
        </Button>
      </div>

      {/* Library Modal */}
      <LibrarySelectModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={handleLibrarySelect}
        category='events'
      />
    </div>
  );
}
