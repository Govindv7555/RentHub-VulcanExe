import { NextRequest } from "next/server";
import { handleOptions } from "../../../../lib/cors";
import { successResponse, errorResponse } from "../../../../lib/api-helpers";
import { requireAuth } from "../../../../lib/auth";
import { supabaseAdmin } from "../../../../lib/supabase-admin";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (authResult.error) return authResult.error;

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return errorResponse("VALIDATION_ERROR", "sessionId is required");
    }

    const { data: session, error } = await supabaseAdmin
      .from("kyc_sessions")
      .select("status, user_id")
      .eq("id", sessionId)
      .single();

    if (error || !session) {
      return errorResponse("VALIDATION_ERROR", "Session not found", 404);
    }

    if (session.user_id !== authResult.user.id) {
      return errorResponse("VALIDATION_ERROR", "Not your session", 403);
    }

    let verified_badge = false;
    if (session.status === "verified") {
      const { data: user } = await supabaseAdmin
        .from("users")
        .select("kyc_verified")
        .eq("id", authResult.user.id)
        .single();
      verified_badge = user?.kyc_verified || false;
    }

    return successResponse({
      status: session.status,
      verified_badge,
    });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message, 500);
  }
}
