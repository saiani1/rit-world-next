"use client";
import { useAtom } from "jotai";

import { filterAtom } from "entities/blog";
import { RadioButton } from "shared/ui";

type RadioLabelType = {
  name: string;
  id: string;
  group: string;
};

const RadioLabel = ({ name, id, group }: RadioLabelType) => {
  const [filterName, setFilterName] = useAtom(filterAtom);

  const handleChange = (e: any) => {
    const id = e.target.id;
    setFilterName(id);
  };

  return (
    <div className="flex items-center gap-x-[7px] py-[6px] pl-[3px]">
      <RadioButton
        id={id}
        name={group}
        defaultChecked={filterName === id}
        onChange={handleChange}
        labelStyle="pt-[1px] text-[13px] text-black-888 font-medium"
        labelName={name}
      />
    </div>
  );
};

export const FilterDialog = () => {
  return (
    <div className="absolute right-0 bottom-[-75px] z-10 flex justify-center items-center w-[85px] h-[70px] bg-black-50 rounded-[5px] before:-translate-x-1/2 before:content-[''] before:w-0 before:h-0 before:border-[4px] before:border-transparent before:border-b-black-50 before:absolute before:top-[-8px] before:right-[5px]">
      <ul className="w-full p-[10px] divide-y divide-black-FFF">
        <li>
          <RadioLabel name="전체" id="all" group="filter" />
        </li>
        <li>
          <RadioLabel name="최신순" id="new" group="filter" />
        </li>
      </ul>
    </div>
  );
};
