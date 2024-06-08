import { Client } from "./model";

export const loadClient = (): Promise<Client> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: "John",
        lastnameA: "Doe",
        lastnameB: "Doe",
        spanishNationality: true,
        Residence: false,
        companyDocument: false,
        nif: "12345678Z",
        cif: "",
        nie: "",
        other: "",
      });
    }, 1000);
  });
};
