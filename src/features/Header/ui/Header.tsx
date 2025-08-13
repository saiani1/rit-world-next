"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAtom } from "jotai";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

import logo from "public/assets/logo.png";
import { isLoginAtom } from "entities/user";
import { CommonButton, supabase } from "shared/index";
import { DarkmodeToggle } from "./DarkmodeToggle";
import { HEADER_ARR } from "../lib";
import { HeaderType } from "../model";

export const Header = () => {
  const router = useRouter();
  const [isActive, setIsActive] = useState("BLOG");
  const [headerArr, setHeaderArr] = useState<HeaderType>([]);
  const [isLogin, setIsLogin] = useAtom(isLoginAtom);
  const handleClick = () => router.push("/");

  const handleClickHeader = async (e: React.MouseEvent<HTMLUListElement>) => {
    const name = (e.target as HTMLElement).closest("li")?.dataset
      .name as string;
    if (name === undefined) return;
    if (name !== "LOG OUT" && name !== "LOG IN") setIsActive(name);
    if (name === "LOG OUT") {
      let { error } = await supabase.auth.signOut();
      if (error) return toast.error("로그아웃이 실패했습니다.");
      Cookies.remove("login");
      setIsLogin(false);
      toast.success("로그아웃 되었습니다.");
      setIsActive("BLOG");
    } else if (name === "LOG IN" && !isLogin) router.push("/signin");
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
    if (isLogin) setHeaderArr(HEADER_ARR);
    else {
      const filterdArr: typeof HEADER_ARR = HEADER_ARR.filter((item) => {
        return item.title === "LOG OUT" || item.title === "BLOG";
      });
      setHeaderArr(filterdArr);
    }
  }, [isLogin]);

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
                <li
                  key={header.id}
                  data-name={
                    header.id === 1 && !isLogin ? "LOG IN" : header.title
                  }
                >
                  <Link
                    className={`${isActive === header.title ? "bg-purple-100 text-black-FFF" : "text-black-777"} px-[15px] py-[2px] rounded-[5px] text-[17px] font-semibold`}
                    href={header.url}
                  >
                    {header.id === 1 && !isLogin ? "LOG IN" : header.title}
                  </Link>
                </li>
              ))}
            <li className="ml-[15px]">
              <DarkmodeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
