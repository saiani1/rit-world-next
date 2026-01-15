"use server";
import { createClient } from "shared/api/server";
import { CompanyTableType } from "../model";

export const getCompanyById = async (id: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as CompanyTableType;
};
