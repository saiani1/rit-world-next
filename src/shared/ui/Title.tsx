"use client";
type TitleType = {
  name: string;
};

export const Title = ({ name }: TitleType) => {
  return <h2 className="text-[22px] font-semibold text-black-444">{name}</h2>;
};
