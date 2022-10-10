import React from "react";
import { useFullnameContext } from "../core";

export const EditNameComponent: React.FC = () => {
  const { name, setName } = useFullnameContext();

  return (
    <div>
      <h2>Edit Name</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
};
