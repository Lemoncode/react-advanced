# 01 Why did you update

## Resumen

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

Tal y como hemos visto en ejemplos anteriores, usando el componente de orden superior _React.memo_ evitamos renderizar un componente cuando las mismas props dan el mismo resultado. Pero, ¿Y si todavía ves renderizados que parecen innecesarios? Puedes usar un custom hook que te permite ver que props están causando que el componente se vuelva a renderizar.

En este ejemplo aprenderemos como implementarlo.

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

Vamos a arrancarlo

```bash
npm start
```

Abrimos el fichero _app.tsx_ y crearemos un componente padre y uno hijo. El componente hijo sólo mostrará sus props mientras que el componente padre tiene dos variables de estado mostradas y dos botones (estos botones incrementan el valor de las variables);

_./src/app.tsx_

```diff
import React from "react";

+ interface Name {
+   firstname: string;
+   lastname: string;
+ }

export const App = () => {
+ const [id, setId] = React.useState(0);
+ const [count, setCount] = React.useState(0);

+ const name: Name = {
+   firstname: "John",
+   lastname: "Doe",
+ };

- return <h1>Hello React !!</h1>;
+ return (
+   <>
+     <ChildComponent name={name} id={id} />
+     <button onClick={() => setId(id + 1)}>Increment id</button>

+     <div>count: {count}</div>
+     <button onClick={() => setCount(count + 1)}>Increment count</button>
+   </>
+ );
};

+ interface ChildProps {
+   name: Name;
+   id: number;
+ }

+ export const ChildComponent: React.FC<ChildProps> = React.memo((props) => {
+   return (
+     <div>
+       {props.name.firstname} {props.name.lastname} id: {props.id}
+     </div>
+   );
+ });

```

El _ChildComponent_ esta usando _React.memo_ para renderizar el componente solamente cuando cambie sus propiedades. ¿Por qué se renderiza cuando aumenta el `count`?

Vamos a añadir un custom hook _useWhyDidYouUpdate_ y usarlo dentro de _ChildComponent_. Este hook recibe las props de un componente y comprueba si han cambiado.

_./src/app.tsx_

```diff
...

export const ChildComponent: React.FC<ChildProps> = React.memo((props) => {
+ useWhyDidYouUpdate("ChildComponent", props);
  return (
    <div>
      {props.name.firstname} {props.name.lastname} id: {props.id}
    </div>
  );
});

+ const useWhyDidYouUpdate = (name, props) => {
+   const previousProps = React.useRef<any>();
+   React.useEffect(() => {
+     if (previousProps.current) {
+       const allKeys = Object.keys({ ...previousProps.current, ...props });
+       const changesObj = {};
+       allKeys.forEach((key) => {
+         if (previousProps.current[key] !== props[key]) {
+           changesObj[key] = {
+             from: previousProps.current[key],
+             to: props[key],
+           };
+         }
+       });
+       if (Object.keys(changesObj).length) {
+         console.log("[why-did-you-update]", name, changesObj);
+       }
+     }
+     previousProps.current = props;
+   });
+ };

```

Si abrimos la consola del navegador, podremos ver que nuestro custom hook lanza un mensaje siempre que se hace click en el botón _Increment id_. Esto es lo esperado, pero cuando el botón _Increment count_ se pulsa, nuestro hook también muestra un mensaje en el console log. ¿Por qué? Porque la variable _name_ está dentro de _App_ y este componente se vuelve a renderizar cada vez que el usuario pulsa el botón _Increment count_. Este botón actualiza la variable de estado _count_ y siempre que el estado de un componente se actualiza, este se vuelve a renderizar, generando una nueva variable _name_ (cambia la dirección de memoria).

Gracias a nuestro custom hook, nos hemos dado cuenta de que la variable _name_ debería estar fuera de _App_. Si modificamos _app.tsx_ poniendo la variable _name_ fuera del componente padre, el hook _useWhyDidYouUpdate_ sólo lanzará un mensaje en el console log cuando el botón _Increment id_ se pulse.

_./src/app.tsx_

```diff
import React from "react";

interface Name {
  firstname: string;
  lastname: string;
}

+ const name: Name = {
+   firstname: "John",
+   lastname: "Doe",
+ };

export const App = () => {
  const [id, setId] = React.useState(0);
  const [count, setCount] = React.useState(0);

- const name: Name = {
-   firstname: "John",
-   lastname: "Doe",
- };

  return (
    <>
      <ChildComponent name={name} id={id} />
      <button onClick={() => setId(id + 1)}>Increment id</button>

      <div>count: {count}</div>
      <button onClick={() => setCount(count + 1)}>Increment count</button>
    </>
  );
};

...

```
