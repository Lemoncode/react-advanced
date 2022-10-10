import React from "react";
import { useAtom } from "jotai";
import { nameAtom } from "../core";

export const DisplayNameComponent: React.FC = () => {
  const [name] = useAtom(nameAtom);

  console.log("1111 - DisplayNameComponent render");

  return (
    <div>
      <h2>Display Name</h2>
      <h3>{name}</h3>
    </div>
  );
};
