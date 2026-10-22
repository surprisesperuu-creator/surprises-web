"use client";

import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

export const inputBaseClass =
  "w-full rounded-2xl border border-primary/25 bg-white px-4 py-3.5 text-base text-text shadow-sm placeholder:text-primary/35 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-text/40";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

/** Envuelve un campo con etiqueta, mensaje de error y ayuda. */
export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-base font-semibold text-text">
        {label}
        {required && <span className="ml-0.5 text-primary">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1.5 flex items-start gap-1 text-xs leading-relaxed text-text/55">
          {hint}
        </p>
      )}
      {error && (
        <p className="mt-1.5 flex items-start gap-1 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  /** Acción opcional que se renderiza a la derecha del input. */
  action?: ReactNode;
}

export function TextField({ label, error, hint, id, action, ...props }: TextFieldProps) {
  const inputId = id ?? props.name;
  return (
    <FormField
      label={label}
      htmlFor={inputId ?? ""}
      error={error}
      hint={hint}
      required={props.required}
    >
      <div className="flex gap-2">
        <input id={inputId} className={inputBaseClass} {...props} />
        {action}
      </div>
    </FormField>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function TextAreaField({ label, error, hint, id, ...props }: TextAreaFieldProps) {
  const inputId = id ?? props.name;
  return (
    <FormField
      label={label}
      htmlFor={inputId ?? ""}
      error={error}
      hint={hint}
      required={props.required}
    >
      <textarea
        id={inputId}
        className={`${inputBaseClass} min-h-[140px] resize-y`}
        {...props}
      />
    </FormField>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function SelectField({ label, error, hint, id, children, ...props }: SelectFieldProps) {
  const inputId = id ?? props.name;
  return (
    <FormField
      label={label}
      htmlFor={inputId ?? ""}
      error={error}
      hint={hint}
      required={props.required}
    >
      <select id={inputId} className={inputBaseClass} {...props}>
        {children}
      </select>
    </FormField>
  );
}
