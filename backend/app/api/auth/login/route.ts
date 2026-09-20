import { NextRequest } from "next/server";
import { handleOptions } from "../../../../lib/cors";
import { successResponse, errorResponse } from "../../../../lib/api-helpers";
import { supabaseAdmin } from "../../../../lib/supabase-admin";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = body;

    if (!phone) {
      return errorResponse("VALIDATION_ERROR", "Phone is required");
    }

    // Check if user exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUsers.users.find(u => u.phone === phone);
    
    if (!userExists) {
      return errorResponse("VALIDATION_ERROR", "User not found", 400);
    }

    return successResponse({ otpSent: true });
  } catch (error: any) {
    return errorResponse("INTERNAL_ERROR", error.message, 500);
  }
}
