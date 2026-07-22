"use client";

import { useState } from "react";
import { RecordFormValues } from "@/types/candidate";

export type FormFeedbackState = "idle" | "loading" | "success" | "error";

export interface FormFeedback {
  state: FormFeedbackState;
  message: string | null;
}

interface CandidateFormProps {
  title: string;
  submitLabel: string;
  initialValues: RecordFormValues;
  feedback: FormFeedback;
  onSubmit: (values: RecordFormValues) => Promise<void>;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  position?: string;
  experienceYears?: string;
}

const STATUS_OPTIONS = ["received", "in_progress", "discarded", "hired"];
const STAGE_OPTIONS = ["pending", "review", "interview", "offer", "final"];

function validate(values: RecordFormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "El nombre completo es obligatorio";
  }

  if (!values.email.trim()) {
    errors.email = "El email es obligatorio";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = "Formato de email inválido";
  }

  if (!values.phone.trim()) {
    errors.phone = "El teléfono es obligatorio";
  }

  if (!values.position.trim()) {
    errors.position = "El puesto es obligatorio";
  }

  if (Number.isNaN(values.experienceYears) || values.experienceYears < 0) {
    errors.experienceYears = "Años de experiencia debe ser 0 o mayor";
  }

  return errors;
}

function fieldError(errors: FormErrors, key: keyof FormErrors): string {
  return errors[key] ?? "";
}

export function CandidateForm({
  title,
  submitLabel,
  initialValues,
  feedback,
  onSubmit,
}: CandidateFormProps) {
  const [values, setValues] = useState<RecordFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  function updateValue<K extends keyof RecordFormValues>(key: K, value: RecordFormValues[K]): void {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!(key in current)) {
        return current;
      }

      const next = { ...current };
      delete next[key as keyof FormErrors];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    await onSubmit(values);
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>

      <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Nombre completo *</span>
          <input
            value={values.fullName}
            onChange={(event) => updateValue("fullName", event.target.value)}
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
          />
          {errors.fullName ? <span className="text-xs text-rose-700">{fieldError(errors, "fullName")}</span> : null}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Email *</span>
          <input
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
          />
          {errors.email ? <span className="text-xs text-rose-700">{fieldError(errors, "email")}</span> : null}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Teléfono *</span>
          <input
            value={values.phone}
            onChange={(event) => updateValue("phone", event.target.value)}
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
          />
          {errors.phone ? <span className="text-xs text-rose-700">{fieldError(errors, "phone")}</span> : null}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Puesto *</span>
          <input
            value={values.position}
            onChange={(event) => updateValue("position", event.target.value)}
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
          />
          {errors.position ? <span className="text-xs text-rose-700">{fieldError(errors, "position")}</span> : null}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">LinkedIn</span>
          <input
            value={values.linkedinUrl}
            onChange={(event) => updateValue("linkedinUrl", event.target.value)}
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">URL del CV</span>
          <input
            value={values.cvUrl}
            onChange={(event) => updateValue("cvUrl", event.target.value)}
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Años de experiencia *</span>
          <input
            type="number"
            min={0}
            step="1"
            value={values.experienceYears}
            onChange={(event) => updateValue("experienceYears", Number(event.target.value))}
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
          />
          {errors.experienceYears ? (
            <span className="text-xs text-rose-700">{fieldError(errors, "experienceYears")}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Estado</span>
          <select
            value={values.status}
            onChange={(event) => updateValue("status", event.target.value)}
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
          >
            <option value="">Seleccionar</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Etapa</span>
          <select
            value={values.stage}
            onChange={(event) => updateValue("stage", event.target.value)}
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
          >
            <option value="">Seleccionar</option>
            {STAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={feedback.state === "loading"}
            className="h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {feedback.state === "loading" ? "Guardando..." : submitLabel}
          </button>
        </div>

        {feedback.message ? (
          <p
            className={`sm:col-span-2 text-sm ${
              feedback.state === "error" ? "text-rose-700" : "text-emerald-700"
            }`}
          >
            {feedback.message}
          </p>
        ) : null}
      </form>
    </section>
  );
}