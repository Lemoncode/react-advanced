export interface Patient {
  id: string;
  nif: string;
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
