import type { LoaderFunctionArgs } from "react-router";
import { requireAdmin } from "~/lib/auth.server";
import { db } from "~/lib/db.server";

interface Row {
  name: string;
  email: string;
  phone: string;
  company: string;
  interest: string;
  created_at: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);

  const rows = db
    .prepare(
      `SELECT name, email, phone,
              COALESCE(company, '—') AS company, interest, created_at
       FROM registrations
       ORDER BY created_at DESC`,
    )
    .all() as unknown as Row[];

  const headers = ["Nama", "Email", "No. HP", "Perusahaan", "Minat", "Tanggal Daftar"];
  const csv = [
    headers,
    ...rows.map((r) => [r.name, r.email, r.phone, r.company, r.interest, formatDate(r.created_at)]),
  ]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv;charset=utf-8",
      "Content-Disposition": 'attachment; filename="data-registrant.csv"',
    },
  });
}
