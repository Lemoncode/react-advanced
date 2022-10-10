import React from "react";
import { useFullnameContext } from "../core";

export const DisplayNameComponent: React.FC = () => {
  const { name } = useFullnameContext();

  return (
    <div>
      <h2>Display Name</h2>
      <h3>{name}</h3>
    </div>
  );
};
