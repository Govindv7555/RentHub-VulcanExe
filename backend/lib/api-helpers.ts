import { NextResponse } from "next/server";
import { corsHeaders } from "./cors";

export function successResponse(data: any, status: number = 200) {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders(),
  });
}

export function errorResponse(code: string, message: string, status: number = 400) {
  return NextResponse.json(
    { error: { code, message } },
    {
      status,
      headers: corsHeaders(),
    }
  );
}
