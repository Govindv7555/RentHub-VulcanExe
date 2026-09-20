export const env = {
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
  MOCK_OTP: process.env.MOCK_OTP === "true" || true, // defaulting to true as instructed for mock setup
  MOCK_OTP_CODE: process.env.MOCK_OTP_CODE || "123456",
  MOCK_PASSWORD_SECRET: process.env.MOCK_PASSWORD_SECRET || "default_secret_do_not_use_in_prod",
};

if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("CRITICAL: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.");
}

