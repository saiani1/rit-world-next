import { supabase } from "shared/index";

type getThumbnailType = {
  file: File;
  path: string;
};

export const getThumbnailUrl = async ({ file, path }: getThumbnailType) => {
  const {} = await supabase.storage
    .from("blog")
    .upload(`blog-thumbnail/${path}`, file);

  const publicUrl = supabase.storage
    .from("blog")
    .getPublicUrl(`blog-thumbnail/${path}`).data.publicUrl;

  return publicUrl;
};
