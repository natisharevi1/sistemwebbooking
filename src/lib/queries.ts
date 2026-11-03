import { db } from "@/lib/db";
import type {
  BookingStatus,
  BookingWithDetails,
  Role,
  Room,
  User,
} from "@/lib/db";

export interface UserSummary {
  id: number;
  name: string;
  email: string;
  role: Role;
  created_at: string;
}

export interface BookingFilters {
  status?: BookingStatus;
  q?: string;
}

export function listRooms(search?: string): Room[] {
  if (search) {
    const q = `%${search}%`;
    return db
      .prepare(
        "SELECT * FROM rooms WHERE name LIKE ? OR location LIKE ? ORDER BY name ASC"
      )
      .all(q, q) as unknown as Room[];
  }
  return db
    .prepare("SELECT * FROM rooms ORDER BY name ASC")
    .all() as unknown as Room[];
}

export function getRoom(id: number): Room | undefined {
  return db.prepare("SELECT * FROM rooms WHERE id = ?").get(id) as unknown as
    | Room
    | undefined;
}

export function getUser(id: number): User | undefined {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as unknown as
    | User
    | undefined;
}

export function listUsers(): UserSummary[] {
  return db
    .prepare("SELECT id, name, email, role, created_at FROM users ORDER BY name ASC")
    .all() as unknown as UserSummary[];
}

export function listBookingsForUser(
  userId: number,
  filters: BookingFilters = {}
): BookingWithDetails[] {
  let sql = `SELECT b.*, r.name AS room_name, r.location AS room_location
       FROM bookings b
       JOIN rooms r ON r.id = b.room_id
       WHERE b.user_id = ?`;
  const params: (string | number)[] = [userId];

  if (filters.status) {
    sql += " AND b.status = ?";
    params.push(filters.status);
  }
  if (filters.q) {
    sql += " AND (r.name LIKE ? OR b.purpose LIKE ?)";
    const q = `%${filters.q}%`;
    params.push(q, q);
  }

  sql += " ORDER BY b.date DESC, b.start_time DESC";
  return db.prepare(sql).all(...params) as unknown as BookingWithDetails[];
}

export function listAllBookings(filters: BookingFilters = {}): BookingWithDetails[] {
  let sql = `SELECT b.*, r.name AS room_name, r.location AS room_location,
              u.name AS user_name, u.email AS user_email
       FROM bookings b
       JOIN rooms r ON r.id = b.room_id
       JOIN users u ON u.id = b.user_id`;
  const params: (string | number)[] = [];
  const where: string[] = [];

  if (filters.status) {
    where.push("b.status = ?");
    params.push(filters.status);
  }
  if (filters.q) {
    where.push("(r.name LIKE ? OR u.name LIKE ? OR u.email LIKE ? OR b.purpose LIKE ?)");
    const q = `%${filters.q}%`;
    params.push(q, q, q, q);
  }
  if (where.length) {
    sql += " WHERE " + where.join(" AND ");
  }

  sql +=
    " ORDER BY CASE b.status WHEN 'PENDING' THEN 0 WHEN 'APPROVED' THEN 1 ELSE 2 END, b.date ASC, b.start_time ASC";
  return db.prepare(sql).all(...params) as unknown as BookingWithDetails[];
}

export function listBookingsForRoom(roomId: number): BookingWithDetails[] {
  return db
    .prepare(
      `SELECT b.*, r.name AS room_name, r.location AS room_location,
              u.name AS user_name, u.email AS user_email
       FROM bookings b
       JOIN rooms r ON r.id = b.room_id
       JOIN users u ON u.id = b.user_id
       WHERE b.room_id = ?
       ORDER BY b.date ASC, b.start_time ASC`
    )
    .all(roomId) as unknown as BookingWithDetails[];
}

export function getBooking(id: number): BookingWithDetails | undefined {
  return db
    .prepare(
      `SELECT b.*, r.name AS room_name, r.location AS room_location,
              u.name AS user_name, u.email AS user_email
       FROM bookings b
       JOIN rooms r ON r.id = b.room_id
       JOIN users u ON u.id = b.user_id
       WHERE b.id = ?`
    )
    .get(id) as unknown as BookingWithDetails | undefined;
}

export function countPendingBookings(): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM bookings WHERE status = 'PENDING'")
    .get() as { c: number };
  return row.c;
}

export function countRooms(): number {
  const row = db.prepare("SELECT COUNT(*) AS c FROM rooms").get() as { c: number };
  return row.c;
}

export function countApprovedBookings(): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM bookings WHERE status = 'APPROVED'")
    .get() as { c: number };
  return row.c;
}

export function countUsers(): number {
  const row = db.prepare("SELECT COUNT(*) AS c FROM users").get() as { c: number };
  return row.c;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function isRoomOccupiedNow(roomId: number): boolean {
  const now = new Date();
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const row = db
    .prepare(
      `SELECT id FROM bookings
       WHERE room_id = ? AND date = ? AND status = 'APPROVED'
         AND start_time <= ? AND end_time > ?
       LIMIT 1`
    )
    .get(roomId, date, time, time);
  return !!row;
}
