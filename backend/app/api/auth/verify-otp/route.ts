import { NextRequest } from "next/server";
import { handleOptions } from "../../../../lib/cors";
import { successResponse, errorResponse } from "../../../../lib/api-helpers";
import { supabaseAnon } from "../../../../lib/supabase-anon";
import { supabaseAdmin } from "../../../../lib/supabase-admin";
import { generateMockPassword } from "../../../../lib/crypto";
import { env } from "../../../../lib/env";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return errorResponse("VALIDATION_ERROR", "Phone and OTP are required");
    }

    if (env.MOCK_OTP && otp !== env.MOCK_OTP_CODE) {
      return errorResponse("AUTH_INVALID_OTP", "Invalid OTP", 401);
    }

    // Sign in with anon client using HMAC password
    const { data, error } = await supabaseAnon.auth.signInWithPassword({
      phone,
      password: generateMockPassword(phone),
    });

    if (error || !data.user || !data.session) {
      console.error("verify-otp error:", error);
      return errorResponse("AUTH_INVALID_OTP", "Failed to verify: " + (error?.message || "unknown"), 401);
    }

    // Check if new user (for our logic, if created within the last 10 seconds)
    const createdAt = new Date(data.user.created_at);
    const now = new Date();
    const isNewUser = (now.getTime() - createdAt.getTime()) < 10000;

    return successResponse({
      userId: data.user.id,
      token: data.session.access_token,
      isNewUser,
    });
  } catch (error: any) {
    return errorResponse("INTERNAL_ERROR", error.message, 500);
  }
}
