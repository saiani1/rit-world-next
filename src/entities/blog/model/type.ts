import { CategoryType } from "entities/category";

export type BlogType = PostBlogType & {
  create_at: string;
  blog_hashtag: BlogHashtagType[];
  category_large: CategoryType;
  category_middle: CategoryType;
};

export type PostBlogType = {
  id?: string;
  subject: string;
  summary: string;
  content: string;
  thumbnail?: string | null;
  large_category_id: string;
  middle_category_id: string;
  path: string;
  is_private?: boolean | string;
};

export type BlogJpType = PostBlogJpType & {
  id: string;
  create_at: string;
  subject: string;
  thumbnail?: string | null;
  blog_hashtag: BlogHashtagType[];
  large_category_id: string;
  middle_category_id: string;
  category_large: CategoryType;
  category_middle: CategoryType;
};

export type PostBlogJpType = {
  path?: string;
  subject: string;
  summary: string;
  content: string;
  locale: string;
  blog_id: string;
  is_private?: boolean | string;
};

export type BlogHashtagType = {
  hashtag_id: {
    id: string;
    name: string;
  };
};
