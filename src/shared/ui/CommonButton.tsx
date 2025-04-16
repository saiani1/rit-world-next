type CommonButtonType = React.ComponentProps<"button"> & {
  children: React.ReactNode;
};

export const CommonButton = ({ children, ...rest }: CommonButtonType) => {
  return (
    <button type={rest.type ?? "button"} {...rest}>
      {children}
    </button>
  );
};
