"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import type { Session } from "@/lib/auth";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const icons = {
  dashboard: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  building: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  ),
  calendar: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  check: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  users: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  user: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  report: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v7.5m-18 0V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-4.5m-18 0h18M12 7.5v6m0 0l-3-3m3 3l3-3" />
    </svg>
  ),
};

function navFor(session: Session): NavItem[] {
  if (session.role === "ADMIN") {
    return [
      { href: "/admin", label: "Dashboard Admin", icon: icons.dashboard },
      { href: "/admin/rooms", label: "Kelola Ruangan", icon: icons.building },
      { href: "/admin/bookings", label: "Persetujuan", icon: icons.check },
      { href: "/admin/users", label: "Kelola Pengguna", icon: icons.users },
      { href: "/admin/laporan", label: "Laporan", icon: icons.report },
      { href: "/rooms", label: "Lihat Ruangan", icon: icons.calendar },
      { href: "/kalender", label: "Kalender", icon: icons.calendar },
      { href: "/profile", label: "Profil", icon: icons.user },
    ];
  }
  return [
    { href: "/dashboard", label: "Dashboard", icon: icons.dashboard },
    { href: "/rooms", label: "Daftar Ruangan", icon: icons.building },
    { href: "/bookings", label: "Peminjaman Saya", icon: icons.calendar },
    { href: "/kalender", label: "Kalender", icon: icons.calendar },
    { href: "/profile", label: "Profil", icon: icons.user },
  ];
}

export function Sidebar({ session }: { session: Session }) {
  const pathname = usePathname();
  const items = navFor(session);

  return (
    <aside className="hidden h-full w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-14 items-center border-b border-slate-200 px-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
            {session.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-medium text-slate-900">{session.name}</div>
            <div className="truncate text-xs text-slate-500">{session.email}</div>
          </div>
        </div>
        <form action={logout} className="mt-2">
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            Keluar
          </button>
        </form>
      </div>
    </aside>
  );
}

export function MobileNav({ session }: { session: Session }) {
  const pathname = usePathname();
  const items = navFor(session);

  return (
    <header className="sticky top-16 z-30 border-b border-slate-200 bg-white lg:hidden sm:top-20">
      <div className="flex h-14 items-center justify-between px-4">
        <span className="truncate text-sm font-medium text-slate-700">{session.name}</span>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Keluar
          </button>
        </form>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-2">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
