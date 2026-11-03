import Image from "next/image";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { HERO_IMAGES } from "@/lib/hero-images";

const FEATURES = [
  "Jadwal & kalender real-time",
  "Persetujuan peminjaman cepat",
  "Kelola ruangan & pengguna",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f6f9fb]">
      {/* Panel kiri — hero + branding */}
      <div className="relative hidden w-1/2 overflow-hidden md:block lg:w-3/5">
        <HeroSlideshow images={HERO_IMAGES} />
        <div className="absolute inset-0 bg-gradient-to-br from-[#012c42]/95 via-[#024d71]/75 to-[#012c42]/45" />

        <div className="relative z-10 flex h-full flex-col justify-between p-10 lg:p-14">
          <div className="flex items-center gap-3">
            <div className="overflow-hidden rounded-xl ring-2 ring-white/70">
              <Image
                src="/logo.jpg"
                alt="Logo IDB Bali"
                width={44}
                height={44}
                className="h-11 w-11 object-cover"
              />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-semibold text-white">
                IDB Bali<span className="text-accent-500">.</span>
              </div>
              <div className="text-xs text-white/70">Institut Desain dan Bisnis Bali</div>
            </div>
          </div>

          <div className="max-w-md">
            <div className="h-1 w-12 rounded-full bg-accent-500" />
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-white lg:text-4xl">
              Sistem Peminjaman Ruangan
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Kelola reservasi ruangan kampus dengan mudah, cepat, dan terorganisir dalam
              satu platform.
            </p>
            <ul className="mt-6 space-y-2.5">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-white/90">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-500 text-white">
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-xs text-white/60">
            © {new Date().getFullYear()} Institut Desain dan Bisnis Bali
          </div>
        </div>
      </div>

      {/* Panel kanan — form */}
      <div className="flex flex-1 flex-col">
        {/* Hero ringkas untuk layar kecil */}
        <div className="relative h-56 w-full overflow-hidden md:hidden">
          <HeroSlideshow images={HERO_IMAGES} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#012c42]/80 to-[#f6f9fb]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="overflow-hidden rounded-full ring-2 ring-white/80">
              <Image
                src="/logo.jpg"
                alt="Logo IDB Bali"
                width={64}
                height={64}
                className="h-16 w-16 object-cover"
              />
            </div>
            <h1 className="mt-2 text-xl font-semibold text-white">
              IDB Bali<span className="text-accent-500">.</span>
            </h1>
            <p className="text-xs text-white/85">Sistem Peminjaman Ruangan</p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-10">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
