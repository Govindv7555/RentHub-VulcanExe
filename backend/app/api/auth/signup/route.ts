import { NextRequest } from "next/server";
import { handleOptions } from "../../../../lib/cors";
import { successResponse, errorResponse } from "../../../../lib/api-helpers";
import { supabaseAdmin } from "../../../../lib/supabase-admin";
import { generateMockPassword } from "../../../../lib/crypto";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, name } = body;

    if (!phone || !name) {
      return errorResponse("VALIDATION_ERROR", "Phone and name are required");
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUsers.users.find(u => u.phone === phone);
    
    if (userExists) {
      return errorResponse("VALIDATION_ERROR", "User already exists", 409);
    }

    // Create auth user with HMAC password and phone_confirm: true (mock setup)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      phone,
      password: generateMockPassword(phone),
      phone_confirm: true,
      user_metadata: { name },
    });

    if (authError || !authData.user) {
      return errorResponse("VALIDATION_ERROR", authError?.message || "Failed to create auth user");
    }

    const userId = authData.user.id;
    return successResponse({ userId, otpSent: true });
  } catch (error: any) {
    return errorResponse("INTERNAL_ERROR", error.message, 500);
  }
}

