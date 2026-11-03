import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Laporan — IDB Bali" };

const REPORTS = [
  {
    title: "Laporan Peminjaman",
    desc: "Semua data peminjaman: peminjam, ruangan, jadwal, dan status.",
    href: "/api/export/bookings",
    filename: "peminjaman.csv",
  },
  {
    title: "Laporan Ruangan",
    desc: "Daftar ruangan beserta lokasi, kapasitas, dan fasilitas.",
    href: "/api/export/rooms",
    filename: "ruangan.csv",
  },
  {
    title: "Laporan Pengguna",
    desc: "Daftar pengguna terdaftar beserta perannya.",
    href: "/api/export/users",
    filename: "pengguna.csv",
  },
];

export default async function LaporanPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Laporan & Ekspor</h1>
        <p className="mt-1 text-sm text-slate-500">
          Unduh data dalam format CSV untuk diolah lebih lanjut.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map((r) => (
          <div
            key={r.href}
            className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v7.5m-18 0V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-4.5m-18 0h18M12 7.5v6m0 0l-3-3m3 3l3-3" />
              </svg>
            </div>
            <h2 className="mt-4 text-base font-semibold text-slate-900">{r.title}</h2>
            <p className="mt-2 flex-1 text-sm text-slate-600">{r.desc}</p>
            <a
              href={r.href}
              download={r.filename}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-500"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Unduh CSV
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
