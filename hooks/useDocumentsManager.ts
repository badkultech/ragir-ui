import { useState } from 'react';

export interface Document {
  id: number | null;
  type: string | null;
  url: string | null;
  file: File | null;
  markedForDeletion: boolean;
}

interface UseDocumentsManagerReturn {
  documents: Document[];
  availableIndexes: number[];
  error: string | null;
  handleAddFiles: (files: FileList | File[]) => void;
  handleMarkForDeletion: (id: number | null, idx: number) => void;
  resetError: () => void;
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
}

export const EMPTY_DOCUMENT: Document = {
  id: null,
  type: null,
  url: null,
  file: null,
  markedForDeletion: false,
};

export function useDocumentsManager(
  initialDocuments: Document[] = [],
  maxAllowedDocs: number = 6,
): UseDocumentsManagerReturn {
  // Initialize array to fixed length (maxAllowedDocs)
  const initializeDocuments = (): Document[] => {
    const docs = [...initialDocuments];
    while (docs.length < maxAllowedDocs) docs.push({ ...EMPTY_DOCUMENT });
    return docs.slice(0, maxAllowedDocs);
  };

  const [documents, setDocuments] = useState<Document[]>(initializeDocuments);
  const [error, setError] = useState<string | null>(null);

  // A slot is "available" if it can accept a new file:
  // - truly empty (no id, no file) OR
  // - an existing server doc that is markedForDeletion (replacement path)
  const getAvailableIndexes = (docs: Document[]): number[] =>
    docs
      .map((doc, idx) =>
        (!doc.file && (!doc.id || doc.markedForDeletion)) ? idx : null,
      )
      .filter((v): v is number => v !== null);

  const [availableIndexes, setAvailableIndexes] = useState<number[]>(
    getAvailableIndexes(initializeDocuments()),
  );

  const resetError = () => setError(null);

  // Utility: revoke previous blob URL (if any)
  const revokeIfBlob = (url?: string | null) => {
    if (url && url.startsWith('blob:')) {
      try { URL.revokeObjectURL(url); } catch {}
    }
  };

  // Mark a slot for deletion / or clear a new slot
  const handleMarkForDeletion = (id: number | null, idx: number) => {
    setDocuments((prev) => {
      const updated = [...prev];
      const current = updated[idx];

      if (!current) return prev;

      // Revoke preview if present
      revokeIfBlob(current.url);

      if (current.id && current.id === id) {
        // Existing server doc: mark for deletion, clear local file/preview
        updated[idx] = {
          ...current,
          markedForDeletion: true,
          file: null,
          url: null,
        };
      } else {
        // New local doc: just clear the slot
        updated[idx] = { ...EMPTY_DOCUMENT };
      }

      setAvailableIndexes(getAvailableIndexes(updated));
      return updated;
    });
  };

  // Add files:
  // 1) First fill "replace" candidates (slots with id && markedForDeletion)
  // 2) Then fill truly empty slots (no id && no file)
  // Always keep total length at maxAllowedDocs
  const handleAddFiles = (files: FileList | File[]) => {
    resetError();
    const newFiles = Array.from(files);
    if (!newFiles.length) return;

    setDocuments((prevDocs) => {
      const updated = [...prevDocs];

      // Build lists of candidate indexes
      const replaceIndexes: number[] = [];
      const emptyIndexes: number[] = [];

      updated.forEach((doc, idx) => {
        const isReplaceCandidate = !!doc.id && doc.markedForDeletion && !doc.file;
        const isEmpty = !doc.id && !doc.file;
        if (isReplaceCandidate) replaceIndexes.push(idx);
        else if (isEmpty) emptyIndexes.push(idx);
      });

      // Total capacity we can accept now
      const capacity = replaceIndexes.length + emptyIndexes.length;
      if (newFiles.length > capacity) {
        setError(`No available space for new documents (max ${maxAllowedDocs}).`);
        return prevDocs;
      }

      const assignFileToIndex = (file: File, idx: number, isReplace: boolean) => {
        const prev = updated[idx];

        // Revoke any existing blob url on this slot
        revokeIfBlob(prev?.url);

        const blobUrl = URL.createObjectURL(file);
        if (isReplace) {
          // Proper REPLACE: keep id, keep markedForDeletion: true, attach new file
          updated[idx] = {
            ...prev,
            type: file.type,
            url: blobUrl,
            file,
            markedForDeletion: true, // <- important per backend contract
          };
        } else {
          // New item in an empty slot
          updated[idx] = {
            ...EMPTY_DOCUMENT,
            type: file.type,
            url: blobUrl,
            file,
            markedForDeletion: false,
          };
        }
      };

      let filePtr = 0;

      // 1) Fill replacements first
      for (const idx of replaceIndexes) {
        const f = newFiles[filePtr++];
        if (!f) break;
        assignFileToIndex(f, idx, true);
      }

      // 2) Fill truly empty slots
      for (const idx of emptyIndexes) {
        const f = newFiles[filePtr++];
        if (!f) break;
        assignFileToIndex(f, idx, false);
      }

      setAvailableIndexes(getAvailableIndexes(updated));
      return updated;
    });
  };

  return {
    documents,
    availableIndexes,
    error,
    handleAddFiles,
    handleMarkForDeletion,
    resetError,
    setDocuments,
  };
}
