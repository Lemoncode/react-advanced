import React from "react";
import { IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { switchRoutes } from "@/core/router";
import { PatientFormComponent, ArterialPreassureComponent } from "./components";
import * as viewModel from "./patient.vm";
import * as classes from "./patient.styles";
interface Props {
  patient: viewModel.Patient;
  onChange: (
    fieldId: string
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Patient: React.FC<Props> = (props) => {
  const { patient, onChange } = props;
  const navigate = useNavigate();

  return (
    <div className={classes.root}>
      <header>
        <Typography className={classes.title} variant="h1" component={"h1"}>
          Paciente
        </Typography>
      </header>

      <section className={classes.textFieldsContainer}>
        <PatientFormComponent patient={patient} onChange={onChange} />
      </section>

      <ArterialPreassureComponent patient={patient} />

      <IconButton
        className={classes.goBack}
        onClick={() => navigate(switchRoutes.patientList)}
        aria-label="Volver al listado de edición de libros"
        size="large"
      >
        <ArrowBackIcon />
        <Typography variant="caption" component={"span"}>
          Regresar
        </Typography>
      </IconButton>
    </div>
  );
};
