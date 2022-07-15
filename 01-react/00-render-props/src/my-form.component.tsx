import React from "react";
import { CSSTransition } from "react-transition-group";

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

  const [feverFlag, setFeverFlag] = React.useState(false);

  React.useEffect(() => {
    setFeverFlag(patient.temperature > 38.9);
  }, [patient.temperature]);

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

        <CSSTransition
          in={feverFlag}
          classNames={{
            enter: "animate__animated animate__flipInX",
            exit: "animate__animated animate__flipOutX",
          }}
          timeout={500}
        >
          <label>
            Temperatura:
            <input
              type="number"
              name="temperature"
              value={patient.temperature}
              onChange={handleChange}
              style={{ background: feverFlag ? "lightCoral" : "white" }}
            />
          </label>
        </CSSTransition>
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
