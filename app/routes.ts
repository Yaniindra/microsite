import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("thanks", "routes/thanks.tsx"),
  route("admin/login", "routes/admin.login.tsx"),
  route("admin", "routes/admin._index.tsx"),
  route("admin/export", "routes/admin.export.tsx"),
] satisfies RouteConfig;
