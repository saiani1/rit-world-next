'use client';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';

import { HEADER_ARR } from 'features/Header/lib/constants';
import { loginAtom } from 'entities/user/model/atom';
import logo from 'assets/logo.png';
import Image from 'next/image';

export const Header = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useAtom(loginAtom);
  const handleClick = () => router.push('/');

  const handleClickHeader = (e: React.MouseEvent<HTMLUListElement>) => {
    const name = (e.target as HTMLButtonElement).name;
    if (name === 'LOG OUT') {
      // logOutAPI().then(() => {
      //   toast.success("로그아웃 되었습니다.")
      //   setIsLogin(false);
      // });
    } else if (name === 'LOG IN') router.push('/signin');
  };

  return (
    <header className="flex justify-center items-center w-full min-h-[80px] bg-white">
      <div className="flex justify-between items-center w-[1280px] h-full">
        <button type="button" onClick={handleClick}>
          <h1 className="relative flex items-baseline gap-x-[8px] font-bold text-purple-700">
            <Image src={logo} alt="로고" />
            <span className="absolute bottom-[-6px] right-[-68px] text-[19px] text-[#888] font-medium">
              Admin
            </span>
          </h1>
        </button>
        <nav>
          <ul className="flex gap-x-[30px]" onClick={handleClickHeader}>
            {HEADER_ARR.map((header) => (
              <li key={header.id}>
                <button
                  type="button"
                  className="text-[17px] text-[#777] font-semibold"
                  name={header.id === 1 && !isLogin ? 'LOG IN' : header.title}
                >
                  {header.id === 1 && !isLogin ? 'LOG IN' : header.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};
