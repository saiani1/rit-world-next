"use server";
import { createClient } from "shared/api/server";

export const getReleaseNotesJP = async () => {
  try {
    const supabase = await createClient();
    const { data: notes, error } = await supabase
      .from("release_note_translation")
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
