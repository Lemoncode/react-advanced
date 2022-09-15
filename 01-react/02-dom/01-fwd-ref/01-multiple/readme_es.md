# 01 Fwd Ref Multiple

## Resumen

Hemos visto un ejemplo con Fwd Ref simple, en este ejemplo veremos como hacerlo con múltiples elementos.

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.


## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Vamos a crear un nuevo componente _TwoInputComponent_

_./src/common/twoinput.component.tsx_

```tsx
import React from "react";

interface InputProps {
  labelA: string;
  valueA: string;
  onChangeA: (newValue: string) => void;
  labelB: string;
  valueB: string;
  onChangeB: (newValue: string) => void;
}

export const TwoInput : React.FC<InputProps> = (props) => {
    const { labelA, valueA, onChangeA, labelB, valueB, onChangeB } = props;

    const handleChangeA = (event: any) => {
      onChangeA(event.target.value);
    };

    const handleChangeB = (event: any) => {
      onChangeB(event.target.value);
    };


    return (
        <>
          <input
          placeholder={labelA}
          value={valueA}
          onChange={handleChangeA}
          />
          <input
          placeholder={labelB}
          value={valueB}
          onChange={handleChangeB}
          />
        </>
    );
  }
);
```

