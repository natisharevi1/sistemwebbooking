import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { hashPassword } from "./password";

const isServerless = process.env.VERCEL === "1";
const dataDir = isServerless
  ? path.join(tmpdir(), "natis-data")
  : path.join(process.cwd(), "data");
mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "natis.db");

const db = new DatabaseSync(dbPath);

db.exec("PRAGMA busy_timeout = 5000;");
db.exec("PRAGMA foreign_keys = ON;");

db.exec(`  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    facilities TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    purpose TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    note TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_bookings_room_date ON bookings (room_id, date);
  CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings (user_id);
`);

export type Role = "ADMIN" | "USER";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  created_at: string;
}

export interface Room {
  id: number;
  name: string;
  location: string;
  capacity: number;
  description: string;
  facilities: string;
  created_at: string;
}

export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Booking {
  id: number;
  user_id: number;
  room_id: number;
  date: string;
  start_time: string;
  end_time: string;
  purpose: string;
  status: BookingStatus;
  note: string;
  created_at: string;
}

export interface BookingWithDetails extends Booking {
  room_name: string;
  room_location: string;
  user_name: string;
  user_email: string;
}

function seed() {
  db.exec("BEGIN IMMEDIATE");
  try {
    const userCount = db.prepare("SELECT COUNT(*) AS c FROM users").get() as {
      c: number;
    };
    if (userCount.c === 0) {
      const insertUser = db.prepare(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
      );
      insertUser.run("Administrator", "admin@natis.id", hashPassword("admin123"), "ADMIN");
      insertUser.run("Budi Santoso", "user@natis.id", hashPassword("user123"), "USER");
    }

    const roomCount = db.prepare("SELECT COUNT(*) AS c FROM rooms").get() as {
      c: number;
    };
    if (roomCount.c === 0) {
      const insertRoom = db.prepare(
        "INSERT INTO rooms (name, location, capacity, description, facilities) VALUES (?, ?, ?, ?, ?)"
      );
      insertRoom.run(
        "Ruang Rapat Utama",
        "Lantai 1 - Gedung A",
        20,
        "Ruang rapat utama dengan meja panjang, cocok untuk rapat koordinasi dan presentasi tim.",
        JSON.stringify(["Proyektor", "AC", "WiFi", "Whiteboard"])
      );
      insertRoom.run(
        "Ruang Seminar",
        "Lantai 2 - Gedung A",
        80,
        "Ruang seminar luas dengan sound system dan kursi berjajar untuk acara formal.",
        JSON.stringify(["Proyektor", "Sound System", "AC", "WiFi", "Mikrofon"])
      );
      insertRoom.run(
        "Ruang Diskusi Kecil",
        "Lantai 1 - Gedung B",
        8,
        "Ruang kecil yang nyaman untuk diskusi kelompok atau sesi wawancara.",
        JSON.stringify(["AC", "WiFi", "TV", "Whiteboard"])
      );
      insertRoom.run(
        "Aula Serbaguna",
        "Lantai 3 - Gedung C",
        150,
        "Aula luas untuk acara besar seperti pelatihan, workshop, dan gathering.",
        JSON.stringify(["Proyektor", "Sound System", "AC", "WiFi", "Panggung"])
      );
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

seed();

export { db };
