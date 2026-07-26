import { useEffect, useState } from "react";
import { redirect, useLoaderData, useNavigate } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
import { destroySession, getSession, requireAdmin } from "~/lib/auth.server";
import { db } from "~/lib/db.server";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export const meta: MetaFunction = () => [{ title: "Admin — Data Registrant" }];

interface Registrant {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  interest: string;
  date: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);

  const url = new URL(request.url);
  const search = url.searchParams.get("q") || "";
  const companyName = process.env.COMPANY_NAME || "Nama Perusahaan";

  const raw = search
    ? (db
        .prepare(
          `SELECT id, name, email, phone,
                  COALESCE(company, '—') AS company, interest, created_at
           FROM registrations
           WHERE name LIKE ? OR email LIKE ? OR company LIKE ?
           ORDER BY created_at DESC`,
        )
        .all(`%${search}%`, `%${search}%`, `%${search}%`) as Array<Omit<Registrant, "date"> & { created_at: string }>)
    : (db
        .prepare(
          `SELECT id, name, email, phone,
                  COALESCE(company, '—') AS company, interest, created_at
           FROM registrations
           ORDER BY created_at DESC`,
        )
        .all() as unknown as Array<Omit<Registrant, "date"> & { created_at: string }>);

  const registrants: Registrant[] = raw.map((r) => ({
    ...r,
    date: formatDate(r.created_at),
  }));

  const { count } = db
    .prepare("SELECT COUNT(*) AS count FROM registrations")
    .get() as { count: number };

  return { registrants, total: count, search, companyName };
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const fd = await request.formData();

  if (fd.get("_action") === "logout") {
    return redirect("/admin/login", {
      headers: { "Set-Cookie": await destroySession(session) },
    });
  }

  return null;
}

export default function AdminDashboard() {
  const { registrants, total, search: initialSearch, companyName } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(initialSearch);

  useEffect(() => {
    setSearchInput(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const q = searchInput.trim();
      const params = q ? `?q=${encodeURIComponent(q)}` : "";
      navigate(`/admin${params}`, { replace: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, navigate]);

  return (
    <div>
      <nav className="nav">
        <span className="nav-brand">Admin Panel · {companyName}</span>
        <form method="post" style={{ marginLeft: "auto" }}>
          <input type="hidden" name="_action" value="logout" />
          <button type="submit" className="btn btn-secondary">
            Keluar
          </button>
        </form>
      </nav>

      <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "24px 24px 80px" }}>
        <h2>Data Registrant</h2>
        <p className="text-muted" style={{ maxWidth: "560px" }}>
          Kelola dan unduh data calon customer yang masuk dari microsite.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            alignItems: "flex-end",
            justifyContent: "space-between",
            margin: "32px 0 24px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "color-mix(in srgb, var(--color-text) 60%, transparent)",
              }}
            >
              Total Registrant
            </div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: "48px",
                color: "var(--color-accent-700)",
                lineHeight: 1,
              }}
            >
              {total}
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <svg
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" stroke="var(--color-neutral-600)" strokeWidth="2" />
                <path
                  d="M21 21l-4.3-4.3"
                  stroke="var(--color-neutral-600)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <input
                className="input"
                type="text"
                placeholder="Cari nama, email, perusahaan..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ paddingLeft: "34px", width: "260px" }}
                aria-label="Cari registrant"
              />
            </div>

            <a href="/admin/export" className="btn btn-primary">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Unduh CSV
            </a>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          {registrants.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>No. HP</th>
                  <th>Perusahaan</th>
                  <th>Minat</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {registrants.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.phone}</td>
                    <td>{r.company}</td>
                    <td>
                      <span className="tag tag-accent">{r.interest}</span>
                    </td>
                    <td className="text-muted">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              style={{ padding: "32px 0", textAlign: "center" }}
              className="text-muted"
            >
              {searchInput.trim()
                ? "Tidak ada data yang cocok dengan pencarian."
                : "Belum ada data registrant."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
