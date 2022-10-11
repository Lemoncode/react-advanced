import React from "react";
import { NameComponent } from "./name-component";

interface Props {
  name: string;
  onChange: (name: string) => void;
  time: string;
}

export const MyForm = (props: Props) => {
  const { name, onChange, time } = props;
  return (
    <div>
      <NameComponent name={name} onChange={onChange} />
      <span>Current time: ${time}</span>
    </div>
  );
};
