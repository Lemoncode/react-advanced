import React from "react";
import { Typography } from "@mui/material";
import { PatientListTable } from "./components";
import { Patient } from "./patient-list.vm";
import * as classes from "./patient-list.styles";

interface Props {
  patientList: Patient[];
}

export const PatientList: React.FC<Props> = (props) => {
  const { patientList } = props;

  return (
    <div className={classes.root}>
      <header>
        <Typography variant="h1" component={"h1"}>
          Listado de Pacientes
        </Typography>
      </header>

      <main>
        <PatientListTable patientList={patientList} />
      </main>
    </div>
  );
};
