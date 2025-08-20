import Link from "next/link";
import { usePathname } from "next/navigation";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashAlt } from "react-icons/fa";

import { CommonButton } from "shared/ui";

export const ButtonWrap = () => {
  const pathname = usePathname();
  const handleClickDeleteButton = () => {};

  return (
    <ul className="flex gap-x-[4px] items-center">
      <li>
        <Link href={`/edit${pathname}`} className="p-1">
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
