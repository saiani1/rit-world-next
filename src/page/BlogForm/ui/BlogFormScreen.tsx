"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

import { useRouter } from "i18n/routing";
import {
  BlogOption,
  hashtagListAtom,
  PrivacySelector,
  selectedLargeCategoryAtom,
  selectedMiddleCategoryAtom,
  ThumbnailWithTitle,
} from "features/Blog";
import { CategoryType } from "entities/category";
import {
  BlogJpType,
  BlogType,
  getImageUrl,
  postBlog,
  postBlogJp,
  PostBlogJpType,
  PostBlogType,
  updateBlog,
  updateBlogJp,
  VocabularyType,
} from "entities/blog";
import { CommonButton, CommonInput, Title, CustomViewer } from "shared/ui";

const CustomEditor = dynamic(() => import("shared/ui/CustomEditor"), {
  ssr: false,
});

type BlogFormScreenType = {
  categories: CategoryType[];
  page: string;
  data?: BlogType | BlogJpType;
};

const BlogFormScreen = ({ categories, page, data }: BlogFormScreenType) => {
  const router = useRouter();
  const { blog } = useParams() || {};
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [blogData, setBlogData] = useState<BlogType | BlogJpType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [vocabList, setVocabList] = useState<
    Omit<VocabularyType, "id" | "created_at">[]
  >([]);
  const [selectedVocabList, setSelectedVocabList] = useState<
    Omit<VocabularyType, "id" | "created_at">[]
  >([]);
  const [selectedLCate, setSelectedLCate] = useAtom(selectedLargeCategoryAtom);
  const [selectedMCate, setSelectedMCate] = useAtom(selectedMiddleCategoryAtom);
  const [hashtags, setHashtags] = useAtom(hashtagListAtom);

  const { getValues, setValue, watch, register, control, handleSubmit, reset } =
    useForm<BlogType | BlogJpType>();

  useEffect(() => {
    if (page !== "create" && data) {
      if (data.blog_hashtag) {
        const hashtagNames: string[] = data.blog_hashtag.map(
          (item) => item.hashtag_id.name
        );
        setHashtags(hashtagNames);
      }
      setBlogData(data);
      setPreviewUrl(data.thumbnail || null);
      const categoryL = categories.find(
        (cate) => cate.title === data.category_large?.title
      );
      setSelectedLCate(categoryL);
      const categoryM = categories.find(
        (cate) => cate.title === data.category_middle?.title
      );
      setSelectedMCate(categoryM);
      reset(data);

      // 기존 한국어 어휘 초기화 (수정 모드일 때 data에 들어있는 blog_vocabularies 바로 활용)
      if (
        page === "edit" &&
        "blog_vocabularies" in data &&
        data.blog_vocabularies
      ) {
        const list = data.blog_vocabularies
          .map((item) => ({
            word: item.vocabularies?.word || "",
            reading: item.vocabularies?.reading || "",
            meaning: item.vocabularies?.meaning || "",
            category_id: item.vocabularies?.category_id || null,
          }))
          .filter((v) => v.word !== "");
        setVocabList(list);
        setSelectedVocabList(list);
      }
    }
    if (page === "create") {
      setSelectedLCate(RESET);
      setSelectedMCate(RESET);
      setHashtags(RESET);
      setVocabList([]);
      setSelectedVocabList([]);
    }
  }, [page, data]);

  const handleChangeFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const toggleSelectVocab = (
    vocab: Omit<VocabularyType, "id" | "created_at">
  ) => {
    setSelectedVocabList((prev) => {
      const exists = prev.some((v) => v.word === vocab.word);
      if (exists) {
        return prev.filter((v) => v.word !== vocab.word);
      } else {
        return [...prev, vocab];
      }
    });
  };

  const handleAnalyzeVocab = async () => {
    const content = getValues("content");
    if (!content || content.trim() === "") {
      toast.error("분석할 본문 내용을 입력해주세요.");
      return;
    }

    setIsAnalyzing(true);
    const toastId = toast.loading(
      "AI가 본문에서 일본어 어휘를 추출하고 있습니다..."
    );

    try {
      const response = await fetch("/api/analyze-vocab", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: content }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const resData = await response.json();
      if (resData && resData.success && Array.isArray(resData.data)) {
        const list = resData.data.map((item: any) => ({
          word: item.word || "",
          reading: item.reading || "",
          meaning: item.meaning || "",
          category_id: null,
        }));
        setVocabList(list);
        setSelectedVocabList(list);
        toast.success("성공적으로 어휘를 추출했습니다!", { id: toastId });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("AI Vocabulary Analysis failed:", error);
      toast.error("어휘 추출 중 오류가 발생했습니다.", { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onSubmit = async (data: PostBlogType | PostBlogJpType) => {
    if (!selectedLCate || !selectedMCate || !data.path) {
      toast.error("빈칸을 입력하세요.");
      return;
    }
    setValue("large_category_id", selectedLCate?.id);
    setValue("middle_category_id", selectedMCate?.id);
    // previewUrl에 path가 포함되어 있으면 supabase에 업로드 하는 절차를 패스한다.
    const isSameImg = page !== "create" && previewUrl?.includes(blog as string);
    if (!isSameImg && previewUrl !== null) {
      const thumbnailParams = {
        file: imageFile!,
        path: `blog-thumbnail/${data.path}`,
      };
      const publicUrl = await getImageUrl(thumbnailParams);
      if (publicUrl) setValue("thumbnail", publicUrl);
      else {
        toast.error("썸네일 추가에 실패했습니다. 다시 시도해주세요.");
        return;
      }
    }
    if (previewUrl === null) setValue("thumbnail", null);

    const isBloging = async () => {
      let isTrue: Boolean;
      switch (page) {
        case "edit": {
          isTrue = await updateBlog({
            data: getValues() as BlogType,
            hashtags,
            vocabList: selectedVocabList,
          });
          break;
        }
        case "translate": {
          setValue("blog_id", blogData?.id!);
          setValue("locale", "jp");
          isTrue = await postBlogJp({
            data: getValues() as BlogJpType,
            hashtags,
          });
          break;
        }
        case "editTranslate": {
          isTrue = await updateBlogJp({
            data: getValues() as BlogJpType,
            hashtags,
          });
          break;
        }
        case "create": {
          isTrue = await postBlog({
            data: getValues() as BlogType,
            hashtags,
            vocabList: selectedVocabList,
          });
          break;
        }
        default:
          isTrue = false;
      }
      return isTrue;
    };
    if (await isBloging()) {
      toast.success(
        `블로그 ${page === "edit" ? "수정" : "발행"}에 성공했습니다.`
      );
      setSelectedLCate(RESET);
      setSelectedMCate(RESET);
      setHashtags(RESET);
      router.push("/");
    } else
      toast.error(
        `블로그 ${page === "edit" ? "수정" : "발행"}에 실패했습니다.`
      );
  };

  const handleClickResetBtn = () => {
    router.back();
  };

  const title = () => {
    switch (page) {
      case "edit":
      case "editTranslate":
        return "포스트 수정";
      case "translate":
        return "포스트 번역";
      default:
        return "포스트 작성";
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={(e) => {
        if (
          e.key === "Enter" &&
          (e.target as HTMLElement).tagName !== "TEXTAREA"
        ) {
          e.preventDefault();
        }
      }}
      className="sm:mx-0 mx-[20px] h-full flex flex-col"
    >
      <div className="sticky top-0 flex justify-between items-center pb-[15px] mb-[10px] bg-black-10 pt-[20px] z-[100]">
        <Title name={title()} />
        <div className="flex gap-x-[5px]">
          <CommonButton
            onClick={handleClickResetBtn}
            className="px-3 py-1 text-[14px] text-white bg-black-AAA rounded-md"
          >
            취소
          </CommonButton>
          <CommonButton
            type="submit"
            className="px-3 py-1 text-[14px] text-white bg-purple-100 rounded-md"
          >
            {page === "edit" ? "수정" : "발행"}
          </CommonButton>
        </div>
      </div>
      <ThumbnailWithTitle
        previewUrl={previewUrl}
        handleChange={handleChangeFileInput}
        titleData={blogData?.subject}
        page={page}
        {...register("subject")}
      />
      {hashtags && (
        <BlogOption
          categories={categories!}
          disabled={page === "translate" || page === "editTranslate"}
        />
      )}
      <div className="flex flex-col gap-y-2 mb-[20px]">
        <CommonInput
          className="px-[10px] w-full h-[34px] bg-black-F5 rounded-[5px] text-[13px]"
          placeholder="요약글을 입력하세요."
          {...register("summary")}
        />
        <div className="flex justify-between items-center gap-x-2 w-full">
          <CommonInput
            className={`flex-1 px-[10px] w-full h-[34px] rounded-[5px] text-[13px] ${page !== "create" ? "text-black-BBB bg-black-DDD cursor-not-allowed" : "bg-black-F5"}`}
            placeholder="path를 입력하세요."
            defaultValue=""
            disabled={page !== "create"}
            {...register("path")}
          />
          <PrivacySelector control={control} name="is_private" />
        </div>
      </div>

      <div className={`${page === "translate" ? "flex gap-x-5" : ""}`}>
        <div className={`${page === "translate" ? "w-1/2" : "hidden"}`}>
          {blogData && <CustomViewer initialValue={blogData?.content} />}
        </div>
        <div className={`${page === "translate" ? "w-1/2" : ""}`}>
          <CustomEditor
            control={control}
            name="content"
            path={watch("path") ?? ""}
            initialValue={watch("content")}
            page={page}
          />
        </div>
      </div>

      {/* AI 일본어 어휘 추출 섹션 */}
      {page !== "translate" && page !== "editTranslate" && (
        <div className="bg-black-10 rounded-[12px] p-5 mt-5 border border-purple-50 flex flex-col gap-y-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="flex justify-between items-start sm:items-center gap-4 flex-col sm:flex-row">
            <div className="flex flex-col">
              <h3 className="text-black-333 text-[15px] font-bold flex items-center gap-x-2">
                🧠 AI 일본어 어휘 추출
              </h3>
              <p className="text-black-777 text-[12px] mt-1">
                본문에 작성된 일본어 내용 중 어려운 어휘를 자동으로 추출하고
                정리합니다.
              </p>
            </div>
            <CommonButton
              onClick={handleAnalyzeVocab}
              disabled={isAnalyzing}
              className={`px-4 py-1.5 text-[13px] font-medium text-white rounded-md flex items-center gap-x-1.5 transition-all duration-200 ${
                isAnalyzing
                  ? "bg-purple-100/50 cursor-not-allowed animate-pulse"
                  : "bg-purple-100 hover:bg-purple-100/90 active:scale-95"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  분석 중...
                </>
              ) : (
                "어휘 추출하기"
              )}
            </CommonButton>
          </div>

          {vocabList.length > 0 && (
            <div className="flex flex-col gap-y-2 mt-1">
              <div className="flex justify-between items-center text-[12px] text-black-777 border-b border-black-EEE pb-2">
                <span>
                  추출된 어휘 ({selectedVocabList.length} / {vocabList.length}{" "}
                  선택됨)
                </span>
                <div className="flex gap-x-2">
                  <CommonButton
                    onClick={() => setSelectedVocabList(vocabList)}
                    className="hover:text-purple-100 font-medium transition-colors"
                  >
                    전체 선택
                  </CommonButton>
                  <span className="text-black-DDD">|</span>
                  <CommonButton
                    onClick={() => setSelectedVocabList([])}
                    className="hover:text-purple-100 font-medium transition-colors"
                  >
                    선택 해제
                  </CommonButton>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 mt-1.5 max-h-[250px] overflow-y-auto pr-1">
                {vocabList.map((vocab) => {
                  const checked = selectedVocabList.some(
                    (v) => v.word === vocab.word
                  );
                  return (
                    <CommonButton
                      key={vocab.word}
                      onClick={() => toggleSelectVocab(vocab)}
                      className={`inline-flex items-center px-4 py-2 border rounded-[12px] text-[13px] transition-all duration-200 select-none cursor-pointer active:scale-[0.96] gap-x-2.5 ${
                        checked
                          ? "bg-purple-50/10 border-purple-100 text-black-333 shadow-[0_2px_4px_rgba(107,33,168,0.04)]"
                          : "bg-white border-black-EEE text-black-777 opacity-75 hover:opacity-100 hover:border-purple-100/30"
                      }`}
                    >
                      <div className="flex items-center select-none">
                        <div
                          className={`w-[14px] h-[14px] rounded-full flex items-center justify-center transition-all ${
                            checked
                              ? "bg-purple-100 text-white"
                              : "border border-black-AAA/40"
                          }`}
                        >
                          {checked && (
                            <svg
                              className="w-2 h-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-baseline gap-x-1 min-w-0 text-left">
                        <span
                          className={`font-bold transition-colors ${checked ? "text-purple-100" : "text-black-333"}`}
                        >
                          {vocab.word}
                        </span>
                        {vocab.reading && (
                          <span
                            className={`text-[11px] font-medium font-sans ${checked ? "text-purple-100" : "text-purple-100/70"}`}
                          >
                            [{vocab.reading}]
                          </span>
                        )}
                        <span className="text-black-BBB text-[11px] select-none">
                          :
                        </span>
                        <span
                          className={
                            checked ? "text-black-555" : "text-black-777"
                          }
                        >
                          {vocab.meaning}
                        </span>
                      </div>
                    </CommonButton>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export default BlogFormScreen;
