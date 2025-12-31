"use server";
import { createClient } from "shared/api/server";
import { revalidatePath } from "next/cache";
import { InterviewType } from "../model/type";

export const updateInterview = async (
  id: string,
  data: Partial<InterviewType>
) => {
  const supabase = createClient();
  const { error } = await supabase.from("interviews").update(data).eq("id", id);

  if (error) throw error;

  revalidatePath("/interview");
  revalidatePath(`/interview/${id}`);
};
