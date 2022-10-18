# 04 Element Height

## Resumen

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

En muchos de los diseños actuales de cualquier web, es muy normal que tengamos un componente _Header_ arriba del todo, el cual nos ayuda a navegar entre las diferentes páginas de la propia web.

Al ser tan importante, casi siempre tiene una posición fija, la cual nos permite tener este componente visible todo el tiempo. Cuando usamos el _position: fixed_ de CSS, estamos sacando al elemento fuera de su flujo normal, por lo que los demás elementos, como el contenido que tenga justo debajo, no tienen en cuenta su posición y por tanto tapar el contenido.

Una solución podría ser utilizar el _position: sticky_ pero este posicionamiento puede que no funcione (https://caniuse.com/?search=sticky) si tienes que soportar un navegador o version antigua. Vamos a dar una alternativa usando un custom hook para calcular la altura del componente _Header_ y usarla para nuestro beneficio.

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

Vamos a arrancarlo

```bash
npm start
```

Vamos a quitar el _margin_ por defecto que trae el body:

_./src/global/styles.css_

```diff
body {
  font-family: sans-serif;
+ margin: 0;
}

```

Añadimos dos ficheros:

- El componente header con posición fija.
- Un componente que representa el contenido de la web y tiene el scroll visible.

_./src/header.tsx_

```tsx
import React from "react";
import classes from "./header.css";

export const Header: React.FC = () => {
  return <header className={classes.root}>This is the header component</header>;
};

```

_./src/header.css_

```css
.root {
  position: fixed;
  width: 100%;
  padding: 1rem;
  background-color: #FF6F91;
}

```

_./src/content.tsx_

```tsx
import React from "react";
import classes from "./content.css";

export const Content: React.FC = () => {
  return <main className={classes.root}>This is the web site content</main>;
};

```

_./src/content.css_

```css
.root {
  height: 2000px;
  padding: 1rem;
  background-color: #008F7A;
}

```

Usamos ambos componentes:

_./src/app.tsx_

```diff
import React from "react";
+ import { Header } from "./header";
+ import { Content } from "./content";

export const App = () => {
- return <h1>Hello React !!</h1>;
+ return (
+   <>
+     <Header />
+     <Content />
+   </>
+ );
};

```

Como vemos, el componente _Header_ tapa el texto del componente _Content_. Una solución rápida podria ser utilizar el _position: sticky_:

_./src/header.css_

```diff
.root {
- position: fixed;
+ position: sticky;
- width: 100%;
+ top: 0;
  padding: 1rem;
  background-color: #FF6F91;
}

```

Pero si tenemos que soportar versiones antiguas de algún navegador, puede que ésta no sea compatible con el _position: sticky_, asi que como alternativa vamos a crear un hook que calcule la altura del componente _Header_ y la utilice en otro componente que vamos a llamar _Offset_, así los demás elementos del DOM van a respetar la altura de la cabecera.

_./src/header.css_

```diff
.root {
- position: sticky;
+ position: fixed;
- top: 0;
+ width: 100%;
  padding: 1rem;
  background-color: #FF6F91;
}

```

_./src/header.tsx_

```diff
import React from "react";
import classes from "./header.css";

export const Header: React.FC = () => {
+ const { elementRef, elementHeight } = useElementHeight();
- return <header className={classes.root}>This is the header component</header>;
+ return (
+   <>
+     <header ref={elementRef} className={classes.root}>
+       This is the header component
+     </header>
+     <Offset height={elementHeight} />
+   </>
+ );
};

+ interface OffsetProps {
+   height: number;
+ }

+ const Offset: React.FC<OffsetProps> = (props) => {
+   const { height } = props;
+   return <div style={{ minHeight: height }} />;
+ };

+ const useElementHeight = () => {
+   const elementRef = React.useRef<HTMLElement>(null);
+   const [elementHeight, setElementHeight] = React.useState<number>(null);

+   const handleSetHeight = () => {
+     if (elementRef.current) {
+       setElementHeight(elementRef.current.clientHeight);
+     }
+   };

+   React.useEffect(() => {
+     handleSetHeight();
+   }, [elementRef.current?.clientHeight]);

+   React.useEffect(() => {
+     window.addEventListener("resize", handleSetHeight);
+     return () => {
+       window.removeEventListener("resize", handleSetHeight);
+     };
+   }, []);

+   return {
+     elementRef,
+     elementHeight,
+   };
+ };

```

Ahora, en cuanto se renderiza la cabecera por primera vez o se produce un _resize_ de la ventana del navegador, se calcula la altura de este componente y se lo pasamos al componente _Offset_ por lo que el componente _Content_ lo tiene en cuenta.

> Prueba el ejemplo redimensionando la pantalla usando la opción _Toggle device toolbar_ de las Dev Tools del navegador.
