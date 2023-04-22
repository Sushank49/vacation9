"use strict";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://edqpwnedqmakhmbqmhnz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcXB3bmVkcW1ha2htYnFtaG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAxNzAzMDYsImV4cCI6MTk5NTc0NjMwNn0.n8R7n_2Sk3eTWnwp4bFJwkfyLr3Zlv78kf99ye_s0AI";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
