export interface Client {
  documentType: string;
  name: string;
  lastnameA: string;
  lastnameB: string;
  nif: string;
  nie: string;
  passport: string;
  province: string;
  country: string;
}

export const createEmptyClient = (): Client => ({
  documentType: "",
  name: "",
  lastnameA: "",
  lastnameB: "",
  nif: "",
  nie: "",
  passport: "",
  province: "",
  country: "",
});
