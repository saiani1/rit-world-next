"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Category } from "features/Category";
import { Header } from "features/Header";
import { ProfileAside, ProfileType } from "features/Profile";
import { supabase } from "shared/index";

const ClientComponent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [profileData, setProfileData] = useState<ProfileType>();

  useEffect(() => {
    (async () => {
      let { data: user, error } = await supabase
        .from("user")
        .select("*")
        .single();
      if (error) console.log("프로필 로드에 실패했습니다.");
      else setProfileData(user);
    })();
  }, []);

  if (pathname === "/signin") return <>{children}</>;

  return (
    <div className="flex flex-col items-center w-full max-h-[1000px]">
      <Header />
      <div className="flex justify-between w-[80%] mt-[10px] mb-[40px] gap-x-[10px] overflow-hidden">
        <div className="flex flex-col">
          {profileData && <ProfileAside data={profileData} />}
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
