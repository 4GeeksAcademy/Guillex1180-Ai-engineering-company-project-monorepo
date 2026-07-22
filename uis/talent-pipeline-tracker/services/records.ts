import {
  ApiNote,
  ApiRecord,
  CandidateDetail,
  CandidateNote,
  CandidateRecord,
  PatchRecordPayload,
  RecordPayload,
  normalizeCandidateDetail,
  normalizeCandidateNote,
  normalizeCandidateRecord,
} from "@/types/candidate";

const DEFAULT_API_BASE_URL = "https://playground.4geeks.com/tracker/api/v1";

interface RecordsEnvelope {
  total?: number;
  page?: number;
  limit?: number;
  data?: ApiRecord[];
  records?: ApiRecord[];
  results?: ApiRecord[];
}

interface RecordEnvelope {
  data?: ApiRecord;
  record?: ApiRecord;
}

interface NotesEnvelope {
  data?: ApiNote[];
  notes?: ApiNote[];
  results?: ApiNote[];
}

interface NoteEnvelope {
  data?: ApiNote;
  note?: ApiNote;
}

function apiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;
}

async function parseApiError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { error?: string; detail?: unknown };

    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }

    if (typeof payload.detail === "string" && payload.detail.trim()) {
      return payload.detail;
    }

    if (Array.isArray(payload.detail) && payload.detail.length > 0) {
      const first = payload.detail[0] as { msg?: string };
      if (typeof first?.msg === "string" && first.msg.trim()) {
        return first.msg;
      }
    }
  } catch {
    return `Error HTTP ${response.status}`;
  }

  return `Error HTTP ${response.status}`;
}

function extractRecords(payload: unknown): ApiRecord[] {
  if (Array.isArray(payload)) {
    return payload as ApiRecord[];
  }

  if (typeof payload === "object" && payload !== null) {
    const envelope = payload as RecordsEnvelope;
    if (Array.isArray(envelope.data)) {
      return envelope.data;
    }
    if (Array.isArray(envelope.records)) {
      return envelope.records;
    }
    if (Array.isArray(envelope.results)) {
      return envelope.results;
    }
  }

  return [];
}

function extractRecord(payload: unknown): ApiRecord | null {
  if (typeof payload === "object" && payload !== null) {
    const envelope = payload as RecordEnvelope;
    if (typeof envelope.data === "object" && envelope.data !== null) {
      return envelope.data;
    }
    if (typeof envelope.record === "object" && envelope.record !== null) {
      return envelope.record;
    }

    return payload as ApiRecord;
  }

  return null;
}

function extractNotes(payload: unknown): ApiNote[] {
  if (Array.isArray(payload)) {
    return payload as ApiNote[];
  }

  if (typeof payload === "object" && payload !== null) {
    const envelope = payload as NotesEnvelope;
    if (Array.isArray(envelope.data)) {
      return envelope.data;
    }
    if (Array.isArray(envelope.notes)) {
      return envelope.notes;
    }
    if (Array.isArray(envelope.results)) {
      return envelope.results;
    }
  }

  return [];
}

function extractNote(payload: unknown): ApiNote | null {
  if (typeof payload === "object" && payload !== null) {
    const envelope = payload as NoteEnvelope;
    if (typeof envelope.data === "object" && envelope.data !== null) {
      return envelope.data;
    }
    if (typeof envelope.note === "object" && envelope.note !== null) {
      return envelope.note;
    }

    return payload as ApiNote;
  }

  return null;
}

export async function getRecords(signal?: AbortSignal): Promise<CandidateRecord[]> {
  const response = await fetch(`${apiBaseUrl()}/records`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const payload = (await response.json()) as unknown;
  const records = extractRecords(payload);

  return records.map(normalizeCandidateRecord);
}

export async function getRecordById(id: string, signal?: AbortSignal): Promise<CandidateDetail> {
  const response = await fetch(`${apiBaseUrl()}/records/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const payload = (await response.json()) as unknown;
  const record = extractRecord(payload);

  if (!record) {
    throw new Error("No se encontraron datos del candidato");
  }

  return normalizeCandidateDetail(record);
}

export async function createRecord(payload: RecordPayload): Promise<CandidateDetail> {
  const response = await fetch(`${apiBaseUrl()}/records`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const data = (await response.json()) as unknown;
  const record = extractRecord(data);
  if (!record) {
    throw new Error("No se recibió el candidato creado");
  }

  return normalizeCandidateDetail(record);
}

export async function putRecord(id: string, payload: RecordPayload): Promise<CandidateDetail> {
  const response = await fetch(`${apiBaseUrl()}/records/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const data = (await response.json()) as unknown;
  const record = extractRecord(data);
  if (!record) {
    throw new Error("No se recibió el candidato actualizado");
  }

  return normalizeCandidateDetail(record);
}

export async function patchRecord(id: string, payload: PatchRecordPayload): Promise<CandidateDetail> {
  const response = await fetch(`${apiBaseUrl()}/records/${id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const data = (await response.json()) as unknown;
  const record = extractRecord(data);
  if (!record) {
    throw new Error("No se recibió el candidato actualizado");
  }

  return normalizeCandidateDetail(record);
}

export async function getRecordNotes(id: string, signal?: AbortSignal): Promise<CandidateNote[]> {
  const response = await fetch(`${apiBaseUrl()}/records/${id}/notes`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const payload = (await response.json()) as unknown;
  const notes = extractNotes(payload);

  return notes.map(normalizeCandidateNote);
}

export async function createRecordNote(id: string, content: string): Promise<CandidateNote> {
  const response = await fetch(`${apiBaseUrl()}/records/${id}/notes`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const payload = (await response.json()) as unknown;
  const note = extractNote(payload);

  if (!note) {
    throw new Error("No se recibió la nota creada");
  }

  return normalizeCandidateNote(note);
}

export async function deleteRecordNote(id: string, noteId: string): Promise<void> {
  const response = await fetch(`${apiBaseUrl()}/records/${id}/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }
}