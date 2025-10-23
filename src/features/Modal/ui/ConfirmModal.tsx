"use client";
import { useAtomValue } from "jotai";
import { useLayoutEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IoMdAlert } from "react-icons/io";

import { useRouter } from "i18n/routing";
import { CommonButton } from "shared/ui";
import { ModalAtom } from "../model";

export const ConfirmModal = () => {
  const router = useRouter();
  const modalData = useAtomValue(ModalAtom);

  useLayoutEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollBarWidth}px`;

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = "0px";
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        key="modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed w-screen h-screen inset-0 z-50"
        onClick={() => router.back()}
      >
        <div className="absolute w-full h-full bg-black-333/30" />
        <div className="relative flex items-center justify-center w-full h-full">
          <div
            className="p-4 text-center bg-white inset-5 rounded-[14px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="flex justify-center mt-[10px]">
              <IoMdAlert size="30" fill="#8B77A6" />
            </h3>
            <div className="flex flex-col gap-y-[4px] my-[20px]">
              <p className="font-semibold text-black-444 text-[20px]">
                {modalData?.title}
              </p>
              <span className="text-black-888">{modalData?.description}</span>
            </div>
            <ul className="flex items-center gap-x-2">
              <li>
                <CommonButton
                  className="px-[60px] py-2 bg-black-EEE/90 font-medium text-black-555 text-[16px] rounded-full"
                  onClick={() => router.back()}
                >
                  No
                </CommonButton>
              </li>
              <li>
                <CommonButton
                  className="px-[60px] py-2 bg-purple-100 font-medium text-white text-[16px] rounded-full"
                  onClick={modalData?.confirm}
                >
                  Yes
                </CommonButton>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
