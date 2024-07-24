import PencilIcon from "public/assets/svg/pencil-icon.svg";

export const WriteButton = () => {
  const handleClick = () => {};

  return (
    <button
      type="button"
      aria-label="블로그 작성"
      className="flex justify-center items-center w-[25px] h-[25px]"
      onClick={handleClick}
    >
      <PencilIcon />
    </button>
  );
};
