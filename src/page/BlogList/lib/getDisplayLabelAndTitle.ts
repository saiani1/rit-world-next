type getDisplayLabelAndTitleType = {
  t: (key: string) => string;
  categoryId?: string | null;
  keyword?: string | null;
  hashtag?: string | null;
  categoryTitle?: string;
};

export const getDisplayLabelAndTitle = ({
  t,
  categoryId,
  keyword,
  hashtag,
  categoryTitle,
}: getDisplayLabelAndTitleType) => {
  if (categoryId) return { label: t("category"), value: categoryTitle ?? "" };
  if (keyword) return { label: t("keyword"), value: keyword };
  if (hashtag) return { label: t("hashtag"), value: hashtag };
  return { label: "", value: t("title") };
};
