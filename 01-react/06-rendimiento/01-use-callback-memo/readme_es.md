# 01 UseCallback / UseMemo

## Resumen

Cuando aprendemos hooks como _useCallback_ o _useMemo_, lo primero que se nos viene a la
cabeza es porque esto no lo implementa siempre React, o tenemos la tentación
de usarlo en todos sitios por defecto.

Hay un tema divertido aquí, abusar de _useCallback_ o _useMemo_ nos puede llevar a
tener un rendimiento peor de nuestra aplicación :-@.

¿Cuándo debemos de usarlos?

## Paso a Paso

- Primero copiamos el ejemplo de _00-boilerplate_, y hacemos un _npm install_

```bash
npm install
```

- Vamos a crear un componente que sea un dispensador de chuches:

_./src/components/chuches/chuches.component.tsx_

```tsx
import React from "react";

export const MaquinaVending = () => {
  const initialCandies = ["gominolas", "chocolatinas", "salaicos", "chicles"];
  const [candies, setCandies] = React.useState(initialCandies);
  const dispense = (candy) => {
    setCandies((allCandies) => allCandies.filter((c) => c !== candy));
  };
  return (
    <div>
      <h1>Maquina Vending</h1>
      <div>
        <div>Producto disponible</div>
        {candies.length === 0 ? (
          <button onClick={() => setCandies(initialCandies)}>refill</button>
        ) : (
          <ul>
            {candies.map((candy) => (
              <li key={candy}>
                <button onClick={() => dispense(candy)}>grab</button> {candy}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
```

- Vamos a instanciarlo.

_./app.tsx_

```tsx
import React from "react";
import { MaquinaVending } from "./components/chuches/chuches.component";

export const App = () => {
  return <MaquinaVending />;
};
```

- Probamos

```bash
npm start
```

- Bueno un *component* normal :), si nos ponemos como teóricos del *soul*
  podemos ver que:
  - Oye, tenemos una constante de *array* de *strings* con el valor inicial,
    y esto se recrea en cada *render*.
  
  - Por otro lado tenemos una función (*callback* dispense) que también
    se crea en cada render.

Podíamos pensar... puedo optimizar esto y evitar trabajo en los *render*,
de primeras podrías probar algo así como:

```diff
import React from "react";

export const MaquinaVending = () => {
-  const initialCandies = ["gominolas", "chocolatinas", "salaicos", "chicles"];
+  const initialCandies = React.useMemo(() => ["gominolas", "chocolatinas", "salaicos", "chicles"], []);

  const [candies, setCandies] = React.useState(initialCandies);
-  const dispense = (candy) => {
-    setCandies((allCandies) => allCandies.filter((c) => c !== candy));
-  };
+  const dispense = React.useCallback((candy) => {
+    setCandies((allCandies) => allCandies.filter((c) => c !== candy))
+  }, []);

  return (
    <div>
      <h1>Maquina Vending</h1>
      <div>
        <div>Producto disponible</div>
        {candies.length === 0 ? (
          <button onClick={() => setCandies(initialCandies)}>refill</button>
        ) : (
          <ul>
            {candies.map((candy) => (
              <li key={candy}>
                <button onClick={() => dispense(candy)}>grab</button> {candy}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
```

- ¿Qué pasa aquí? ¿Estamos mejorando algo? Pues igual hasta lo empeoramos.

Empezamos por _useCallback_:

- Tenemos que definir una función en cada *render* (*useCallback*).
- Tenemos que definir un *array*.
- En el primer render tenemos que definir la función interna.
- Además empiezo a correr el riesgo de que cuando llame a la función
  consulta valores del pasado (*closure hell*).
- ¿Y _useMemo_?
- En este caso estamos haciendo el código más complicado de leer.
- Estamos definiendo una función,... y el ahorro en rendimiento
  vs la complejidad que metemos no merece la pena.

En este caso sería mejor hacer lo siguiente

```diff
+ const candiesEntries = ["gominolas", "chocolatinas", "salaicos", "chicles"];

export const MaquinaVending = () => {
- const initialCandies = React.useMemo(() => ["gominolas", "chocolatinas", "salaicos", "chicles"], []);
- const [candies, setCandies] = React.useState(initialCandies);
+ const [candies, setCandies] = React.useState(candiesEntries);
```

Otra opción podría haber sido:

```diff
export const MaquinaVending = () => {
- const initialCandies = React.useMemo(() => ["gominolas", "chocolatinas", "salaicos", "chicles"], []);
+ const [candies, setCandies] = React.useState(() => ["gominolas", "chocolatinas", "salaicos", "chicles"]);
```

Aunque para un array de este tamaño no tiene mucho sentido.

El tema es que el motor de React se encarga de optimizar los renders.

## ¿Me olvido de esto?

La respuesta es no, ... lo que sí es importante es saber cuándo usarlo.

### UseCallback

- Imagínate que tenemos un componente hijo que es pesado de renderizar, por ejemplo:
  - Renderiza muchos nodos en tiempo real (¿una gráfica?)
  - Renderizamos muchos elementos de ese tipo (basado en ejemplo real, un simple
    *radiobutton* con *semantic UI* que tiene sus animaciones y peso, si pintamos no pasa nada, si pintamos 500...).

En este caso, aunque usemos _React.memo_ si pasamos la función como *prop* al hijo, el componente se va a repintar ya que la dirección que apunta a la función es diferente (se crea cada vez).

- Lo mismo pasaría si un valor lo pasamos en la parte de dependencias de un
  _useEffect_, vamos a ver código un poco forzado para ver el ejemplo:

```tsx
export const EjemploForzado = () => {
  const objetoA = () => {a: 1, b: 2};

  React.useEffect(() => {
    console.log("Esto se tira después de cada render...")
  }, [objetoA]);
}
```

Y sin embargo

```diff
export const EjemploForzado = () => {
-  const objetoA = () => {a: 1, b: 2};
+  const objetoA = React.useCallback(() => {a: 1, b: 2}, []);

  React.useEffect(() => {
-    console.log("Esto se tira después de cada render...")
+    console.log("Esto se ejecuta solo una vez...")

  }, [objetoA])
}
```

### Memo

En el caso de _useMemo_ nos merece la pena llamarlo si tenemos muchos datos o
un cálculo costos para obtenerlo.

Otro tema es cuando aplicar _React.Memo_ a un componente, en este caso igual,
es cuando voy a pintar muchos componentes hijos, o el componente hijo es pesado
de renderizar, lo normal es que no me haga falta, React es muy rápido y tiene
unas optimizaciones de *rendering* muy buenas.

¿Cómo funciona *React.Memo*? Un pequeño recordatorio:

```tsx
const CountButton = ({ onClick, count }) => {
  return <button onClick={onClick}>{count}</button>;
};

const DualCounter = () => {
  const [count1, setCount1] = React.useState(0);
  const increment1 = () => setCount1((c) => c + 1);

  const [count2, setCount2] = React.useState(0);
  const increment2 = () => setCount2((c) => c + 1);

  return (
    <>
      <CountButton count={count1} onClick={increment1} />
      <CountButton count={count2} onClick={increment2} />
    </>
  );
};
```

Aquí pinche en el botón que pinche se van a renderizar los dos componentes,
en este caso no pasa nada, pero si _CountButton_ fuera un componente
costoso de renderizar, podría hacer lo siguiente:

```diff
-const CountButton = ({onClick, count}) => {
+const CountButton = React.memo(({onClick, count}) => {
  return <button onClick={onClick}>{count}</button>
-}
+})


const DualCounter = () => {
  const [count1, setCount1] = React.useState(0)
-  const increment1 = () => setCount1(c => c + 1)
+  const increment1 = React.useCallback(() => setCount1(c => c + 1), [])

  const [count2, setCount2] = React.useState(0)
-  const increment2 = () => setCount2(c => c + 1)
+ const increment2 = React.useCallback(() => setCount2(c => c + 1), [])

  return (
    <>
      <CountButton count={count1} onClick={increment1} />
      <CountButton count={count2} onClick={increment2} />
    </>
  )
}
```



## Referencias

https://kentcdodds.com/blog/usememo-and-usecallback
