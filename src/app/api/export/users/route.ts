import { getSession } from "@/lib/auth";
import { usersCsv } from "@/lib/export";

export async function GET() {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });
  if (session.role !== "ADMIN") return new Response("Forbidden", { status: 403 });

  return new Response(usersCsv(), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="pengguna.csv"',
    },
  });
}
