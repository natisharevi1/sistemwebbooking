import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listAllBookings } from "@/lib/queries";
import { StatusBadge } from "@/components/status-badge";
import { ApproveRejectButtons } from "@/components/approve-reject-buttons";
import { formatDate, formatTime } from "@/lib/format";

import type { BookingStatus } from "@/lib/db";

export const metadata = { title: "Persetujuan Peminjaman — IDB Bali" };

const statusOptions: { value: "" | BookingStatus; label: string }[] = [
  { value: "", label: "Semua Status" },
  { value: "PENDING", label: "Menunggu" },
  { value: "APPROVED", label: "Disetujui" },
  { value: "REJECTED", label: "Ditolak" },
];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requireAdmin();
  const { status, q } = await searchParams;
  const bookings = listAllBookings({
    status: status as BookingStatus | undefined,
    q,
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Persetujuan Peminjaman</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tinjau dan setujui atau tolak pengajuan peminjaman ruangan.
        </p>
      </div>

      <form method="GET" action="/admin/bookings" className="mb-6 flex flex-wrap items-center gap-2">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Cari peminjam, ruangan, atau keperluan..."
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
            href="/admin/bookings"
            className="inline-flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Reset
          </Link>
        ) : null}
      </form>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          Belum ada pengajuan peminjaman.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Peminjam
                </th>
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
                    <div className="text-sm font-medium text-slate-900">{b.user_name}</div>
                    <div className="text-xs text-slate-500">{b.user_email}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{b.room_name}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{formatDate(b.date)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {formatTime(b.start_time)} – {formatTime(b.end_time)}
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-sm text-slate-600">
                    {b.purpose}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} />
                    {b.status === "REJECTED" && b.note ? (
                      <div className="mt-1 max-w-[180px] text-xs text-slate-500">{b.note}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {b.status === "PENDING" ? (
                      <ApproveRejectButtons bookingId={b.id} />
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
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
