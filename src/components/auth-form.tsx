"use client";

import { useActionState } from "react";
import { login, register } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/submit-button";
import type { ActionState } from "@/lib/action-state";

const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 ring-1 ring-inset ring-rose-600/20">
      {message}
    </div>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(login, {} as ActionState);

  return (
    <form action={formAction} className="space-y-5">
      <FieldError message={state.error} />
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="nama@contoh.id"
          className={`mt-1.5 ${inputClass}`}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Kata Sandi
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className={`mt-1.5 ${inputClass}`}
        />
      </div>
      <SubmitButton>Masuk</SubmitButton>
    </form>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(register, {} as ActionState);

  return (
    <form action={formAction} className="space-y-5">
      <FieldError message={state.error} />
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Nama Lengkap
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Nama Anda"
          className={`mt-1.5 ${inputClass}`}
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="nama@contoh.id"
          className={`mt-1.5 ${inputClass}`}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Kata Sandi
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Minimal 6 karakter"
          className={`mt-1.5 ${inputClass}`}
        />
      </div>
      <div>
        <label htmlFor="confirm" className="block text-sm font-medium text-slate-700">
          Konfirmasi Kata Sandi
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Ulangi kata sandi"
          className={`mt-1.5 ${inputClass}`}
        />
      </div>
      <SubmitButton>Daftar</SubmitButton>
    </form>
  );
}
