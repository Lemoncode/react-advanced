export interface Patient {
  id: string;
  dni: string;
  letra: string;
  nombre: string;
  apellidos: string;
  edad: number;
  alergias?: string[];
  medicacion?: string[];
  medidasPresionArterial: {
    fechaHora: string;
    sistolica: number;
    diastolica: number;
  }[];
}

export const createEmptyPatient = (): Patient => ({
  id: "",
  dni: "",
  letra: "",
  nombre: "",
  apellidos: "",
  edad: 0,
  alergias: [],
  medicacion: [],
  medidasPresionArterial: [],
});
