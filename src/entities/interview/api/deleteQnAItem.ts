import { supabase } from "shared/index";

export const deleteQnAItem = async (id: string) => {
  const { error } = await supabase.from("qna_items").delete().eq("id", id);
  if (error) throw error;
};
