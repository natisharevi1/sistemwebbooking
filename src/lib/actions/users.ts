"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import type { Role } from "@/lib/db";

export async function updateUserRole(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const id = Number(formData.get("id"));
  const role = String(formData.get("role")) as Role;

  if (!id || (role !== "ADMIN" && role !== "USER")) return;
  if (id === admin.id) return;

  db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, id);

  revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const id = Number(formData.get("id"));
  if (!id || id === admin.id) return;

  db.prepare("DELETE FROM users WHERE id = ?").run(id);

  revalidatePath("/admin/users");
}
