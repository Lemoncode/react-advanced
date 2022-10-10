# 00 Render Prop

## Resumen

Un tema muy interesante que ofrece *Framer* son las animaciones de *layout*,
¿Te imaginas cambiar la dirección de un contenedor *flexbox* y obtener una
animación? ¿Y lo mismo con anchos y altos? Vamos a ver cómo funciona
esta maravilla.

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- En este ejemplo vamos a mirar de crear un *toggle button* (sí, el
  famoso del *iphone* :)).

- Si no tenemos ya *framer* instalado, lo instalamos.

```bash
npm install framer-motion
```

- Lo siguiente vamos a crearnos un *toggle button* sin animaciones.

- Creamos un componente de clase.

_./components/toggle-button.component.tsx_

```tsx
import React from "react";

interface Props {
  on: boolean;
  onToggle: () => void;
}

export const ToggleButton: React.FC<Props> = (props) => {
  const { on, onToggle } = props;

  return (
    <div>
      <div />
    </div>
  );
};
```

- Y vamos ya a consumirlo en nuestra *App*:

```tsx
import React from "react";
import { ToggleButton } from "./components/toggle-button.component";

export const App = () => {
  const [on, setOn] = React.useState(false);

  const handleToggle = () => {
    setOn(!on);
  };

  return <ToggleButton on={on} onToggle={handleToggle} />;
};
```

- De momento nada del otro jueves, vamos a darle algo de estilo a esto.

_./components/toggle-button.component.css_

```css
.container {
  display: flex;
  width: 170px;
  height: 100px;
  border-radius: 100px;
  padding: 10px;
  cursor: pointer;
  z-index: 2;
  background-color: #2f4858;
}
```

- Vamos a aplicar esta clase en el *div* contenedor:

_./components/toggle-button.component.tsx_

```diff
import React from 'react';
+ import classes from './toggle-button.component.css';

interface Props {
  on: boolean;
  onToggle: () => void;
}

export const ToggleButton : ReactFC<Props> = (props) => {
  const {on, onToggle} = props;

  return (
-    <div className={classes.container}>
+    <div className={classes.container} onClick={onToggle}>
      <div/>
    </div>
  );
};
```

- Probamos

```bash
npm start
```

Bueno, tenemos un contenedor con un *div* vacío, y ojo fíjate en el truco,
por defecto _justify-content_ va a valer _flex-start_, así que cuando
pongamos un div dentro se mostrará justificado a la izquierda.

- Vamos a pintar "la bolita" (le vamos a llamar la _canica_)

_./components/toggle-button.component.css_

```diff
.container {
  display: flex;
  width: 170px;
  height: 100px;
  border-radius: 100px;
  padding: 10px;
  cursor: pointer;
  z-index: 2;
  background-color: #2f4858;
}

+ .marble {
+  width: 80px;
+  height: 80px;
+  margin: 10px;
+  border-radius: 100%;
+  background-color: white;
+ }
```

- Vamos a aplicar la clase a la "bolita":

```diff
export const ToggleButton : ReactFC<Props> = (props) => {
  const {on, onToggle} = props;

  return (
     <div className={classes.container} onClick={onToggle}>
-      <div/>
+      <div className={classes.marble}/>
    </div>
  );
};
```

- Bueno ya tenemos una "bolita" :).

- Ahora vamos a jugar con el *container*:
  - Cuando está *off* queremos que el *flex* que el *justify-content* sea
    *flex-start* (lo que hay por defecto).
  - Cuando el contenedor está en on queremos que el *flex* sea *flex-end*.

Esto lo vamos a implementar con dos sabores, uno usando atributos de datos en
el *css* y otro con un *class name composer* (me decís vosotros que solución
véis más limpia).

Vamos a por el atributo de datos en CSS.

_./components/toggle-button.component.css_

```diff
.container {
  display: flex;
  width: 170px;
  height: 100px;
  border-radius: 100px;
  padding: 10px;
  cursor: pointer;
  z-index: 2;
  background-color: #2f4858;
}

+ .container[data-isOn='true'] {
+  justify-content: flex-end;
+ }
```

Vamos ahora a aplicar esto en el DIV:

_./components/toggle-button.component.tsx_

```diff
  return (
-    <div className={classes.container} onClick={onToggle}>
+    <div className={classes.container} onClick={onToggle} data-isOn={on}>

      <div className={classes.marble}/>
    </div>
  );
```

- Si ahora probamos el *toggle* funciona, pero se ve muy brusca la transición,
  manos a la obra con *framer*.
- Importamos _motion_

_./components/toggle-button.component.tsx_

```diff
import React from 'react';
+ import {motion} from 'framer-motion';
import classes from './toggle-button.component.css';
```

Y ojo que ahora decimos que la canica va a ser un _motion.div_ y le
añadimos el atributo _layout_

_./components/toggle-button.component.tsx_

```diff
 <div className={classes.container} onClick={onToggle} data-isOn={on}>
-    <div className={classes.marble}/>
+    <motion.div className={classes.marble} layout/>
```

- Eyyy!!! ya tenemos un *toggle button* con animaciones, pero vamos a darle
  un puntito mal, hay una propiedad _spring_ con la que podemos jugar para
  que vaya hasta el final el *toggle* y rebote un poquito.

Añadir esto al inicio del App

```diff
import {motion} from 'framer-motion';
import classes from './toggle-button.component.css';

+ const spring = {
+  type: "spring",
+  stiffness: 700,
+  damping: 30,
+};
```

- Y lo añadimos a la canica:

```diff
  <div className={classes.container} onClick={onToggle} data-isOn={on}>
-    <motion.div className={classes.marble} layout />
+    <motion.div className={classes.marble} layout transition={spring}/>
  </div>
```

# Apéndice usando class name composer

Vamos a hacer el cambio de clase usando *class composer*, para ello vamos
a instalar la librería _classnames_:

```bash
npm i classnames --save
```

Y ahora en el css vamos a crear una clase:

```diff
- .container[data-isOn='true'] {
-  justify-content: flex-end;
- }
+ .container-on {
+  justify-content: flex-end;
+ }
```

Vamos ahora a actualizar el código:

```diff
import classes from "./toggle-button.css";
+ import classNames from "classNames";
```

Y en el markup

```diff
   <div
-    className={classes.container}
+    className={classNames(classes.container,
+        on ? classes.containerOn : null
+      )}
      >
    data-isOn={on}>
```
