"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSetAtom } from "jotai";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";

import logo from "public/assets/logo.png";
import { useRouter } from "i18n/routing";
import { isLoginAtom, SignInUserInfoType } from "entities/user";
import { supabase, CommonInput, ErrorMsg, CommonButton } from "shared/index";

const SignInScreen = () => {
  const router = useRouter();
  const t = useTranslations("Signin");
  const setIsLogin = useSetAtom(isLoginAtom);
  const [isMounted, setIsMounted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInUserInfoType>({ mode: "onChange" });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit: SubmitHandler<SignInUserInfoType> = async (data) => {
    try {
      let { error } = await supabase.auth.signInWithPassword({
        email: data.userId,
        password: data.password,
      });
      if (error) return toast.error(t("loginFail"));
      else {
        Cookies.set("login", "Y");
        setIsLogin(true);
        router.replace("/");
        toast.success(t("loginSuccess"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex justify-center items-center w-full h-screen bg-slate-200">
      <form
        className="flex flex-col justify-center items-center w-96 h-96 rounded-full bg-white"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="flex justify-center w-52 mb-8">
          <Image src={logo} alt="logo" />
        </h1>
        <motion.div
          layout
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-y-2"
        >
          <CommonInput
            type="email"
            page="signin"
            placeholder={t("email")}
            {...register("userId", {
              required: true,
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: t("emailValidFail"),
              },
              setValueAs: (v: string) => v.trim(),
            })}
          />
          {errors.userId && <ErrorMsg message={errors.userId.message} />}
          <CommonInput
            type="password"
            page="signin"
            placeholder={t("password")}
            autoComplete="current-password"
            {...register("password", {
              required: true,
            })}
          />
        </motion.div>
        <CommonButton
          type="submit"
          className="w-64 py-1.5 mt-5 bg-gray-700 text-white rounded-full "
        >
          {t("login")}
        </CommonButton>
      </form>
    </div>
  );
};

export default SignInScreen;
