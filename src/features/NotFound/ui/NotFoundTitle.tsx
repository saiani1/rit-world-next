import FaceIcon from "public/assets/svg/logo-face-icon.svg";

type NotFoundTitleType = {
  inside?: boolean;
};

export const NotFoundTitle = ({ inside }: NotFoundTitleType) => {
  return (
    <h1
      className={`flex items-center text-[100px] font-bold ${inside ? "text-slate-450" : "text-black-999"}`}
    >
      <span>4</span>
      <div
        className={`flex justify-center items-center ml-[20px] mr-[10px] w-[140px] h-[140px] rounded-full ${inside ? "bg-slate-250/70 text-slate-470" : "bg-black-EEE text-black-777"}`}
      >
        <FaceIcon
          width="80"
          fill="currentColor"
          className="pt-[20px] animate-spin-slow"
        />
      </div>
      <span>4</span>
    </h1>
  );
};
