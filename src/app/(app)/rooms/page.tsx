import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { isRoomOccupiedNow, listRooms } from "@/lib/queries";
import { AvailabilityBadge } from "@/components/availability-badge";

export const metadata = { title: "Daftar Ruangan — IDB Bali" };

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireUser();
  const { q } = await searchParams;
  const rooms = listRooms(q);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Daftar Ruangan</h1>
        <p className="mt-1 text-sm text-slate-500">
          Pilih ruangan yang tersedia untuk diajukan peminjamannya.
        </p>
      </div>

      <form method="GET" action="/rooms" className="mb-6 flex gap-2">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Cari nama atau lokasi ruangan..."
          className="block w-full max-w-sm rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-500"
        >
          Cari
        </button>
        {q ? (
          <Link
            href="/rooms"
            className="inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Reset
          </Link>
        ) : null}
      </form>

      {rooms.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          Belum ada ruangan yang terdaftar.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => {
            const facilities = JSON.parse(room.facilities || "[]") as string[];
            return (
              <div
                key={room.id}
                className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-20 items-center justify-between bg-gradient-to-r from-[#024d71] to-[#007c91] px-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 text-white">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                    </svg>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-500 px-2.5 py-1 text-xs font-semibold text-white">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                    {room.capacity} orang
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-semibold text-slate-900">{room.name}</h2>
                    <AvailabilityBadge occupied={isRoomOccupiedNow(room.id)} />
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {room.location}
                  </p>

                  {room.description ? (
                    <p className="mt-3 line-clamp-2 text-sm text-slate-600">{room.description}</p>
                  ) : null}

                  {facilities.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {facilities.slice(0, 4).map((f) => (
                        <span
                          key={f}
                          className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700"
                        >
                          {f}
                        </span>
                      ))}
                      {facilities.length > 4 ? (
                        <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                          +{facilities.length - 4}
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                    <Link
                      href={`/rooms/${room.id}`}
                      className="text-sm font-medium text-brand-600 hover:text-brand-500"
                    >
                      Lihat detail
                    </Link>
                    <Link
                      href={`/rooms/${room.id}#pinjam`}
                      className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500"
                    >
                      Pinjam
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
