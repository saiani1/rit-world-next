"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { IoMenu } from "react-icons/io5";

import logo from "public/assets/logo.png";
import { Link, useRouter, usePathname } from "i18n/routing";
import { isLoginAtom } from "entities/user";
import { CategoryType } from "entities/category";
import { CommonButton, SelectLangBox, supabase } from "shared/index";
import { HeaderType } from "../model";
import { MobileMenu } from "./MobileMenu";
import { isClickMobileMenuAtom } from "features/Category";

type HeaderCompType = {
  data: CategoryType[];
};

export const Header = ({ data }: HeaderCompType) => {
  const router = useRouter();
  const pathname = usePathname();
  const [headerArr, setHeaderArr] = useState<HeaderType>([]);
  const [isLogin, setIsLogin] = useAtom(isLoginAtom);
  const [isClickMenu, setIsClickMenu] = useAtom(isClickMobileMenuAtom);
  const handleLogoClick = () => router.push("/");
  const tH = useTranslations("Header");
  const menuItems: HeaderType = tH.raw("menu");
  const tL = useTranslations("Login");

  const handleAuthClick = async () => {
    if (isLogin) {
      let { error } = await supabase.auth.signOut();
      if (error) return toast.error("로그아웃이 실패했습니다.");
      Cookies.remove("login");
      setIsLogin(false);
      toast.success("로그아웃 되었습니다.");
    } else {
      router.push("/signin");
    }
  };

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) Cookies.remove("login");
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setHeaderArr(menuItems);
  }, [isLogin, tH]);

  return (
    <>
      {isClickMenu && <MobileMenu data={data} />}
      <header className="flex justify-center items-center w-full min-h-[80px] bg-black-10">
        <div className="flex justify-between items-center lg:w-[80%] md:w-full sm:w-full w-full lg:px-0 md:px-[50px] sm:px-[50px] px-[20px] h-full">
          <CommonButton onClick={handleLogoClick}>
            <h1 className="relative flex items-baseline gap-x-[8px] font-bold text-purple-700">
              <Image src={logo} alt="로고" />
            </h1>
          </CommonButton>
          <nav>
            <ul className="flex items-center gap-x-[3px]">
              {headerArr &&
                headerArr.map((header) => {
                  if (header.id === 1) {
                    return (
                      <li key={header.id} className="hidden sm:flex">
                        <CommonButton
                          onClick={handleAuthClick}
                          className={`${pathname === "/signin" ? "bg-purple-100 text-black-FFF" : "text-black-777"} px-[15px] py-[2px] rounded-[5px] text-[17px] font-semibold`}
                        >
                          {!isLogin ? tL("login") : header.title}
                        </CommonButton>
                      </li>
                    );
                  }
                  return (
                    <li key={header.id} className="hidden sm:flex">
                      <Link
                        className="bg-purple-100 text-black-FFF px-[15px] py-[2px] rounded-[5px] text-[17px] font-semibold"
                        href={header.url}
                      >
                        {header.title}
                      </Link>
                    </li>
                  );
                })}
              <li className="hidden sm:flex ml-[15px]">
                <SelectLangBox />
              </li>
              <li className="block sm:hidden">
                <CommonButton onClick={() => setIsClickMenu(true)}>
                  <IoMenu size={30} stroke="#888" className="mt-[8px]" />
                </CommonButton>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};
