# React compiler

Una de las novedades que nos trae React 19 es el compilador de React (que por cierto es Open Source), este se encarga de optimizar el código de React para que sea más rápido y eficiente, y nos podemos olvidar de tener nosotros que usar hooks como `useMemo` o `useCallback` para optimizar nuestro código.

_Vale, ¿Entonces lo que hace es detectar donde hace falta esos hooks y lo añade él?_ No, detecta un montón de cosas y hace cambios más optimos, también el código generado en _JavaScript_ es un galimatias, esto no es nuevo, ya se venían haciendo cosas parecidas con por ejemplo C++.

El código fuente de este compilador esta publicado como open source:

De momento podemos jugar con un playground:

https://playground.react.dev/

Vamos a poner un ejemplo sencillo:

```js
export default function MyApp() {
  const [count, setCount] = React.useState(0);

  const handleSetCount = () => {
    setCount((count) => count + 1);
  };

  return (
    <div>
      {count}
      <button onClick={handleSetCount} />
    </div>
  );
}
```

Fijate el código que genera, parte interesante, la función _handleSetCount_ del botón la cachéa y lo mismo con el tag del botón, para evitar tirar rerenders innecesarios.

```js
function MyApp() {
  const $ = _c(4);

  const [count, setCount] = React.useState(0);
  let t0;

  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = () => {
      setCount((count_0) => count_0 + 1);
    };

    $[0] = t0;
  } else {
    t0 = $[0];
  }

  const handleSetCount = t0;
  let t1;

  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = <button onClick={handleSetCount} />;
    $[1] = t1;
  } else {
    t1 = $[1];
  }

  let t2;

  if ($[2] !== count) {
    t2 = (
      <div>
        {count}
        {t1}
      </div>
    );
    $[2] = count;
    $[3] = t2;
  } else {
    t2 = $[3];
  }

  return t2;
}
```

A la derecha podemos ver que optimizaciones ha ido aplicando.

Lo mejor es que todo esto va a ser transparente para nosotros.

Esta por ver que tal se va a portar esto con TypeScript, depuración etc...

Más Info:

React compiler: https://react.dev/learn/react-compiler

Que hace: https://github.com/reactwg/react-compiler/discussions/5

Código fuente: https://github.com/facebook/react/tree/main/compiler

Lo mejor, esto va a ser transparente para nosotros.
