"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import type { ActionState } from "@/lib/action-state";
import type { Booking, Room } from "@/lib/db";

function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function hasConflict(
  roomId: number,
  date: string,
  startTime: string,
  endTime: string,
  excludeId?: number
): boolean {
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);

  const rows = db
    .prepare(
      `SELECT start_time, end_time FROM bookings
       WHERE room_id = ? AND date = ? AND status != 'REJECTED' AND id != ?`
    )
    .all(roomId, date, excludeId ?? -1) as { start_time: string; end_time: string }[];

  return rows.some((row) => {
    const s = toMinutes(row.start_time);
    const e = toMinutes(row.end_time);
    return start < e && end > s;
  });
}

export async function createBooking(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const roomId = Number(formData.get("roomId"));
  const date = String(formData.get("date") ?? "").trim();
  const startTime = String(formData.get("startTime") ?? "").trim();
  const endTime = String(formData.get("endTime") ?? "").trim();
  const purpose = String(formData.get("purpose") ?? "").trim();

  if (!roomId || !date || !startTime || !endTime) {
    return { error: "Semua kolom peminjaman wajib diisi." };
  }

  const room = db.prepare("SELECT id FROM rooms WHERE id = ?").get(roomId) as
    | Room
    | undefined;
  if (!room) {
    return { error: "Ruangan tidak ditemukan." };
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const timeRegex = /^\d{2}:\d{2}$/;
  if (!dateRegex.test(date)) {
    return { error: "Format tanggal tidak valid." };
  }
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    return { error: "Format jam tidak valid." };
  }
  if (date < todayISO()) {
    return { error: "Tanggal tidak boleh di masa lalu." };
  }
  if (toMinutes(startTime) >= toMinutes(endTime)) {
    return { error: "Jam selesai harus lebih besar dari jam mulai." };
  }

  if (hasConflict(roomId, date, startTime, endTime)) {
    return { error: "Jadwal bentrok dengan peminjaman lain pada tanggal tersebut." };
  }

  db.prepare(
    `INSERT INTO bookings (user_id, room_id, date, start_time, end_time, purpose, status)
     VALUES (?, ?, ?, ?, ?, ?, 'PENDING')`
  ).run(user.id, roomId, date, startTime, endTime, purpose);

  revalidatePath("/bookings");
  revalidatePath(`/rooms/${roomId}`);
  return { success: "Pengajuan peminjaman berhasil dikirim dan menunggu persetujuan admin." };
}

export async function updateBooking(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const bookingId = Number(formData.get("bookingId"));
  const date = String(formData.get("date") ?? "").trim();
  const startTime = String(formData.get("startTime") ?? "").trim();
  const endTime = String(formData.get("endTime") ?? "").trim();
  const purpose = String(formData.get("purpose") ?? "").trim();

  if (!bookingId || !date || !startTime || !endTime) {
    return { error: "Semua kolom peminjaman wajib diisi." };
  }

  const booking = db
    .prepare("SELECT * FROM bookings WHERE id = ?")
    .get(bookingId) as Booking | undefined;

  if (!booking || booking.user_id !== user.id) {
    return { error: "Peminjaman tidak ditemukan." };
  }
  if (booking.status !== "PENDING") {
    return { error: "Hanya peminjaman berstatus menunggu yang dapat diubah." };
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const timeRegex = /^\d{2}:\d{2}$/;
  if (!dateRegex.test(date)) {
    return { error: "Format tanggal tidak valid." };
  }
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    return { error: "Format jam tidak valid." };
  }
  if (date < todayISO()) {
    return { error: "Tanggal tidak boleh di masa lalu." };
  }
  if (toMinutes(startTime) >= toMinutes(endTime)) {
    return { error: "Jam selesai harus lebih besar dari jam mulai." };
  }

  if (hasConflict(booking.room_id, date, startTime, endTime, bookingId)) {
    return { error: "Jadwal bentrok dengan peminjaman lain pada tanggal tersebut." };
  }

  db.prepare(
    "UPDATE bookings SET date = ?, start_time = ?, end_time = ?, purpose = ? WHERE id = ?"
  ).run(date, startTime, endTime, purpose, bookingId);

  revalidatePath("/bookings");
  revalidatePath(`/rooms/${booking.room_id}`);
  return { success: "Peminjaman berhasil diperbarui." };
}

export async function cancelBooking(formData: FormData): Promise<void> {
  const user = await requireUser();
  const bookingId = Number(formData.get("bookingId"));

  if (!bookingId) return;

  const booking = db
    .prepare("SELECT id, user_id, status FROM bookings WHERE id = ?")
    .get(bookingId) as Pick<Booking, "id" | "user_id" | "status"> | undefined;

  if (!booking || booking.user_id !== user.id) return;

  db.prepare("DELETE FROM bookings WHERE id = ?").run(bookingId);

  revalidatePath("/bookings");
  revalidatePath("/admin/bookings");
  revalidatePath("/dashboard");
}
