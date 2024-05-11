import React from "react";
import { PatientList } from "./patient-list.component";
import { mapPatientListFromApiToVm } from "./patient-list.mappers";
import * as api from "./api";

export const PatientListContainer: React.FC = () => {
  const [patientList, setPatientList] = React.useState([]);

  React.useEffect(() => {
    api.getPatientList().then(mapPatientListFromApiToVm).then(setPatientList);
  }, []);
  return <PatientList patientList={patientList}/>;
};
