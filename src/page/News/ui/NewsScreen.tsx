"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { ReleaseNoteType } from "entities/releaseNote";
import { Title } from "shared/ui";
import { ReleaseTypeTag } from "./ReleaseTypeTag";

dayjs.extend(relativeTime);
dayjs.locale("en");

type NewsScreenType = {
  data: ReleaseNoteType[];
};

const NewsScreen = ({ data }: NewsScreenType) => {
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations("ReleaseNote");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {isMounted && (
        <div className="mx-[20px] sm:mx-0">
          <Title name={t("title")} />
          <ul className="flex flex-col gap-y-4 mt-[20px]">
            {data.map((item) => {
              const isNew = dayjs().diff(dayjs(item.update_at), "day") <= 7;

              return (
                <li
                  key={item.id}
                  className={`relative px-7 py-5 rounded-md ${isNew ? "" : "border border-black-DDD"}`}
                >
                  {isNew && (
                    <span className="absolute -inset-[1px] border-[3px] border-yellow-400 rounded-md animate-pulse pointer-events-none" />
                  )}
                  <h3 className="mb-[8px] text-[20px] text-black-555 font-semibold">
                    {item.version}
                  </h3>
                  <div className="flex items-center gap-x-2 mb-[16px]">
                    <ul className="flex gap-x-1">
                      {item.type.map((type, i) => (
                        <ReleaseTypeTag key={`tag-${i}`} type={type} />
                      ))}
                    </ul>
                    <span className="text-black-999 text-[12px]">
                      {dayjs(item.update_at).fromNow()}
                    </span>
                  </div>
                  <p className="text-[14px] text-black-777 leading-6">
                    {item.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default NewsScreen;
