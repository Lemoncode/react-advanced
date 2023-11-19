import * as apiModel from "./api";
import * as viewModel from "./patient-list.vm";

const mapPatientFromApiToVm = (
  patient: apiModel.Patient
): viewModel.Patient => ({
  id: patient.id,
  nif: patient.nif,
  nombreCompleto: `${patient.nombre} ${patient.apellidos}`,
  edad: patient.edad,
});

export const mapPatientListFromApiToVm = (
  patientList: apiModel.Patient[]
): viewModel.Patient[] =>
  Array.isArray(patientList) ? patientList.map(mapPatientFromApiToVm) : [];
