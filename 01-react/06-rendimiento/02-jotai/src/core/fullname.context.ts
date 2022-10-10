import React from "react";
import { Fullname, createEmptyFullname } from "./model";

export interface FullnameContextVm extends Fullname {
  setName: (name: string) => void;
  setLastname: (lastname: string) => void;
}

const notInitialized = "not initialized";

export const FullnameContext = React.createContext<FullnameContextVm>({
  name: notInitialized,
  lastname: notInitialized,
  setName: () =>
    console.warn(
      "** If you area reading this, likely you have forgotten to add the provider on top of your app"
    ),
  setLastname: () =>
    console.warn(
      "** If you area reading this, likely you have forgotten to add the provider on top of your app"
    ),
});
