export type SignInUserInfoType = {
  userId: string;
  password: string;
};

export type SignUpUserInfoType = SignInUserInfoType & {
  confirm_password: string;
  nickname: string;
};
