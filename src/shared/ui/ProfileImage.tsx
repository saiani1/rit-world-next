import Image from "next/image";
import profileImage from "public/assets/image/aibao.jpg";

export const ProfileImage = () => {
  return (
    <div className="relative flex flex-col">
      <div className="h-[130px] overflow-hidden bg-[#eee]">
        <Image src={profileImage} alt="dimmed" className="blur-sm" />
      </div>
      <div className="absolute top-[60px] left-[50%] translate-x-[-50%] w-[134px] h-[134px] bg-[#aaa] overflow-hidden rounded-[50%] border-[6px] border-white shadow-profileShadow">
        <Image src={profileImage} className="" alt="프로필사진" />
      </div>
    </div>
  );
};
