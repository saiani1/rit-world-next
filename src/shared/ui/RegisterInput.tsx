"use client";
import { forwardRef } from "react";

type RegisterInputType = React.ComponentProps<"input">;

export const RegisterInput = forwardRef<HTMLInputElement, RegisterInputType>(
  ({}, ref) => {
    return (
      <input
        ref={ref}
        className="w-64 px-5 py-1.5 border rounded-full border-slate-300 placeholder:text-xs focus:outline-slate-400"
      />
    );
  }
);
RegisterInput.displayName = "RegisterInput";
