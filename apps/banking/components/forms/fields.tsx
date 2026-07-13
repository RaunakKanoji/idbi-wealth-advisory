"use client";

import { useId } from "react";
import { cn } from "@/lib/utils/cn";

interface FieldChromeProps {
  label: string;
  hint?: string;
  error?: string;
  children: (ids: { inputId: string; describedBy: string | undefined }) => React.ReactNode;
}

function FieldChrome({ label, hint, error, children }: FieldChromeProps) {
  const inputId = useId();
  const hintId = useId();
  const errorId = useId();
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      {children({ inputId, describedBy })}
      {hint ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs font-medium text-negative">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const inputClass =
  "min-h-12 w-full rounded-(--radius-control) border border-border bg-surface px-4 text-base aria-[invalid=true]:border-negative";

interface CurrencyFieldProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  hint?: string;
  error?: string;
}

/** Whole-rupee input with a numeric keyboard (F109). */
export function CurrencyField({ label, value, onChange, hint, error }: CurrencyFieldProps) {
  return (
    <FieldChrome label={label} hint={hint} error={error}>
      {({ inputId, describedBy }) => (
        <div className="relative">
          <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
            ₹
          </span>
          <input
            id={inputId}
            inputMode="numeric"
            autoComplete="off"
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            className={cn(inputClass, "pl-8")}
            value={value === null ? "" : new Intl.NumberFormat("en-IN").format(value)}
            onChange={(event) => {
              const digits = event.target.value.replace(/[^\d]/g, "");
              onChange(digits === "" ? null : Number(digits));
            }}
          />
        </div>
      )}
    </FieldChrome>
  );
}

interface NumberFieldProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  hint?: string;
  error?: string;
}

export function NumberField({ label, value, onChange, hint, error }: NumberFieldProps) {
  return (
    <FieldChrome label={label} hint={hint} error={error}>
      {({ inputId, describedBy }) => (
        <input
          id={inputId}
          inputMode="numeric"
          autoComplete="off"
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={inputClass}
          value={value === null ? "" : String(value)}
          onChange={(event) => {
            const digits = event.target.value.replace(/[^\d]/g, "");
            onChange(digits === "" ? null : Number(digits));
          }}
        />
      )}
    </FieldChrome>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
  maxLength?: number;
  multiline?: boolean;
}

export function TextField({ label, value, onChange, hint, error, maxLength, multiline }: TextFieldProps) {
  return (
    <FieldChrome label={label} hint={hint} error={error}>
      {({ inputId, describedBy }) =>
        multiline ? (
          <textarea
            id={inputId}
            rows={4}
            maxLength={maxLength}
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            className={cn(inputClass, "py-3")}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : (
          <input
            id={inputId}
            type="text"
            maxLength={maxLength}
            autoComplete="off"
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            className={inputClass}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        )
      }
    </FieldChrome>
  );
}

export interface ChoiceOption<V extends string | number> {
  value: V;
  label: string;
  description?: string;
}

interface ChoiceFieldProps<V extends string | number> {
  legend: string;
  options: ChoiceOption<V>[];
  value: V | null;
  onChange: (value: V) => void;
  error?: string;
}

/** Radio-group step question with full-row touch targets (F109/F106). */
export function ChoiceField<V extends string | number>({
  legend,
  options,
  value,
  onChange,
  error,
}: ChoiceFieldProps<V>) {
  const name = useId();
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <label
            key={String(option.value)}
            className={cn(
              "flex min-h-12 cursor-pointer items-center gap-3 rounded-(--radius-control) border px-4 py-2.5",
              selected ? "border-primary bg-primary-soft" : "border-border bg-surface",
            )}
          >
            <input
              type="radio"
              name={name}
              checked={selected}
              onChange={() => onChange(option.value)}
              className="h-5 w-5 shrink-0 accent-(--color-primary)"
            />
            <span className="flex flex-col">
              <span className={cn("text-sm", selected && "font-semibold")}>{option.label}</span>
              {option.description ? (
                <span className="text-xs text-muted">{option.description}</span>
              ) : null}
            </span>
          </label>
        );
      })}
      {error ? (
        <p className="text-xs font-medium text-negative" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
