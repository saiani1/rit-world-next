type ReleaseTypeTagType = {
  type: "ADDED" | "CHANGED" | "FIXED";
};

export const ReleaseTypeTag = ({ type }: ReleaseTypeTagType) => {
  const getTypeColor = () => {
    switch (type) {
      case "ADDED":
        return "bg-green-500";
      case "CHANGED":
        return "bg-yellow-500";
      case "FIXED":
        return "bg-red-500";
      default:
        return "";
    }
  };

  return (
    <li
      className={`px-2 py-[2px] text-white font-medium text-[12px] ${getTypeColor()} rounded-sm`}
    >
      {type}
    </li>
  );
};
