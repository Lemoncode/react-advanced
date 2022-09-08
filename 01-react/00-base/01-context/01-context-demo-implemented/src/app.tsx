import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RouterComponent } from "@/core";
import { ProfileProvider } from "@/core/providers";
import { MemberListProvider } from "@/pods/list";

export const App = () => {
  return (
    <ProfileProvider>
      <MemberListProvider>
        <RouterComponent />
      </MemberListProvider>
    </ProfileProvider>
  );
};
