type HashtagButtonType = {
  tag: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const HashtagButton = ({ tag, onClick }: HashtagButtonType) => {
  return (
    <li>
      <button
        type="button"
        className="px-[10px] h-[20px] bg-purple-100 text-white text-[11px] rounded-full whitespace-nowrap"
        name={tag}
        onClick={onClick}
      >
        {tag}
      </button>
    </li>
  );
};
