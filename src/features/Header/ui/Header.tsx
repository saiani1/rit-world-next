"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";

import logo from "public/assets/logo.png";
import { Link, useRouter } from "i18n/routing";
import { isLoginAtom } from "entities/user";
import { CommonButton, SelectLangBox, supabase } from "shared/index";
import { HeaderType } from "../model";

export const Header = () => {
  const router = useRouter();
  const [isActive, setIsActive] = useState(2);
  const [headerArr, setHeaderArr] = useState<HeaderType>([]);
  const [isLogin, setIsLogin] = useAtom(isLoginAtom);
  const handleClick = () => router.push("/");
  const tH = useTranslations("Header");
  const menuItems: HeaderType = tH.raw("menu");
  const tL = useTranslations("Login");

  const handleClickHeader = async (e: React.MouseEvent<HTMLUListElement>) => {
    const id = Number((e.target as HTMLElement).closest("li")?.dataset.id);
    if (id === undefined) return;
    if (id === 1) setIsActive(id);
    if (id === 1 && isLogin) {
      let { error } = await supabase.auth.signOut();
      if (error) return toast.error("로그아웃이 실패했습니다.");
      Cookies.remove("login");
      setIsLogin(false);
      toast.success("로그아웃 되었습니다.");
      setIsActive(2);
    } else if (id === 1 && !isLogin) router.push("/signin");
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

  console.log("headerArr", headerArr, " tL('login')", tL("login"));

  return (
    <header className="flex justify-center items-center w-full min-h-[80px] bg-white">
      <div className="flex justify-between items-center w-[80%] h-full">
        <CommonButton onClick={handleClick}>
          <h1 className="relative flex items-baseline gap-x-[8px] font-bold text-purple-700">
            <Image src={logo} alt="로고" />
          </h1>
        </CommonButton>
        <nav>
          <ul
            className="flex items-center gap-x-[3px]"
            onClick={handleClickHeader}
          >
            {headerArr &&
              headerArr.map((header) => (
                <li key={header.id} data-id={header.id}>
                  <Link
                    className={`${isActive === header.id ? "bg-purple-100 text-black-FFF" : "text-black-777"} px-[15px] py-[2px] rounded-[5px] text-[17px] font-semibold`}
                    href={header.url}
                  >
                    {header.id === 1 && !isLogin ? tL("login") : header.title}
                  </Link>
                </li>
              ))}
            <li className="ml-[15px]">
              <SelectLangBox />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
