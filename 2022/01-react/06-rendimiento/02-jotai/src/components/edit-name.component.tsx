import React from "react";
import { useAtom } from "jotai";
import { nameAtom } from "../core";

export const EditNameComponent: React.FC = () => {
  const [name, setName] = useAtom(nameAtom);

  console.log("22222 - EditNameComponent render");

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
