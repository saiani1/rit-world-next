export type BlogType = {
  id?: string;
  create_at?: string;
  subject: string;
  summary: string;
  content: string;
  thumbnail: string;
  path: string;
  large_category_id: string;
  middle_category_id: string;
  blog_hashtag?: BlogHashtagType[];
  category_large?: BlogCategoryType;
  category_middle?: BlogCategoryType;
};

type BlogHashtagType = {
  hashtag_id: {
    id: string;
    name: string;
  };
};

type BlogCategoryType = {
  title: string;
};
