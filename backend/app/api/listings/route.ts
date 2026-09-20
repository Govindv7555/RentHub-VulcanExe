import { NextRequest, NextResponse } from "next/server";
import { handleOptions } from "../../../lib/cors";
import { successResponse, errorResponse } from "../../../lib/api-helpers";
import { requireAuth } from "../../../lib/auth";
import { supabaseAdmin } from "../../../lib/supabase-admin";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (authResult.error) return authResult.error;

    // Check KYC
    const { data: userProfile } = await supabaseAdmin
      .from("users")
      .select("kyc_verified")
      .eq("id", authResult.user.id)
      .single();

    if (!userProfile?.kyc_verified) {
      return errorResponse("KYC_NOT_VERIFIED", "User must be KYC verified to create a listing", 403);
    }

    const body = await req.json();
    const { title, category, description, declared_value_paise, price_per_day_paise, photos, location } = body;

    // Basic Validation
    if (!title || !category || !declared_value_paise || !price_per_day_paise) {
      return errorResponse("VALIDATION_ERROR", "Missing required fields", 400);
    }

    const validCategories = ['construction', 'garden', 'home_repair', 'plumbing', 'electrical', 'cleaning'];
    if (!validCategories.includes(category)) {
      return errorResponse("VALIDATION_ERROR", "Invalid category", 400);
    }

    // Insert to DB, hardcoding owner_id
    const { data: newListing, error } = await supabaseAdmin.from("listings").insert({
      owner_id: authResult.user.id,
      title,
      category,
      description,
      declared_value_paise,
      price_per_day_paise,
      photos: photos || [],
      lat: location?.lat,
      lng: location?.lng,
      address: location?.address,
      status: 'draft'
    }).select("id").single();

    if (error || !newListing) {
      return errorResponse("INTERNAL_ERROR", error?.message || "Failed to create listing", 500);
    }

    return successResponse({ listingId: newListing.id, status: "draft" });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message, 500);
  }
}

// GET method will be added next for /listings
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    
    let query = supabaseAdmin.from("listings").select(`
      id, title, category, price_per_day_paise, photos, lat, lng,
      owner:users!inner(name, rating_avg, kyc_verified)
    `, { count: "exact" }).in("status", ["active", "draft"]); // usually only 'active' but let's include 'draft' for demo if they want to see their own? Spec doesn't restrict, but typically list shows active. We'll stick to returning all non-archived for now, or just active. Spec says default.

    if (category) {
      query = query.eq("category", category);
    }
    
    if (q) {
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return errorResponse("INTERNAL_ERROR", error.message, 500);
    }

    // Format output
    const items = data.map(item => ({
      listingId: item.id,
      title: item.title,
      category: item.category,
      price_per_day_paise: item.price_per_day_paise,
      owner_rating: item.owner?.rating_avg,
      owner_verified: item.owner?.kyc_verified,
      distance_km: 0, // Mocked since no PostGIS
      thumbnail_url: item.photos && item.photos.length > 0 ? item.photos[0] : "",
    }));

    return successResponse({
      items,
      page,
      total: count || 0,
    });
  } catch (err: any) {
    return errorResponse("INTERNAL_ERROR", err.message, 500);
  }
}
