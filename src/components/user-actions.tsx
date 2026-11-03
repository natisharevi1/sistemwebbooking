"use client";

import { updateUserRole, deleteUser } from "@/lib/actions/users";
import type { Role } from "@/lib/db";

export function RoleSelect({
  userId,
  currentRole,
  disabled,
}: {
  userId: number;
  currentRole: Role;
  disabled: boolean;
}) {
  return (
    <form action={updateUserRole}>
      <input type="hidden" name="id" value={userId} />
      <select
        name="role"
        defaultValue={currentRole}
        disabled={disabled}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>
    </form>
  );
}

export function DeleteUserButton({
  userId,
  userName,
}: {
  userId: number;
  userName: string;
}) {
  return (
    <form
      action={deleteUser}
      onSubmit={(e) => {
        if (
          !window.confirm(
            `Hapus pengguna "${userName}"? Semua peminjamannya akan ikut terhapus.`
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={userId} />
      <button
        type="submit"
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
      >
        Hapus
      </button>
    </form>
  );
}
