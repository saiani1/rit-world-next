import { usePathname } from "i18n/routing";

export const useIsEditMode = () => {
  const pathname = usePathname();
  return (
    pathname.includes("edit") ||
    pathname.includes("translate") ||
    (pathname.includes("create") && !pathname.includes("interview"))
  );
};
