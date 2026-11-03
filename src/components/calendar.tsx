"use client";

import { useMemo, useState } from "react";
import type { BookingStatus } from "@/lib/db";
import { formatTime } from "@/lib/format";

export interface CalendarBooking {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  room_name: string;
  status: BookingStatus;
  user_name?: string;
}

const statusDot: Record<BookingStatus, string> = {
  PENDING: "bg-amber-500",
  APPROVED: "bg-emerald-500",
  REJECTED: "bg-rose-500",
};

const statusText: Record<BookingStatus, string> = {
  PENDING: "text-amber-700",
  APPROVED: "text-emerald-700",
  REJECTED: "text-rose-700",
};

const statusLabel: Record<BookingStatus, string> = {
  PENDING: "Menunggu",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
};

const weekdayLabels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toISO(y: number, m: number, d: number): string {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

function todayISO(): string {
  const n = new Date();
  return toISO(n.getFullYear(), n.getMonth(), n.getDate());
}

export function Calendar({ bookings }: { bookings: CalendarBooking[] }) {
  const now = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [selected, setSelected] = useState<string | null>(null);

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarBooking[]>();
    for (const b of bookings) {
      const list = map.get(b.date) ?? [];
      list.push(b);
      map.set(b.date, list);
    }
    return map;
  }, [bookings]);

  const cells = useMemo(() => {
    const startWeekday = (new Date(view.year, view.month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const out: (number | null)[] = [];
    for (let i = 0; i < startWeekday; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(d);
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [view]);

  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const today = todayISO();
  const selectedBookings = selected ? (byDate.get(selected) ?? []) : [];

  function goTo(delta: number) {
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  function goToday() {
    const n = new Date();
    setView({ year: n.getFullYear(), month: n.getMonth() });
    setSelected(today);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold capitalize text-slate-900">{monthLabel}</h2>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={goToday}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={() => goTo(-1)}
                aria-label="Bulan sebelumnya"
                className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-slate-600 hover:bg-slate-50"
              >
                &larr;
              </button>
              <button
                type="button"
                onClick={() => goTo(1)}
                aria-label="Bulan berikutnya"
                className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-slate-600 hover:bg-slate-50"
              >
                &rarr;
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-slate-200 text-center">
            {weekdayLabels.map((w) => (
              <div
                key={w}
                className="bg-slate-50 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {w}
              </div>
            ))}
            {cells.map((day, idx) => {
              if (day === null) {
                return <div key={`e-${idx}`} className="min-h-24 bg-white" />;
              }
              const iso = toISO(view.year, view.month, day);
              const list = byDate.get(iso) ?? [];
              const isToday = iso === today;
              const isSelected = iso === selected;

              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelected(iso)}
                  className={`min-h-24 bg-white p-1 text-left align-top transition-colors hover:bg-brand-50/50 ${
                    isSelected ? "ring-2 ring-inset ring-brand-500" : ""
                  }`}
                >
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                      isToday
                        ? "bg-brand-600 text-white"
                        : "text-slate-700"
                    }`}
                  >
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {list.slice(0, 2).map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center gap-1 truncate rounded bg-slate-100 px-1 py-0.5 text-[10px] leading-tight text-slate-700"
                      >
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDot[b.status]}`} />
                        <span className="truncate">
                          {b.start_time} {b.room_name}
                        </span>
                      </div>
                    ))}
                    {list.length > 2 ? (
                      <div className="px-1 text-[10px] font-medium text-slate-500">
                        +{list.length - 2} lagi
                      </div>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            {selected ? "Jadwal Terpilih" : "Pilih Tanggal"}
          </h2>
          {!selected ? (
            <p className="text-sm text-slate-500">
              Klik salah satu tanggal di kalender untuk melihat jadwal peminjamannya.
            </p>
          ) : selectedBookings.length === 0 ? (
            <p className="text-sm text-slate-500">
              Tidak ada peminjaman pada tanggal tersebut.
            </p>
          ) : (
            <ul className="space-y-3">
              {selectedBookings
                .slice()
                .sort((a, b) => a.start_time.localeCompare(b.start_time))
                .map((b) => (
                  <li key={b.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900">{b.room_name}</span>
                      <span className={`text-xs font-medium ${statusText[b.status]}`}>
                        {statusLabel[b.status]}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {formatTime(b.start_time)} – {formatTime(b.end_time)}
                    </div>
                    {b.user_name ? (
                      <div className="mt-1 text-xs text-slate-500">Pemohon: {b.user_name}</div>
                    ) : null}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
