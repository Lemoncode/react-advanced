interface SwitchRoutes {
  root: string;
  patientList: string;
  patient: (id: string) => string;
}

export const switchRoutes: SwitchRoutes = {
  root: "/",
  patientList: "/patient-list",
  patient: (id: string) => `/patient/${id}`,
};
