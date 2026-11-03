"use client";

import { useActionState } from "react";
import Link from "next/link";
import { SubmitButton } from "@/components/submit-button";
import type { ActionState } from "@/lib/action-state";
import type { Room } from "@/lib/db";

const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

interface Props {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  room?: Room;
}

export function RoomForm({ action, room }: Props) {
  const [state, formAction] = useActionState(action, {} as ActionState);
  const facilities = room
    ? (JSON.parse(room.facilities || "[]") as string[]).join(", ")
    : "";

  return (
    <form action={formAction} className="space-y-5">
      {room ? <input type="hidden" name="id" value={room.id} /> : null}

      {state.error ? (
        <div className="rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 ring-1 ring-inset ring-rose-600/20">
          {state.error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            Nama Ruangan
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={room?.name ?? ""}
            placeholder="Contoh: Ruang Rapat Utama"
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate-700">
            Lokasi
          </label>
          <input
            id="location"
            name="location"
            type="text"
            required
            defaultValue={room?.location ?? ""}
            placeholder="Contoh: Lantai 2 - Gedung A"
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-slate-700">
            Kapasitas (orang)
          </label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min={1}
            required
            defaultValue={room?.capacity ?? 20}
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">
            Deskripsi
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={room?.description ?? ""}
            placeholder="Deskripsi singkat ruangan"
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="facilities" className="block text-sm font-medium text-slate-700">
            Fasilitas
          </label>
          <input
            id="facilities"
            name="facilities"
            type="text"
            defaultValue={facilities}
            placeholder="Pisahkan dengan koma, contoh: Proyektor, AC, WiFi"
            className={`mt-1.5 ${inputClass}`}
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Pisahkan setiap fasilitas dengan tanda koma (,).
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton className="w-auto px-6">
          {room ? "Simpan Perubahan" : "Tambah Ruangan"}
        </SubmitButton>
        <Link
          href="/admin/rooms"
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
