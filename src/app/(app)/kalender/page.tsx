import { requireUser } from "@/lib/auth";
import { listAllBookings, listBookingsForUser } from "@/lib/queries";
import { Calendar, type CalendarBooking } from "@/components/calendar";

export const metadata = { title: "Kalender — IDB Bali" };

export default async function KalenderPage() {
  const session = await requireUser();
  const bookings =
    session.role === "ADMIN"
      ? listAllBookings()
      : listBookingsForUser(session.id);

  const items: CalendarBooking[] = bookings.map((b) => ({
    id: b.id,
    date: b.date,
    start_time: b.start_time,
    end_time: b.end_time,
    room_name: b.room_name,
    status: b.status,
    user_name: session.role === "ADMIN" ? b.user_name : undefined,
  }));

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Kalender Peminjaman</h1>
        <p className="mt-1 text-sm text-slate-500">
          {session.role === "ADMIN"
            ? "Lihat seluruh jadwal peminjaman ruangan per tanggal."
            : "Lihat jadwal peminjaman ruangan Anda."}
        </p>
      </div>

      <Calendar bookings={items} />
    </div>
  );
}
