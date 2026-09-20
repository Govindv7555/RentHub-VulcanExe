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
    if (authResult.error) {
      return authResult.error;
    }

    const { data: userProfile, error: dbError } = await supabaseAdmin
      .from("users")
      .select("id, name, phone_masked, kyc_verified, rating_avg, created_at")
      .eq("id", authResult.user.id)
      .single();

    if (dbError || !userProfile) {
      return errorResponse("VALIDATION_ERROR", "User profile not found", 404);
    }

    return successResponse({
      userId: userProfile.id,
      name: userProfile.name,
      phone_masked: userProfile.phone_masked,
      kyc_verified: userProfile.kyc_verified,
      rating: userProfile.rating_avg,
      created_at: userProfile.created_at,
    });
  } catch (error: any) {
    return errorResponse("INTERNAL_ERROR", error.message, 500);
  }
}
