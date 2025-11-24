import { supabase } from "./supabase";
import { v4 as uuid } from "uuid";

export interface Book {
  id: string;
  title: string;
  file_name: string; // ✅ FIXED
  file_size: number;
  status: "done" | "started" | "not-started";
  file_url: string;
  created_at: string;
}




// Get all books
export async function getAllBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching books:", error);
    throw error;
  }

  return data || [];
}

// Delete one book
export async function deleteBook(id: string) {
  const { error } = await supabase.from("books").delete().eq("id", id);

  if (error) {
    console.error("Error deleting book", error);
    throw error;
  }

  return true;
}

// Delete all books
export async function deleteAllBooks() {
  const { error } = await supabase.from("books").delete().neq("id", null);

  if (error) {
    console.error("Error deleting all books:", error);
    throw error;
  }

  return true;
}

// Update status
export async function updateStatus(
  id: string,
  status: "done" | "started" | "not-started"
) {
  const { data, error } = await supabase
    .from("books")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error updating status:", error);
    throw error;
  }

  return data;
}

// Add a new book
export async function addBook(file: File) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${uuid()}.${fileExt}`;
  const filePath = `books/${fileName}`;

  // 1️⃣ Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from("Books")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("File upload failed:", uploadError);
    throw uploadError;
  }

  // 2️⃣ Get public URL
  const { data: urlData } = supabase.storage
    .from("Books")
    .getPublicUrl(filePath);

  const file_url = urlData.publicUrl;

  // 3️⃣ Insert metadata into DB
  const { data, error: insertError } = await supabase
    .from("books")
    .insert({
      title: file.name.replace(".pdf", ""),
      file_name: fileName, // ✅ FIXED COLUMN NAME
      file_size: file.size,
      file_url,
      status: "not-started",
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (insertError) {
    console.error("DB insert failed:", insertError);
    throw insertError;
  }

  return data;
}
