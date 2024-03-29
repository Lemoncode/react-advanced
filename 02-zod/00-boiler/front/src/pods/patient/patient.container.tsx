import React from "react";
import { useParams } from "react-router-dom";
import { Patient } from "./patient.component";
import { mapPatientFromApiToVm } from "./patient.mappers";
import * as viewModel from "./patient.vm";
import * as api from "./api";

export const PatientContainer: React.FC = () => {
  const [patient, setPatient] = React.useState<viewModel.Patient>(
    viewModel.createEmptyPatient()
  );
  const { id } = useParams();

  const handleFieldChange =
    (fieldId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setPatient({ ...patient, [fieldId]: value });
    };

  React.useEffect(() => {
    if (id) {
      api.getPatient(id).then(mapPatientFromApiToVm).then(setPatient);
    }
  }, []);

  return <Patient patient={patient} onChange={handleFieldChange} />;
};
