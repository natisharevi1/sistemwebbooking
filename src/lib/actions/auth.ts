"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  createSession,
  destroySession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import type { ActionState } from "@/lib/action-state";
import type { User } from "@/lib/db";

export async function register(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!name || !email || !password) {
    return { error: "Nama, email, dan kata sandi wajib diisi." };
  }
  if (password.length < 6) {
    return { error: "Kata sandi minimal 6 karakter." };
  }
  if (password !== confirm) {
    return { error: "Konfirmasi kata sandi tidak cocok." };
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email) as
    | { id: number }
    | undefined;
  if (existing) {
    return { error: "Email sudah terdaftar. Silakan masuk." };
  }

  const result = db
    .prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'USER')")
    .run(name, email, hashPassword(password));

  await createSession({
    id: Number(result.lastInsertRowid),
    name,
    email,
    role: "USER",
  });

  redirect("/dashboard");
}

export async function login(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi." };
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as
    | User
    | undefined;

  if (!user || !verifyPassword(password, user.password)) {
    return { error: "Email atau kata sandi salah." };
  }

  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  redirect(user.role === "ADMIN" ? "/admin" : "/dashboard");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/login");
}
