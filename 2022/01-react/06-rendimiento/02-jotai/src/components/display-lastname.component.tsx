import React from "react";
import { useAtom } from "jotai";
import { lastnameAtom } from "../core";

export const DisplayLastnameComponent: React.FC = () => {
  const [lastname] = useAtom(lastnameAtom);

  console.log("33333 - DisplayLastnameComponent render");

  return (
    <div>
      <h2>Display Lastname</h2>
      <h3>{lastname}</h3>
    </div>
  );
};
