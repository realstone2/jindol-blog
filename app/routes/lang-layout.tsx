import { data, Outlet } from "react-router";
import type { Route } from "./+types/lang-layout";

export async function loader({ params }: Route.LoaderArgs) {
  // 허용 프리픽스는 /en 뿐 — 그 외 첫 세그먼트는 404
  if (params.lang !== undefined && params.lang !== "en") {
    throw data(null, { status: 404 });
  }
  return null;
}

export default function LangLayout() {
  return <Outlet />;
}
