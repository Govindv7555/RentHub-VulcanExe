import { NextRequest } from "next/server";
import { handleOptions, corsHeaders } from "../../../../lib/cors";
import { successResponse, errorResponse } from "../../../../lib/api-helpers";
import { requireAuth } from "../../../../lib/auth";
import { supabaseAdmin } from "../../../../lib/supabase-admin";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (authResult.error) return authResult.error;

    // Create a new KYC session
    const { data, error } = await supabaseAdmin
      .from("kyc_sessions")
      .insert({
        user_id: authResult.user.id,
        provider: "mock",
        status: "pending",
      })
      .select("id")
      .single();

    if (error || !data) {
      return errorResponse("INTERNAL_ERROR", error?.message || "Failed to create session", 500);
    }

    // Return the mock redirect URL
    return successResponse({
      sessionId: data.id,
      redirectUrl: "/mock/digilocker",
    });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message, 500);
  }
}
