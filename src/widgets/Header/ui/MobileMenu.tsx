"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAtom, useSetAtom } from "jotai";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { IoClose } from "react-icons/io5";

import logo from "public/assets/logo.png";
import { Link, useRouter } from "i18n/routing";
import { isClickMobileMenuAtom } from "features/Category";
import { isLoginAtom } from "entities/user";
import { supabase } from "shared/index";
import { CommonButton, SelectLangBox } from "shared/ui";
import { HeaderType } from "../model";

export const MobileMenu = () => {
  const router = useRouter();
  const [menuArr, setMenuArr] = useState<HeaderType>([]);
  const [isLogin, setIsLogin] = useAtom(isLoginAtom);
  const setIsClickMenu = useSetAtom(isClickMobileMenuAtom);
  const tH = useTranslations("Header");
  const tL = useTranslations("Login");
  const menuItems: HeaderType = tH.raw("menu");

  useEffect(() => {
    const filteredMenu = menuItems.filter((item) => item.id !== 1);
    setMenuArr(filteredMenu);
  }, [isLogin, tH]);

  const buttonStyle =
    "ml-[-14px] text-black-888 px-[15px] py-[2px] rounded-[5px] text-[24px] font-medium";

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
    <motion.nav
      key="mobile-menu"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="sm:hidden fixed p-8 w-screen h-screen bg-black-FFF z-[1000] overflow-auto"
    >
      <div className="flex flex-col h-full">
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
        </div>
        <div className="flex flex-col h-full justify-between">
          <ul className="flex flex-col gap-y-4 mt-[44px]">
            {menuArr &&
              menuArr.map((menu) => (
                <li key={menu.id}>
                  <Link
                    className={`${buttonStyle} flex justify-between items-center`}
                    href={menu.url}
                    onClick={() => setIsClickMenu(false)}
                  >
                    <span>{menu.title}</span>
                  </Link>
                </li>
              ))}
          </ul>
          <div className="flex flex-col gap-y-4">
            <SelectLangBox isMobile />
            <CommonButton
              onClick={handleClickLogin}
              className="py-[8px] mb-[30px] w-full bg-purple-100 text-white font-medium text-[20px] rounded-md"
            >
              {isLogin ? tL("logout") : tL("login")}
            </CommonButton>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
