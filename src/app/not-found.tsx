import { NotFoundTitle, RedirectButton } from "features/NotFound";

const NotFound = () => {
  return (
    <html>
      <body className="flex flex-col justify-center items-center gap-y-[20px] h-screen bg-black-F5">
        <NotFoundTitle />
        <p className="text-[22px] text-black-999">NOT FOUND</p>
        <RedirectButton name="Go Home" />
      </body>
    </html>
  );
};

export default NotFound;
