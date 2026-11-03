"use client";

import { deleteRoom } from "@/lib/actions/rooms";

export function DeleteRoomButton({ roomId, roomName }: { roomId: number; roomName: string }) {
  return (
    <form
      action={deleteRoom}
      onSubmit={(e) => {
        if (!window.confirm(`Hapus ruangan "${roomName}"? Semua jadwal peminjamannya ikut terhapus.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={roomId} />
      <button
        type="submit"
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
      >
        Hapus
      </button>
    </form>
  );
}
