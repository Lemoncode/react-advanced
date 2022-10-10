import React from "react";
import { FullnameProvider } from "./core";
import {
  DisplayNameComponent,
  EditNameComponent,
  DisplayLastnameComponent,
  EditLastnameComponent,
} from "./components";

export const App = () => {
  const [country, setCountry] = React.useState<string>("France");

  return (
    <FullnameProvider>
      <DisplayNameComponent />
      <EditNameComponent />
      <DisplayLastnameComponent />
      <EditLastnameComponent />
    </FullnameProvider>
  );
};
