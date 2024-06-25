'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { useAtom } from "jotai";

import logo from "shared/assets/logo.png"
import { RegisterInput, ErrorMsg } from "shared/index";
import { loginAtom } from "entities/user/model/atom";
import Image from "next/image";

interface IFormData {
  userId: string;
  password: string;
}

export const SignInScreen = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useAtom(loginAtom);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<IFormData>({ mode: "onChange" });

  const onSubmit: SubmitHandler<IFormData> = async () => {
    if (!errors.userId && getValues().password.length !== 0) {
      const data = getValues();
      try {
        // await loginAPI(data);
        // setIsLogin(true);
        router.replace("/list");
        console.log("로그인 되었습니다.")
      } catch (err) {
        console.error(err);
      }
    }
  }

  useEffect(() => {
    if (isLogin) router.push("/list");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          <RegisterInput
            type="email"
            name="userId"
            placeholder="이메일"
            page="signin"
            register={register}
          />
          {errors.userId && <ErrorMsg message={errors.userId.message} />}
          <RegisterInput
            type="password"
            name="password"
            placeholder="비밀번호"
            page="signin"
            register={register}
          />
        </motion.div>
        <button
          type="submit"
          className="w-64 py-1.5 mt-5 bg-gray-700 text-white rounded-full "
        >
          로그인
        </button>
        <div className="flex justify-between w-48 mt-5 text-xs text-gray-400">
          <button
            type="button"
            className="relative after:absolute after:content-[''] after:w-px after:h-2.5 after:top-1 after:left-32 after:bg-gray-300"
          >
            아이디/비밀번호 찾기
          </button>
          <button type="button">회원가입</button>
        </div>
      </form>
    </div>
  );
};
