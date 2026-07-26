import bcrypt from "bcryptjs";
import { createCookieSessionStorage, redirect } from "react-router";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__admin_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || "dev-secret-change-in-production"],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

export async function requireAdmin(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.get("adminLoggedIn")) {
    throw redirect("/admin/login");
  }
  return session;
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  if (username !== adminUsername) return false;

  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  if (adminPasswordHash) {
    return bcrypt.compare(password, adminPasswordHash);
  }

  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  return password === adminPassword;
}
