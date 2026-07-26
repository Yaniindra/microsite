import { data, redirect, useActionData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
import { commitSession, getSession, verifyCredentials } from "~/lib/auth.server";

export const meta: MetaFunction = () => [{ title: "Admin — Masuk" }];

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.get("adminLoggedIn")) throw redirect("/admin");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const fd = await request.formData();
  const username = (fd.get("username") as string || "").trim();
  const password = (fd.get("password") as string || "").trim();

  if (!username || !password) {
    return data({ error: "Username dan password wajib diisi" }, { status: 422 });
  }

  const valid = await verifyCredentials(username, password);
  if (!valid) {
    return data({ error: "Username atau password salah" }, { status: 401 });
  }

  const session = await getSession(request.headers.get("Cookie"));
  session.set("adminLoggedIn", true);

  return redirect("/admin", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export default function AdminLogin() {
  const actionData = useActionData<typeof action>();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <form
        method="post"
        className="card elev-md"
        style={{ width: "100%", maxWidth: "380px", padding: "32px", gap: "20px" }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-accent-700)",
              marginBottom: "6px",
            }}
          >
            Admin Panel
          </div>
          <h3 style={{ margin: 0 }}>Masuk ke Dashboard</h3>
        </div>

        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            className="input"
            id="username"
            name="username"
            type="text"
            placeholder="admin"
            autoComplete="username"
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            className="input"
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        {actionData?.error && (
          <div style={{ color: "var(--color-accent-2-700)", fontSize: "13px" }}>
            {actionData.error}
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-block">
          Masuk
        </button>

        <a
          href="/"
          className="btn btn-ghost"
          style={{ alignSelf: "flex-start", paddingLeft: 0 }}
        >
          ← Kembali ke microsite
        </a>
      </form>
    </div>
  );
}
