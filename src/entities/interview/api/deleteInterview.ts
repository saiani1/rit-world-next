"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "shared/api/server";

export const deleteInterview = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase.from("interviews").delete().eq("id", id);

  if (error) throw error;

  revalidatePath("/interview");
};
