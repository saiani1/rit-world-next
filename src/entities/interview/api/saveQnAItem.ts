import { supabase } from "shared/index";
import { QnAItemType } from "../model";

type SaveQnAItemParams = {
  datas: QnAItemType;
};

export const saveQnAItem = async ({
  datas,
}: SaveQnAItemParams): Promise<QnAItemType> => {
  const { data, error } = await supabase
    .from("qna_items")
    .insert({
      ...datas,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};
