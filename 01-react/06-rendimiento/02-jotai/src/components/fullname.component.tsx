import React from "react";
import { useAtom } from "jotai";
import { fullnameAtom } from "../core";

export const FullnameComponent: React.FC = () => {
  const [fullname] = useAtom(fullnameAtom);

  console.log("5555 - FullnameComponent render");

  return (
    <div>
      <h2>Fullname</h2>
      <h3>{fullname}</h3>
    </div>
  );
};
