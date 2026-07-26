import { Form, data, redirect, useActionData, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
import { db } from "~/lib/db.server";

export const meta: MetaFunction = () => [
  { title: "Formulir Minat Produk" },
];

function formatDateId(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function loader(_: LoaderFunctionArgs) {
  return {
    companyName: process.env.COMPANY_NAME || "Nama Perusahaan",
    date: formatDateId(new Date()),
    requireConsent: process.env.REQUIRE_CONSENT !== "false",
    showNoteField: process.env.SHOW_NOTE_FIELD !== "false",
  };
}

interface ActionErrors {
  name?: string;
  email?: string;
  phone?: string;
  consent?: string;
}

export async function action({ request }: ActionFunctionArgs) {
  const fd = await request.formData();
  const name = (fd.get("name") as string || "").trim();
  const email = (fd.get("email") as string || "").trim();
  const phone = (fd.get("phone") as string || "").trim();
  const company = (fd.get("company") as string || "").trim();
  const interest = (fd.get("interest") as string || "Informasi umum").trim();
  const note = (fd.get("note") as string || "").trim();
  const consent = fd.get("consent") === "on";
  const requireConsent = process.env.REQUIRE_CONSENT !== "false";

  const errors: ActionErrors = {};
  if (!name) errors.name = "Nama wajib diisi";
  if (!email) errors.email = "Email wajib diisi";
  if (!phone) errors.phone = "No. HP wajib diisi";
  if (requireConsent && !consent) errors.consent = "Persetujuan wajib dicentang";

  if (Object.keys(errors).length > 0) {
    return data(
      { errors, values: { name, email, phone, company, interest, note } },
      { status: 422 },
    );
  }

  db.prepare(
    `INSERT INTO registrations (name, email, phone, company, interest, note, consent)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(name, email, phone, company || null, interest, note || null, consent ? 1 : 0);

  return redirect(`/thanks?name=${encodeURIComponent(name)}`);
}

export default function Index() {
  const { companyName, date, requireConsent, showNoteField } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors;
  const values = actionData?.values;

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px 80px" }}>
      <nav className="nav" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="nav-brand">{companyName}</span>
      </nav>

      {/* Masthead rule pair */}
      <div style={{ borderTop: "4px solid var(--color-text)", marginTop: "8px" }} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 0",
          fontSize: "11px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "color-mix(in srgb, var(--color-text) 60%, transparent)",
        }}
      >
        <span>Formulir Minat Produk</span>
        <span>{date}</span>
      </div>
      <div style={{ borderTop: "1px solid var(--color-text)", marginBottom: "40px" }} />

      <h1 style={{ maxWidth: "520px" }}>Tertarik dengan Produk Kami? Mari Terhubung.</h1>
      <p className="text-muted" style={{ maxWidth: "480px", fontSize: "16px" }}>
        Lengkapi data singkat di bawah ini. Tim kami akan menghubungi Anda untuk
        informasi produk, jadwal demo, atau penawaran harga.
      </p>

      <div style={{ display: "flex", gap: "8px", margin: "20px 0 48px", flexWrap: "wrap" }}>
        <span className="tag tag-outline">Respon dalam 1x24 jam</span>
        <span className="tag tag-outline">Data aman &amp; rahasia</span>
      </div>

      <Form
        method="post"
        style={{ maxWidth: "480px", display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <div className="field">
          <label htmlFor="name">Nama Lengkap*</label>
          <input
            className="input"
            id="name"
            name="name"
            type="text"
            placeholder="Nama sesuai KTP"
            defaultValue={values?.name}
          />
          {errors?.name && (
            <div style={{ color: "var(--color-accent-2-700)", fontSize: "12px", marginTop: "4px" }}>
              {errors.name}
            </div>
          )}
        </div>

        <div className="field">
          <label htmlFor="email">Email Aktif*</label>
          <input
            className="input"
            id="email"
            name="email"
            type="email"
            placeholder="nama@perusahaan.com"
            defaultValue={values?.email}
          />
          {errors?.email && (
            <div style={{ color: "var(--color-accent-2-700)", fontSize: "12px", marginTop: "4px" }}>
              {errors.email}
            </div>
          )}
        </div>

        <div className="field">
          <label htmlFor="phone">No. HP / WhatsApp*</label>
          <input
            className="input"
            id="phone"
            name="phone"
            type="tel"
            placeholder="08xx-xxxx-xxxx"
            defaultValue={values?.phone}
          />
          {errors?.phone && (
            <div style={{ color: "var(--color-accent-2-700)", fontSize: "12px", marginTop: "4px" }}>
              {errors.phone}
            </div>
          )}
        </div>

        <div className="field">
          <label htmlFor="company">Nama Perusahaan (opsional)</label>
          <input
            className="input"
            id="company"
            name="company"
            type="text"
            placeholder="PT / CV / Perorangan"
            defaultValue={values?.company}
          />
        </div>

        <div className="field">
          <label htmlFor="interest">Anda tertarik dengan apa?</label>
          <select
            className="input"
            id="interest"
            name="interest"
            defaultValue={values?.interest ?? "Informasi umum"}
          >
            <option value="Informasi umum">Informasi umum</option>
            <option value="Demo produk">Demo produk</option>
            <option value="Penawaran harga">Penawaran harga</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        {showNoteField && (
          <div className="field">
            <label htmlFor="note">Catatan Tambahan (opsional)</label>
            <textarea
              className="input"
              id="note"
              name="note"
              placeholder="Ceritakan kebutuhan Anda secara singkat"
              defaultValue={values?.note}
            />
          </div>
        )}

        {requireConsent && (
          <div>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="consent"
                style={{
                  accentColor: "var(--color-accent)",
                  width: "18px",
                  height: "18px",
                  marginTop: "1px",
                  flex: "none",
                }}
              />
              <span>
                Saya setuju data ini digunakan oleh tim untuk menghubungi saya terkait
                produk/layanan yang diminati.
              </span>
            </label>
            {errors?.consent && (
              <div style={{ color: "var(--color-accent-2-700)", fontSize: "12px", marginTop: "6px" }}>
                {errors.consent}
              </div>
            )}
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: "4px" }}>
          Kirim Data
        </button>
      </Form>

      <p style={{ marginTop: "48px", fontSize: "12px" }} className="text-muted">
        © 2026 {companyName}. Data Anda diproses sesuai{" "}
        <a href="#">Kebijakan Privasi</a> kami.
      </p>
    </div>
  );
}
