"use server";
import { createClient } from "shared/api/server";
import { revalidatePath } from "next/cache";

export const deleteInterview = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase.from("interviews").delete().eq("id", id);

  if (error) throw error;

  revalidatePath("/interview");
};
