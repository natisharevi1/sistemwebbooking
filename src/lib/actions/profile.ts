"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSession, hashPassword, requireUser, verifyPassword } from "@/lib/auth";
import { getUser } from "@/lib/queries";
import type { ActionState } from "@/lib/action-state";

export async function updateProfile(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!name) {
    return { error: "Nama wajib diisi." };
  }

  const user = getUser(session.id);
  if (!user) {
    return { error: "Akun tidak ditemukan." };
  }

  let newHash: string | undefined;
  if (newPassword || currentPassword || confirmPassword) {
    if (!currentPassword) {
      return { error: "Masukkan kata sandi saat ini untuk mengubah kata sandi." };
    }
    if (!verifyPassword(currentPassword, user.password)) {
      return { error: "Kata sandi saat ini salah." };
    }
    if (newPassword.length < 6) {
      return { error: "Kata sandi baru minimal 6 karakter." };
    }
    if (newPassword !== confirmPassword) {
      return { error: "Konfirmasi kata sandi baru tidak cocok." };
    }
    newHash = hashPassword(newPassword);
  }

  if (newHash) {
    db.prepare("UPDATE users SET name = ?, password = ? WHERE id = ?").run(
      name,
      newHash,
      session.id
    );
  } else {
    db.prepare("UPDATE users SET name = ? WHERE id = ?").run(name, session.id);
  }

  const updated = getUser(session.id)!;
  await createSession({
    id: updated.id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
  });

  revalidatePath("/profile");
  return { success: "Profil berhasil diperbarui." };
}
