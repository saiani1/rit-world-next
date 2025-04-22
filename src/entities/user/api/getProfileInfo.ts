"use server";
import { createClient } from "shared/api/server";
import { ProfileType } from "../model";

export const getProfileInfo = async (): Promise<ProfileType> => {
  const supabase = await createClient();
  let { data, error } = await supabase.from("user").select("*").single();

  if (error || !data) {
    throw new Error("Failed to fetch profile");
  }
  return data;
};
