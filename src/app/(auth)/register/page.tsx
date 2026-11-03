import Link from "next/link";
import { RegisterForm } from "@/components/auth-form";

export const metadata = { title: "Daftar — IDB Bali" };

export default function RegisterPage() {
  return (
    <>
      <h2 className="mb-1 text-lg font-semibold text-slate-900">Buat Akun Baru</h2>
      <p className="mb-6 text-sm text-slate-500">
        Daftar untuk mulai mengajukan peminjaman ruangan.
      </p>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-slate-500">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:text-brand-500">
          Masuk di sini
        </Link>
      </p>
    </>
  );
}
