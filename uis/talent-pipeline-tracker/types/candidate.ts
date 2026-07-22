export interface ApiRecord {
  id?: string | number;
  full_name?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  position?: string;
  role?: string;
  linkedin_url?: string | null;
  cv_url?: string | null;
  status?: string;
  stage?: string;
  experience_years?: number | string | null;
  applied_at?: string | null;
  updated_at?: string | null;
  notes_count?: number | null;
  notes?: ApiNote[];
  [key: string]: unknown;
}

export interface ApiNote {
  id?: string;
  record_id?: string;
  content?: string;
  created_at?: string;
}

export interface CandidateRecord {
  id: string;
  fullName: string;
  email: string;
  position: string;
  status: string;
  stage: string;
  raw: ApiRecord;
}

export interface CandidateDetail extends CandidateRecord {
  phone: string;
  linkedinUrl: string;
  cvUrl: string;
  experienceYears: number;
  appliedAt: string;
  updatedAt: string;
  notesCount: number;
}

export interface CandidateNote {
  id: string;
  recordId: string;
  content: string;
  createdAt: string;
}

export interface RecordFormValues {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  linkedinUrl: string;
  cvUrl: string;
  experienceYears: number;
  status: string;
  stage: string;
}

export interface RecordPayload {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url?: string | null;
  cv_url?: string | null;
  experience_years: number;
  status?: string;
  stage?: string;
}

export interface PatchRecordPayload {
  status?: string;
  stage?: string;
}

export interface CandidateFilters {
  query: string;
  status: string;
  stage: string;
}

function firstString(record: ApiRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function firstNumber(record: ApiRecord, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return undefined;
}

function firstId(record: ApiRecord): string | undefined {
  const rawId = record.id;
  if (typeof rawId === "string" && rawId.trim()) {
    return rawId.trim();
  }
  if (typeof rawId === "number") {
    return String(rawId);
  }
  return undefined;
}

export function normalizeCandidateRecord(record: ApiRecord): CandidateRecord {
  const fullName = firstString(record, ["full_name", "fullName", "name"]) ?? "Sin nombre";
  const email = firstString(record, ["email"]) ?? "Sin email";
  const position = firstString(record, ["position", "role"]) ?? "Sin puesto";
  const status = firstString(record, ["status"]) ?? "unknown";
  const stage = firstString(record, ["stage"]) ?? "unknown";
  const id = firstId(record) ?? `${email}-${fullName}`.toLowerCase().replace(/\s+/g, "-");

  return {
    id,
    fullName,
    email,
    position,
    status,
    stage,
    raw: record,
  };
}

export function normalizeCandidateDetail(record: ApiRecord): CandidateDetail {
  const base = normalizeCandidateRecord(record);

  return {
    ...base,
    phone: firstString(record, ["phone"]) ?? "",
    linkedinUrl: firstString(record, ["linkedin_url"]) ?? "",
    cvUrl: firstString(record, ["cv_url"]) ?? "",
    experienceYears: firstNumber(record, ["experience_years"]) ?? 0,
    appliedAt: firstString(record, ["applied_at"]) ?? "",
    updatedAt: firstString(record, ["updated_at"]) ?? "",
    notesCount: firstNumber(record, ["notes_count"]) ?? 0,
  };
}

export function normalizeCandidateNote(note: ApiNote): CandidateNote {
  return {
    id: note.id ?? crypto.randomUUID(),
    recordId: note.record_id ?? "",
    content: note.content?.trim() ?? "",
    createdAt: note.created_at ?? "",
  };
}

export function toRecordPayload(values: RecordFormValues): RecordPayload {
  return {
    full_name: values.fullName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    position: values.position.trim(),
    linkedin_url: values.linkedinUrl.trim() ? values.linkedinUrl.trim() : null,
    cv_url: values.cvUrl.trim() ? values.cvUrl.trim() : null,
    experience_years: values.experienceYears,
    status: values.status.trim() ? values.status.trim() : undefined,
    stage: values.stage.trim() ? values.stage.trim() : undefined,
  };
}

export function toRecordFormValues(detail: CandidateDetail): RecordFormValues {
  return {
    fullName: detail.fullName,
    email: detail.email,
    phone: detail.phone,
    position: detail.position,
    linkedinUrl: detail.linkedinUrl,
    cvUrl: detail.cvUrl,
    experienceYears: detail.experienceYears,
    status: detail.status,
    stage: detail.stage,
  };
}