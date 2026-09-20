import crypto from "crypto";
import { env } from "./env";

export function generateMockPassword(phone: string): string {
  return crypto
    .createHmac("sha256", env.MOCK_PASSWORD_SECRET)
    .update(phone)
    .digest("hex");
}
