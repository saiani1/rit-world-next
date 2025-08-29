import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashAlt } from "react-icons/fa";

import { deleteBlog } from "entities/blog";
import { CommonButton } from "shared/ui";

type ButtonWrapType = {
  id: string;
};

export const ButtonWrap = ({ id }: ButtonWrapType) => {
  const router = useRouter();
  const { blog } = useParams() as { blog: string };

  const handleClickDeleteButton = async () => {
    const params = {
      blog_id: id,
      path: blog,
    };
    const isDeleteBlog = await deleteBlog(params);
    if (isDeleteBlog) {
      router.refresh();
      router.push("/");
    }
  };

  return (
    <ul className="flex gap-x-[4px] items-center">
      <li>
        <Link href={`/edit/${blog}`} className="p-1">
          <TbEdit size={20} stroke="#777" />
        </Link>
      </li>
      <li>
        <CommonButton className="p-1">
          <FaRegTrashAlt
            size={17}
            fill="#777"
            onClick={handleClickDeleteButton}
          />
        </CommonButton>
      </li>
    </ul>
  );
};
