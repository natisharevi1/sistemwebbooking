import Link from "next/link";
import { LoginForm } from "@/components/auth-form";

export const metadata = { title: "Masuk — IDB Bali" };

export default function LoginPage() {
  return (
    <>
      <h2 className="mb-1 text-lg font-semibold text-slate-900">Masuk ke Akun</h2>
      <p className="mb-6 text-sm text-slate-500">
        Masuk untuk mengelola peminjaman ruangan Anda.
      </p>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-slate-500">
        Belum punya akun?{" "}
        <Link href="/register" className="font-medium text-brand-600 hover:text-brand-500">
          Daftar di sini
        </Link>
      </p>
    </>
  );
}
