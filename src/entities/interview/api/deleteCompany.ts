import { supabase } from "shared/index";

export const deleteCompany = async (id: string) => {
  const { error } = await supabase.from("companies").delete().eq("id", id);

  if (error) {
    console.error("Error deleting company:", error);
    throw new Error("Failed to delete company.");
  }
};
