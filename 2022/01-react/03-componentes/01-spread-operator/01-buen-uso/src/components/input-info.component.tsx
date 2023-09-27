import * as React from "react";
import classes from "./input-info.component.css";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const InputInfo: React.FC<Props> = (props: Props) => {
  // cast props to inputProps that only contains HTMLInputElement props
  const { label, ...inputProps } = props;

  return (
    <div className={classes.container}>
      <input {...inputProps} />
      <label>{props.label}</label>
    </div>
  );
};
