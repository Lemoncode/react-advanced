import React from "react";
import {
  DisplayNameComponent,
  EditNameComponent,
  DisplayLastnameComponent,
  EditLastnameComponent,
  FullnameComponent,
  EditFullnameComponent,
} from "./components";

export const App = () => {
  const [country, setCountry] = React.useState<string>("France");

  return (
    <>
      <DisplayNameComponent />
      <EditNameComponent />
      <DisplayLastnameComponent />
      <EditLastnameComponent />
      <FullnameComponent />
      <EditFullnameComponent />
    </>
  );
};
