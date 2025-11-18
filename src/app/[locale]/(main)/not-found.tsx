"use client";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-[50px] font-bold">404</h1>
      <h2>{t("subject")}</h2>
      <p>{t("description")}</p>
    </div>
  );
}
