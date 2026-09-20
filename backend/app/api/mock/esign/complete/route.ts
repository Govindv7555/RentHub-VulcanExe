import { NextRequest } from "next/server";
import { handleOptions } from "../../../../../lib/cors";
import { successResponse, errorResponse } from "../../../../../lib/api-helpers";
import { supabaseAdmin } from "../../../../../lib/supabase-admin";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractId, signerId } = body;

    if (!contractId || !signerId) {
      return errorResponse("VALIDATION_ERROR", "contractId and signerId required");
    }

    const { data: contract, error } = await supabaseAdmin
      .from("contracts")
      .select("*, booking:bookings(owner_id, renter_id)")
      .eq("id", contractId)
      .single();

    if (error || !contract) return errorResponse("VALIDATION_ERROR", "Contract not found", 404);

    // Insert signature
    await supabaseAdmin
      .from("contract_signatures")
      .insert({
        contract_id: contractId,
        signer_user_id: signerId,
        certificate_meta: { provider: "mock_esign" },
      });

    // Check if both signed
    const { data: signatures } = await supabaseAdmin
      .from("contract_signatures")
      .select("signer_user_id")
      .eq("contract_id", contractId);

    const signers = signatures?.map((s) => s.signer_user_id) || [];
    const booking = Array.isArray(contract.booking) ? contract.booking[0] : contract.booking;
    const isOwnerSigned = signers.includes(booking.owner_id);
    const isRenterSigned = signers.includes(booking.renter_id);

    if (isOwnerSigned && isRenterSigned) {
      await supabaseAdmin.from("contracts").update({ status: "signed" }).eq("id", contractId);
      // Advance booking to contract_signed if it's currently kyc_verified
      const { data: b } = await supabaseAdmin.from("bookings").select("status").eq("id", contract.booking_id).single();
      if (b && b.status === "kyc_verified") {
        await supabaseAdmin.from("bookings").update({ status: "contract_signed" }).eq("id", contract.booking_id);
      }
    }

    return successResponse({ ok: true });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message, 500);
  }
}
