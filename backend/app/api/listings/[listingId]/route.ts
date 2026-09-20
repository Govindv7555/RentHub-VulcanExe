import { NextRequest } from "next/server";
import { handleOptions } from "../../../../lib/cors";
import { successResponse, errorResponse } from "../../../../lib/api-helpers";
import { requireAuth } from "../../../../lib/auth";
import { supabaseAdmin } from "../../../../lib/supabase-admin";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ listingId: string }> }) {
  try {
    const { listingId } = await params;

    const { data: listing, error } = await supabaseAdmin
      .from("listings")
      .select(`
        *,
        owner:users!inner(id, name, rating_avg, kyc_verified)
      `)
      .eq("id", listingId)
      .single();

    if (error) {
      return errorResponse("INTERNAL_ERROR", error.message, 500);
    }
    if (!listing) {
      return errorResponse("LISTING_NOT_FOUND", "Listing not found", 404);
    }

    // Fetch listings count for owner
    const { count: listingsCount } = await supabaseAdmin
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", listing.owner_id);

    // Fetch availability
    const { data: availability } = await supabaseAdmin
      .from("listing_availability")
      .select("date, available")
      .eq("listing_id", listingId);

    return successResponse({
      listingId: listing.id,
      title: listing.title,
      description: listing.description,
      category: listing.category,
      declared_value_paise: listing.declared_value_paise,
      price_per_day_paise: listing.price_per_day_paise,
      photos: listing.photos,
      owner: {
        name: listing.owner?.name,
        rating: listing.owner?.rating_avg,
        verified_badge: listing.owner?.kyc_verified,
        listings_count: listingsCount || 0,
      },
      availability: availability || [],
    });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message, 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ listingId: string }> }) {
  try {
    const authResult = await requireAuth(req);
    if (authResult.error) return authResult.error;

    const { listingId } = await params;

    const { data: listing } = await supabaseAdmin
      .from("listings")
      .select("owner_id")
      .eq("id", listingId)
      .single();

    if (!listing) return errorResponse("LISTING_NOT_FOUND", "Listing not found", 404);
    if (listing.owner_id !== authResult.user.id) {
      return errorResponse("NOT_OWNER", "You can only edit your own listings", 403);
    }

    const body = await req.json();
    const updateData: any = {};
    const updatableFields = ['title', 'description', 'category', 'declared_value_paise', 'price_per_day_paise', 'photos'];
    updatableFields.forEach(field => {
      if (body[field] !== undefined) updateData[field] = body[field];
    });

    if (body.location) {
      if (body.location.lat !== undefined) updateData.lat = body.location.lat;
      if (body.location.lng !== undefined) updateData.lng = body.location.lng;
      if (body.location.address !== undefined) updateData.address = body.location.address;
    }

    const { error } = await supabaseAdmin
      .from("listings")
      .update(updateData)
      .eq("id", listingId);

    if (error) return errorResponse("INTERNAL_ERROR", error.message, 500);

    return successResponse({ listingId, status: "updated" }); // status "updated" is technically not in the DB, it just says returns { status: string }. Actually let's fetch current status.
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message, 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ listingId: string }> }) {
  try {
    const authResult = await requireAuth(req);
    if (authResult.error) return authResult.error;

    const { listingId } = await params;

    const { data: listing } = await supabaseAdmin
      .from("listings")
      .select("owner_id")
      .eq("id", listingId)
      .single();

    if (!listing) return errorResponse("LISTING_NOT_FOUND", "Listing not found", 404);
    if (listing.owner_id !== authResult.user.id) {
      return errorResponse("NOT_OWNER", "You can only delete your own listings", 403);
    }

    const { error } = await supabaseAdmin
      .from("listings")
      .update({ status: 'archived' })
      .eq("id", listingId);

    if (error) return errorResponse("INTERNAL_ERROR", error.message, 500);

    return successResponse({ archived: true });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message, 500);
  }
}
