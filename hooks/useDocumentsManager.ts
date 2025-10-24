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
  // ✅ initialize with 6 documents (existing + empty)
  const initializeDocuments = (): Document[] => {
    const docs = [...initialDocuments];
    while (docs.length < maxAllowedDocs) {
      docs.push({ ...EMPTY_DOCUMENT });
    }
    return docs.slice(0, maxAllowedDocs);
  };

  const [documents, setDocuments] = useState<Document[]>(initializeDocuments);
  const [error, setError] = useState<string | null>(null);
  // ✅ compute available indexes dynamically
  const getAvailableIndexes = (docs: Document[]): number[] =>
    docs
      .map((doc, idx) =>
        !doc.file && (!doc.id || doc.markedForDeletion) ? idx : null,
      )
      .filter((v): v is number => v !== null);

  const [availableIndexes, setAvailableIndexes] = useState<number[]>(
    getAvailableIndexes(initializeDocuments()),
  );

  const resetError = () => setError(null);

  // ✅ Handle delete (mark + add to availableIndexes)
  const handleMarkForDeletion = (id: number | null, idx: number) => {
    const updated = documents.map((doc, index) => {
      if (index === idx) {
        if (doc.id && doc.id === id) {
          return {
            ...doc,
            markedForDeletion: true,
            file: null,
            url: null,
          };
        } else {
          return { ...EMPTY_DOCUMENT };
        }
      }
      return doc;
    });

    setDocuments(updated);
    setAvailableIndexes(getAvailableIndexes(updated));
  };

  // ✅ Handle Add — fills available indexes
  const handleAddFiles = (files: FileList | File[]) => {
    resetError();
    const newFiles = Array.from(files);
    setDocuments((prevDocs) => {
      const updated = [...prevDocs];
      const available = getAvailableIndexes(prevDocs);

      // ❌ No space
      if (newFiles.length > available.length) {
        setError(
          `No available space for new documents (max ${maxAllowedDocs}).`,
        );
        return prevDocs;
      }

      // ✅ Fill available indexes in order
      available.forEach((index, i) => {
        const file = newFiles[i];
        if (!file) return;
        updated[index] = {
          ...EMPTY_DOCUMENT,
          type: file.type,
          url: URL.createObjectURL(file),
          file,
          markedForDeletion: false,
        };
      });

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
