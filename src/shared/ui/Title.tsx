"use client";
type TitleType = {
  name: string;
};

export const Title = ({ name }: TitleType) => {
  return <h2 className="text-[22px] font-semibold text-black-777">{name}</h2>;
};
