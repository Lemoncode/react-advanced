import React from "react";
import classes from "./my-form.component.module.css";
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
      <div>
        <AnimationWrapper inProp={feverFlag}>
          {(animationInProgress) => (
            <label>
              Temperatura:
              <input
                type="number"
                name="temperature"
                value={patient.temperature}
                onChange={handleChange}
                disabled={animationInProgress}
                style={{ background: feverFlag ? "lightCoral" : "white" }}
              />
              {animationInProgress ? "Animation in progress" : "quiet"}
            </label>
          )}
        </AnimationWrapper>
      </div>
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
