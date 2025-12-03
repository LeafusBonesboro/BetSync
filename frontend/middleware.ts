import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export { updateSession as middleware } from "./utils/supabase/middleware";

export const config = {
  matcher: ["/:path*"],
};

