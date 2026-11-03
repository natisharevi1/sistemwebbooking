import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listBookingsForUser } from "@/lib/queries";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, formatTime } from "@/lib/format";

export const metadata = { title: "Dashboard — IDB Bali" };

function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default async function DashboardPage() {
  const session = await requireUser();
  const bookings = listBookingsForUser(session.id);

  const pending = bookings.filter((b) => b.status === "PENDING").length;
  const approved = bookings.filter((b) => b.status === "APPROVED").length;
  const rejected = bookings.filter((b) => b.status === "REJECTED").length;

  const upcoming = bookings
    .filter((b) => b.status !== "REJECTED" && b.date >= todayISO())
    .sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time))
    .slice(0, 5);

  const stats = [
    {
      label: "Total Pengajuan",
      value: bookings.length,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      tone: "bg-brand-50 text-brand-600",
    },
    {
      label: "Menunggu Persetujuan",
      value: pending,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      tone: "bg-amber-50 text-amber-600",
    },
    {
      label: "Disetujui",
      value: approved,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Ditolak",
      value: rejected,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      tone: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {/* Welcome hero */}
      <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#024d71] to-[#007c91] p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Selamat datang, {session.name}
            </h1>
            <p className="mt-1 text-sm text-white/80">
              Kelola peminjaman ruangan Anda di satu tempat.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/rooms"
              className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-600"
            >
              + Ajukan Peminjaman
            </Link>
            <Link
              href="/kalender"
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-white/30 hover:bg-white/20"
            >
              Lihat Kalender
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${s.tone}`}>
              {s.icon}
            </div>
            <div>
              <div className="text-sm text-slate-500">{s.label}</div>
              <div className="text-2xl font-semibold text-slate-900">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Peminjaman Mendatang</h2>
          <Link href="/bookings" className="text-sm font-medium text-brand-600 hover:text-brand-500">
            Lihat semua →
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-sm text-slate-500">Tidak ada peminjaman mendatang.</p>
            <Link href="/rooms" className="mt-2 inline-block text-sm font-medium text-brand-600 hover:text-brand-500">
              Ajukan peminjaman sekarang
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-slate-900">{b.room_name}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{formatDate(b.date)}</div>
                  <div className="text-xs text-slate-500">
                    {formatTime(b.start_time)} – {formatTime(b.end_time)}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <StatusBadge status={b.status} />
                  {b.status === "APPROVED" ? (
                    <a
                      href={`/api/bookings/${b.id}/surat`}
                      className="text-xs font-medium text-brand-600 hover:text-brand-500"
                    >
                      Unduh Surat
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent table */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Peminjaman Terbaru</h2>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-sm text-slate-500">Belum ada peminjaman.</p>
            <Link href="/rooms" className="mt-1 text-sm font-medium text-brand-600 hover:text-brand-500">
              Lihat daftar ruangan
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
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{b.room_name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{formatDate(b.date)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {formatTime(b.start_time)} – {formatTime(b.end_time)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
