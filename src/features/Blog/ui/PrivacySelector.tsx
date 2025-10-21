import { Control, Controller } from "react-hook-form";

import { BlogJpType, BlogType } from "entities/blog";
import { CommonInput } from "shared/ui";

type BlogRadio = React.ComponentProps<typeof CommonInput> & {
  label: string;
  checked: boolean;
  onChange: () => void;
};

export const BlogRadio = ({ label, checked, onChange }: BlogRadio) => {
  return (
    <label className="flex items-center justify-center flex-shrink-0 w-[80px] h-[34px] text-[14px] border border-black-888 rounded-md has-[input:checked]:bg-purple-100 transition-colors duration-200 box-border">
      <CommonInput
        type="radio"
        name="isPrivate"
        checked={checked}
        className="hidden peer"
        onChange={onChange}
      />
      <span className="text-black-888 peer-checked:text-white transition-colors duration-200">
        {label}
      </span>
    </label>
  );
};

type PrivacySelectorType = {
  control: Control<BlogType | BlogJpType>;
  name: "is_private";
};

export const PrivacySelector = ({ control, name }: PrivacySelectorType) => {
  return (
    <Controller<BlogType | BlogJpType, "is_private">
      control={control}
      name={name}
      defaultValue={true}
      render={({ field }) => (
        <div className="flex gap-x-1">
          <BlogRadio
            label="공개"
            defaultChecked
            checked={field.value === true}
            onChange={() => field.onChange(true)}
          />
          <BlogRadio
            label="비공개"
            checked={field.value === false}
            onChange={() => field.onChange(false)}
          />
        </div>
      )}
    ></Controller>
  );
};
PrivacySelector.displayName = "PrivacySelector";
