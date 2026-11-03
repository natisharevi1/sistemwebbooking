"use client";

import { useActionState, useState } from "react";
import { createBooking } from "@/lib/actions/bookings";
import { SubmitButton } from "@/components/submit-button";
import { formatDate } from "@/lib/format";
import type { ActionState } from "@/lib/action-state";

const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} menit`;
  if (m === 0) return `${h} jam`;
  return `${h} jam ${m} menit`;
}

export function BookingForm({ roomId, roomName }: { roomId: number; roomName: string }) {
  const [state, formAction] = useActionState(createBooking, {} as ActionState);
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const hasTimes = date && start && end;
  const duration =
    hasTimes && toMinutes(end) > toMinutes(start) ? toMinutes(end) - toMinutes(start) : null;

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="roomId" value={roomId} />

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

      <div className="flex items-center gap-3 rounded-lg bg-brand-50 px-4 py-3 ring-1 ring-inset ring-brand-100">
        <svg className="h-5 w-5 shrink-0 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
        <p className="text-sm text-brand-700">
          Anda mengajukan peminjaman untuk{" "}
          <span className="font-semibold text-brand-800">{roomName}</span>.
        </p>
      </div>

      <div>
        <label htmlFor="date" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
          <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          Tanggal
        </label>
        <input
          id="date"
          name="date"
          type="date"
          required
          min={todayISO()}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Jam Mulai
          </label>
          <input
            id="startTime"
            name="startTime"
            type="time"
            required
            onChange={(e) => setStart(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="endTime" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Jam Selesai
          </label>
          <input
            id="endTime"
            name="endTime"
            type="time"
            required
            onChange={(e) => setEnd(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {hasTimes ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <div className="font-medium text-slate-900">Ringkasan</div>
          <div className="mt-1.5 space-y-1">
            <div>Tanggal: <span className="font-medium text-slate-900">{formatDate(date)}</span></div>
            <div>
              Jam: <span className="font-medium text-slate-900">{start} – {end}</span>
              {duration !== null ? (
                <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                  {formatDuration(duration)}
                </span>
              ) : null}
            </div>
            {duration === null && start && end ? (
              <div className="text-xs text-rose-600">Jam selesai harus lebih besar dari jam mulai.</div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div>
        <label htmlFor="purpose" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
          <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
          Tujuan / Keperluan
        </label>
        <textarea
          id="purpose"
          name="purpose"
          rows={3}
          required
          placeholder="Contoh: Rapat koordinasi tim produk"
          className={inputClass}
        />
      </div>

      <SubmitButton>Ajukan Peminjaman</SubmitButton>
    </form>
  );
}
