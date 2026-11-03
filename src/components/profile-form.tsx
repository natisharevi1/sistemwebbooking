"use client";

import { useActionState } from "react";
import { updateProfile } from "@/lib/actions/profile";
import { SubmitButton } from "@/components/submit-button";
import type { ActionState } from "@/lib/action-state";

const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

export function ProfileForm({ initialName }: { initialName: string }) {
  const [state, formAction] = useActionState(updateProfile, {} as ActionState);

  return (
    <form action={formAction} className="space-y-6">
      {state.error ? (
        <div className="rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 ring-1 ring-inset ring-rose-600/20">
          {state.error}
        </div>
      ) : null}
      {state.success ? (
        <div className="rounded-lg bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          {state.success}
        </div>
      ) : null}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Nama Lengkap
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={initialName}
          className={`mt-1.5 ${inputClass}`}
        />
      </div>

      <div className="border-t border-slate-100 pt-6">
        <h2 className="text-base font-semibold text-slate-900">Ubah Kata Sandi</h2>
        <p className="mt-1 text-sm text-slate-500">
          Kosongkan kolom di bawah jika tidak ingin mengubah kata sandi.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700">
              Kata Sandi Saat Ini
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={`mt-1.5 ${inputClass}`}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">
                Kata Sandi Baru
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Minimal 6 karakter"
                className={`mt-1.5 ${inputClass}`}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                Konfirmasi Kata Sandi Baru
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Ulangi kata sandi baru"
                className={`mt-1.5 ${inputClass}`}
              />
            </div>
          </div>
        </div>
      </div>

      <SubmitButton className="w-auto px-6">Simpan Perubahan</SubmitButton>
    </form>
  );
}
