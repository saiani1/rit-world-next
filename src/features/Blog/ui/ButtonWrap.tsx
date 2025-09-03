import { useParams } from "next/navigation";
import { useSetAtom } from "jotai";
import toast from "react-hot-toast";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashAlt } from "react-icons/fa";

import { useRouter } from "i18n/routing";
import { ModalAtom } from "features/Modal";
import { deleteBlog } from "entities/blog";
import { CommonButton } from "shared/ui";

type ButtonWrapType = {
  id: string;
};

export const ButtonWrap = ({ id }: ButtonWrapType) => {
  const router = useRouter();
  const setModalData = useSetAtom(ModalAtom);
  const { blog } = useParams() as { blog: string };

  const handleClickDeleteButton = () => {
    router.push(`/post/${blog}/confirm`);
    setModalData({
      title: "블로그 삭제",
      description: "해당 블로그를 삭제하시겠습니까?",
      confirm: callDeleteBlog,
    });
  };

  const callDeleteBlog = async () => {
    const params = {
      blog_id: id,
      path: blog,
    };
    const isDeleteBlog = await deleteBlog(params);
    if (isDeleteBlog) {
      toast.success("블로그가 삭제되었습니다.");
      router.refresh();
      router.push("/");
    }
  };

  const handleClickEditButton = () => {
    router.push(`/post/${blog}/confirm`);
    setModalData({
      title: "블로그 수정",
      description: "해당 블로그를 수정하시겠습니까?",
      confirm: () => router.push(`/edit/${blog}`),
    });
  };

  return (
    <ul className="flex gap-x-[4px] items-center">
      <li>
        <CommonButton className="p-1" onClick={handleClickEditButton}>
          <TbEdit size={20} stroke="#777" />
        </CommonButton>
      </li>
      <li>
        <CommonButton className="p-1" onClick={handleClickDeleteButton}>
          <FaRegTrashAlt size={17} fill="#777" />
        </CommonButton>
      </li>
    </ul>
  );
};
