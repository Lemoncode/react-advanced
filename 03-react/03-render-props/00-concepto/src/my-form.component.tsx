import React from "react";
import classes from "./my-form.component.module.css";
import { CSSTransition } from "react-transition-group";
import { AnimationWrapper } from "./animation-wrapper.component";

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
    <form className={classes.form}>
      <div>
        <label>Nombre:</label>
        <input
          type="text"
          name="name"
          value={patient.name}
          onChange={handleChange}
        />
      </div>

      <AnimationWrapper
        inProp={feverFlag}
        render={(animationInProgress) => (
          <div>
            <label>Temperatura:</label>
            <input
              type="number"
              name="temperature"
              value={patient.temperature}
              disabled={animationInProgress}
              onChange={handleChange}
              style={{ background: feverFlag ? "#BC5B40" : "#00AD74" }}
            />
            {animationInProgress ? "Animation in progress" : "quiet"}
          </div>
        )}
      />
      <div>
        <label>Presión arterial:</label>
        <div>
          <input
            type="number"
            name="bloodPressureL"
            value={patient.bloodPressureL}
            onChange={handleChange}
          />
          /
          <input
            type="number"
            name="bloodPressureH"
            value={patient.bloodPressureH}
            onChange={handleChange}
          />
        </div>
      </div>
    </form>
  );
};
