import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listBookingsForUser } from "@/lib/queries";
import { StatusBadge } from "@/components/status-badge";
import { CancelBookingButton } from "@/components/cancel-booking-button";
import { formatDate, formatTime } from "@/lib/format";

import type { BookingStatus } from "@/lib/db";

export const metadata = { title: "Peminjaman Saya — IDB Bali" };

const statusOptions: { value: "" | BookingStatus; label: string }[] = [
  { value: "", label: "Semua Status" },
  { value: "PENDING", label: "Menunggu" },
  { value: "APPROVED", label: "Disetujui" },
  { value: "REJECTED", label: "Ditolak" },
];

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const session = await requireUser();
  const { status, q } = await searchParams;
  const bookings = listBookingsForUser(session.id, {
    status: status as BookingStatus | undefined,
    q,
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Peminjaman Saya</h1>
        <p className="mt-1 text-sm text-slate-500">
          Riwayat seluruh pengajuan peminjaman ruangan Anda.
        </p>
      </div>

      <form method="GET" action="/bookings" className="mb-6 flex flex-wrap items-center gap-2">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Cari ruangan atau keperluan..."
          className="block w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-500"
        >
          Terapkan
        </button>
        {status || q ? (
          <Link
            href="/bookings"
            className="inline-flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Reset
          </Link>
        ) : null}
      </form>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">Anda belum pernah mengajukan peminjaman.</p>
          <Link
            href="/rooms"
            className="mt-2 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500"
          >
            Ajukan Sekarang
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Ruangan
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Jam
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Keperluan
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-slate-900">{b.room_name}</div>
                    <div className="text-xs text-slate-500">{b.room_location}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{formatDate(b.date)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {formatTime(b.start_time)} – {formatTime(b.end_time)}
                  </td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-sm text-slate-600">
                    {b.purpose}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} />
                    {b.status === "REJECTED" && b.note ? (
                      <div className="mt-1 text-xs text-slate-500">{b.note}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {b.status === "APPROVED" ? (
                        <a
                          href={`/api/bookings/${b.id}/surat`}
                          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50"
                        >
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                            />
                          </svg>
                          Surat
                        </a>
                      ) : null}
                      {b.status === "PENDING" ? (
                        <Link
                          href={`/bookings/${b.id}/edit`}
                          className="rounded-lg px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50"
                        >
                          Ubah
                        </Link>
                      ) : null}
                      {b.status !== "REJECTED" ? (
                        <CancelBookingButton bookingId={b.id} />
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
