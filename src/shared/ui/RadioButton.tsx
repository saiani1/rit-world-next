type RadioButtonType = React.ComponentProps<"input"> & {
  className?: string;
  labelStyle?: string;
  labelName?: string;
};

export const RadioButton = ({
  className,
  labelName,
  labelStyle,
  ...rest
}: RadioButtonType) => {
  return (
    <>
      <input
        type="radio"
        {...rest}
        className={`${className ?? "appearance-none w-[14px] h-[14px] border-[2px] border-black-FFF rounded-full shadow-commonShadow checked:bg-blue-100"} `}
      />
      {labelName && (
        <label htmlFor={rest.id} className={labelStyle}>
          {labelName}
        </label>
      )}
    </>
  );
};
