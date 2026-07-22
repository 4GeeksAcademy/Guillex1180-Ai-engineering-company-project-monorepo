"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CandidateForm, FormFeedback } from "@/components/candidates/candidate-form";
import { useCandidateDetail } from "@/hooks/useCandidateDetail";
import {
  RecordFormValues,
  toRecordFormValues,
  toRecordPayload,
} from "@/types/candidate";

const STATUS_OPTIONS = ["received", "in_progress", "discarded", "hired"];
const STAGE_OPTIONS = ["pending", "review", "interview", "offer", "final"];

function emptyFormValues(): RecordFormValues {
  return {
    fullName: "",
    email: "",
    phone: "",
    position: "",
    linkedinUrl: "",
    cvUrl: "",
    experienceYears: 0,
    status: "",
    stage: "",
  };
}

function formatDate(dateIso: string): string {
  if (!dateIso) {
    return "-";
  }

  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) {
    return dateIso;
  }

  return date.toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

interface CandidateDetailPageProps {
  recordId: string;
}

export function CandidateDetailPage({ recordId }: CandidateDetailPageProps) {
  const {
    candidate,
    notes,
    detailState,
    notesState,
    detailError,
    notesError,
    patchStatusFeedback,
    patchStageFeedback,
    updateFeedback,
    addNoteFeedback,
    deleteNoteFeedback,
    refetchDetail,
    refetchNotes,
    updateStatus,
    updateStage,
    updateRecord,
    addNote,
    removeNote,
  } = useCandidateDetail(recordId);

  const [statusToSet, setStatusToSet] = useState("");
  const [stageToSet, setStageToSet] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const initialFormValues = useMemo(() => {
    if (!candidate) {
      return emptyFormValues();
    }
    return toRecordFormValues(candidate);
  }, [candidate]);

  const updateFormFeedback: FormFeedback = {
    state: updateFeedback.state,
    message: updateFeedback.message,
  };

  async function handleSubmitEdition(values: RecordFormValues): Promise<void> {
    await updateRecord(toRecordPayload(values));
  }

  async function handleAddNote(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!noteContent.trim()) {
      return;
    }

    await addNote(noteContent.trim());
    setNoteContent("");
  }

  if (detailState === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-amber-50 p-6">
        <div className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-3">
          <div className="h-60 animate-pulse rounded-2xl border border-slate-200 bg-white/70 lg:col-span-2" />
          <div className="h-60 animate-pulse rounded-2xl border border-slate-200 bg-white/70" />
        </div>
      </div>
    );
  }

  if (detailState === "error") {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto w-full max-w-3xl rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-900">
          <h1 className="text-xl font-bold">No se pudo cargar el detalle</h1>
          <p className="mt-2 text-sm">{detailError ?? "Error inesperado"}</p>
          <button
            type="button"
            onClick={refetchDetail}
            className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-amber-50 px-4 py-6 sm:px-6 lg:px-8">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800"
          >
            Volver al listado
          </Link>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Detalle de candidatura</p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">{candidate.fullName}</h1>
          <p className="mt-1 text-sm text-slate-600">{candidate.email}</p>

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <p><span className="font-semibold text-slate-900">Teléfono:</span> {candidate.phone || "-"}</p>
            <p><span className="font-semibold text-slate-900">Puesto:</span> {candidate.position || "-"}</p>
            <p><span className="font-semibold text-slate-900">Años experiencia:</span> {candidate.experienceYears}</p>
            <p><span className="font-semibold text-slate-900">Estado:</span> {candidate.status || "-"}</p>
            <p><span className="font-semibold text-slate-900">Etapa:</span> {candidate.stage || "-"}</p>
            <p><span className="font-semibold text-slate-900">Aplicó:</span> {formatDate(candidate.appliedAt)}</p>
            <p className="sm:col-span-2 lg:col-span-3">
              <span className="font-semibold text-slate-900">LinkedIn:</span>{" "}
              {candidate.linkedinUrl ? (
                <a className="text-sky-700 underline" href={candidate.linkedinUrl} target="_blank" rel="noreferrer">
                  {candidate.linkedinUrl}
                </a>
              ) : (
                "-"
              )}
            </p>
            <p className="sm:col-span-2 lg:col-span-3">
              <span className="font-semibold text-slate-900">CV:</span>{" "}
              {candidate.cvUrl ? (
                <a className="text-sky-700 underline" href={candidate.cvUrl} target="_blank" rel="noreferrer">
                  Abrir CV
                </a>
              ) : (
                "-"
              )}
            </p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Actualizar estado (PATCH)</h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <select
                value={statusToSet}
                onChange={(event) => setStatusToSet(event.target.value)}
                className="h-11 min-w-52 rounded-xl border border-slate-200 px-3 text-sm"
              >
                <option value="">Seleccionar estado</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!statusToSet || patchStatusFeedback.state === "loading"}
                onClick={() => updateStatus(statusToSet)}
                className="h-11 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white disabled:opacity-60"
              >
                {patchStatusFeedback.state === "loading" ? "Guardando..." : "Guardar estado"}
              </button>
            </div>
            {patchStatusFeedback.message ? (
              <p className={`mt-2 text-sm ${patchStatusFeedback.state === "error" ? "text-rose-700" : "text-emerald-700"}`}>
                {patchStatusFeedback.message}
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Actualizar etapa (PATCH)</h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <select
                value={stageToSet}
                onChange={(event) => setStageToSet(event.target.value)}
                className="h-11 min-w-52 rounded-xl border border-slate-200 px-3 text-sm"
              >
                <option value="">Seleccionar etapa</option>
                {STAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!stageToSet || patchStageFeedback.state === "loading"}
                onClick={() => updateStage(stageToSet)}
                className="h-11 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white disabled:opacity-60"
              >
                {patchStageFeedback.state === "loading" ? "Guardando..." : "Guardar etapa"}
              </button>
            </div>
            {patchStageFeedback.message ? (
              <p className={`mt-2 text-sm ${patchStageFeedback.state === "error" ? "text-rose-700" : "text-emerald-700"}`}>
                {patchStageFeedback.message}
              </p>
            ) : null}
          </div>
        </section>

        <CandidateForm
          title="Editar candidatura (PUT)"
          submitLabel="Guardar cambios"
          initialValues={initialFormValues}
          feedback={updateFormFeedback}
          onSubmit={handleSubmitEdition}
        />

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-900">Notas ({candidate.notesCount})</h2>
            <button
              type="button"
              onClick={refetchNotes}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
            >
              Recargar notas
            </button>
          </div>

          <form className="mt-3 flex flex-col gap-2" onSubmit={handleAddNote}>
            <textarea
              value={noteContent}
              onChange={(event) => setNoteContent(event.target.value)}
              placeholder="Agregar nota interna"
              className="min-h-24 rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <div>
              <button
                type="submit"
                disabled={!noteContent.trim() || addNoteFeedback.state === "loading"}
                className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white disabled:opacity-60"
              >
                {addNoteFeedback.state === "loading" ? "Guardando..." : "Agregar nota"}
              </button>
            </div>
            {addNoteFeedback.message ? (
              <p className={`text-sm ${addNoteFeedback.state === "error" ? "text-rose-700" : "text-emerald-700"}`}>
                {addNoteFeedback.message}
              </p>
            ) : null}
          </form>

          {notesState === "loading" ? (
            <div className="mt-4 space-y-2">
              <div className="h-16 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
              <div className="h-16 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
            </div>
          ) : null}

          {notesState === "error" ? (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
              <p>{notesError ?? "No se pudieron cargar las notas"}</p>
            </div>
          ) : null}

          {notesState === "success" ? (
            <ul className="mt-4 space-y-2">
              {notes.map((note) => (
                <li key={note.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-slate-800">{note.content}</p>
                    <button
                      type="button"
                      onClick={() => removeNote(note.id)}
                      className="shrink-0 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Eliminar
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{formatDate(note.createdAt)}</p>
                </li>
              ))}
              {notes.length === 0 ? (
                <li className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                  No hay notas registradas.
                </li>
              ) : null}
            </ul>
          ) : null}

          {deleteNoteFeedback.message ? (
            <p className={`mt-3 text-sm ${deleteNoteFeedback.state === "error" ? "text-rose-700" : "text-emerald-700"}`}>
              {deleteNoteFeedback.message}
            </p>
          ) : null}
        </section>
      </main>
    </div>
  );
}