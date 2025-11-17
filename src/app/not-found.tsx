import { redirect } from "next/navigation";

import FaceIcon from "public/assets/svg/logo-face-icon.svg";

const NotFound = () => {
  return (
    <html>
      <body className="flex flex-col justify-center items-center gap-y-[20px] h-screen">
        <h1 className="flex items-center text-[150px] font-bold text-black-999">
          <span>4</span>
          <div className="flex justify-center items-center ml-[20px] mr-[10px] w-[200px] h-[200px] rounded-full bg-black-EEE">
            <FaceIcon
              width="120"
              fill="#777"
              className="pt-[20px] animate-spin-slow"
            />
          </div>
          <span>4</span>
        </h1>
        <p className="text-[22px] text-black-777">페이지를 찾을 수 없습니다</p>
      </body>
    </html>
  );
};

export default NotFound;
