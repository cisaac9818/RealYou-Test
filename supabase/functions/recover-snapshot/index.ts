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

  if (req.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const email = String(url.searchParams.get("email") || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return new Response("Missing email", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const supabase = createClient(
      Deno.env.get("PROJECT_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase
      .from("realyou_snapshots")
      .select("email,name,results_json")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      return new Response(error.message, {
        status: 500,
        headers: corsHeaders,
      });
    }

    if (!data) {
      return new Response("Not found", {
        status: 404,
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify({
        row: {
          email: data.email,
          name: data.name,
          result_snapshot: data.results_json,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    return new Response(String(e), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
