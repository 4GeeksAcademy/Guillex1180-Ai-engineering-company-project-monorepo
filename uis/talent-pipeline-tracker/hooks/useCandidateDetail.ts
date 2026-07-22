"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CandidateDetail,
  CandidateNote,
  PatchRecordPayload,
  RecordPayload,
} from "@/types/candidate";
import {
  createRecordNote,
  deleteRecordNote,
  getRecordById,
  getRecordNotes,
  patchRecord,
  putRecord,
} from "@/services/records";

type AsyncState = "idle" | "loading" | "success" | "error";
type NetworkState = "loading" | "success" | "error";

interface MutationFeedback {
  state: AsyncState;
  message: string | null;
}

interface UseCandidateDetailResult {
  candidate: CandidateDetail | null;
  notes: CandidateNote[];
  detailState: NetworkState;
  notesState: NetworkState;
  detailError: string | null;
  notesError: string | null;
  patchStatusFeedback: MutationFeedback;
  patchStageFeedback: MutationFeedback;
  updateFeedback: MutationFeedback;
  addNoteFeedback: MutationFeedback;
  deleteNoteFeedback: MutationFeedback;
  refetchDetail: () => void;
  refetchNotes: () => void;
  updateStatus: (status: string) => Promise<void>;
  updateStage: (stage: string) => Promise<void>;
  updateRecord: (payload: RecordPayload) => Promise<void>;
  addNote: (content: string) => Promise<void>;
  removeNote: (noteId: string) => Promise<void>;
}

function feedbackDefault(): MutationFeedback {
  return { state: "idle", message: null };
}

export function useCandidateDetail(recordId: string): UseCandidateDetailResult {
  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [notes, setNotes] = useState<CandidateNote[]>([]);

  const [detailState, setDetailState] = useState<NetworkState>("loading");
  const [notesState, setNotesState] = useState<NetworkState>("loading");
  const [detailError, setDetailError] = useState<string | null>(null);
  const [notesError, setNotesError] = useState<string | null>(null);

  const [detailRefreshCounter, setDetailRefreshCounter] = useState(0);
  const [notesRefreshCounter, setNotesRefreshCounter] = useState(0);

  const [patchStatusFeedback, setPatchStatusFeedback] = useState<MutationFeedback>(feedbackDefault());
  const [patchStageFeedback, setPatchStageFeedback] = useState<MutationFeedback>(feedbackDefault());
  const [updateFeedback, setUpdateFeedback] = useState<MutationFeedback>(feedbackDefault());
  const [addNoteFeedback, setAddNoteFeedback] = useState<MutationFeedback>(feedbackDefault());
  const [deleteNoteFeedback, setDeleteNoteFeedback] = useState<MutationFeedback>(feedbackDefault());

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDetail(): Promise<void> {
      setDetailState("loading");
      setDetailError(null);
      try {
        const result = await getRecordById(recordId, controller.signal);
        setCandidate(result);
        setDetailState("success");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        setDetailError(error instanceof Error ? error.message : "Error inesperado");
        setDetailState("error");
      }
    }

    fetchDetail();

    return () => {
      controller.abort();
    };
  }, [recordId, detailRefreshCounter]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchNotes(): Promise<void> {
      setNotesState("loading");
      setNotesError(null);
      try {
        const result = await getRecordNotes(recordId, controller.signal);
        setNotes(result);
        setNotesState("success");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        setNotesError(error instanceof Error ? error.message : "Error inesperado");
        setNotesState("error");
      }
    }

    fetchNotes();

    return () => {
      controller.abort();
    };
  }, [recordId, notesRefreshCounter]);

  const refetchDetail = useCallback(() => {
    setDetailRefreshCounter((value) => value + 1);
  }, []);

  const refetchNotes = useCallback(() => {
    setNotesRefreshCounter((value) => value + 1);
  }, []);

  const updateStatus = useCallback(
    async (status: string) => {
      setPatchStatusFeedback({ state: "loading", message: null });
      try {
        const payload: PatchRecordPayload = { status };
        const updated = await patchRecord(recordId, payload);
        setCandidate(updated);
        setPatchStatusFeedback({ state: "success", message: "Estado actualizado" });
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudo actualizar el estado";
        setPatchStatusFeedback({ state: "error", message });
      }
    },
    [recordId]
  );

  const updateStage = useCallback(
    async (stage: string) => {
      setPatchStageFeedback({ state: "loading", message: null });
      try {
        const payload: PatchRecordPayload = { stage };
        const updated = await patchRecord(recordId, payload);
        setCandidate(updated);
        setPatchStageFeedback({ state: "success", message: "Etapa actualizada" });
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudo actualizar la etapa";
        setPatchStageFeedback({ state: "error", message });
      }
    },
    [recordId]
  );

  const updateRecord = useCallback(
    async (payload: RecordPayload) => {
      setUpdateFeedback({ state: "loading", message: null });
      try {
        const updated = await putRecord(recordId, payload);
        setCandidate(updated);
        setUpdateFeedback({ state: "success", message: "Datos del candidato actualizados" });
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudo guardar la edición";
        setUpdateFeedback({ state: "error", message });
      }
    },
    [recordId]
  );

  const addNote = useCallback(
    async (content: string) => {
      setAddNoteFeedback({ state: "loading", message: null });
      try {
        const newNote = await createRecordNote(recordId, content);
        setNotes((current) => [newNote, ...current]);
        setCandidate((current) => {
          if (!current) {
            return current;
          }
          return {
            ...current,
            notesCount: current.notesCount + 1,
          };
        });
        setAddNoteFeedback({ state: "success", message: "Nota agregada" });
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudo agregar la nota";
        setAddNoteFeedback({ state: "error", message });
      }
    },
    [recordId]
  );

  const removeNote = useCallback(
    async (noteId: string) => {
      setDeleteNoteFeedback({ state: "loading", message: null });
      try {
        await deleteRecordNote(recordId, noteId);
        setNotes((current) => current.filter((note) => note.id !== noteId));
        setCandidate((current) => {
          if (!current) {
            return current;
          }
          return {
            ...current,
            notesCount: Math.max(0, current.notesCount - 1),
          };
        });
        setDeleteNoteFeedback({ state: "success", message: "Nota eliminada" });
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudo eliminar la nota";
        setDeleteNoteFeedback({ state: "error", message });
      }
    },
    [recordId]
  );

  return {
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
  };
}