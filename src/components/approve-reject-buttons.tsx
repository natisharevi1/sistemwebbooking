"use client";

import { useState } from "react";
import { approveBooking, rejectBooking } from "@/lib/actions/admin";

export function ApproveRejectButtons({ bookingId }: { bookingId: number }) {
  const [showReject, setShowReject] = useState(false);

  return (
    <div className="flex items-center justify-end gap-1">
      <form action={approveBooking}>
        <input type="hidden" name="bookingId" value={bookingId} />
        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-500"
        >
          Setujui
        </button>
      </form>
      {showReject ? (
        <form
          action={rejectBooking}
          onSubmit={() => setShowReject(false)}
          className="flex items-center gap-1"
        >
          <input type="hidden" name="bookingId" value={bookingId} />
          <input
            name="note"
            placeholder="Alasan penolakan"
            className="w-44 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-rose-500"
          >
            Tolak
          </button>
          <button
            type="button"
            onClick={() => setShowReject(false)}
            className="rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
          >
            Batal
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowReject(true)}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
        >
          Tolak
        </button>
      )}
    </div>
  );
}
