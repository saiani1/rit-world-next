import FaceIcon from "public/assets/svg/logo-face-icon.svg";

type NotFoundTitleType = {
  inside?: boolean;
};

export const NotFoundTitle = ({ inside }: NotFoundTitleType) => {
  return (
    <h1
      className={`flex items-center text-[100px] font-bold ${inside ? "text-[#8b95a2]" : "text-black-999"}`}
    >
      <span>4</span>
      <div
        className={`flex justify-center items-center ml-[20px] mr-[10px] w-[140px] h-[140px] rounded-full ${inside ? "bg-[#d5dce6]/70" : "bg-black-EEE"}`}
      >
        <FaceIcon
          width="80"
          fill={`${inside ? "#8d96a3" : "#777"}`}
          className="pt-[20px] animate-spin-slow"
        />
      </div>
      <span>4</span>
    </h1>
  );
};
