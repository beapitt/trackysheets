import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nmthfzhdwukjhgezuqrj.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tdGhmemhkd3VramhnZXp1cXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NjM4ODMsImV4cCI6MjA5MjQzOTg4M30.Ju50EL8mZeG_KN8PuhLbuEMcZ3rTU_j6jNhERD9-tzw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
