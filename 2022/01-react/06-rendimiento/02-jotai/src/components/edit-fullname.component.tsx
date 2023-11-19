import React from "react";
import { useAtom } from "jotai";
import { fullnameAtomWithWrite } from "../core";

export const EditFullnameComponent: React.FC = () => {
  const [fullname, setFullname] = useAtom(fullnameAtomWithWrite);

  console.log("66666 - EditFullnameComponent render");

  return (
    <div>
      <h2>Edit Fullname</h2>
      <input
        type="text"
        value={fullname.name}
        onChange={(e) => {
          setFullname({ ...fullname, name: e.target.value });
        }}
      />
      <input
        type="text"
        value={fullname.lastname}
        onChange={(e) => {
          setFullname({ ...fullname, lastname: e.target.value });
        }}
      />
    </div>
  );
};
