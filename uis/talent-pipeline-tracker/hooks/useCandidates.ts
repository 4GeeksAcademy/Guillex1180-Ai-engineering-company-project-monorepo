"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CandidateFilters, CandidateRecord } from "@/types/candidate";
import { getRecords } from "@/services/records";

export type CandidatesNetworkState = "loading" | "success" | "error";

interface UseCandidatesResult {
  candidates: CandidateRecord[];
  filteredCandidates: CandidateRecord[];
  networkState: CandidatesNetworkState;
  errorMessage: string | null;
  lastUpdatedAt: Date | null;
  uniqueStatuses: string[];
  uniqueStages: string[];
  refetch: () => void;
  addCandidate: (candidate: CandidateRecord) => void;
}

function matchesFilters(candidate: CandidateRecord, filters: CandidateFilters): boolean {
  const normalizedQuery = filters.query.trim().toLowerCase();
  const normalizedStatus = filters.status.trim().toLowerCase();
  const normalizedStage = filters.stage.trim().toLowerCase();

  const matchesQuery =
    normalizedQuery.length === 0 ||
    candidate.fullName.toLowerCase().includes(normalizedQuery) ||
    candidate.email.toLowerCase().includes(normalizedQuery);

  const matchesStatus =
    normalizedStatus.length === 0 || candidate.status.toLowerCase() === normalizedStatus;

  const matchesStage =
    normalizedStage.length === 0 || candidate.stage.toLowerCase() === normalizedStage;

  return matchesQuery && matchesStatus && matchesStage;
}

export function useCandidates(filters: CandidateFilters): UseCandidatesResult {
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [networkState, setNetworkState] = useState<CandidatesNetworkState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCandidates(): Promise<void> {
      setNetworkState("loading");
      setErrorMessage(null);

      try {
        const result = await getRecords(controller.signal);
        setCandidates(result);
        setNetworkState("success");
        setLastUpdatedAt(new Date());
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message = error instanceof Error ? error.message : "Error inesperado al cargar datos";
        setErrorMessage(message);
        setNetworkState("error");
      }
    }

    fetchCandidates();

    return () => {
      controller.abort();
    };
  }, [refreshCounter]);

  const filteredCandidates = useMemo(
    () => candidates.filter((candidate) => matchesFilters(candidate, filters)),
    [candidates, filters]
  );

  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(candidates.map((candidate) => candidate.status))).sort();
  }, [candidates]);

  const uniqueStages = useMemo(() => {
    return Array.from(new Set(candidates.map((candidate) => candidate.stage))).sort();
  }, [candidates]);

  const refetch = useCallback(() => {
    setRefreshCounter((value) => value + 1);
  }, []);

  const addCandidate = useCallback((candidate: CandidateRecord) => {
    setCandidates((current) => [candidate, ...current]);
    setLastUpdatedAt(new Date());
  }, []);

  return {
    candidates,
    filteredCandidates,
    networkState,
    errorMessage,
    lastUpdatedAt,
    uniqueStatuses,
    uniqueStages,
    refetch,
    addCandidate,
  };
}