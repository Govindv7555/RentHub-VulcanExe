import { NextRequest } from "next/server";
import { handleOptions } from "@/lib/cors";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    // Demo-only endpoint: disabled unless MOCK_KYC=true
    if (process.env.MOCK_KYC !== "true") {
      return errorResponse("NOT_FOUND", "Not found", 404);
    }

    const auth = await requireAuth(req);
    if ("error" in auth) return auth.error;
    const user = auth.user;

    const body = await req.json().catch(() => ({}));
    const { sessionId } = body;

    if (!sessionId) {
      return errorResponse("VALIDATION_ERROR", "sessionId is required");
    }

    // The session must belong to the caller
    const { data: session, error } = await supabaseAdmin
      .from("kyc_sessions")
      .select("id, user_id")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (error || !session) {
      return errorResponse("NOT_FOUND", "Session not found", 404);
    }

    // Fixed demo values only. Anything the client sends (for example
    // mockAadhaar) is ignored and never stored.
    const { error: idError } = await supabaseAdmin
      .from("identity_records")
      .upsert({
        user_id: user.id,
        name: "Mock Digilocker User",
        dob: "1990-01-01",
        gender: "M",
        address_hash: "mock_address_hash",
        aadhaar_last4: "0000",
        verified_badge: true,
      });

    if (idError) return errorResponse("INTERNAL_ERROR", idError.message, 500);

    const { error: sessError } = await supabaseAdmin
      .from("kyc_sessions")
      .update({ status: "verified" })
      .eq("id", sessionId);
    if (sessError) return errorResponse("INTERNAL_ERROR", sessError.message, 500);

    const { error: userError } = await supabaseAdmin
      .from("users")
      .update({ kyc_verified: true })
      .eq("id", user.id);
    if (userError) return errorResponse("INTERNAL_ERROR", userError.message, 500);

    return successResponse({ ok: true });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message, 500);
  }
}
