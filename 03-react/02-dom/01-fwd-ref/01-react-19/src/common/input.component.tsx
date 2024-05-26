import React from "react";

export interface InputProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  ref: React.RefObject<HTMLInputElement>;
}

export const InputComponent = (props: InputProps) => {
  const { label, value, onChange, ref } = props;

  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  return (
    <input
      ref={ref}
      placeholder={label}
      value={value}
      onChange={handleChange}
    />
  );
};
