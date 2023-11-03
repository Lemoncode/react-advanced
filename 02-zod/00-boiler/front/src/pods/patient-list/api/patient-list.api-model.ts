export interface Patient {
  ID: string;
  NIF: string;
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
