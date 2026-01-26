import { supabase } from "shared/index";

export const deleteInterviewSet = async (id: string) => {
  const { error } = await supabase.from("interview_sets").delete().eq("id", id);
  if (error) throw error;
};
