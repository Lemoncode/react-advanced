import { atom } from "jotai";

export const nameAtom = atom("John");
export const lastnameAtom = atom("Doe");

export const fullnameAtom = atom((get) => {
  const name = get(nameAtom);
  const lastname = get(lastnameAtom);
  return `${name} ${lastname}`;
});

export const fullnameAtomWithWrite = atom(
  (get) => {
    const name = get(nameAtom);
    const lastname = get(lastnameAtom);
    return { name, lastname };
  },
  (get, set, value: { name: string; lastname: string }) => {
    const { name, lastname } = value;
    
    set(nameAtom, name);
    set(lastnameAtom, lastname);
  }
);
