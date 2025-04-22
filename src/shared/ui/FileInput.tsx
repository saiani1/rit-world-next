type FileInputType = React.ComponentProps<"input"> & {
  labelStyle?: string;
  icon?: React.ReactNode;
};

export const FileInput = ({ labelStyle, icon, ...rest }: FileInputType) => {
  return (
    <>
      <input type="file" {...rest} />
      {icon && (
        <label htmlFor={rest.id} className={labelStyle}>
          {icon}
        </label>
      )}
    </>
  );
};
