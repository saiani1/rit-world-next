import { SupabaseClient } from "@supabase/supabase-js";

import { supabase as defaultSupabase } from "shared/index";
import { CompanyTableType } from "../model";

export const saveCompany = async (
  data: Partial<CompanyTableType>,
  client?: SupabaseClient
) => {
  const supabaseClient = client || defaultSupabase;
  const { data: insertedData, error } = await supabaseClient
    .from("companies")
    .insert(data)
    .select();

  if (error) throw error;
  return insertedData;
};
