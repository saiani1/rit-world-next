import BlogListScreen from "pages/BlogList/ui/BlogListScreen";
import { getBlogList, getBlogListJp } from "entities/blog";

const HomePage = async ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  const blogData =
    locale === "ko" ? await getBlogList() : await getBlogListJp();

  return <>{blogData && <BlogListScreen data={blogData} />}</>;
};

export default HomePage;

export const dynamic = "force-dynamic";
