import NewsScreen from "page/News/ui/NewsScreen";
import { getReleaseNotes, getReleaseNotesJP } from "entities/releaseNote";

const NewsPage = async ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  const releaseNoteData =
    locale === "ko" ? await getReleaseNotes() : await getReleaseNotesJP();

  return <>{releaseNoteData && <NewsScreen data={releaseNoteData} />}</>;
};

export default NewsPage;
