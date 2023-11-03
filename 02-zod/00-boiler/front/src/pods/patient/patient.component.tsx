import React from "react";
import * as viewModel from "./patient.vm";

interface Props {
  patient: viewModel.Patient;
}

export const Patient: React.FC<Props> = (props) => {
  const { patient } = props;
  console.log(patient);
  return <div>Patient: React.</div>;
};
