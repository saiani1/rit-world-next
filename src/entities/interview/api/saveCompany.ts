import { supabase } from "shared/index";
import { CompanyTableType } from "../model";

export const saveCompany = async (data: CompanyTableType) => {
  const { error } = await supabase.from("companies").insert(data);

  if (error) throw error;
};
