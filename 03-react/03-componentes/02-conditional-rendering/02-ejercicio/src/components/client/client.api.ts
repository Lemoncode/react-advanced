import { Client } from "./model";

export const loadClient = (): Promise<Client> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        documentType: "NIF",
        name: "Paco",
        lastnameA: "Perez",
        lastnameB: "Lopez",
        nif: "12345678X",
        nie: "",
        passport: "",
        province: "Zaragoza",
        country: "",
      });
    }, 1000);
  });
};
