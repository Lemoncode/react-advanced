import React from "react";
import {
  DisplayNameComponent,
  EditNameComponent,
  DisplayLastnameComponent,
  EditLastnameComponent,
  FullnameComponent,
  EditFullnameComponent,
} from "./components";
import { Provider } from "jotai";

export const App = () => {
  const [country, setCountry] = React.useState<string>("France");

  return (
    <>
      <h1>Island A</h1>
      <Provider>
        <DisplayNameComponent />
        <EditNameComponent />
        <DisplayLastnameComponent />
        <EditLastnameComponent />
        <FullnameComponent />
        <EditFullnameComponent />
      </Provider>
      <h2>Island B</h2>
      <Provider>
        <DisplayNameComponent />
        <EditNameComponent />
        <DisplayLastnameComponent />
        <EditLastnameComponent />
        <FullnameComponent />
        <EditFullnameComponent />
      </Provider>
    </>
  );
};
