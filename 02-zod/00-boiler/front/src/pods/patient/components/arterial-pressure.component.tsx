import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Patient } from "../patient.vm";
import * as classes from "./arterial-pressure.styles";

interface Props {
  patient: Patient;
}

export const ArterialPreassureComponent: React.FC<Props> = (props) => {
  const { patient } = props;
  return (
    <>
      <Typography className={classes.title} variant="h1" component={"h1"}>
        Medidas de Presión Arterial
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Fecha</TableCell>
              <TableCell align="center">Presión sistólica</TableCell>
              <TableCell align="center">Presión Diastólica</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patient?.medidasPresionArterial?.map((presion) => (
              <TableRow key={presion.fechaHora}>
                <TableCell align="center">{presion.fechaHora}</TableCell>
                <TableCell align="center">{presion.sistolica} mmHg</TableCell>
                <TableCell align="center">{presion.diastolica} mmHg</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
