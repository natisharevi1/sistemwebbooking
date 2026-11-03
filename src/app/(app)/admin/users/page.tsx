import { requireAdmin } from "@/lib/auth";
import { listUsers } from "@/lib/queries";
import { RoleSelect, DeleteUserButton } from "@/components/user-actions";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Kelola Pengguna — IDB Bali" };

export default async function AdminUsersPage() {
  const session = await requireAdmin();
  const users = listUsers();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Kelola Pengguna</h1>
        <p className="mt-1 text-sm text-slate-500">
          Lihat daftar pengguna, ubah peran, atau hapus akun.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Nama
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Terdaftar
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Peran
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {users.map((u) => {
              const isSelf = u.id === session.id;
              return (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-slate-900">
                        {u.name}
                        {isSelf ? (
                          <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                            Anda
                          </span>
                        ) : null}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{u.email}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {formatDate(u.created_at.slice(0, 10))}
                  </td>
                  <td className="px-4 py-3">
                    <RoleSelect userId={u.id} currentRole={u.role} disabled={isSelf} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isSelf ? (
                      <span className="text-xs text-slate-400">—</span>
                    ) : (
                      <DeleteUserButton userId={u.id} userName={u.name} />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
