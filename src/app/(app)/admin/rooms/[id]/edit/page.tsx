import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getRoom } from "@/lib/queries";
import { updateRoom } from "@/lib/actions/rooms";
import { RoomForm } from "@/components/room-form";

export const metadata = { title: "Ubah Ruangan — IDB Bali" };

export default async function EditRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const room = getRoom(Number(id));
  if (!room) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Ubah Ruangan</h1>
        <p className="mt-1 text-sm text-slate-500">Perbarui informasi ruangan.</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <RoomForm action={updateRoom} room={room} />
      </div>
    </div>
  );
}
