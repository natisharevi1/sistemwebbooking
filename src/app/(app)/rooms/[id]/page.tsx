import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getRoom, isRoomOccupiedNow, listBookingsForRoom } from "@/lib/queries";
import { BookingForm } from "@/components/booking-form";
import { StatusBadge } from "@/components/status-badge";
import { AvailabilityBadge } from "@/components/availability-badge";
import { formatDate, formatTime } from "@/lib/format";

export const metadata = { title: "Detail Ruangan — IDB Bali" };

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireUser();

  const room = getRoom(Number(id));
  if (!room) notFound();

  const facilities = JSON.parse(room.facilities || "[]") as string[];
  const schedule = listBookingsForRoom(room.id);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <Link href="/rooms" className="text-sm font-medium text-brand-600 hover:text-brand-500">
          &larr; Kembali ke daftar ruangan
        </Link>
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-[#024d71] to-[#007c91] p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">{room.name}</h1>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-white/80">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {room.location}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-accent-500 px-3 py-1 text-sm font-semibold text-white">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              {room.capacity} orang
            </span>
            <AvailabilityBadge occupied={isRoomOccupiedNow(room.id)} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {room.description ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Deskripsi</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{room.description}</p>
            </div>
          ) : null}

          {facilities.length > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Fasilitas</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {facilities.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-sm text-brand-700"
                  >
                    <svg className="h-4 w-4 text-accent-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Jadwal Ruangan</h2>
            {schedule.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                Belum ada jadwal peminjaman untuk ruangan ini.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100">
                {schedule.map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {formatDate(b.date)}
                        </div>
                        <div className="text-xs text-slate-500">
                          {formatTime(b.start_time)} – {formatTime(b.end_time)}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={b.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div id="pinjam" className="scroll-mt-24">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Ajukan Peminjaman</h2>
              <BookingForm roomId={room.id} roomName={room.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
