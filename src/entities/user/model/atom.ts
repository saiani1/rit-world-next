import { atom } from "jotai";
import Cookies from "js-cookie";

export const isLoginAtom = atom(Cookies.get("login") === "Y");
