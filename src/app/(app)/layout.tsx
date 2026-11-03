import Image from "next/image";
import { requireUser } from "@/lib/auth";
import { Sidebar, MobileNav } from "@/components/sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-40 h-16 w-full bg-gradient-to-r from-[#012c42] via-[#024d71] to-[#007c91] sm:h-20">
        <div className="flex h-full items-center gap-3 px-4 sm:px-6">
          <div className="overflow-hidden rounded-lg ring-1 ring-white/60">
            <Image
              src="/logo.jpg"
              alt="Logo IDB Bali"
              width={36}
              height={36}
              className="h-9 w-9 object-cover"
            />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">
              IDB Bali<span className="text-accent-500">.</span>
            </div>
            <div className="text-[11px] text-white/75">Peminjaman Ruangan</div>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="sticky top-20 hidden h-[calc(100vh-5rem)] lg:block">
          <Sidebar session={session} />
        </div>
        <div className="flex flex-1 flex-col">
          <MobileNav session={session} />
          <main className="flex-1 px-4 py-8 sm:px-8 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
