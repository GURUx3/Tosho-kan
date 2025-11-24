"use client";
import { supabase } from "@/lib/supabase";

export default function TestSupabase() {
  const testConnection = async () => {
    const { data, error } = await supabase.from("books").select("*");
    console.log("Data:", data);
    console.log("Error:", error);
  };

  return <button onClick={testConnection}>Test Supabase Connection</button>;
}
