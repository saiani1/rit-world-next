import { supabase } from "shared/index";

type getImageUrlType = {
  file: File;
  path: string;
};

export const getImageUrl = async ({ file, path }: getImageUrlType) => {
  try {
    const { error } = await supabase.storage.from("blog").upload(path, file);
    if (error) console.log(error);

    const publicUrl = supabase.storage.from("blog").getPublicUrl(path)
      .data.publicUrl;

    return publicUrl;
  } catch (err) {
    console.error(err);
  }
};
