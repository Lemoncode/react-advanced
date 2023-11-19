import React from "react";

interface Props {
  name: string;
  onChange: (name: string) => void;
}

export const NameComponent = React.memo((props: Props) => {
  const { name, onChange } = props;

  console.log("Name component rerender...");

  return (
    <div>
      <h1>{props.name}</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
});
