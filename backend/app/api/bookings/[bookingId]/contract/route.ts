import { NextRequest } from "next/server";
import { handleOptions } from "@/lib/cors";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ bookingId: string }> }) {
  try {
    const authResult = await requireAuth(req);
    if (authResult.error) return authResult.error;

    const { bookingId } = await params;

    // Verify booking
    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (error || !booking) {
      return errorResponse("VALIDATION_ERROR", "Booking not found", 404);
    }

    if (booking.owner_id !== authResult.user.id && booking.renter_id !== authResult.user.id) {
      return errorResponse("NOT_OWNER", "Not a party to this booking", 403);
    }

    // Insert a draft contract
    const { data: contract, error: contractError } = await supabaseAdmin
      .from("contracts")
      .insert({
        booking_id: bookingId,
        status: "draft",
        document_hash: "mock_hash_123",
      })
      .select("id")
      .single();

    if (contractError || !contract) {
      return errorResponse("INTERNAL_ERROR", contractError?.message || "Failed to create contract", 500);
    }

    return successResponse({
      contractId: contract.id,
      esignUrl: `/mock/esign?contractId=${contract.id}`,
    });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message, 500);
  }
}
