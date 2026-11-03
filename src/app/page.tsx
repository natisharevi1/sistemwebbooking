import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { listRooms, isRoomOccupiedNow } from "@/lib/queries";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { AvailabilityBadge } from "@/components/availability-badge";
import { HERO_IMAGES } from "@/lib/hero-images";

const FEATURES = [
  {
    title: "Kalender & Jadwal",
    desc: "Lihat jadwal peminjaman ruangan per tanggal dengan kalender visual.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    title: "Persetujuan Cepat",
    desc: "Admin meninjau dan menyetujui pengajuan peminjaman dengan mudah.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Kelola Ruangan",
    desc: "Tambah dan atur ruangan beserta fasilitas dan kapasitasnya.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    title: "Laporan & Data",
    desc: "Unduh laporan peminjaman dalam format CSV kapan pun dibutuhkan.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v7.5m-18 0V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-4.5m-18 0h18M12 7.5v6m0 0l-3-3m3 3l3-3" />
      </svg>
    ),
  },
];

export default async function Home() {
  const session = await getSession();
  const rooms = listRooms().slice(0, 6);
  const dashboardHref = session
    ? session.role === "ADMIN"
      ? "/admin"
      : "/dashboard"
    : "/login";

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="overflow-hidden rounded-lg ring-1 ring-slate-200">
              <Image src="/logo.jpg" alt="Logo IDB Bali" width={36} height={36} className="h-9 w-9 object-cover" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">
                IDB Bali<span className="text-accent-600">.</span>
              </div>
              <div className="text-[11px] text-slate-500">Peminjaman Ruangan</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#beranda" className="hover:text-slate-900">Beranda</a>
            <a href="#fitur" className="hover:text-slate-900">Fitur</a>
            <a href="#ruangan" className="hover:text-slate-900">Ruangan</a>
          </nav>

          <div className="flex items-center gap-2">
            {session ? (
              <Link
                href={dashboardHref}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500"
              >
                Buka Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="beranda" className="relative h-[30rem] w-full overflow-hidden md:h-[34rem]">
        <HeroSlideshow images={HERO_IMAGES} />
        <div className="absolute inset-0 bg-gradient-to-br from-[#012c42]/95 via-[#024d71]/80 to-[#012c42]/50" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 text-center">
          <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white ring-1 ring-inset ring-white/25 backdrop-blur">
            Institut Desain dan Bisnis Bali
          </span>
          <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight text-white md:text-5xl">
            Kelola Peminjaman Ruangan Kampus dengan Mudah
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
            Ajukan peminjaman, pantau jadwal, dan kelola ruangan dalam satu platform
            yang rapi dan terorganisir.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#ruangan"
              className="rounded-lg bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-600"
            >
              Lihat Ruangan
            </a>
            <Link
              href={session ? dashboardHref : "/register"}
              className="rounded-lg bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/30 backdrop-blur transition-colors hover:bg-white/20"
            >
              {session ? "Buka Dashboard" : "Daftar Sekarang"}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">Fitur Utama</h2>
          <p className="mt-2 text-sm text-slate-500">
            Semua yang Anda butuhkan untuk mengelola peminjaman ruangan.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                {f.icon}
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rooms preview */}
      <section id="ruangan" className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">Ruangan Kampus</h2>
              <p className="mt-2 text-sm text-slate-500">
                Beberapa ruangan yang tersedia untuk dipinjam.
              </p>
            </div>
            <Link
              href={session ? "/rooms" : "/login"}
              className="hidden text-sm font-medium text-brand-600 hover:text-brand-500 sm:block"
            >
              Lihat semua →
            </Link>
          </div>

          {rooms.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada ruangan yang terdaftar.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => {
                const facilities = JSON.parse(room.facilities || "[]") as string[];
                return (
                  <div
                    key={room.id}
                    className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="flex h-16 items-center justify-between bg-gradient-to-r from-[#024d71] to-[#007c91] px-5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-white">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                        </svg>
                      </div>
                      <span className="rounded-full bg-accent-500 px-2.5 py-1 text-xs font-semibold text-white">
                        {room.capacity} orang
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-semibold text-slate-900">{room.name}</h3>
                        <AvailabilityBadge occupied={isRoomOccupiedNow(room.id)} />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{room.location}</p>
                      {facilities.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {facilities.slice(0, 3).map((f) => (
                            <span key={f} className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                              {f}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <div className="mt-auto pt-4">
                        <Link
                          href={session ? `/rooms/${room.id}#pinjam` : "/login"}
                          className="block rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-brand-500"
                        >
                          Pinjam Ruangan
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#012c42] py-10 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="overflow-hidden rounded-lg ring-1 ring-white/30">
              <Image src="/logo.jpg" alt="Logo IDB Bali" width={36} height={36} className="h-9 w-9 object-cover" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">
                IDB Bali<span className="text-accent-500">.</span>
              </div>
              <div className="text-[11px] text-white/70">Peminjaman Ruangan</div>
            </div>
          </div>
          <p className="text-xs text-white/60">
            Jl. Tukad Batanghari No. 29, Panjer, Denpasar, Bali
          </p>
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} Institut Desain dan Bisnis Bali
          </p>
        </div>
      </footer>
    </div>
  );
}
