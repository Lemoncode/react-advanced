# 01 Buen Uso

## Resumen

Acabamos de ver como el operador de propagación puede ser peligroso, ya que se nos pueden colar props que no esperabamos y provocarnos problemas.

Ahora vamos a ver un ejemplo en el que si que nos es de gran ayuda.

Vamos a crear un input con una etiqueta adicional para mostrar información
(mensaje de error, etc...).

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Vamos a crearnos nuestro input componente, de primeras podemos
  probar algo así como (de momento con las props vamos en modo salvaje):

_./src/components/input-info.component.css_

```css
.container {
  display: inline-flex;
  flex-direction: column;
}

.container label {
  color: red;
  font-size: x-small;
}
```

_./src/components/input-info.component.tsx_

```tsx
import * as React from "react";
import classes from "./input-info.component.css";

export const InputInfo = (props: any) => {
  return (
    <div className={classes.container}>
      <input type="text" value={props.value} onChange={props.onChange} />
      <label>{props.label}</label>
    </div>
  );
};
```

- Ahora vamos a consumir este componente:

_./src/app.tsx_

```tsx
import * as React from "react";
import { InputInfo } from "./components/input-info.component";

export const App = () => {
  const [value, setValue] = React.useState("");

  return (
    <div>
      <InputInfo
        value={value}
        onChange={(e) => setValue(e.target.value)}
        label="El campo es obligatorio"
      />
    </div>
  );
};
```

- Vamos a probarlo:

```bash
npm start
```

- Todo parece que funciona, pero tenemos algo muy feo en nuestro
  componente input... un _any_ como un castillo en las props.

- De hecho podemos hacer la jugada del ejemplo anterior:

_./src/app.tsx_

```diff
export const App = () => {
  const [value, setValue] = React.useState("");
+  const [time, setTime] = React.useState("");

+  React.useEffect(() => {
+    setInterval(() => {
+      setTime(new Date().toLocaleTimeString());
+    }, 1000);
+  }, []);

  return (
    <div>
      <InputInfo
        value={value}
        onChange={(e) => setValue(e.target.value)}
        label="El campo es obligatorio"
+        time={time}
      />
    </div>
  );
};
```

Lo primero que se nos puede venir a la cabeza es definir lo que nos
hace falta y ya esta...:

```diff

+ interface Props {
+  value: string;
+  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
+  label : string;
+ }

- export const InputInfo = (props: any) => {
+ export const InputInfo : React.FC<Props> = (props: Props) => {

  return (
    <div className={classes.container}>
      <input type="text" value={props.value} onChange={props.onChange}/>
      <label>{props.label}</label>
    </div>
  );
};
```

Con esto nos avisa que estamos colando una prop de más, peeeero
y si queremos usar alguna propiedad de _Input_ podría ser un estilado
o decirle que el input es de tipo password:

_./sr/app.tsx_

```diff
    <div>
      <InputInfo
        value={value}
        onChange={(e) => setValue(e.target.value)}
        label="El campo es obligatorio"
+       type={password}
-        time={time}
      />
    </div>
```

En este momento podríamos esta tentados de añadir el campo _type_ y
tirar millas, pero mañana querremos usar el style, o el className, o...,
así que mejor hacer que nuestro componente mezcle las props que
trae un _input_ con la nueva que hemos añadido...

_./src/components/input-info.component.tsx_

```diff
- interface Props {
+ interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
-  value: string;
-  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}
```

Con esto ya no nos sale en rojo, pero el input no se pone en modo
clave... y es que no estamos pasando el _type_ al input, ¿Qué podemos
hacer? Otra vez podríamos pensar en ir campo a campo, pero esto
sería un suplicio, otra opción es usar el spread operator:

_./src/components/input-info.component.tsx_

```diff
    <div className={classes.container}>
-      <input type="text" value={props.value} onChange={props.onChange} />
+      <input {...props} />
      <label>{props.label}</label>
    </div>
```

- Con esto ya podemos usar el componente como un input normal, pero
  con la etiqueta adicional, si metemos algo que no aplica nos va
  a "chillar" ¿Por qué? Porque en este caso acotamos el rango de campos
  en las props, y al spread operator le llega la lista de props
  valida.

- Bueno esto está casí casí bien, hay un detalle, y es que al input
  le estamos pasando una propiedad de más _label_, vamos a aplicar
  destructuring para quedarnos con las props del input limpia.

_./src/components/input-info.component.tsx_

```diff
export const InputInfo: React.FC<Props> = (props: Props) => {
  // cast props to inputProps that only contains HTMLInputElement props
+  const { label, ...inputProps } = props;

  return (
    <div className={classes.container}>
-      <input {...Props} />
+      <input {...inputProps} />
      <label>{props.label}</label>
    </div>
  );
};
```

> ¿Qué pasaría si intentáramos hacer un cast de TypeScript?

```
const Input = props as React.InputHTMLAttributes<HTMLInputElement>;
```

# Ejercicio

Vamos a hacer un pequeño ejercicio, ... le damos vida a la validación
de campo obligatorio, lo resolvemos a nivel de página...

Una vez hecho, añadir validaciones a un formulario puede parece sencillo
pero a poco que nos empezamos a meter en escenario reales nos podemos encontrar
con que:

- No queremos mostrar los mensajes de error a no ser que el usuario
hay visitado ese campo o ya le haya dado al botón de submit.

- Podemos tener validaciones síncronas y asíncronas.

- Queremos reutilizar validaciones con firmas estándares.

- Queremos tener validaciones a nivel de campo y a nivel de formulario.

- ...

Más adelante veremos una solución para validar formulario de una manera
más declarativa.


