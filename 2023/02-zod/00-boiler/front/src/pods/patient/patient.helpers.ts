interface NIF {
  dni: string;
  letter: string;
}

export const separateNumberFromLetterInDNI = (NIF: string): NIF => {
  const dni = NIF.slice(0, -1);
  const letter = NIF.slice(-1);
  return { dni, letter };
};
