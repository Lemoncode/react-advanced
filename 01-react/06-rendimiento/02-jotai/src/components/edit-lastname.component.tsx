import React from "react";
import { useAtom } from "jotai";
import { lastnameAtom } from "../core";

export const EditLastnameComponent: React.FC = () => {
  const [lastname, setLastname] = useAtom(lastnameAtom);

  console.log("4444 - EditLastnameComponent render");

  return (
    <div>
      <h2>Edit Lastname</h2>
      <input
        type="text"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
      />
    </div>
  );
};
