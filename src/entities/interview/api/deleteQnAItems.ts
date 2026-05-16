import { supabase } from "shared/index";

export const deleteQnAItems = async (ids: string[]) => {
  const { error } = await supabase.from("qna_items").delete().in("id", ids);
  if (error) throw error;
};
