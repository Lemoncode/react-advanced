# Introducción

Cada vez que se pinta un componente de tipo función, se ejecuta la función completa, es decir, si tenemos algo así como:

*./src/app.js*

```diff
export default function App() {
+ const [myClient, setMyClient]  = React.useState({name: 'Pepe', lastname: 'Perez'});
-  return <h1>Hello React !!</h1>;
+  return (
+    <>
+      <h1>{myClient.name}</h1>
+      <input value={myClient.name} onChange={(e) => setMyClient({...myClient, name: e.target.value})}/>
+    </>
+)
};
```

¿Qué quiere decir esto? Que el objeto que se crea dentro del *useState* se instancia, aunque sólo se use la primera vez que se renderiza la función (el resto _useState_ lo descarta y tira del valor que esté almacenado en su parte del estado).

Si quieres ver esto en acción, vamos a añadir una función *factory*:

```diff
+ export const createClient = () => {
+  console.log('factory invoked');
+  return {name: 'Pepe', lastname: 'Perez'};
+ }

export default function App() {
- const [myClient, setMyClient]  = React.useState({name: 'Pepe', lastname: 'Perez'});
+ const [myClient, setMyClient]  = React.useState(createClient());
```

Vamos a poner un *break point* para probarlo.

Esto no suele ser un problema si los datos son elementales o si el objeto es pequeño, pero, si tenemos un objeto grande o si tiramos por ejemplo de una lectura del *local storage* si puede ser un problema, ya que penalizaría en cada repintado del componente.

Para solucionar este problema podemos usar lo que llaman "*lazy initialization*"

# Lazy initialization

Vamos a ver cómo resolver esto, en vez de pasarle el objeto directamente como parámetro en el _useState_
vamos a pasarle una función (es lo que llamamos *lazy initialization*)

```diff
import "./styles.css";
import React from "react";

export const createClient = () => {
  console.log("factory invoked");
  return { name: "Pepe", lastname: "Perez" };
};

export default function App() {
-  const [myClient, setMyClient] = React.useState(createClient());

+  const [myClient, setMyClient] = React.useState(() => createClient());

  return (
    <div className="App">
```

Para comprobar que solo se llama una vez vamos a añadir un *console.log*

Si ahora depuramos (o ponemos un *console.log*, podrás ver que sólo se llama la primera vez que se renderiza el componente)

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.
