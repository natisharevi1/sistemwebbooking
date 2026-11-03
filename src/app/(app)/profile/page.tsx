import { requireUser } from "@/lib/auth";
import { ProfileForm } from "@/components/profile-form";

export const metadata = { title: "Profil — IDB Bali" };

export default async function ProfilePage() {
  const session = await requireUser();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Profil Saya</h1>
        <p className="mt-1 text-sm text-slate-500">Kelola informasi akun Anda.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600 ring-1 ring-inset ring-slate-200">
          <span className="text-slate-500">Email:</span>{" "}
          <span className="font-medium text-slate-900">{session.email}</span>
          <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
            {session.role === "ADMIN" ? "Admin" : "User"}
          </span>
        </div>

        <ProfileForm initialName={session.name} />
      </div>
    </div>
  );
}
