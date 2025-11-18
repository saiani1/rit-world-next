"use server";
import { createClient } from "shared/api/server";

// 한국어 릴리스 노트 불러오기
export const getReleaseNotes = async () => {
  try {
    const supabase = await createClient();
    const { data: notes, error } = await supabase
      .from("release_note")
      .select("*")
      .order("update_at", { ascending: false });

    if (error) {
      console.error(error);
      return [];
    }

    return notes;
  } catch (err) {
    console.error(err);
    return [];
  }
};
