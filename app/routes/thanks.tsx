import { redirect, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";

export const meta: MetaFunction = () => [{ title: "Terima Kasih" }];

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const name = url.searchParams.get("name");
  if (!name) throw redirect("/");
  return { name };
}

export default function Thanks() {
  const { name } = useLoaderData<typeof loader>();

  return (
    <div
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "64px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "16px",
        minHeight: "70vh",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "var(--color-accent-100)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 13l4 4L19 7"
            stroke="var(--color-accent-700)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2>Terima kasih, {name}!</h2>

      <p className="text-muted" style={{ maxWidth: "440px", fontSize: "16px" }}>
        Data Anda sudah kami terima. Tim kami akan segera menghubungi Anda melalui email
        atau WhatsApp yang telah didaftarkan.
      </p>

      <a href="/" className="btn btn-secondary" style={{ marginTop: "12px" }}>
        Isi Formulir Lain
      </a>
    </div>
  );
}
