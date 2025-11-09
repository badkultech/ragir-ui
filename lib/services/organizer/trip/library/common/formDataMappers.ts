// src/lib/formDataMappers.ts
// Centralized FormData mappers with consistent document handling
// - honors the Document shape you provided
// - supports mark-for-deletion for existing docs
// - enforces a MAX_DOCS cap (6 by default)

export interface DocumentItem {
  id: number | null;
  type: string | null;
  url: string | null;
  file: File | null;
  markedForDeletion: boolean;
}

const MAX_DOCS = 6;

/* ---------- small helpers ---------- */

/**
 * Append a repeated simple field (e.g., moodTags) to formdata.
 */
function appendRepeatedField(fd: FormData, key: string, values?: string[] | null) {
  if (!values || !values.length) return;
  values.forEach((v) => {
    if (v !== undefined && v !== null) fd.append(key, String(v));
  });
}

/**
 * Normalize boolean/flags into the string representation backend commonly expects.
 * We append "true" or "false" strings so FormData is consistent.
 */
function boolToString(v: boolean | undefined | null) {
  return v ? "true" : "false";
}

/**
 * Append documents in a consistent shape:
 * For each doc (up to MAX_DOCS) we will:
 * - if doc.file exists: append to `documents[i].file`
 * - if doc.id exists: append `documents[i].id` (useful for server to identify existing doc)
 * - if doc.markedForDeletion is true: append `documents[i].markedForDeletion` -> "true"
 *
 * NOTE: this function will keep the index positions stable (0..MAX_DOCS-1),
 * so server can correlate positions if it relies on indices.
 */

export function appendDocuments(
  fd: FormData,
  documents?: {
    id: number | null;
    type: string | null;
    url: string | null;
    file: File | null;
    markedForDeletion: boolean;
  }[] | null,
  maxDocs: number = MAX_DOCS
) {
  if (!documents || documents.length === 0) {
    // still set count 0 (optional)
    fd.append("documentsCount", "0");
    return fd;
  }

  // Ensure stable iteration 0..maxDocs-1
  const docsArray = Array.from({ length: maxDocs }).map((_, i) =>
    documents[i] ? documents[i] : null
  );

  // compute actual highest index used (helpful for server)
  let highestIndex = -1;
  for (let i = 0; i < docsArray.length; i++) {
    if (docsArray[i]) highestIndex = i;
  }

  // tell server how many positions we considered
  fd.append("documentsCount", String(Math.max(0, highestIndex + 1)));

  for (let i = 0; i < docsArray.length; i++) {
    const doc = docsArray[i];
    const base = `documents[${i}]`;

    if (!doc) {
      // keep index stable but don't append empty url/id/file
      continue;
    }

    // 1) Always include existing id (server will map to storage record)
    if (doc.id !== null && doc.id !== undefined) {
      fd.append(`${base}.id`, String(doc.id));
    }

    // 2) If user uploaded a new file in this slot, send it as file
    if (doc.file instanceof File) {
      const filename = doc.file.name || `document_${i}`;
      fd.append(`${base}.file`, doc.file, filename);

      // optional: include mime/type
      if (doc.type) fd.append(`${base}.fileType`, doc.type);
    }

    // 3) If user marked it for deletion, send the flag
    if (doc.markedForDeletion) {
      fd.append(`${base}.markedForDeletion`, "true");
    }

    // NOTE: intentionally do NOT append url for existing docs because:
    //  - urls are presigned and can expire (403)
    //  - backend should rely on id to reference existing stored assets
  }

  return fd;
}



/* ---------- mappers for each resource ---------- */

/** Generic base mapper used by many resources */
function mapBaseFields(fd: FormData, base: { name?: string; location?: string; description?: string; packing?: string; addToLibrary?: boolean; time?: string }) {
  if (base.name !== undefined) fd.append("name", base.name);
  if (base.location !== undefined) fd.append("location", base.location);
  if (base.description !== undefined) fd.append("description", base.description);
  // normalized key: packingSuggestion (pick this and keep it consistent)
  if (base.packing !== undefined) fd.append("packingSuggestion", base.packing);
  if (base.addToLibrary !== undefined) fd.append("addToLibrary", boolToString(!!base.addToLibrary));
  if (base.time !== undefined) fd.append("time", base.time);
  return fd;
}

export function mapStayToFormData(data: any, documents?: DocumentItem[]) {
  const fd = new FormData();
  mapBaseFields(fd, {
    name: data.title ?? "",
    location: data.location ?? "",
    description: data.description ?? "",
    packing: data.packing ?? "",
  });

  // stay-specific fields
  if (data.sharingType !== undefined) fd.append("sharingType", String(data.sharingType));
  // use camelCase checkInTime/checkOutTime in formdata (normalize across project)
  if (data.checkIn !== undefined) fd.append("checkInTime", data.checkIn);
  if (data.checkOut !== undefined) fd.append("checkOutTime", data.checkOut);

  appendDocuments(fd, documents);
  return fd;
}

export function mapTransitToFormData(data: any, documents?: DocumentItem[]) {
  const fd = new FormData();
  fd.append("fromLocation", data.from ?? "");
  fd.append("toLocation", data.to ?? "");
  fd.append("startTime", data.departure ?? "");
  fd.append("endTime", data.arrival ?? "");
  fd.append("vehicleType", Array.isArray(data.vehicle) ? data.vehicle[0] : data.vehicle ?? "");
  fd.append("customVehicleType", data.otherVehicle ?? "");
  fd.append("arrangedBy", (data.arrangement ?? "organizer").toString().toUpperCase());
  fd.append("description", data.description ?? "");
  fd.append("packingSuggestion", data.packing ?? "");
  fd.append("addToLibrary", boolToString(true));
  fd.append("name", data.title ?? "");
  appendDocuments(fd, documents);
  return fd;
}

export function mapMealToFormData(data: any, documents?: DocumentItem[]) {
  const fd = new FormData();
  mapBaseFields(fd, {
    name: data.title ?? "",
    location: data.location ?? "",
    description: data.description ?? "",
    packing: data.packing ?? "",
    time: data.mealTime ?? "",
    addToLibrary: data.addToLibrary ?? true,
  });

  // unify mealType -> uppercase
  if (data.mealType !== undefined) fd.append("mealType", String(data.mealType).toUpperCase());
  // chargeable boolean: prefer a boolean in UI; map here
  if (data.chargeable !== undefined) {
    fd.append("chargeable", boolToString(!!data.chargeable));
  } else if (data.included !== undefined) {
    // fallback to your previous logic if UI still uses 'included'
    fd.append("chargeable", boolToString(data.included === "chargeable"));
  }
  appendDocuments(fd, documents);
  return fd;
}

export function mapActivityToFormData(data: any, documents?: DocumentItem[]) {
  const fd = new FormData();
  mapBaseFields(fd, {
    name: data.title ?? "",
    location: data.location ?? "",
    description: data.description ?? "",
    packing: data.packing ?? "",
    time: data.time ?? "",
  });

  if (data.priceType !== undefined) fd.append("priceCharge", String(data.priceType));

  // moodTags: allow either array of strings or array of {label, value}
  const rawMoods = Array.isArray(data.moodTags) ? data.moodTags : [];
  const moods = rawMoods
    .map((t: any) => (typeof t === "string" ? t.trim() : String(t?.value ?? "").trim()))
    .filter(Boolean);
  appendRepeatedField(fd, "moodTags", moods);

  appendDocuments(fd, documents);
  return fd;
}

export function mapDayDescriptionToFormData(data: any, documents?: DocumentItem[]) {
  const fd = new FormData();
  mapBaseFields(fd, {
    name: data.title ?? "",
    description: data.description ?? "",
    location: data.location ?? "",
    packing: data.packing ?? "",
    time: data.time ?? "",
    addToLibrary: true,
  });

  // some dayDescriptions might include extra fields like packingSuggestion already handled above
  // handle attached documents (the `documents` param), as well as possibly pre-existing `data.documents`
  // prefer explicit passed documents (from your useDocumentsManager). If none passed, try data.documents
  appendDocuments(fd, documents ?? data.documents ?? null);
  return fd;
}
