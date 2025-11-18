import { cache } from "react";
import { notFound } from "next/navigation";

import BlogContentScreen from "page/BlogContent/ui/BlogContentScreen";
import DefaultImage from "public/assets/image/default-image.jpg";
import { BlogHashtagType, getBlogByPath, getBlogByPathJp } from "entities/blog";

const getCachedBlogData = cache(async (locale: string, blog: string) => {
  return locale === "ko"
    ? await getBlogByPath(blog)
    : await getBlogByPathJp(blog);
});

export const generateMetadata = async ({
  params: { locale, blog },
}: {
  params: { locale: string; blog: string };
}) => {
  const blogData = await getCachedBlogData(locale, blog);

  if (!blogData) {
    return { title: "Not Found", description: "The page was not found." };
  }

  const keywords =
    blogData.blog_hashtag
      ?.map((hash: BlogHashtagType) => hash.hashtag_id.name)
      .join(", ") || "";

  return {
    title: blogData.subject,
    description: blogData.summary,
    keywords: keywords,
    openGraph: {
      title: blogData.subject,
      description: blogData.summary,
      url: `https://ritworld.dev/${locale}/post/${blog}`,
      images: [
        {
          url: blogData.thumbnail || DefaultImage.src,
          alt: blogData.subject,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blogData.subject,
      description: blogData.summary,
      images: [blogData.thumbnail || DefaultImage.src],
    },
  };
};

const BlogContentPage = async ({
  params: { locale, blog },
}: {
  params: { locale: string; blog: string };
}) => {
  const blogData = await getCachedBlogData(locale, blog);

  if (!blogData) {
    notFound();
  }

  return (
    <>
      <BlogContentScreen data={blogData} />
    </>
  );
};

export default BlogContentPage;
