import React from "react";
import { Outlet, useNavigation } from "react-router-dom";

export const RootLayout = () => {
  const navigation = useNavigation();

  return (
    <>
      {navigation.state === "loading" && <h5>⏱ Loading...</h5>}
      <Outlet />
    </>
  );
};
