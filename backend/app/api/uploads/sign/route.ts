import { NextRequest } from "next/server";
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

    const body = await req.json();
    const { filename, content_type, purpose } = body;

    if (!filename || !purpose) {
      return errorResponse("VALIDATION_ERROR", "filename and purpose are required", 400);
    }

    let bucket = "renthub-uploads";
    let isPublic = false;

    if (purpose === "listing_photo") {
      bucket = "listing-photos";
      isPublic = true;
    } else if (purpose === "handover_evidence") {
      bucket = "handover-photos";
    } else if (purpose === "selfie" || purpose === "id_document") {
      bucket = "renthub-uploads";
    }

    const ext = filename.split(".").pop();
    // Path structure: purpose/userId/timestamp.ext
    const filePath = `${purpose}/${authResult.user.id}/${Date.now()}.${ext}`;

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUploadUrl(filePath);

    if (error || !data) {
      return errorResponse("INTERNAL_ERROR", error?.message || "Failed to generate upload URL", 500);
    }

    let publicUrl = "";
    if (isPublic) {
      const { data: publicData } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);
      publicUrl = publicData.publicUrl;
    }

    return successResponse({
      uploadUrl: data.signedUrl,
      publicUrl,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // rough 15 min expiry for signed url
    });
  } catch (error: any) {
    return errorResponse("INTERNAL_ERROR", error.message, 500);
  }
}
