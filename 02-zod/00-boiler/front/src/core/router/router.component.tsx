import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { PatientListScene, PatientScene } from "@/scenes";
import { switchRoutes } from "./routes";

export const RouterComponent: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={switchRoutes.root} element={<PatientListScene />} />
        <Route path={switchRoutes.patientList} element={<PatientListScene />} />
        <Route path={switchRoutes.patient(":id")} element={<PatientScene />} />
        <Route path="*" element={<PatientListScene />}></Route>
      </Routes>
    </HashRouter>
  );
};
