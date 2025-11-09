// hooks/useDocumentsManager.ts
"use client";

import { useState } from "react";

export interface Document {
  id: number | null;
  type: string | null;
  url: string | null;
  file: File | null;
  markedForDeletion: boolean;
}

export const EMPTY_DOCUMENT: Document = {
  id: null,
  type: null,
  url: null,
  file: null,
  markedForDeletion: false,
};

export type UseDocumentsManagerReturn = {
  documents: Document[];
  availableIndexes: number[];
  error: string | null;
  handleAddFiles: (files: FileList | File[]) => void;
  handleReplaceFileAtIndex: (file: File, idx: number) => void;
  handleRemoveAtIndex: (idx: number) => void;
  handleUnmarkDeletion: (idx: number) => void;
  handleMarkForDeletion: (id: number | null, idx: number) => void;
  resetError: () => void;
  resetDocuments: (initialDocuments?: Document[]) => void;
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
};

export function useDocumentsManager(
  initialDocuments: Document[] = [],
  maxAllowedDocs: number = 6,
): UseDocumentsManagerReturn {
  const initializeDocuments = (seed: Document[] = initialDocuments): Document[] => {
    const docs = [...seed];
    while (docs.length < maxAllowedDocs) docs.push({ ...EMPTY_DOCUMENT });
    return docs.slice(0, maxAllowedDocs);
  };

  const [documents, setDocuments] = useState<Document[]>(() => initializeDocuments());
  const [error, setError] = useState<string | null>(null);

  const getAvailableIndexes = (docs: Document[]): number[] =>
    docs
      .map((doc, idx) =>
        !doc.file && (!doc.id || doc.markedForDeletion) ? idx : null,
      )
      .filter((v): v is number => v !== null);

  const [availableIndexes, setAvailableIndexes] = useState<number[]>(
    () => getAvailableIndexes(initializeDocuments()),
  );

  const resetError = () => setError(null);

  const resetDocuments = (seed: Document[] = []) => {
    const init = initializeDocuments(seed);
    setDocuments(init);
    setAvailableIndexes(getAvailableIndexes(init));
    setError(null);
  };

  const handleMarkForDeletion = (id: number | null, idx: number) => {
    setDocuments((prev) => {
      const updated = prev.map((doc, i) => {
        if (i !== idx) return doc;
        if (doc.id && doc.id === id) {
          // existing server-backed item: mark for deletion, clear file/preview
          return { ...doc, markedForDeletion: true, file: null, url: null };
        }
        // no id -> empty slot
        return { ...EMPTY_DOCUMENT };
      });
      setAvailableIndexes(getAvailableIndexes(updated));
      return updated;
    });
  };

  const handleAddFiles = (files: FileList | File[]) => {
    resetError();
    const newFiles = Array.from(files);
    setDocuments((prevDocs) => {
      const updated = [...prevDocs];
      const available = getAvailableIndexes(prevDocs);

      if (newFiles.length > available.length) {
        setError(`No available space for new documents (max ${maxAllowedDocs}).`);
        return prevDocs;
      }

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

  const handleReplaceFileAtIndex = (file: File, idx: number) => {
    resetError();
    setDocuments((prev) => {
      const updated = [...prev];
      const existing = updated[idx];

      // preserve id if present — this indicates "replace" to backend
      updated[idx] = {
        id: existing?.id ?? null,
        type: file.type,
        url: URL.createObjectURL(file),
        file,
        markedForDeletion: false,
      };
      setAvailableIndexes(getAvailableIndexes(updated));
      return updated;
    });
  };

  const handleRemoveAtIndex = (idx: number) => {
    setDocuments((prev) => {
      const updated = [...prev];
      const doc = updated[idx];
      if (doc.id) {
        // existing item -> mark for deletion, backend will see id + markedForDeletion
        updated[idx] = { ...doc, markedForDeletion: true, file: null, url: null };
      } else {
        // local-only slot -> simply clear it
        updated[idx] = { ...EMPTY_DOCUMENT };
      }
      setAvailableIndexes(getAvailableIndexes(updated));
      return updated;
    });
  };

  const handleUnmarkDeletion = (idx: number) => {
    setDocuments((prev) => {
      const updated = [...prev];
      const doc = updated[idx];
      if (!doc) return prev;
      // If previously marked, unmark it. If it had been cleared, it's still safe.
      updated[idx] = { ...doc, markedForDeletion: false };
      setAvailableIndexes(getAvailableIndexes(updated));
      return updated;
    });
  };

  return {
    documents,
    availableIndexes,
    error,
    handleAddFiles,
    handleReplaceFileAtIndex,
    handleRemoveAtIndex,
    handleUnmarkDeletion,
    handleMarkForDeletion,
    resetError,
    resetDocuments,
    setDocuments,
  };
}
