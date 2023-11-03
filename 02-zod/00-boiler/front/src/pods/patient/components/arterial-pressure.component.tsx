import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Patient } from "../patient.vm";

interface Props {
  patient: Patient;
}

export const ArterialPreassureComponent: React.FC<Props> = (props) => {
  const { patient } = props;
  return (
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
  );
};
