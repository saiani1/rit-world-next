"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAtom } from "jotai";
import { motion } from "framer-motion";

import logo from "public/assets/logo.png";
import { DarkmodeToggle } from "./DarkmodeToggle";
import { loginAtom } from "entities/user";
import { HEADER_ARR } from "../lib/constants";

export const Header = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useAtom(loginAtom);
  const [isActive, setIsActive] = useState("BLOG");
  const handleClick = () => router.push("/");

  const handleClickHeader = (e: React.MouseEvent<HTMLUListElement>) => {
    const name = (e.target as HTMLButtonElement).name;
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
              <li key={header.id}>
                <motion.button
                  type="button"
                  className={`${isActive === header.title ? "bg-purple-100 text-black-FFF" : "text-black-777"} px-[15px] py-[2px] rounded-[5px] text-[17px] font-semibold`}
                  name={header.id === 1 && !isLogin ? "LOG IN" : header.title}
                >
                  {header.id === 1 && !isLogin ? "LOG IN" : header.title}
                </motion.button>
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
