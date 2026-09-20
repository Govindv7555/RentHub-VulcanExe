import { NextRequest } from "next/server";
import { handleOptions } from "@/lib/cors";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    // Demo-only endpoint: disabled unless MOCK_KYC=true
    if (process.env.MOCK_KYC !== "true") {
      return errorResponse("NOT_FOUND", "Not found", 404);
    }

    const auth = await requireAuth(req);
    if ("error" in auth) return auth.error;
    const user = auth.user;

    const body = await req.json().catch(() => ({}));
    const { contractId } = body;

    if (!contractId) {
      return errorResponse("VALIDATION_ERROR", "contractId is required");
    }

    const { data: contract, error } = await supabaseAdmin
      .from("contracts")
      .select("*, booking:bookings(owner_id, renter_id)")
      .eq("id", contractId)
      .single();

    if (error || !contract) return errorResponse("NOT_FOUND", "Contract not found", 404);

    const booking = Array.isArray(contract.booking) ? contract.booking[0] : contract.booking;
    if (!booking) return errorResponse("NOT_FOUND", "Contract not found", 404);

    // Only the owner or the renter of this booking can sign, as themselves.
    // Any signerId in the request body is ignored.
    if (user.id !== booking.owner_id && user.id !== booking.renter_id) {
      return errorResponse("FORBIDDEN", "Not a party to this booking", 403);
    }

    const { data: existing } = await supabaseAdmin
      .from("contract_signatures")
      .select("signer_user_id")
      .eq("contract_id", contractId);

    let signers = (existing || []).map((s) => s.signer_user_id);

    if (!signers.includes(user.id)) {
      const { error: sigError } = await supabaseAdmin
        .from("contract_signatures")
        .insert({
          contract_id: contractId,
          signer_user_id: user.id,
          certificate_meta: { provider: "mock_esign" },
        });
      if (sigError) return errorResponse("INTERNAL_ERROR", sigError.message, 500);
      signers = [...signers, user.id];
    }

    if (signers.includes(booking.owner_id) && signers.includes(booking.renter_id)) {
      await supabaseAdmin.from("contracts").update({ status: "signed" }).eq("id", contractId);
      const { data: b } = await supabaseAdmin
        .from("bookings")
        .select("status")
        .eq("id", contract.booking_id)
        .single();
      if (b && b.status === "kyc_verified") {
        await supabaseAdmin.from("bookings").update({ status: "contract_signed" }).eq("id", contract.booking_id);
      }
    }

    return successResponse({ ok: true });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message, 500);
  }
}
