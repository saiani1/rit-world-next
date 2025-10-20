import BlogContentScreen from "page/BlogContent/ui/BlogContentScreen";
import { BlogHashtagType, getBlogList, getBlogListJp } from "entities/blog";
import DefaultImage from "public/assets/image/default-image.jpg";

export const generateMetadata = async ({
  params: { locale, blog },
}: {
  params: { locale: string; blog: string };
}) => {
  const blogData =
    locale === "ko" ? await getBlogList() : await getBlogListJp();
  const filteredData = blogData?.find((blogItem) => blogItem.path === blog);

  const keywords = filteredData?.blog_hashtag
    ?.map((hash: BlogHashtagType) => hash.hashtag_id.name)
    .join(", ");

  return {
    title: filteredData?.subject,
    description: filteredData?.summary,
    keywords: keywords,
    openGraph: {
      title: filteredData?.subject,
      description: filteredData?.summary,
      url: `https://ritworld.dev/${locale}/post/${blog}`,
      images: [
        {
          url: filteredData?.thumbnail || DefaultImage,
          alt: filteredData?.subject,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: filteredData?.subject,
      description: filteredData?.summary,
      images: [filteredData?.thumbnail || DefaultImage],
    },
  };
};

const BlogContentPage = async ({
  params: { locale, blog },
}: {
  params: { locale: string; blog: string };
}) => {
  const blogData =
    locale === "ko" ? await getBlogList() : await getBlogListJp();
  const filteredData = blogData?.find((blogItem) => blogItem.path === blog);

  return (
    <>
      <BlogContentScreen data={filteredData} />
    </>
  );
};

export default BlogContentPage;
