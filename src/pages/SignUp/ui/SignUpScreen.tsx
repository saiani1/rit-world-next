"use client";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import logo from "public/assets/logo.png";
import { RegisterInput, ErrorMsg } from "shared/index";
import Image from "next/image";

export const SignUpScreen = () => {
  const router = useRouter();
  const [checkedDuplicate, setCheckedDuplicate] = useState({
    email: false,
    nickname: false,
  });
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<ISignUpUserInfo>({ mode: "onChange" });

  const onSubmit: SubmitHandler<ISignUpUserInfo> = async () => {
    if (Object.values(checkedDuplicate).every((v) => v === true) === true) {
      const data = getValues();
      try {
        // await submitAPI(data);
        router.push("/");
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("중복확인 검사를 완료해주세요.");
    }
  };

  const handleClickCheckDuplicate = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const name = (e.target as HTMLButtonElement).name;
    if (
      name === "userId" &&
      getValues("userId").length !== 0 &&
      errors.userId?.message === undefined
    ) {
      const email = getValues("userId");
      try {
        // const res = checkDuplicateIdAPI(email)
        // if (!res) {
        //   toast.success("사용할 수 있는 아이디입니다.");
        //   setCheckedDuplicate({ ...checkedDuplicate, email: true });
        // } else {
        //   toast.error("사용할 수 없는 아이디입니다.");
        //   setCheckedDuplicate({ ...checkedDuplicate, email: false });
        // }
      } catch (err) {
        console.error(err);
      }
    } else if (name === "nickname" && getValues("nickname").length !== 0) {
      const nickname = getValues("nickname");
      try {
        // const res = await checkDuplicateNicknameAPI(nickname);
        // if (!res) {
        //   toast.success("사용할 수 있는 닉네임입니다.");
        //   setCheckedDuplicate({ ...checkedDuplicate, nickname: true });
        // } else {
        //   toast.error("사용할 수 없는 닉네임입니다.");
        //   setCheckedDuplicate({ ...checkedDuplicate, nickname: false });
        // }
      } catch (err) {
        console.error(err);
      }
    } else return;
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-slate-200">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex flex-col w-[400px] h-[550px] px-[50px] py-[60px] bg-white rounded-3xl"
        noValidate
      >
        <div className="flex flex-col justify-center items-center mt-[70px] mb-[60px]">
          <h1>
            <Image src={logo} alt="logo" className="w-[160px]" />
          </h1>
        </div>
        <div className="flex flex-col">
          <div className="mb-2">
            <motion.div
              layout
              transition={{ duration: 0.2 }}
              className="flex gap-x-3"
            >
              <RegisterInput
                type="email"
                name="userId"
                placeholder="이메일"
                register={register}
              />
              <button
                type="button"
                className="w-28 py-1.5 bg-gray-500 text-white text-[13px] rounded-full"
                onClick={handleClickCheckDuplicate}
                name="userId"
              >
                중복확인
              </button>
            </motion.div>
            {errors.userId?.message && (
              <ErrorMsg message={errors.userId.message} />
            )}
          </div>
          <div className="mb-2">
            <motion.div
              layout
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-y-2"
            >
              <RegisterInput
                type="password"
                name="password"
                placeholder="비밀번호"
                register={register}
              />
              <RegisterInput
                type="password"
                name="confirm_password"
                placeholder="비밀번호 확인"
                register={register}
                watch={watch}
              />
            </motion.div>
            {errors.confirm_password?.message && (
              <ErrorMsg message={errors.confirm_password.message} />
            )}
          </div>
          <motion.div
            layout
            transition={{ duration: 0.2 }}
            className="flex gap-x-3"
          >
            <RegisterInput
              type="text"
              name="nickname"
              placeholder="닉네임"
              register={register}
            />
            <button
              type="button"
              className="w-28 py-1.5 bg-gray-500 text-white text-[13px] rounded-full"
              name="nickname"
              onClick={handleClickCheckDuplicate}
            >
              중복확인
            </button>
          </motion.div>
        </div>
        <div className="absolute bottom-[60px] right-[50px] left-[50px] flex gap-x-4">
          <button
            type="reset"
            className="w-64 py-1.5 mt-5 text-gray-700 bg-white rounded-full border border-slate-300"
          >
            취소
          </button>
          <button
            type="submit"
            className="w-64 py-1.5 mt-5 bg-gray-700 text-white rounded-full"
          >
            제출
          </button>
        </div>
      </form>
    </div>
  );
};
