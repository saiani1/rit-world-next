"use server";
import { createClient } from "shared/api/server";
import { CompanyTableType } from "../model";

export const getCompanyList = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("companies")
    .select("id, name, type, applied_at, status, result, next_step_date")
    .order("applied_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as
    | Pick<
        CompanyTableType,
        | "id"
        | "name"
        | "type"
        | "applied_at"
        | "status"
        | "result"
        | "next_step_date"
      >[]
    | [];
};
