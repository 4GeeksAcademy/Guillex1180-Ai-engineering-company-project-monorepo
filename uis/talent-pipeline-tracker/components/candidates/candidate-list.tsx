"use client";

import Link from "next/link";
import { CandidateRecord } from "@/types/candidate";

interface CandidateListProps {
  candidates: CandidateRecord[];
}

function badgeClasses(value: string): string {
  const normalized = value.toLowerCase();

  if (normalized.includes("hired") || normalized.includes("offer")) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (normalized.includes("rejected") || normalized.includes("declined")) {
    return "bg-rose-100 text-rose-700";
  }

  if (normalized.includes("interview")) {
    return "bg-sky-100 text-sky-700";
  }

  return "bg-slate-100 text-slate-700";
}

export function CandidateList({ candidates }: CandidateListProps) {
  if (candidates.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
        <h3 className="text-lg font-semibold text-slate-900">No hay resultados</h3>
        <p className="mt-2 text-sm text-slate-600">
          Ajusta tus filtros o agrega nuevos candidatos para verlos en el pipeline.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {candidates.map((candidate) => (
        <article
          key={candidate.id}
          className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-slate-900">{candidate.fullName}</h3>
              <p className="mt-0.5 text-sm text-slate-600">{candidate.email}</p>
            </div>
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClasses(candidate.status)}`}
            >
              {candidate.status}
            </span>
          </div>

          <div className="mt-4 space-y-1.5 text-sm">
            <p className="text-slate-700">
              <span className="font-medium text-slate-900">Puesto:</span> {candidate.position}
            </p>
            <p className="text-slate-700">
              <span className="font-medium text-slate-900">Etapa:</span> {candidate.stage}
            </p>
          </div>

          <div className="mt-5">
            <Link
              href={`/candidates/${candidate.id}`}
              className="inline-flex items-center text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 transition group-hover:decoration-slate-700"
            >
              Ver detalle
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}