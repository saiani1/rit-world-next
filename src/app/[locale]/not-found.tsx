import { getTranslations } from "next-intl/server";
import { Link } from "i18n/routing";

import { NotFoundTitle, RedirectButton } from "features/NotFound";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="flex flex-col items-center justify-center gap-y-4 h-screen">
      <NotFoundTitle inside />
      <p className="text-[22px] text-slate-500/70">{t("subject")}</p>
      <RedirectButton path="/" name={t("description")} />
    </div>
  );
}
