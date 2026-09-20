import { NextRequest } from "next/server";
import { supabaseAdmin } from "./supabase-admin";
import { errorResponse } from "./api-helpers";

export async function requireAuth(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: errorResponse("AUTH_REQUIRED", "Missing or invalid authorization header", 401) };
  }

  const token = authHeader.split(" ")[1];
  
  // Verify token via Supabase
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  
  if (error || !data.user) {
    return { error: errorResponse("AUTH_REQUIRED", "Invalid or expired token", 401) };
  }

  return { user: data.user };
}
