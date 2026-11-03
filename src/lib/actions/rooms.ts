"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import type { ActionState } from "@/lib/action-state";

export async function createRoom(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const capacity = Number(formData.get("capacity") ?? 0);
  const description = String(formData.get("description") ?? "").trim();
  const facilitiesRaw = String(formData.get("facilities") ?? "").trim();

  if (!name || !location) {
    return { error: "Nama dan lokasi ruangan wajib diisi." };
  }
  if (!Number.isInteger(capacity) || capacity <= 0) {
    return { error: "Kapasitas harus berupa angka lebih dari 0." };
  }

  const facilities = facilitiesRaw
    ? facilitiesRaw
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean)
    : [];

  db.prepare(
    `INSERT INTO rooms (name, location, capacity, description, facilities)
     VALUES (?, ?, ?, ?, ?)`
  ).run(name, location, capacity, description, JSON.stringify(facilities));

  revalidatePath("/admin/rooms");
  revalidatePath("/rooms");
  return { success: "Ruangan berhasil ditambahkan." };
}

export async function updateRoom(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const capacity = Number(formData.get("capacity") ?? 0);
  const description = String(formData.get("description") ?? "").trim();
  const facilitiesRaw = String(formData.get("facilities") ?? "").trim();

  if (!id || !name || !location) {
    return { error: "Nama dan lokasi ruangan wajib diisi." };
  }
  if (!Number.isInteger(capacity) || capacity <= 0) {
    return { error: "Kapasitas harus berupa angka lebih dari 0." };
  }

  const facilities = facilitiesRaw
    ? facilitiesRaw
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean)
    : [];

  db.prepare(
    `UPDATE rooms SET name = ?, location = ?, capacity = ?, description = ?, facilities = ? WHERE id = ?`
  ).run(name, location, capacity, description, JSON.stringify(facilities), id);

  revalidatePath("/admin/rooms");
  revalidatePath("/rooms");
  revalidatePath(`/rooms/${id}`);
  return { success: "Ruangan berhasil diperbarui." };
}

export async function deleteRoom(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;

  db.prepare("DELETE FROM rooms WHERE id = ?").run(id);

  revalidatePath("/admin/rooms");
  revalidatePath("/rooms");
}
