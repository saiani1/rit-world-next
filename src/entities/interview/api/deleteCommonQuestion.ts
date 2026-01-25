import { supabase } from "shared/index";

export const deleteCommonQuestion = async (id: string) => {
  const { error } = await supabase
    .from("common_questions")
    .delete()
    .eq("id", id);
  if (error) throw error;
};
