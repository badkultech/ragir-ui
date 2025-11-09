// components/library/AddNewItemModal/loaders/common.ts
export function normalizeDocuments(rawDocs: any[]): any[] {
  if (!Array.isArray(rawDocs)) return [];

  return rawDocs.map((d: any) => ({
    id: d.id ?? null,
    url: d.url ?? d.fileUrl ?? d.path ?? d.s3Url ?? null,
    type: d.type ?? null,
    file: null,
    markedForDeletion: false,
  }));
}
