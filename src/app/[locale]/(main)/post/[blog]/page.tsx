import { notFound } from "next/navigation";

import BlogContentScreen from "page/BlogContent/ui/BlogContentScreen";
import {
  BlogHashtagType,
  getBlogByPath,
  getBlogByPathJp,
  getBlogList,
  getBlogListJp,
} from "entities/blog";
import DefaultImage from "public/assets/image/default-image.jpg";

export const generateStaticParams = async ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  const blogData =
    locale === "ko" ? await getBlogList() : await getBlogListJp();

  if (!blogData) return [];
  return blogData.map((post) => ({
    blog: post.path,
  }));
};

const getPageData = async (locale: string, blog: string) => {
  const blogData =
    locale === "ko" ? await getBlogByPath(blog) : await getBlogByPathJp(blog);

  if (!blogData) {
    notFound();
  }
  return blogData;
};

export const generateMetadata = async ({
  params: { locale, blog },
}: {
  params: { locale: string; blog: string };
}) => {
  const blogData = await getPageData(locale, blog);

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
  const blogData = await getPageData(locale, blog);

  return (
    <>
      <BlogContentScreen data={blogData} />
    </>
  );
};

export default BlogContentPage;
