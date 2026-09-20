import { NextRequest, NextResponse } from "next/server";
import { handleOptions } from "../../../../lib/cors";
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

    const formData = await req.formData();
    const sessionId = formData.get("sessionId") as string;
    const selfie = formData.get("selfie") as File | null;

    if (!sessionId || !selfie) {
      return errorResponse("VALIDATION_ERROR", "sessionId and selfie file are required", 400);
    }

    // Validate size (e.g., 5MB max)
    if (selfie.size > 5 * 1024 * 1024) {
      return errorResponse("VALIDATION_ERROR", "Selfie size exceeds 5MB limit", 400);
    }
    // Validate type
    if (!selfie.type.startsWith("image/")) {
      return errorResponse("VALIDATION_ERROR", "Selfie must be an image", 400);
    }

    // Verify session belongs to user
    const { data: session, error } = await supabaseAdmin
      .from("kyc_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error || !session || session.user_id !== authResult.user.id) {
      return errorResponse("VALIDATION_ERROR", "Invalid session", 404);
    }

    // Read file to memory
    const arrayBuffer = await selfie.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase using admin (private bucket)
    const ext = selfie.name.split(".").pop() || "jpg";
    const filePath = `selfie/${authResult.user.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("renthub-uploads")
      .upload(filePath, buffer, {
        contentType: selfie.type,
      });

    if (uploadError) {
      return errorResponse("INTERNAL_ERROR", "Failed to upload selfie", 500);
    }

    // Generate mock deterministic score
    // In mock: simply pass (>= 0.85)
    const match_score = 0.92;
    const liveness_passed = true;

    // We don't actually delete from memory explicitly in Node; it gets garbage collected.
    // In a real app we might update the identity_records with the match score, but for mock, we just return it.
    
    return successResponse({
      match_score,
      liveness_passed,
    });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message, 500);
  }
}
