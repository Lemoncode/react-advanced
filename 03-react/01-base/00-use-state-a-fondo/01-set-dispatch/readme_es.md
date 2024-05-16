# Introducción

El _hook_ de _useState_ nos ofrece una función para _setear_ el nuevo estado (un _dispatcher_), esta acción de asignar un valor es asíncrona, es decir, justo en la siguiente línea de código de un set de estado no tenemos el nuevo valor disponible, seguramente haya que esperar a que se genere un nuevo _render_ para tener el nuevo valor.

Esto nos puede llevar a casos extraños, si trabajamos con asincronía (por ejemplo si usamos un _fetch_ para pedir datos a servidor o si usamos un _setTimeout_)

# Dispatch function updates

Veamos el problema que se puede generar partiendo de un ejemplo, para ello utilizaremos _setTimeout_:

En el código que vamos a introducir, estamos incrementado el valor de la variable _contador_ y un segundo después volvemos a incrementarlo.

_./src/app.tsx_

```diff
import React from "react";

export const App = () => {
+  const [contador, setContador] = React.useState(0);
+
+  React.useEffect(() => {
+    setContador(1);
+    setTimeout(() => {
+      setContador(contador + 1);
+    }, 500);
+  }, []);
+
+  return (
+    <div>
+      <h1>Valor: {contador}</h1>
+    </div>
+  );

-  return <h1>Hello React !!</h1>;
};
```

¿Qué ocurre si ejecutamos esto? Que el valor de contador siempre vale uno _¿Cooomooor?_

- En el primer _set_ el valor de la variable _contador_ para esa invocación de la función es cero (en siguientes invocaciones cuando se haga un _render_ valdrá 1, pero eso será en otra invocación de la función)
- ¿Qué es lo que pasa? Que dentro del _timeout_, aunque hayan pasado los 500 milisegundos y el 1 este asignado en el estado, la variable _contador_ seguirá valiendo cero, ya que
  el código que se ejecuta dentro del _setTimeout_ apunta a la variable antigua (_const contador_) de la ejecución anterior de la función. Esto no tiene nada que ver con React, sino JavaScript, si quieres saber más puedes revisar el concepto de _Closure_.

¿Qué podemos hacer para asegurarnos que estamos manejando el valor más actual de este estado? Podemos usar una función dentro del _set_ del _hook_:

_./src/app.tsx_

```diff
import "./styles.css";
import React from "react";

export default function App() {
  const [contador, setContador] = React.useState(0);

  React.useEffect(() => {
    setContador(1);
    setTimeout(() => {
-      setContador(contador + 1);
+      setContador((contadorActual) => contadorActual + 1);
    }, 500);
  }, []);

  return (
    <div className="App">
      <h1>
        Valor: {contador}
      </h1>
    </div>
  );
}
```

De esta manera si nos aseguramos que tenemos el último valor disponible, si ejecutamos ahora, podemos ver como el valor empieza valiendo 1, y después pasa 2.

PEEEEROOO, NOS DA 3 QUE NARICES ESTÁ PASANDO... ¿Te acuerdas lo que te comenté que en modo estricto en React el _useEffect_ se ejecuta dos veces? Pues eso es lo que está pasando, el primer _set_ se ejecuta en la primera ejecución del _useEffect_ y el segundo _set_ se ejecuta en la segunda ejecución del _useEffect_, esto es una condición de carrera como un castillo, vamonos a _main.tsx_ y quitamos el _strictMode_.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.
