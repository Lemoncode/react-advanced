import { atom } from "jotai";

export const nameAtom = atom("John");
export const lastnameAtom = atom("Doe");

export const fullnameAtom = atom((get) => {
  const name = get(nameAtom);
  const lastname = get(lastnameAtom);
  return `${name} ${lastname}`;
});