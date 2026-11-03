"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function approveBooking(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("bookingId"));
  if (!id) return;

  db.prepare("UPDATE bookings SET status = 'APPROVED', note = '' WHERE id = ?").run(id);

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  revalidatePath("/bookings");
  revalidatePath("/dashboard");
}

export async function rejectBooking(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("bookingId"));
  const note = String(formData.get("note") ?? "").trim();
  if (!id) return;

  db.prepare("UPDATE bookings SET status = 'REJECTED', note = ? WHERE id = ?").run(
    note || "Ditolak oleh admin",
    id
  );

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  revalidatePath("/bookings");
  revalidatePath("/dashboard");
}
