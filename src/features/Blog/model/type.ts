export type BlogType = {
  subject: string;
  summary: string;
  content: string;
  thumbnail: string;
};

export type BlogPostPayload = BlogType & {
  large_category_id: string;
  middle_category_id: string;
  hashtags: string[];
};
