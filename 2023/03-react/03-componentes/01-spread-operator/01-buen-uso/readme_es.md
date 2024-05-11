# 01 Buen Uso

## Resumen

Acabamos de ver como el operador de propagación puede ser peligroso, ya que se nos pueden colar _props_ que no esperábamos y provocarnos problemas.

Ahora vamos a ver un ejemplo en el que si que nos es de gran ayuda.

Vamos a crear un input con una etiqueta adicional para mostrar información (mensaje de error, etc...).

## Paso a Paso

- Primero copiamos el _00-boiler-plate_, y hacemos un _npm install_

```bash
npm install
```

- Vamos a crearnos nuestro componente input, de primeras podemos probar algo así como (de momento con las _props_ vamos en modo salvaje):

_./src/components/input-info.component.module.css_

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
import classes from "./input-info.component.module.css";

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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
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

- Todo parece que funciona, pero tenemos algo muy feo en nuestro componente input... un _any_ como un castillo en las _props_.
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

_./src/components/input-info.component.tsx_

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

Con esto nos avisa que estamos colando una _prop_ de más, peeeero y si queremos usar alguna propiedad de _Input_ podría ser un estilado o decirle que el input es de tipo password:

_./sr/app.tsx_

```diff
    <div>
      <InputInfo
        value={value}
        onChange={(e) => setValue(e.target.value)}
        label="El campo es obligatorio"
+       type="password"
-        time={time}
      />
    </div>
```

En este momento podríamos esta tentados de añadir el campo _type_ y tirar millas, pero mañana querremos usar el _style_, o el _className_, o..., sí que mejor hacer que nuestro componente mezcle las _props_ que trae un _input_ con la nueva que hemos añadido...

_./src/components/input-info.component.tsx_

```diff
- interface Props {
+ interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
-  value: string;
-  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}
```

Con esto ya no nos sale en rojo, pero el input no se pone en modo clave... y es que no estamos pasando el _type_ al _input_, ¿Qué podemos hacer? Otra vez podríamos pensar en ir campo a campo, pero esto sería un suplicio, otra opción es usar el _spread operator_:

_./src/components/input-info.component.tsx_

```diff
    <div className={classes.container}>
-      <input type="text" value={props.value} onChange={props.onChange} />
+      <input {...props} />
      <label>{props.label}</label>
    </div>
```

- Con esto ya podemos usar el componente como un _input_ normal, pero con la etiqueta adicional, si metemos algo que no aplica nos va a "_chillar_" ¿Por qué? Porque en este caso acotamos el rango de campos en las _props_, y al _spread operator_ le llega la lista de _props_ valida.
- Bueno esto está casi casi bien, hay un detalle, y es que al _input_ le estamos pasando una propiedad de más _label_, vamos a aplicar _destructuring_ para quedarnos con las _props_ del _input_ limpia.

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

> ¿Que pasa si quiero tener un valor por defecto? Por ejemplo en el input quiero que el type sea input:

```diff
export const InputInfo: React.FC<Props> = (props: Props) => {
  return (
    <div className={classes.container}>
      <input
+       type="number"
        {...props}
      />
      <label>{props.label}</label>
    </div>
  );
};
```

Ponemos otro campo y no informamos _password_

_./src/App.tsx_

```diff
function App() {
  const [value, setValue] = React.useState("");
+  const [myNumber, setMyNumber] = React.useState(0);
-  const [dummy, _] = React.useState("");

  return (
    <div>
+      <InputInfo
+        value={myNumber}
+        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
+          setMyNumber(+e.target.value)
+        }
+        label="Campo numérico"
+      />
      <InputInfo
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
        label="El campo es obligatorio"
        type="password"
      />
    </div>
  );
}

```

> ¿Y si quiero gestionar yo el OnChange en el input (quiero hacer algo más):

_./src/components/input-info.component.tsx_

```diff
import classes from "./input-info.component.module.css";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

+ const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
+   console.log("Aquí pongo mi código");
+    if(props.onChange) {
+      props.onChange(e);
+    }
+ };


export const InputInfo: React.FC<Props> = (props: Props) => {
  return (
    <div className={classes.container}>
      <input
        type="number" {...props}
+      onChange={(e) => handleOnChange(e)}
      />
      <label>{props.label}</label>
    </div>
  );
};
```

# Ejercicio

Vamos a hacer un pequeño ejercicio,... le damos vida a la validación de campo obligatorio, lo resolvemos a nivel de página...

Una vez hecho, añadir validaciones a un formulario puede parecer sencillo pero a poco que nos empezamos a meter en escenario reales nos podemos encontrar con qué:

- No queremos mostrar los mensajes de error a no ser que el usuario
  hay visitado ese campo o ya le haya dado al botón de _submit_.

- Podemos tener validaciones síncronas y asíncronas.

- Queremos reutilizar validaciones con firmas estándares.

- Queremos tener validaciones a nivel de campo y a nivel de formulario.

- ...

Más adelante veremos una solución para validar formulario de una manera
más declarativa.
