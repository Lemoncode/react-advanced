import React from "react";
import { useFullnameContext } from "../core";

export const DisplayLastnameComponent: React.FC = () => {
  const { lastname } = useFullnameContext();

  console.log("33333 - DisplayLastnameComponent render");

  return (
    <div>
      <h2>Display Lastname</h2>
      <h3>{lastname}</h3>
    </div>
  );
};
