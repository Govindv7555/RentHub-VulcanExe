import { NextResponse } from "next/server";
import { env } from "./env";

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export function handleOptions() {
  return new NextResponse("OK", {
    status: 200,
    headers: corsHeaders(),
  });
}

