# 02 Opciones

## Resumen

En un formulario real es muy normal mostrar u ocultar markup dependiendo de que opcones
elijamos, es más es normal que tengamos condiciones anidadas, si no llevamos cuidado
esto puede hacer que nuestra aplicación se convierta en un caso de markup y que
sea muy difícil de mantener, el proceso que sigo cuando me encuentro con estos escenarios:

- Primero entender el problema.
- Segundo empezar implementando sin preocuparme de optimizar, salvo que en ese paso
  este muy claro.
- Conforme implemento y voy encontrando problemas o posibles mejoras, voy refactorizando, para ello:
  - Componentizo.
  - Veo que patrón de conditional rendering es el que mejor aplica.
  - Estudio si alguno de los componente se empieza a llenar de JS y complejidad y
    en ese caso estudio si merece la pena extraer a custom hooks funcionalidad bien
    delimitada.
  - Estudio si tanto en el componente como en el hook hay código que puedo sacar
    a ficheros TS planos (lo llamo lógica de negocio, el nombre el que mejor veais).
  - Sigo iterando.
- Una vez que tengo la solución final, vuelvo a revisar y refactoizar lo que sea
  necesario

Como resultado espero:

- Un markup que pueda leer como un libro.
- Un markup que me de un nivel de abstracción y puede navegar al detalle de cada funcionalidad y me la encuentre encapsulada en un componente, y a su vez ese componente en subcomponentes.
- Unos custom hooks que tengan cada uno bien delimitada su responsabilidad, pueda probar,
  e incluso puede que alguno pueda promocionar a común.
- Un código plano en TS cn

En este ejemplo vamos a estudiar las opciones que tenemos para aplicar rendering
condicional, más allá de la básica de _&&_

## Paso a Paso

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

- Primero copiamos el ejemplo **00-boiler-plate**, y hacemos un _npm install_

```bash
npm install
```

- Vamos a ver problemas de usar _&&_, a vuela pluma
  - Manchamos el markup y añadimos complejidad para leerlo.
  - Si necesitamos anidarlo se nos complica el tema.
  - Hay que tener cuidado que esa condición se evalua..

¿ Que quiere decir esto de que es "evalua"? Vamos a por un caso divertido:

_./src/components/playground/playground.tsx_

```tsx
import React from "react";

export const PlayGround: React.FC = () => {
  const [clientNameCollection, setClientNameCollection] = React.useState<
    string[]
  >([]);

  return (
    <div>
      <h1>PlayGround Conditional Rendering</h1>
      {clientNameCollection.length &&
        clientNameCollection.map((name) => <h2 key={name}>{name}</h2>)}
    </div>
  );
};
```

- Vamos a crear un barrel:

_./src/components/playground/index.ts_

```ts
export * from "./playground";
```

- Y lo instanciamos el en _app_

_./src/app.tsx_

```tsx
import React from "react";
import { PlayGround } from "./components/playground";

export const App = () => {
  return <PlayGround />;
};
```

- Si ejecutamos esto verás algo divertido... en el markup aparece un cero :-@

¿Por qué pasa esto? Porque la expresión se evalúa y es un cero, entonces se muestra.

Si vamos a usar un _&&_ el consejo aquí es usar un ternario:

```diff
import React from "react";

export const PlayGround: React.FC = () => {
  const [clientNameCollection, setClientNameCollection] = React.useState<string[]>([]);

  return (
    <div>
      <h1>PlayGround Conditional Rendering</h1>
-      {clientNameCollection.length &&
+      {clientNameCollection.length ?
          (clientNameCollection.map((name) => <h2 key={name}>{name}</h2>)
        :
           null
      }
    </div>
  );
};
```


