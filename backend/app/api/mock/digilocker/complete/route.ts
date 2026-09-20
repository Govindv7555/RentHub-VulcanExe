import { NextRequest } from "next/server";
import { handleOptions } from "../../../../../lib/cors";
import { successResponse, errorResponse } from "../../../../../lib/api-helpers";
import { supabaseAdmin } from "../../../../../lib/supabase-admin";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    // Internal endpoint, no auth required, just sessionId
    const body = await req.json();
    const { sessionId, mockAadhaar, mockOtp } = body;

    if (!sessionId || !mockAadhaar) {
      return errorResponse("VALIDATION_ERROR", "sessionId and mockAadhaar are required");
    }

    // Fetch session
    const { data: session, error } = await supabaseAdmin
      .from("kyc_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error || !session) {
      return errorResponse("VALIDATION_ERROR", "Session not found", 404);
    }

    // Write canned identity record
    const aadhaar_last4 = mockAadhaar.slice(-4);
    const { error: idError } = await supabaseAdmin
      .from("identity_records")
      .upsert({
        user_id: session.user_id,
        name: "Mock Digilocker User",
        dob: "1990-01-01",
        gender: "M",
        address_hash: "mock_address_hash",
        aadhaar_last4,
        verified_badge: true,
      });

    if (idError) return errorResponse("INTERNAL_ERROR", idError.message, 500);

    // Update session status
    await supabaseAdmin
      .from("kyc_sessions")
      .update({ status: "verified" })
      .eq("id", sessionId);

    // Update user kyc_verified flag
    await supabaseAdmin
      .from("users")
      .update({ kyc_verified: true })
      .eq("id", session.user_id);

    return successResponse({ ok: true });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message, 500);
  }
}
