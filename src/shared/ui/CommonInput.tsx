import { forwardRef } from "react";

type CommonInputType = React.ComponentProps<"input"> & {
  page?: string;
  className?: string;
};

export const CommonInput = forwardRef<HTMLInputElement, CommonInputType>(
  ({ page, className, ...rest }, ref) => {
    return (
      <input
        {...rest}
        type={rest.type ?? "text"}
        ref={ref}
        className={`${page === "signin" ? "w-64 px-5 py-1.5 border rounded-full border-slate-300 placeholder:text-xs focus:outline-slate-400" : ""} ${className}`}
      />
    );
  }
);
CommonInput.displayName = "CommonInput";
