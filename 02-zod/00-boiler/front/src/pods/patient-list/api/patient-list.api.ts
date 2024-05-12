import Axios from "axios";
import { Patient } from "./patient-list.api-model";

export const getPatientList = async (): Promise<Patient[]> => {
  const { data } = await Axios.get<Patient[]>(
    "http://localhost:3000/pacientes"
  );
  return data;
};
