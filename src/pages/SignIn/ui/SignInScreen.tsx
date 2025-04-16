"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { useSetAtom } from "jotai";
import { toast } from "react-hot-toast";

import logo from "public/assets/logo.png";
import { loginAtom, SignInUserInfoType } from "entities/user";
import { supabase, CommonInput, ErrorMsg, CommonButton } from "shared/index";

const SignInScreen = () => {
  const router = useRouter();
  const setIsLogin = useSetAtom(loginAtom);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInUserInfoType>({ mode: "onChange" });

  const onSubmit: SubmitHandler<SignInUserInfoType> = async (data) => {
    if (!errors.userId && data.password.length !== 0) {
      try {
        let { error } = await supabase.auth.signInWithPassword({
          email: data.userId,
          password: data.password,
        });
        if (error) return toast.error("로그인 실패");
        else {
          setIsLogin(true);
          router.replace("/");
          toast.success("로그인 되었습니다.");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

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
            placeholder="이메일"
            {...register("userId", {
              required: true,
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "이메일 형식에 맞지 않습니다.",
              },
              setValueAs: (v: string) => v.trim(),
              onBlur: (e: any) =>
                (e.currentTarget.value = e.currentTarget.value.trim()),
            })}
          />
          {errors.userId && <ErrorMsg message={errors.userId.message} />}
          <CommonInput
            type="password"
            page="signin"
            placeholder="비밀번호"
            {...register("password", { required: true })}
          />
        </motion.div>
        <CommonButton
          type="submit"
          className="w-64 py-1.5 mt-5 bg-gray-700 text-white rounded-full "
        >
          로그인
        </CommonButton>
      </form>
    </div>
  );
};

export default SignInScreen;
