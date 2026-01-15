import { supabase } from "shared/index";
import { CompanyTableType } from "../model";

export const updateCompany = async (
  id: string,
  data: Partial<CompanyTableType>
) => {
  const { error } = await supabase.from("companies").update(data).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};
