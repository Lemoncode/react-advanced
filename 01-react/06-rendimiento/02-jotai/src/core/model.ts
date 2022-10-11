export interface Fullname {
  name: string;
  lastname: string;
}

export const createEmptyFullname = (): Fullname => ({
  name: "",
  lastname: "",
});
