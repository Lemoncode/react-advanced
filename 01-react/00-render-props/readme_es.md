# 00 Render Props

## Resumen

Vamos a añadir una animación un componente cuando se cumpla una condición, veremos que esto para un caso
concreto está bien pero ¿Y si queremos reusar este comportamiento en otros componentes?

Veremos como hacer esto aplicando composición y la propiedad children, ... nos daremos cuenta
de una limitación.

Después nos pondremos a implementar este comportamiento usando render props.

Este ejemplo toma como punto de partida el ejemplo _02-webpack-boiler_.

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Para manejarnos con animaciones nos vamos a instalar:
  - Animate.css: una librería para trabajar con animaciones CSS que es agnóstica de framework.
  - React-transition-group: una librería para gestionar animaciones con React.

```bash
npm install animate.css --save
```

```bash
npm install react-transition-group --save
```

```bash
npm install @types/react-transition-group --save-dev
```

- Nos vamos a crear un componente que llamaremos _my-form.component_ en este
  componente vamos a añadir un formulario con datos del paciente:

```tsx
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
    </form>
  );
};
```

```

```
