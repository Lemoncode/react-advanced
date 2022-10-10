import React from "react";
import { Fullname, createEmptyFullname } from "./model";
import { FullnameContext } from "./fullname.context";

interface Props {
  children: React.ReactNode;
}

export const FullnameProvider: React.FC<Props> = ({ children }) => {
  const [fullname, setFullname] = React.useState<Fullname>(
    createEmptyFullname()
  );

  const setName = (name: string) => {
    setFullname((prev) => ({ ...prev, name }));
  };

  const setLastname = (lastname: string) => {
    setFullname((prev) => ({ ...prev, lastname }));
  };

  return (
    <FullnameContext.Provider
      value={{
        name: fullname.name,
        lastname: fullname.lastname,
        setName,
        setLastname,
      }}
    >
      {children}
    </FullnameContext.Provider>
  );
};

export const useFullnameContext = () => {
  const context = React.useContext(FullnameContext);
  if (context === undefined) {
    throw new Error(
      "useFullnameContext must be used within a FullnameProvider"
    );
  }
  return context;
};
