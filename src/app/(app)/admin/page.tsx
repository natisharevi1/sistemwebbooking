import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import {
  countRooms,
  countPendingBookings,
  countApprovedBookings,
  countUsers,
  listAllBookings,
} from "@/lib/queries";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, formatTime } from "@/lib/format";

export const metadata = { title: "Dashboard Admin — IDB Bali" };

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const rooms = countRooms();
  const pending = countPendingBookings();
  const approved = countApprovedBookings();
  const users = countUsers();
  const allBookings = listAllBookings();

  const stats = [
    {
      label: "Total Ruangan",
      value: rooms,
      href: "/admin/rooms",
      tone: "bg-brand-50 text-brand-600",
    },
    {
      label: "Menunggu Persetujuan",
      value: pending,
      href: "/admin/bookings",
      tone: "bg-amber-50 text-amber-600",
    },
    {
      label: "Peminjaman Disetujui",
      value: approved,
      href: "/admin/bookings",
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total Peminjaman",
      value: allBookings.length,
      href: "/admin/bookings",
      tone: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Total Pengguna",
      value: users,
      href: "/admin/users",
      tone: "bg-slate-100 text-slate-600",
    },
  ];

  const recentPending = allBookings.filter((b) => b.status === "PENDING").slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl">
      {/* Welcome hero */}
      <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#024d71] to-[#007c91] p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Dashboard Admin</h1>
            <p className="mt-1 text-sm text-white/80">
              Ringkasan pengelolaan ruangan dan peminjaman. Halo, {session.name}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/rooms/new"
              className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-600"
            >
              + Tambah Ruangan
            </Link>
            <Link
              href="/admin/laporan"
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-white/30 hover:bg-white/20"
            >
              Unduh Laporan
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${s.tone}`}>
              <span className="text-lg font-semibold">{s.value}</span>
            </div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent pending */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Pengajuan Terbaru</h2>
          <Link href="/admin/bookings" className="text-sm font-medium text-brand-600 hover:text-brand-500">
            Lihat semua
          </Link>
        </div>

        {recentPending.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
            Tidak ada pengajuan yang menunggu persetujuan.
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
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentPending.map((b) => (
                  <tr key={b.id}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{b.user_name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{b.room_name}</td>
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
