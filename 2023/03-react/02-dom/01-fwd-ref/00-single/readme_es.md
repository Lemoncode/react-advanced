# 00 Forward Ref

## Resumen

Cuando usamos el _hook_ _useRef_ nos permite de una manera fácil poder mantener la referencia
a un elemento del DOM (por ejemplo un _input_ o un _select_), y poder cambiar propiedades del mismo
como por ejemplo asignarle el foco a ese elemento o cualquier otra.

Esto está genial si la referencia la tenemos dentro del mismo componente, pero ¿y si quisiéramos
pasar esa referencia desde el componente padre? Las _ForwardRef_ nos pueden ser de gran ayuda.

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

## Paso a Paso

- Hacemos un _npm install_

```bash
npm install
```

En este ejemplo vamos a crearnos un componente que vamos a llamar _InputComponent_ en el que vamos a envolver un
elemento _(HTML) input_.

Tenemos un requerimiento: cuando el usuario pulsa en un botón que se encuentra fuera del componente
queremos darle el foco al elemento _input_ interno de nuestro _InputComponent_.

Aquí tenemos un desafío, podemos tener un _ref_ al _input_ dentro de nuestro _InputComponent_, pero...
nosotros queremos manejar esa referencia desde el componente padre, ¿qué podemos hacer? _ForwardRef_ al rescate.

Primero vamos a definir nuestro componente _InputComponent_

_./src/common/input.component.tsx_

```tsx
import React from "react";

export interface InputProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
}

export const InputComponent: React.FC<InputProps> = (props) => {
  const { label, value, onChange } = props;

  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  return <input placeholder={label} value={value} onChange={handleChange} />;
};
```

Vamos a añadir nuestro componente principal que instanciará dos _inputComponents_ y un botón:

_./src/app.tsx_

```tsx
import React from "react";
import { InputComponent } from "./common/input.component";

export function App() {
  const [firstName, setFirstName] = React.useState("");
  const [secondName, setSecondName] = React.useState("");

  return (
    <div className="App">
      <InputComponent
        label="First name"
        value={firstName}
        onChange={setFirstName}
      />
      <InputComponent
        label="Second name"
        value={secondName}
        onChange={setSecondName}
      />
      <button>Set focus to second name</button>
    </div>
  );
}
```

Ahora viene la parte interesante: queremos que cuando el usuario pulse en el botón, el foco se asigne al segundo _InputComponent_.

¿Cómo podríamos intentar implementar esto con lo que sabemos de _React_? Podríamos exponer una propiedad _ref_, esto no va a funcionar, veamos por qué...

Primero en el _InputComponent_ exponemos la propiedad _ref_. Es el nombre de la propiedad que tienen todos los componentes nativos en _React_ para obtener su instancia:

_./src/common/input.component.tsx_

```diff
import React from "react";

interface InputProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
+ ref?: React.RefObject<HTMLInputElement>;
}

const InputComponent : React.FC<InputProps> = (props) => {
- const { label, value, onChange } = props;
+ const { label, value, onChange, ref } = props;

  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  return (
    <input
+     ref={ref}
      placeholder={label}
      value={value}
      onChange={handleChange}
    />
  );
};
```

Segundo lo consumimos en el componente padre:

- Por un lado definimos una variable que tendrá la referencia.
- Por otro cuando instanciamos nuestro segundo _InputComponent_ le pasamos
  esa _ref_ por propiedad.

_./src/app.tsx_

```diff
export function App() {
+ const secondInputRef = React.useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = React.useState("");
  const [secondName, setSecondName] = React.useState("");

  return (
    <div className="App">
      <InputComponent
        label="First name"
        value={firstName}
        onChange={setFirstName}
      />
      <InputComponent
+       ref={secondInputRef}
        label="Second name"
        value={secondName}
        onChange={setSecondName}
      />
      <button>Set focus to second name</button>
    </div>
  );
}
```

Ya sólo nos queda manejar esa referencia cuando el usuario pulse en el botón.

_./src/app.tsx_

```diff
export function App() {
  const secondInputRef = React.useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = React.useState("");
  const [secondName, setSecondName] = React.useState("");

+ const handleSetFocus = () => {
+   if (secondInputRef.current) {
+     secondInputRef.current.focus();
+   }
+ };

  return (
    <div className="App">
      <InputComponent
        label="Firt name"
        value={firstName}
        onChange={setFirstName}
      />
      <InputComponent
        ref={secondInputRef}
        label="Second name"
        value={secondName}
        onChange={setSecondName}
      />
-     <button>Set focus to second name</button>
+     <button onClick={handleSetFocus}>Set focus to second name</button>
    </div>
  );
}
```

Como vemos, esto no funciona, debido a que la propiedad [_ref_](https://reactjs.org/docs/refs-and-the-dom.html) es una propiedad
nativa de los componentes de _React_, al igual que por ejemplo la propiedad [_key_](https://reactjs.org/docs/lists-and-keys.html).

Tenemos el siguiente error:

```
react-dom.development.js?f8c1:86 Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
```

Podemos hacer un _workaround_ un poco sucio y por ejemplo cambiarle el nombre a la propiedad.

_./src/common/input.component.tsx_

```diff
import React from "react";

interface InputProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
- ref?: React.RefObject<HTMLInputElement>;
+ innerRef?: React.RefObject<HTMLInputElement>;
}

const InputComponent : React.FC<InputProps> = (props) => {
- const { label, value, onChange, ref } = props;
+ const { label, value, onChange, innerRef } = props;

  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  return (
    <input
-     ref={ref}
+     ref={innerRef}
      placeholder={label}
      value={value}
      onChange={handleChange}
    />
  );
};

```

_./src/app.tsx_

```diff
export default function App() {
  const secondInputRef = React.useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = React.useState("");
  const [secondName, setSecondName] = React.useState("");

  return (
    <div className="App">
      <InputComponent
        label="Firt name"
        value={firstName}
        onChange={setFirstName}
      />
      <InputComponent
-       ref={secondInputRef}
+       innerRef={secondInputRef}
        label="Second name"
        value={secondName}
        onChange={setSecondName}
      />
      <button>Set focus to second name</button>
    </div>
  );
}
```

Si te fijas ahora cuando pulsas en el botón, el foco de la ventana se va al segundo _InputComponent_.

¿Qué ocurre si necesitamos usar la propiedad _ref_ sin tener que inventarnos nuevas propiedades? Un ejemplo práctico, podría ser crear nuestra propia librería de componentes y dejar la posibilidad de que accedan a la referencia de cada componente.

Es hora de usar las _ForwardRef_.

Primero, en el _InputComponent_ exponemos la _forwardRef_, si te fijas es una función que envuelve a tu componente funcional de _React_.

_./src/common/input.component.tsx_

```diff
interface InputProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
- innerRef?: React.RefObject<HTMLInputElement>;
}

- export const InputComponent : React.FC<InputProps> = (props) => {
+ export const InputComponent = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
-     const { label, value, onChange, innerRef } = props;
+     const { label, value, onChange } = props;

      const handleChange = (event: any) => {
        onChange(event.target.value);
      };

      return (
        <input
-         ref={innerRef}
+         ref={ref}
          placeholder={label}
          value={value}
          onChange={handleChange}
        />
      );
-   };
+   }
+ );

```

Segundo, volvemos a actualizar el padre:

_./src/app.tsx_

```diff
export default function App() {
  const secondInputRef = React.useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = React.useState("");
  const [secondName, setSecondName] = React.useState("");

  return (
    <div className="App">
      <InputComponent
        label="First name"
        value={firstName}
        onChange={setFirstName}
      />
      <InputComponent
-       innerRef={secondInputRef}
+       ref={secondInputRef}
        label="Second name"
        value={secondName}
        onChange={setSecondName}
      />
      <button>Set focus to second name</button>
    </div>
  );
}
```

Este ejemplo tal cual te puede parecer un caso un poco raro pero... ponte en el escenario en el que estás validando
un formulario y el equipo de usabilidad te ha pedido poner el foco en el primer campo que tenga un error... ahora
empieza todo a tener más sentido ¿Verdad?

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
