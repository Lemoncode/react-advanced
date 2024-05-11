import React from "react";
import { Chip, TextField } from "@mui/material";
import * as viewModel from "../patient.vm";
import * as classes from "./patient-form.styles";

interface Props {
  patient: viewModel.Patient;
  onChange: (
    fieldId: string
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PatientFormComponent: React.FC<Props> = (props) => {
  const { patient, onChange } = props;
  return (
    <>
      <label htmlFor="name" className={classes.hiddeLabel}>
        Título
      </label>
      <TextField
        id="name"
        onChange={onChange("nombre")}
        label="Nombre"
        variant="outlined"
        value={patient.nombre}
        InputProps={{
          readOnly: true,
        }}
      />

      <label htmlFor="apellidos" className={classes.hiddeLabel}>
        Título
      </label>
      <TextField
        id="apellidos"
        onChange={onChange("apellidos")}
        label="Apellidos"
        variant="outlined"
        value={patient.apellidos}
        InputProps={{
          readOnly: true,
        }}
      />

      <label htmlFor="dni" className={classes.hiddeLabel}>
        Título
      </label>
      <TextField
        id="dni"
        onChange={onChange("dni")}
        label="DNI"
        variant="outlined"
        value={patient.dni}
        InputProps={{
          readOnly: true,
        }}
      />

      <label htmlFor="letra" className={classes.hiddeLabel}>
        Título
      </label>
      <TextField
        id="letra"
        onChange={onChange("letra")}
        label="Letra NIF"
        variant="outlined"
        value={patient.letra}
        InputProps={{
          readOnly: true,
        }}
      />

      <label htmlFor="edad" className={classes.hiddeLabel}>
        Título
      </label>
      <TextField
        id="edad"
        onChange={onChange("edad")}
        label="Edad"
        variant="outlined"
        value={patient.edad}
        InputProps={{
          readOnly: true,
        }}
      />

      <label htmlFor="alergias" className={classes.hiddeLabel}>
        Alergias
      </label>
      <TextField
        id="alergias"
        onChange={onChange("alergias")}
        label="Alergias"
        variant="outlined"
        fullWidth
        InputProps={{
          startAdornment: (
            <div className={classes.chipsContainer}>
              {patient.alergias.map((alergia, index) => (
                <Chip key={index} label={alergia} onDelete={() => {}} />
              ))}
            </div>
          ),
          readOnly: true,
        }}
      />

      <label htmlFor="medicacion" className={classes.hiddeLabel}>
        Medicación
      </label>
      <TextField
        id="medicacion"
        onChange={onChange("medicacion")}
        label="Medicación"
        variant="outlined"
        fullWidth
        InputProps={{
          startAdornment: (
            <div className={classes.chipsContainer}>
              {patient.medicacion.map((medicacion, index) => (
                <Chip key={index} label={medicacion} onDelete={() => {}} />
              ))}
            </div>
          ),
          readOnly: true,
        }}
      />
    </>
  );
};
