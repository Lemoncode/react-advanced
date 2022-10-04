# 01 Fwd Ref Multiple

## Resumen

Hemos visto un ejemplo con *Fwd Ref* simple, en este ejemplo veremos cómo hacerlo con múltiples elementos.

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

export const TwoInput: React.FC<InputProps> = (props) => {
  const { labelA, valueA, onChangeA, labelB, valueB, onChangeB } = props;

  const handleChangeA = (event: any) => {
    onChangeA(event.target.value);
  };

  const handleChangeB = (event: any) => {
    onChangeB(event.target.value);
  };

  return (
    <>
      <input placeholder={labelA} value={valueA} onChange={handleChangeA} />
      <input placeholder={labelB} value={valueB} onChange={handleChangeB} />
    </>
  );
};
```

- Y vamos a consumirlo en nuestra aplicación:

_./src/app.tsx_

```tsx
import React from "react";
import { TwoInput } from "./common/twoinput.component";

export function App() {
  const [firstName, setFirstName] = React.useState("");
  const [secondName, setSecondName] = React.useState("");

  return (
    <div className="App">
      <TwoInput
        labelA="First name"
        valueA={firstName}
        onChangeA={setFirstName}
        labelB="Second name"
        valueB={secondName}
        onChangeB={setSecondName}
      />
      <button>Set focus to first name</button>
      <button>Set focus to second name</button>
    </div>
  );
}
```

En esta ocasión queremos obtener una referencia al primer input, y otra al segundo para poder hacer *focus* sobre ellos, para ellos vamos a seguir la misma aproximación que nos encontramos en *Material UI*, crearemos
dos propiedades pero les daremos nombres *custom*.

_./src/common/twoinput.component.tsx_

```diff
import React from "react";

interface InputProps {
  labelA: string;
  valueA: string;
  onChangeA: (newValue: string) => void;
  labelB: string;
  valueB: string;
  onChangeB: (newValue: string) => void;
+  inputRefA?: React.RefObject<HTMLInputElement>;
+  inputRefB?: React.RefObject<HTMLInputElement>;
}
```

Y vamos a enlazarlo con cada input:

```diff
export const TwoInput : React.FC<InputProps> = (props) => {
-    const { labelA, valueA, onChangeA, labelB, valueB, onChangeB } = props;
+    const { labelA, valueA, onChangeA, labelB, valueB, onChangeB, inputRefA, inputRefB } = props;


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
+          ref={inputRefA}
          />
          <input
          placeholder={labelB}
          value={valueB}
          onChange={handleChangeB}
+          ref={inputRefB}
          />
        </>
    );
```

Y ahora en app, vamos a crear las referencias:

```diff
export function App() {
  const [firstName, setFirstName] = React.useState("");
  const [secondName, setSecondName] = React.useState("");
+  const inputARef = React.useRef(null);
+  const inputBRef = React.useRef(null);

  return (
    <div className="App">
      <TwoInput
        labelA="First name"
        valueA={firstName}
        onChangeA={setFirstName}
        labelB="Second name"
        valueB={secondName}
        onChangeB={setSecondName}
+        inputRefA={inputARef}
+        inputRefB={inputBRef}
      />
```

Y vamos a añadir el comportamiento para que los botones pongan el foco en cada uno:

```diff
    <button
+      onClick={() => {if(inputARef.current) inputARef.current.focus()}}
    >Set focus to first name</button>
    <button
+      onClick={() => {if(inputBRef.current) inputBRef.current.focus()}}
    >Set focus to second name</button>
```

> Este código ha quedado un tanto sucio, aplicando curry podríamos hacer
> limpia y refactoring ¿Te animas?

# Otras aproximaciones

Se puede extender / jugar con *Forward Ref*

https://thewebdev.info/2021/11/14/how-to-forward-multiple-refs-with-react/

https://fettblog.eu/typescript-react-generic-forward-refs/

*useMergedRef*

https://github.com/jaredLunde/react-hook/tree/master/packages/merged-ref#readme
https://codesandbox.io/s/uhj08

Pueden estar bien si queremos tratar un array de elementos iguales, también te van a dar quebradores de cabeza con el tipado en *TypeScript*.
