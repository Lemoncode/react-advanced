# 02 Click outside

## Resumen

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

Cuando estamos trabajando con React, es muy típico lanzar eventos cuando pulsamos un botón y queremos que aparezca por pantalla un nuevo componente que estaba oculto, por ejemplo: un modal, un menú con opciones, etc.

Para el caso del modal, una vez se muestra por pantalla, suelen tener un botón de acción para cerrarlo y que se vuelva a ocultar.

Sin embargo, en el menú con opciones, estamos acostumbrados a elegir una de ellas y que se cierre, pero ¿y si no queremos seleccionar ninguna? ¿cómo podemos ocultar de nuevo el menú?

En este ejemplo, vamos a crear un custom hook que nos permita detectar que estamos haciendo click fuera del componente.

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

Vamos a arrancarlo

```bash
npm start
```

Abrimos el fichero _app.tsx_ y añadimos:

- un botón que al pulsar muestre un listado con opciones para poder elegir un color.
- otro botón para resetear el color.
- el listado de opciones, inicialmente oculto.
- y mostramos el color seleccionado.

_./src/app.tsx_

```diff
import React from "react";

export const App = () => {
+ const [isOpen, setIsOpen] = React.useState(false);
+ const [color, setColor] = React.useState("");

+ const handleSelectColor = (color: string) => () => {
+   setColor(color);
+   setIsOpen(false);
+ };

- return <h1>Hello React !!</h1>;
+ return (
+   <>
+     <button onClick={() => setIsOpen(true)}>Choose color</button>
+     <button onClick={() => setColor("")}>Reset color</button>
+     {isOpen && (
+       <ul>
+         <li onClick={handleSelectColor("red")}>Red</li>
+         <li onClick={handleSelectColor("green")}>Green</li>
+         <li onClick={handleSelectColor("blue")}>Blue</li>
+       </ul>
+     )}
+     <p>Selected color: {color}</p>
+   </>
+ );
};

```

Vamos a darle algo de estilo al menú:
  - Vamos a convertirlo en un contenedor flex y le añadimos un borde.
  - Además borramos el estilado de los puntos de la lista que viene por defecto.
  - Por último le añadimos una sombra para que de la sensación de que es una capa que está por encima del resto.
  - A cada hijo, le añadimos algo de padding
  - Modificamos el _cursor_ a tipo _pointer_ (para que el usuario sepa que es un elemento clickable)
  - Y un color de fondo para cuando pase el ratón por cada opción.

_./src/app.css_

```css
ul {
  display: flex;
  flex-direction: column;
  border: 1px solid gray;
  border-radius: 4px;
  list-style: none;
  padding: 0;
  box-shadow: rgb(0 0 0 / 20%) 0px 3px 3px -2px, rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px;
}

li {
  padding: 0.5rem;
  cursor: pointer;
}

li:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

```

Usemos los estilos:

_./src/app.tsx_

```diff
import React from "react";
+ import './app.css'

...

```

Como vemos, cada vez que seleccionamos un color, hacemos que el listado se oculte, para dar la sesanción de que ya está el trabajo realizado. Pero, ¿qué ocurre si seleccionamos por ejemplo el color rojo, hacemos click de nuevo al botón _Choose color_ pero queremos cerrar el menú sin seleccionar uno nuevo?

Lo más intuitivo para el usuario es que haciendo click fuera del menú se cierre automaticamente sin seleccionar ningún elemento. Para implementar esto, vamos a crear un custom hook:

_./src/app.tsx_

```diff
import React from "react";
import "./app.css";

export const App = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [color, setColor] = React.useState("");
+ const menuRef = React.useRef<HTMLUListElement>(null);
+ useClickOutside({
+   ref: menuRef,
+   onClickOutside: () => {
+     setIsOpen(false);
+   },
+ });

  const handleSelectColor = (color: string) => () => {
    setColor(color);
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Choose color</button>
      <button onClick={() => setColor("")}>Reset color</button>
      {isOpen && (
-       <ul>
+       <ul ref={menuRef}>
          <li onClick={handleSelectColor("red")}>Red</li>
          <li onClick={handleSelectColor("green")}>Green</li>
          <li onClick={handleSelectColor("blue")}>Blue</li>
        </ul>
      )}
      <p>Selected color: {color}</p>
    </>
  );
};

+ interface ClickOutsideProps {
+   ref: React.MutableRefObject<HTMLElement>;
+   onClickOutside: () => void;
+ }

+ export const useClickOutside = (props: ClickOutsideProps) => {
+   const { ref, onClickOutside } = props;

+   React.useEffect(() => {
+     const handleClickOutside = (event) => {
+       if (ref.current && !ref.current?.contains(event.target)) {
+         onClickOutside();
+       }
+     };

+     // Assign handleClickOutside to the whole document mousedown events.
+     // Using mousedown because click fires after both the mousedown and mouseup events have fired, in that order.
+     // That is, if you use click event, the handleClickOutside method will be fired after click Choose color button.
+     // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event
+     document.addEventListener("mousedown", handleClickOutside);
+     return () => {
+       document.removeEventListener("mousedown", handleClickOutside);
+     };
+   }, [ref.current]);

```

Ahora, con este hook detectamos todos los eventos `mousedown` que se realice en todo el documento.

En el momento en que esté visible el menú `ref.current`, y el elemento HTML que ha lanzado el evento no sea éste `!ref.current?.contains(event.target)` entonces se lanzará el método `onClickOutside`.

Se está utilizando el evento `mousedown` en lugar del `click` porque este último, se lanza justo después de lanzar los eventos `mousedown` y `mouseup`. Es decir, aquí tendríamos una condición de carrera, cuando pulsamos el botón _Choose color_ y se produce el evento `click` justamente aparece por pantalla el menú, por tanto esta condición `ref.current && !ref.current?.contains(event.target)` sería verdadera y el menú volvería a cerrarse automáticamente.
