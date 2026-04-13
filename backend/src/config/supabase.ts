import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const SUPABASE_URL = "https://pioatcendofqumfrkylv.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpb2F0Y2VuZG9mcXVtZnJreWx2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQyMDgyOSwiZXhwIjoyMDg3OTk2ODI5fQ.hXutM1A0d64G4zFWe5plVHyyG6zJNnmWYb0f5a5kIr4";

// if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
//   throw new Error("Missing Supabase env vars");
// }

// Service role - full DB access, server-side only
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
