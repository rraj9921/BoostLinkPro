import axios from "axios";
import { createClient } from "@/lib/supabase/client";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// Attach Supabase JWT to every request
api.interceptors.request.use(async (config) => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Global error handling
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg = error.response?.data?.error || "Something went wrong";
    return Promise.reject(new Error(msg));
  }
);

export default api;
