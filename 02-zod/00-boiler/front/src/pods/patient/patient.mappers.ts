import { createEmptyPatient } from "./patient.vm";
import * as apiModel from "./api";
import * as viewModel from "./patient.vm";
import { separateNumberFromLetterInDNI } from "./patient.helpers";

export const mapPatientFromApiToVm = (
  patient: apiModel.Patient
): viewModel.Patient =>
  Boolean(patient)
    ? {
        id: patient.id,
        dni: separateNumberFromLetterInDNI(patient.nif).dni,
        letra: separateNumberFromLetterInDNI(patient.nif).letter,
        nombre: patient.nombre,
        apellidos: patient.apellidos,
        edad: patient.edad,
        alergias: patient.alergias ?? [],
        medicacion: patient.medicacion ?? [],
        medidasPresionArterial: patient.medidasPresionArterial,
      }
    : createEmptyPatient();
