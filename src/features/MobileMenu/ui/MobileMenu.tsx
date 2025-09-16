import Image from "next/image";
import { useAtom, useSetAtom } from "jotai";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import Cookies from "js-cookie";

import logo from "public/assets/logo.png";
import { useRouter } from "i18n/routing";
import { Category } from "features/Category";
import { CategoryType } from "entities/category";
import { isLoginAtom } from "entities/user";
import { supabase } from "shared/index";
import { CommonButton } from "shared/ui";
import { isClickMobileMenuAtom } from "../model";

type MobileMenuType = {
  data: CategoryType[];
};

export const MobileMenu = ({ data }: MobileMenuType) => {
  const t = useTranslations("Menu");
  const router = useRouter();
  const [isLogin, setIsLogin] = useAtom(isLoginAtom);
  const setIsClickMenu = useSetAtom(isClickMobileMenuAtom);

  const handleClickLogin = async () => {
    if (isLogin) {
      let { error } = await supabase.auth.signOut();
      if (error) return toast.error("로그아웃이 실패했습니다.");
      Cookies.remove("login");
      setIsLogin(false);
      toast.success("로그아웃 되었습니다.");
    } else router.push("/signin");
    setIsClickMenu(false);
  };

  return (
    <div className="sm:hidden fixed p-8 w-screen h-screen bg-black-FFF z-[1000]">
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between">
            <Image src={logo} alt="로고" />
            <CommonButton>
              <IoClose
                size={32}
                fill="#888"
                onClick={() => setIsClickMenu(false)}
              />
            </CommonButton>
          </div>
          <Category isMobile data={data} />
        </div>
        <CommonButton
          className="p-2 w-full bg-purple-100 text-white font-medium rounded-md"
          onClick={handleClickLogin}
        >
          {isLogin ? t("logout") : t("login")}
        </CommonButton>
      </div>
    </div>
  );
};
