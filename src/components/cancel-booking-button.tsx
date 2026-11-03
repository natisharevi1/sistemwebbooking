"use client";

import { cancelBooking } from "@/lib/actions/bookings";

export function CancelBookingButton({ bookingId }: { bookingId: number }) {
  return (
    <form
      action={cancelBooking}
      onSubmit={(e) => {
        if (!window.confirm("Batalkan peminjaman ini?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="bookingId" value={bookingId} />
      <button
        type="submit"
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
      >
        Batalkan
      </button>
    </form>
  );
}
