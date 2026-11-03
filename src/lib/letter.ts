import type { BookingWithDetails } from "@/lib/db";
import { formatDate, formatTime } from "@/lib/format";

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 56;
const CONTENT_W = PAGE_W - MARGIN * 2;
const LEFT = MARGIN;
const RIGHT = PAGE_W - MARGIN;
const LINE = 15;

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function longDate(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function clock(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function normalize(text: string): string {
  return text
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, "?");
}

function pdfEscape(text: string): string {
  return normalize(text)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function textWidth(text: string, size: number, bold = false): number {
  return text.length * size * (bold ? 0.55 : 0.5);
}

function wrap(text: string, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (textWidth(candidate, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function fmt(n: number): string {
  return n.toFixed(2);
}

class Content {
  private parts: string[] = [];

  text(x: number, y: number, size: number, bold: boolean, value: string): void {
    const font = bold ? "F2" : "F1";
    this.parts.push(
      `BT /${font} ${size} Tf 1 0 0 1 ${fmt(x)} ${fmt(y)} Tm (${pdfEscape(value)}) Tj ET`
    );
  }

  center(y: number, size: number, bold: boolean, value: string): void {
    const x = (PAGE_W - textWidth(value, size, bold)) / 2;
    this.text(x, y, size, bold, value);
  }

  line(x1: number, y1: number, x2: number, y2: number, width = 0.8, gray = 0): void {
    this.parts.push(
      `q ${gray} G ${width} w ${fmt(x1)} ${fmt(y1)} m ${fmt(x2)} ${fmt(y2)} l S Q`
    );
  }

  toString(): string {
    return this.parts.join("\n");
  }
}

function buildContent(booking: BookingWithDetails): string {
  const c = new Content();
  let y = PAGE_H - MARGIN;

  c.center(y, 15, true, "INSTITUT DESAIN DAN BISNIS BALI");
  y -= 18;
  c.center(y, 9.5, false, "Bagian Administrasi Sarana dan Prasarana");
  y -= 10;
  c.line(LEFT, y, RIGHT, y, 1.4, 0.1);
  y -= 3;
  c.line(LEFT, y, RIGHT, y, 0.6, 0.1);
  y -= 30;

  c.center(y, 12.5, true, "SURAT KETERANGAN PEMINJAMAN RUANGAN");
  y -= 16;
  c.center(
    y,
    10,
    false,
    `Nomor: SPR/IDB/${booking.date.slice(0, 4)}/${String(booking.id).padStart(3, "0")}`
  );
  y -= 30;

  const opening =
    "Yang bertanda tangan di bawah ini, Bagian Administrasi Sarana dan Prasarana Institut Desain dan Bisnis Bali, dengan ini menerangkan bahwa peminjaman ruangan berikut telah disetujui:";
  for (const ln of wrap(opening, 10.5, CONTENT_W)) {
    c.text(LEFT, y, 10.5, false, ln);
    y -= LINE;
  }
  y -= 8;

  const rows: [string, string][] = [
    ["Nama Peminjam", booking.user_name],
    ["Email", booking.user_email],
    ["Ruangan", booking.room_name],
    ["Lokasi", booking.room_location],
    ["Tanggal", formatDate(booking.date)],
    ["Waktu", `${formatTime(booking.start_time)} - ${formatTime(booking.end_time)} WITA`],
    ["Keperluan", booking.purpose || "-"],
    ["Status", "Disetujui"],
    ["No. Pengajuan", `#${booking.id}`],
  ];
  const valueX = LEFT + 140;
  const valueW = RIGHT - valueX;

  for (const [label, value] of rows) {
    c.text(LEFT, y, 10.5, false, label);
    c.text(LEFT + 116, y, 10.5, false, ":");
    const lines = wrap(value, 10.5, valueW);
    lines.forEach((ln, i) => {
      c.text(valueX, y - i * LINE, 10.5, false, ln);
    });
    y -= LINE * lines.length + 3;
  }
  y -= 10;

  const closing =
    "Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.";
  for (const ln of wrap(closing, 10.5, CONTENT_W)) {
    c.text(LEFT, y, 10.5, false, ln);
    y -= LINE;
  }
  y -= 28;

  const today = new Date();
  const sigX = 360;
  c.text(sigX, y, 10.5, false, `Denpasar, ${longDate(today)}`);
  y -= LINE;
  c.text(sigX, y, 10.5, false, "Bagian Administrasi,");
  y -= 60;
  c.text(sigX, y, 10.5, true, "( ................................ )");

  c.text(
    LEFT,
    46,
    8,
    false,
    "Dokumen ini dihasilkan secara otomatis oleh Sistem Peminjaman Ruangan IDB Bali."
  );
  c.text(LEFT, 36, 8, false, `Dicetak pada ${longDate(today)} ${clock(today)} WITA`);

  return c.toString();
}

export function renderLetterPdf(booking: BookingWithDetails): Buffer {
  const contentBuffer = Buffer.from(buildContent(booking), "latin1");

  const header = Buffer.from("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n", "latin1");
  const chunks: Buffer[] = [header];
  let offset = header.length;
  const offsets: number[] = [];

  const addObject = (num: number, body: string | Buffer): void => {
    offsets[num] = offset;
    const bodyBuf = Buffer.isBuffer(body) ? body : Buffer.from(body, "latin1");
    const prefix = Buffer.from(`${num} 0 obj\n`, "latin1");
    const suffix = Buffer.from("\nendobj\n", "latin1");
    chunks.push(prefix, bodyBuf, suffix);
    offset += prefix.length + bodyBuf.length + suffix.length;
  };

  addObject(1, "<< /Type /Catalog /Pages 2 0 R >>");
  addObject(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  addObject(
    3,
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`
  );
  addObject(
    4,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"
  );
  addObject(
    5,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"
  );
  addObject(
    6,
    Buffer.concat([
      Buffer.from(`<< /Length ${contentBuffer.length} >>\nstream\n`, "latin1"),
      contentBuffer,
      Buffer.from("\nendstream", "latin1"),
    ])
  );

  const xrefStart = offset;
  let xref = `xref\n0 7\n0000000000 65535 f \n`;
  for (let i = 1; i < 7; i++) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  chunks.push(Buffer.from(xref, "latin1"));
  chunks.push(
    Buffer.from(
      `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`,
      "latin1"
    )
  );

  return Buffer.concat(chunks);
}
