"use client";

interface CandidateFiltersProps {
  query: string;
  status: string;
  stage: string;
  statusOptions: string[];
  stageOptions: string[];
  onQueryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onStageChange: (value: string) => void;
  onReset: () => void;
}

export function CandidateFilters({
  query,
  status,
  stage,
  statusOptions,
  stageOptions,
  onQueryChange,
  onStatusChange,
  onStageChange,
  onReset,
}: CandidateFiltersProps) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-sm backdrop-blur sm:p-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Buscar</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Nombre o email"
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Estado</span>
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          >
            <option value="">Todos</option>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Etapa</span>
          <select
            value={stage}
            onChange={(event) => onStageChange(event.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          >
            <option value="">Todas</option>
            {stageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onReset}
            className="h-11 w-full rounded-xl border border-slate-300 bg-slate-100 px-4 text-sm font-medium text-slate-800 transition hover:bg-slate-200"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </section>
  );
}