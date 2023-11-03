import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ExitToApp as NavigatePatientDetail } from "@mui/icons-material";
import { switchRoutes } from "@/core/router";
import { Patient } from "../patient-list.vm";

interface Props {
  patientList: Patient[];
}

export const PatientListTable: React.FC<Props> = (props) => {
  const { patientList } = props;
  const navigate = useNavigate();
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 600 }}>
        <TableHead>
          <TableRow>
            <TableCell align="center">Id</TableCell>
            <TableCell>Nif</TableCell>
            <TableCell>Nombre Completo</TableCell>
            <TableCell>Edad</TableCell>
            <TableCell align="center">Ver Paciente</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patientList?.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell align="center">{patient.id}</TableCell>
              <TableCell>{patient.nif}</TableCell>
              <TableCell>{patient.nombreCompleto}</TableCell>
              <TableCell>{patient.edad}</TableCell>
              <TableCell align="center">
                <IconButton
                  onClick={() => navigate(switchRoutes.patient(patient.id))}
                >
                  <NavigatePatientDetail sx={{ color: "black" }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
