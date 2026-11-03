import { listAllBookings, listRooms, listUsers } from "@/lib/queries";
import type { BookingStatus } from "@/lib/db";

function esc(value: unknown): string {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

function toCsv(header: string[], rows: unknown[][]): string {
  const lines = [header, ...rows].map((r) => r.map(esc).join(","));
  return "\uFEFF" + lines.join("\r\n");
}

const statusLabel: Record<BookingStatus, string> = {
  PENDING: "Menunggu",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
};

export function bookingsCsv(): string {
  const data = listAllBookings();
  return toCsv(
    ["ID", "Peminjam", "Email", "Ruangan", "Lokasi", "Tanggal", "Jam Mulai", "Jam Selesai", "Keperluan", "Status", "Catatan", "Dibuat"],
    data.map((b) => [
      b.id,
      b.user_name,
      b.user_email,
      b.room_name,
      b.room_location,
      b.date,
      b.start_time,
      b.end_time,
      b.purpose,
      statusLabel[b.status],
      b.note,
      b.created_at,
    ])
  );
}

export function roomsCsv(): string {
  const data = listRooms();
  return toCsv(
    ["ID", "Nama", "Lokasi", "Kapasitas", "Deskripsi", "Fasilitas", "Dibuat"],
    data.map((r) => [
      r.id,
      r.name,
      r.location,
      r.capacity,
      r.description,
      r.facilities,
      r.created_at,
    ])
  );
}

export function usersCsv(): string {
  const data = listUsers();
  return toCsv(
    ["ID", "Nama", "Email", "Peran", "Terdaftar"],
    data.map((u) => [u.id, u.name, u.email, u.role, u.created_at])
  );
}
