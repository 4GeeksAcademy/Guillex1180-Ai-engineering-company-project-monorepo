"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CandidateForm, FormFeedback } from "@/components/candidates/candidate-form";
import { CandidateFilters } from "@/components/candidates/candidate-filters";
import { CandidateList } from "@/components/candidates/candidate-list";
import { useCandidates } from "@/hooks/useCandidates";
import { createRecord } from "@/services/records";
import { RecordFormValues, toRecordPayload } from "@/types/candidate";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200/70 bg-white/90 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export function CandidateListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("query") ?? "";
  const status = searchParams.get("status") ?? "";
  const stage = searchParams.get("stage") ?? "";

  const {
    filteredCandidates,
    candidates,
    networkState,
    errorMessage,
    lastUpdatedAt,
    uniqueStages,
    uniqueStatuses,
    refetch,
    addCandidate,
  } =
    useCandidates({ query, status, stage });

  const [createFeedback, setCreateFeedback] = useState<FormFeedback>({
    state: "idle",
    message: null,
  });

  const createInitialValues = useMemo<RecordFormValues>(
    () => ({
      fullName: "",
      email: "",
      phone: "",
      position: "",
      linkedinUrl: "",
      cvUrl: "",
      experienceYears: 0,
      status: "received",
      stage: "pending",
    }),
    []
  );

  const createCandidate = useCallback(
    async (values: RecordFormValues) => {
      setCreateFeedback({ state: "loading", message: null });
      try {
        const created = await createRecord(toRecordPayload(values));
        addCandidate(created);
        setCreateFeedback({
          state: "success",
          message: "Candidatura creada correctamente y agregada al listado.",
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudo crear la candidatura";
        setCreateFeedback({ state: "error", message });
      }
    },
    [addCandidate]
  );

  const syncFilterInUrl = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim().length === 0) {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      const queryString = params.toString();
      const target = queryString.length > 0 ? `${pathname}?${queryString}` : pathname;
      router.replace(target);
    },
    [pathname, router, searchParams]
  );

  const resetFilters = useCallback(() => {
    router.replace(pathname);
  }, [pathname, router]);

  const totalStatuses = useMemo(() => uniqueStatuses.length, [uniqueStatuses]);
  const totalStages = useMemo(() => uniqueStages.length, [uniqueStages]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-amber-50 via-white to-cyan-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.12),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(245,158,11,0.18),transparent_26%)]" />

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <header className="rounded-3xl border border-slate-200/70 bg-white/85 p-6 shadow-sm backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">People & Talent</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Talent Pipeline Tracker</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
            Vista centralizada del pipeline de selección para monitorear estado y etapa de cada candidatura.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <StatCard label="Total de candidatos" value={candidates.length} />
            <StatCard label="Estados activos" value={totalStatuses} />
            <StatCard label="Etapas activas" value={totalStages} />
          </div>
        </header>

        <CandidateFilters
          query={query}
          status={status}
          stage={stage}
          statusOptions={uniqueStatuses}
          stageOptions={uniqueStages}
          onQueryChange={(value) => syncFilterInUrl("query", value)}
          onStatusChange={(value) => syncFilterInUrl("status", value)}
          onStageChange={(value) => syncFilterInUrl("stage", value)}
          onReset={resetFilters}
        />

        <CandidateForm
          title="Registrar nueva candidatura (POST)"
          submitLabel="Crear candidatura"
          initialValues={createInitialValues}
          feedback={createFeedback}
          onSubmit={createCandidate}
        />

        {networkState === "loading" ? (
          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white/70"
              />
            ))}
          </section>
        ) : null}

        {networkState === "error" ? (
          <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-900">
            <h2 className="text-lg font-semibold">No se pudo cargar el listado</h2>
            <p className="mt-1 text-sm">{errorMessage ?? "Error inesperado"}</p>
            <button
              type="button"
              onClick={refetch}
              className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Reintentar
            </button>
          </section>
        ) : null}

        {networkState === "success" ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-700">
              <p>
                Mostrando <span className="font-semibold text-slate-900">{filteredCandidates.length}</span> de{" "}
                <span className="font-semibold text-slate-900">{candidates.length}</span> candidatos.
              </p>
              <p>
                Actualizado: {lastUpdatedAt ? lastUpdatedAt.toLocaleTimeString("es-ES") : "-"}
              </p>
            </div>

            <CandidateList candidates={filteredCandidates} />
          </>
        ) : null}
      </main>
    </div>
  );
}