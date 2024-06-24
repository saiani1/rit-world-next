// import profileImage from "../../../assets/aibao.jpg";

export const ProfileImage = () => {
  return (
    <div className="relative flex flex-col">
      <div className="h-[150px] overflow-hidden bg-[#eee]">
        {/* <img src={profileImage} alt="dimmed" className="blur-sm" /> */}
      </div>
      <div className="absolute top-[80px] left-[50%] translate-x-[-50%] w-[140px] h-[140px] bg-[#aaa] overflow-hidden rounded-[50%] border-[6px] border-white shadow-profileShadow">
        {/* <img src={profileImage} className="" alt="프로필사진" /> */}
      </div>
    </div>
  );
};
