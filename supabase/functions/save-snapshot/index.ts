import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const { email, name, results } = await req.json();
    const cleanEmail = String(email || "").trim().toLowerCase();

    if (!cleanEmail || !results) {
      return new Response("Missing data", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const supabase = createClient(
      Deno.env.get("PROJECT_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    );

    const { error } = await supabase
      .from("realyou_snapshots")
      .upsert(
        {
          email: cleanEmail,
          name: name ?? null,
          results_json: results,
        },
        { onConflict: "email" }
      );

    if (error) {
      return new Response(error.message, {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(String(e), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
