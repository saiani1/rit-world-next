import { useParams } from "next/navigation";
import { useSetAtom } from "jotai";
import { useLocale, useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashAlt } from "react-icons/fa";
import { BsTranslate } from "react-icons/bs";

import { useRouter } from "i18n/routing";
import { ModalAtom } from "features/Modal";
import { deleteBlog, deleteBlogJp } from "entities/blog";
import { CommonButton } from "shared/ui";

type ButtonWrapType = {
  id: string;
};

export const ButtonWrap = ({ id }: ButtonWrapType) => {
  const t = useTranslations("Blog");
  const locale = useLocale();
  const router = useRouter();
  const setModalData = useSetAtom(ModalAtom);
  const { blog } = useParams() as { blog: string };

  const callDeleteBlog = async () => {
    let isDeleteBlog;
    if (locale === "ko") {
      const params = {
        blog_id: id,
        path: blog,
      };
      isDeleteBlog = await deleteBlog(params);
    } else {
      const params = {
        blog_id: id,
      };
      isDeleteBlog = await deleteBlogJp(params);
    }
    if (isDeleteBlog) {
      toast.success(t("deleteSuccess"));
      router.refresh();
      router.push("/");
    }
  };

  const handleClickDeleteButton = () => {
    router.push("/confirm");
    setModalData({
      title: t("deleteBlog"),
      description: t("deleteDescription"),
      confirm: callDeleteBlog,
    });
  };

  const handleClickEditButton = () => {
    router.push("/confirm");
    setModalData({
      title: t("editBlog"),
      description: t("editDescription"),
      confirm: () => router.push(`/edit/${blog}`),
    });
  };

  const handleClickTranslateButton = () => {
    router.push("/confirm");
    setModalData({
      title: t("translateBlog"),
      description: t("translateDescription"),
      confirm: () => router.push(`/translate/${blog}`),
    });
  };

  return (
    <ul className="flex gap-x-[4px] items-center">
      <li>
        <CommonButton
          className="p-1"
          onClick={handleClickEditButton}
          title={t("edit")}
        >
          <TbEdit size={20} stroke="#777" />
        </CommonButton>
      </li>
      {locale === "ko" && (
        <li>
          <CommonButton
            className="p-1"
            onClick={handleClickTranslateButton}
            title={t("translate")}
          >
            <BsTranslate size={18} fill="#777" />
          </CommonButton>
        </li>
      )}
      <li>
        <CommonButton
          className="p-1"
          onClick={handleClickDeleteButton}
          title={t("delete")}
        >
          <FaRegTrashAlt size={17} fill="#777" />
        </CommonButton>
      </li>
    </ul>
  );
};
