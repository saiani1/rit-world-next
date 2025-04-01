"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAtom } from "jotai";

import logo from "public/assets/logo.png";
import { loginAtom } from "entities/user";
import { DarkmodeToggle } from "./DarkmodeToggle";
import { HEADER_ARR } from "../lib/constants";
import Link from "next/link";

export const Header = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useAtom(loginAtom);
  const [isActive, setIsActive] = useState("BLOG");
  const handleClick = () => router.push("/");

  const handleClickHeader = (e: React.MouseEvent<HTMLUListElement>) => {
    // const name = e.currentTarget.dataset.name as string;
    const name = (e.target as HTMLElement).closest("li")?.dataset
      .headerId as string;
    setIsActive(name);
    // if (name === "LOG OUT") {
    //   logOutAPI().then(() => {
    //     toast.success("로그아웃 되었습니다.")
    //     setIsLogin(false);
    //   });
    // } else if (name === "LOG IN") router.push("/signin");
  };

  return (
    <header className="flex justify-center items-center w-full min-h-[80px] bg-white">
      <div className="flex justify-between items-center w-[80%] h-full">
        <button type="button" onClick={handleClick}>
          <h1 className="relative flex items-baseline gap-x-[8px] font-bold text-purple-700">
            <Image src={logo} alt="로고" />
          </h1>
        </button>
        <nav>
          <ul
            className="flex items-center gap-x-[3px]"
            onClick={handleClickHeader}
          >
            {HEADER_ARR.map((header) => (
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
