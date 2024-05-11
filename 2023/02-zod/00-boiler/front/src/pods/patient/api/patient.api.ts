import Axios from "axios";
import { Patient } from "./patient.api-model";

export const getPatient = async (id: string): Promise<Patient> => {
  const { data } = await Axios.get<Patient>(
    `http://localhost:3000/pacientes/${id}`
  );
  return data;
};
