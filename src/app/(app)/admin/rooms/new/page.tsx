import { requireAdmin } from "@/lib/auth";
import { createRoom } from "@/lib/actions/rooms";
import { RoomForm } from "@/components/room-form";

export const metadata = { title: "Tambah Ruangan — IDB Bali" };

export default async function NewRoomPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Tambah Ruangan</h1>
        <p className="mt-1 text-sm text-slate-500">Tambahkan data ruangan baru ke sistem.</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <RoomForm action={createRoom} />
      </div>
    </div>
  );
}
