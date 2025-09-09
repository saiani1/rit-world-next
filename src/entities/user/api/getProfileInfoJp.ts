"use server";
import { createClient } from "shared/api/server";
import { ProfileType } from "../model";

export const getProfileInfoJp = async (): Promise<ProfileType> => {
  const supabase = await createClient();

  let { data, error } = await supabase
    .from("user_translation")
    .select(
      `
      *,
      user: user_id (
        portfolio,
        email,
        imgUrl,
        gitHubUrl
      )
    `
    )
    .single();

  if (error || !data) {
    throw new Error("Failed to fetch profile");
  }

  return {
    id: data.id,
    name: data.name,
    job: data.job,
    location: data.location,
    introduce: data.introduce,
    gitHubUrl: data.user.gitHubUrl,
    linkedinUrl: data.linkedinUrl,
    portfolio: data.user.portfolio,
    email: data.user.email,
    imgUrl: data.user.imgUrl,
  };
};
