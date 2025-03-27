"use client";
import { Category } from "features/Category";
import { Header } from "features/Header";
import { ProfileAside } from "features/Profile";
import { usePathname } from "next/navigation";

const ClientComponent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  if (pathname === "/signin" || pathname === "/signup") return <>{children}</>;

  return (
    <div className="flex flex-col items-center w-full max-h-[1000px]">
      <Header />
      <div className="flex justify-between w-[80%] mt-[10px] mb-[40px] gap-x-[10px] overflow-hidden">
        <div className="flex flex-col">
          <ProfileAside />
          <Category />
        </div>
        <div className="pt-[105px] px-[50px] pb-[40px] w-full bg-white rounded-xl overflow-scroll">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
