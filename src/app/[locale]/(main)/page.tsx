import BlogListScreen from "page/BlogList/ui/BlogListScreen";
import { getBlogList, getBlogListJp } from "entities/blog";

const HomePage = async ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  const blogData =
    locale === "ko" ? await getBlogList() : await getBlogListJp();

  console.log("blogData", blogData);

  return <>{blogData && <BlogListScreen data={blogData} />}</>;
};

export default HomePage;

export const dynamic = "force-dynamic";
