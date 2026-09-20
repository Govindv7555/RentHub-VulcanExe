import { NextResponse } from "next/server";
import { env } from "./env";

export function corsHeaders(origin?: string) {
  const allowed = env.ALLOWED_ORIGIN.split(',').map(s => s.trim());
  const reqOrigin = origin || "";
  const allow = allowed.includes(reqOrigin) ? reqOrigin : allowed[0];

  return {
    "Access-Control-Allow-Origin": allow,
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

