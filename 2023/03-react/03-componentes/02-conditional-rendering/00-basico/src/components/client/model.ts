export interface Client {
  name: string;
  lastnameA: string;
  lastnameB: string;
  spanishNationality: boolean;
  Residence: boolean;
  companyDocument: boolean;
  nif: string;
  cif: string;
  nie: string;
  other: string;
}

export const createEmptyClient = (): Client => ({
  name: "",
  lastnameA: "",
  lastnameB: "",
  spanishNationality: false,
  Residence: false,
  companyDocument: false,
  nif: "",
  cif: "",
  nie: "",
  other: "",
});
