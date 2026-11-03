import { getSession } from "@/lib/auth";
import { getBooking } from "@/lib/queries";
import { renderLetterPdf } from "@/lib/letter";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const booking = getBooking(Number(id));
  if (!booking) return new Response("Peminjaman tidak ditemukan.", { status: 404 });

  if (session.role !== "ADMIN" && booking.user_id !== session.id) {
    return new Response("Forbidden", { status: 403 });
  }

  if (booking.status !== "APPROVED") {
    return new Response("Surat hanya tersedia untuk peminjaman yang telah disetujui.", {
      status: 409,
    });
  }

  const pdf = renderLetterPdf(booking);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="surat-peminjaman-${booking.id}.pdf"`,
      "Content-Length": String(pdf.length),
      "Cache-Control": "no-store",
    },
  });
}
