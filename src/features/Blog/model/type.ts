export type BlogType = {
  subject: string;
  summary: string;
  content: string;
  thumbnail: string;
  path: string;
};

export type BlogPostPayloadType = BlogType & {
  large_category_id: string;
  middle_category_id: string;
  hashtags: string[];
};
