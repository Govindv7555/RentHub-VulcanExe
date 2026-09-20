import { NextRequest } from "next/server";
import { handleOptions } from "../../../../../lib/cors";
import { successResponse, errorResponse } from "../../../../../lib/api-helpers";
import { requireAuth } from "../../../../../lib/auth";
import { supabaseAdmin } from "../../../../../lib/supabase-admin";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ bookingId: string }> }) {
  try {
    const authResult = await requireAuth(req);
    if (authResult.error) return authResult.error;

    const { bookingId } = await params;

    const { data: contract, error } = await supabaseAdmin
      .from("contracts")
      .select("*")
      .eq("booking_id", bookingId)
      .single();

    if (error || !contract) {
      return errorResponse("VALIDATION_ERROR", "Contract not found for booking", 404);
    }

    const { data: signatures } = await supabaseAdmin
      .from("contract_signatures")
      .select("signer_user_id, signed_at")
      .eq("contract_id", contract.id);

    return successResponse({
      status: contract.status,
      pdf_url: contract.pdf_url || "",
      signatures: signatures || [],
    });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message, 500);
  }
}
