import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getBooking } from "@/lib/queries";
import { EditBookingForm } from "@/components/edit-booking-form";

export const metadata = { title: "Ubah Peminjaman — IDB Bali" };

export default async function EditBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireUser();
  const { id } = await params;

  const booking = getBooking(Number(id));
  if (!booking) notFound();
  if (booking.user_id !== session.id) redirect("/bookings");
  if (booking.status !== "PENDING") redirect("/bookings");

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Ubah Peminjaman</h1>
        <p className="mt-1 text-sm text-slate-500">
          Perbarui tanggal, jam, atau keperluan peminjaman Anda.
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <EditBookingForm
          booking={{
            id: booking.id,
            room_name: booking.room_name,
            date: booking.date,
            start_time: booking.start_time,
            end_time: booking.end_time,
            purpose: booking.purpose,
          }}
        />
      </div>
    </div>
  );
}
