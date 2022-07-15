import React from "react";

interface Patient {
  name: string;
  temperature: number;
  bloodPressureH: number;
  bloodPressureL: number;
}

export const MyForm = () => {
  const [patient, setPatient] = React.useState<Patient>({
    name: "",
    temperature: 0,
    bloodPressureH: 0,
    bloodPressureL: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  return (
    <form>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <label>
          Nombre:
          <input
            type="text"
            name="name"
            value={patient.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Temperatura:
          <input
            type="number"
            name="temperature"
            value={patient.temperature}
            onChange={handleChange}
          />
        </label>
        <label>
          Presión arterial:
          <input
            type="number"
            name="bloodPressureH"
            value={patient.bloodPressureH}
            onChange={handleChange}
          />
          /
          <input
            type="number"
            name="bloodPressureL"
            value={patient.bloodPressureL}
            onChange={handleChange}
          />
        </label>
      </div>
    </form>
  );
};
