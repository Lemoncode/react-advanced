import React from "react";

export interface InputProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
}

export const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const { label, value, onChange } = props;

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
  }
);
