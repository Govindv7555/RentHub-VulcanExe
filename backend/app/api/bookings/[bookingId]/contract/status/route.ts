import { NextRequest } from "next/server";
import { handleOptions } from "@/lib/cors";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ bookingId: string }> }) {
  try {
    const authResult = await requireAuth(req);
    if (authResult.error) return authResult.error;

    const { bookingId } = await params;

    // Only the owner or the renter of this booking may see its contract
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select("owner_id, renter_id")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return errorResponse("VALIDATION_ERROR", "Booking not found", 404);
    }

    if (booking.owner_id !== authResult.user.id && booking.renter_id !== authResult.user.id) {
      return errorResponse("NOT_OWNER", "Not a party to this booking", 403);
    }

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
