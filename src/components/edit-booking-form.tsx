"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateBooking } from "@/lib/actions/bookings";
import { SubmitButton } from "@/components/submit-button";
import type { ActionState } from "@/lib/action-state";

const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

interface Props {
  booking: {
    id: number;
    room_name: string;
    date: string;
    start_time: string;
    end_time: string;
    purpose: string;
  };
}

function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function EditBookingForm({ booking }: Props) {
  const [state, formAction] = useActionState(updateBooking, {} as ActionState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="bookingId" value={booking.id} />

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

      <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600 ring-1 ring-inset ring-slate-200">
        Mengubah jadwal peminjaman ruangan{" "}
        <span className="font-semibold text-slate-900">{booking.room_name}</span>.
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-slate-700">
          Tanggal
        </label>
        <input
          id="date"
          name="date"
          type="date"
          required
          min={todayISO()}
          defaultValue={booking.date}
          className={`mt-1.5 ${inputClass}`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-slate-700">
            Jam Mulai
          </label>
          <input
            id="startTime"
            name="startTime"
            type="time"
            required
            defaultValue={booking.start_time}
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-slate-700">
            Jam Selesai
          </label>
          <input
            id="endTime"
            name="endTime"
            type="time"
            required
            defaultValue={booking.end_time}
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="purpose" className="block text-sm font-medium text-slate-700">
          Tujuan / Keperluan
        </label>
        <textarea
          id="purpose"
          name="purpose"
          rows={3}
          required
          defaultValue={booking.purpose}
          className={`mt-1.5 ${inputClass}`}
        />
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton className="w-auto px-6">Simpan Perubahan</SubmitButton>
        <Link
          href="/bookings"
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
