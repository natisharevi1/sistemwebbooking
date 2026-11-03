import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listRooms } from "@/lib/queries";
import { DeleteRoomButton } from "@/components/delete-room-button";

export const metadata = { title: "Kelola Ruangan — IDB Bali" };

export default async function AdminRoomsPage() {
  await requireAdmin();
  const rooms = listRooms();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Kelola Ruangan</h1>
          <p className="mt-1 text-sm text-slate-500">Tambah, ubah, dan hapus data ruangan.</p>
        </div>
        <Link
          href="/admin/rooms/new"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500"
        >
          + Tambah Ruangan
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          Belum ada ruangan. Tambahkan ruangan pertama Anda.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Nama
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Lokasi
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Kapasitas
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Fasilitas
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rooms.map((room) => {
                const facilities = JSON.parse(room.facilities || "[]") as string[];
                return (
                  <tr key={room.id}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{room.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{room.location}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{room.capacity} orang</td>
                    <td className="max-w-[240px] px-4 py-3 text-sm text-slate-600">
                      {facilities.join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/rooms/${room.id}/edit`}
                          className="rounded-lg px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50"
                        >
                          Ubah
                        </Link>
                        <DeleteRoomButton roomId={room.id} roomName={room.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
