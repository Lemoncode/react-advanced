# 02 Opciones

## Resumen

En un formulario real es muy normal mostrar u ocultar _markup_ dependiendo de qué opciones elijamos, es más, es normal que tengamos condiciones anidadas, si no llevamos cuidado esto puede hacer que nuestra aplicación se convierta en un caso de _markup_ y que sea muy difícil de mantener, el proceso que sigo cuando me encuentro con estos escenarios:

- Primero entender el problema.

- Segundo empezar implementando sin preocuparme de optimizar, salvo que en ese paso este muy claro.

- Conforme implemento y voy encontrando problemas o posibles mejoras, voy refactorizando, para ello:

  - _Componentizo_.

  - Veo que patrón de _conditional_ _rendering_ es el que mejor aplica.

  - Estudio si alguno de los componentes se empieza a llenar de JS y complejidad y en ese caso estudio si merece la pena extraer a _custom hooks_ funcionalidad bien delimitada.

  - Estudio si tanto en el componente como en el _hook_ hay código que puedo sacar a ficheros TS planos (lo llamo lógica de negocio, el nombre el que mejor veáis).

  - Sigo iterando.

  - Una vez que tengo la solución final, vuelvo a revisar y refactorizar lo que sea necesario.

Como resultado espero:

- Un _markup_ que pueda leer como un libro.

- Un _markup_ que me dé un nivel de abstracción y puede navegar al detalle de cada funcionalidad y me la encuentre encapsulada en un componente, y a su vez ese componente en subcomponentes.

- Unos _custom hooks_ que tengan cada uno bien delimitada su responsabilidad, pueda probar,
  e incluso puede que alguno pueda promocionar a común.

- Un código plano en TS.

En este ejemplo vamos a estudiar las opciones que tenemos para aplicar _rendering_ condicional, más allá de la básica de _&&_

## Paso a Paso

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

- Primero copiamos el ejemplo **00-boiler-plate**, y hacemos un _npm install_

```bash
npm install
```

- Vamos a ver problemas de usar _&&_, a vuela pluma
  - Manchamos el _markup_ y añadimos complejidad para leerlo.
  - Si necesitamos anidarlo se nos complica el tema.
  - Hay que tener cuidado, que esa condición se evalúa.

¿Qué quiere decir esto de que es "evalúa"? Vamos a por un caso divertido:

_./src/components/playground/playground.tsx_

```tsx
import React from "react";

export const PlayGround: React.FC = () => {
  const [clientNameCollection, _] = React.useState<string[]>([]);

  return (
    <div>
      <h1>PlayGround Conditional Rendering</h1>
      {clientNameCollection.length &&
        clientNameCollection.map((name) => <h2 key={name}>{name}</h2>)}
    </div>
  );
};
```

- Vamos a crear un _barrel_:

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

- Si ejecutamos esto verás algo divertido... en el _markup_ aparece un cero :-@

¿Por qué pasa esto? Porque la expresión se evalúa y es un cero, entonces se muestra.

Si vamos a usar un _&&_ el consejo aquí es reemplazarlo por un ternario:

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
+        :
+           null
      }
    </div>
  );
};
```

Otra opción es encapsular el código en un método de la función y usar _if_ _else_.

```diff
export const PlayGround: React.FC = () => {
  const [clientNameCollection, setClientNameCollection] = React.useState<
    string[]
  >([]);

+  function renderClientNameCollection() {
+    if (clientNameCollection.length) {
+      return clientNameCollection.map((name) => <h2 key={name}>{name}</h2>);
+    } else {
+      return null;
+    }
+  }

  return (
    <div>
      <h1>PlayGround Conditional Rendering</h1>
-      {clientNameCollection.length
-        ? clientNameCollection.map((name) => <h2 key={name}>{name}</h2>)
-        : null}
+        {renderClientNameCollection()}
    </div>
  );
};
```

Vamos a añadir algunos datos para probar esto:

```diff
export const PlayGround: React.FC = () => {
  const [clientNameCollection, setClientNameCollection] = React.useState<
    string[]
  >([]);

+ React.useEffect(() => {
+    setClientNameCollection(["Pepe", "Juan", "Maria"]);
+ }, []);

  function renderClientNameCollection() {
    if (clientNameCollection.length) {
      return clientNameCollection.map((name) => <h2 key={name}>{name}</h2>);
    } else {
      return null;
    }
  }
```

Otra opción más es romper en subcomponentes (componentizar), aquí tenemos
varias opciones:

- Si el componente es muy pequeño, lo podemos meter en el mismo fichero.

- Podemos sacarlo a un fichero hermano (en la misma carpeta).

- Si vemos que esto crece podemos crear una subcarpeta y organizar los subcomponentes dentro de ella (o incluso crear una jerarquía), pero todo esto bajo demanda.

Como quedaría esto:

_./src/components/playground/playground.tsx_

```diff
import React from "react";

+ const ClientNameCollectionComponent: React.FC<{
+  clientNameCollection: string[];
+ }> = ({ clientNameCollection }) => (
+  <>
+    {clientNameCollection.map((name) => (
+      <h2 key={name}>{name}</h2>
+    ))}
+  </>
+ );

export const PlayGround: React.FC = () => {
  const [clientNameCollection, setClientNameCollection] = React.useState<
    string[]
  >([]);

-  function renderClientNameCollection() {
-    if (clientNameCollection.length) {
-      return clientNameCollection.map((name) => <h2 key={name}>{name}</h2>);
-    } else {
-      return null;
-    }
-  }

  React.useEffect(() => {
    setClientNameCollection(["Pepe", "Juan", "Maria"]);
  }, []);

  return (
    <div>
      <h1>PlayGround Conditional Rendering</h1>
-      {renderClientNameCollection()}
+      {clientNameCollection.length ? (
+        <ClientNameCollectionComponent
+          clientNameCollection={clientNameCollection}
+        />
+      ) : null}
    </div>
  );
};
```

- Vamos a por otro ejemplo, que pasa si tenemos varios casos que sean "_hermanos_", por ejemplo (ojo esto se podía hacer en un componente y pasar el colo por parámetro, pero es por simplificar, imaginate que son datos de ciudadanos UE, USA y otras zonas geográficas :)):

_./src/components/playground/playground.tsx_

```tsx
import React from "react";

enum Status {
  Info,
  Warning,
  Error,
}

interface InfoProps {
  message: string;
}

const InfoNotificationComponent: React.FC<InfoProps> = ({ message }) => (
  <h5 style={{ color: "DarkSlateBlue" }}>{message}</h5>
);

interface WarningProps {
  message: string;
}

const WarningNotificationComponent: React.FC<WarningProps> = ({ message }) => (
  <h5 style={{ color: "Gold" }}>{message}</h5>
);

interface ErrorProps {
  message: string;
}

const ErrorNotificationComponent: React.FC<ErrorProps> = ({ message }) => (
  <h5 style={{ color: "Crimson" }}>{message}</h5>
);
```

- Vamos a ver cómo quedaría esto con ternarios...

_./src/components/playground/playground.tsx_

```ts
export const PlayGround: React.FC = () => {
  const [status, setStatus] = React.useState<Status>(Status.Info);
  const [message, _] = React.useState<string>("Hey, I'm a message");

  React.useEffect(() => {
    setStatus(Status.Warning);
  }, []);

  return (
    <div>
      <h1>PlayGround Conditional Rendering</h1>
      {status === Status.Info ? (
        <InfoNotificationComponent message={message} />
      ) : status === Status.Warning ? (
        <WarningNotificationComponent message={message} />
      ) : (
        <ErrorNotificationComponent message={message} />
      )}
    </div>
  );
};
```

- Cuesta un poco de seguir ¿verdad? Y eso que esta componentizado.

- Vamos a encapsularlo en una función e ir evolucionándolo:

Paso 1:

_./src/components/playground/playground.tsx_

```diff
  React.useEffect(() => {
    setStatus(Status.Warning);
  }, []);

+ function renderNotification() {
+   if (status === Status.Info) {
+     return <InfoNotificationComponent message={message} />;
+   } else if (status === Status.Warning) {
+     return <WarningNotificationComponent message={message} />;
+   } else {
+     return <ErrorNotificationComponent message={message} />;
+  }
+ }

  return (
    <div>
      <h1>PlayGround Conditional Rendering</h1>
+      {renderNotification()}
-      {status === Status.Info ? (
-        <InfoNotificationComponent message={message} />
-      ) : status === Status.Warning ? (
-        <WarningNotificationComponent message={message} />
-      ) : (
-        <ErrorNotificationComponent message={message} />
-      )}
-    </div>
-  );
};
```

No está mal, pero el _if_ y _elseif_ sigue siendo un galimatías, ¿Qué podemos usar? Aquí viene el amigo _switch/case_ al rescate:

_./src/components/playground/playground.tsx_

```diff
  function renderNotification() {
-    if (status === Status.Info) {
-      return <InfoNotificationComponent message={message} />;
-    } else if (status === Status.Warning) {
-      return <WarningNotificationComponent message={message} />;
-    } else {
-      return <ErrorNotificationComponent message={message} />;
-    }
+    switch (status) {
+      case Status.Info:
+        return <InfoNotificationComponent message={message} />;
+      case Status.Warning:
+        return <WarningNotificationComponent message={message} />;
+      case Status.Error:
+        return <ErrorNotificationComponent message={message} />;
+       default:
+         return null;
+    }
  }
```

Si quisiéramos incluso podríamos sacar la función fuera del componente y alimentarle por parámetro el status y el mensaje.

Vale.. pero nosotros queremos tener eso dentro del _markup_, ¿Qué podemos hacer?
Utilizar una función _autoinvocada_:

_./src/components/playground/playground.tsx_

```diff
  }, []);

-  function renderNotification() {
-    switch (status) {
-      case Status.Info:
-        return <InfoNotificationComponent message={message} />;
-      case Status.Warning:
-        return <WarningNotificationComponent message={message} />;
-      case Status.Error:
-       return <ErrorNotificationComponent message={message} />;
-      default:
-        return null;
-    }
-  }

  return (
    <div>
      <h1>PlayGround Conditional Rendering</h1>
-      {renderNotification()}
+      {(() => {
+        switch (status) {
+          case Status.Info:
+            return <InfoNotificationComponent message={message} />;
+          case Status.Warning:
+            return <WarningNotificationComponent message={message} />;
+          case Status.Error:
+            return <ErrorNotificationComponent message={message} />;
+          default:
+            return null;
+        }
+      })()}
    </div>
  );
};
```

Esto de la función _autoinvocada_ no tiene mala pinta, pero vamos a ver si podemos dejarlo más claro en el JSX, vamos a crear un objeto con _keys_ para _notification state_ (se podría automatizar con _TypeScript_, habría que darle una vuelta).

_./src/components/playground/playground.tsx_

```diff
import React from "react";

enum Status {
-  Info,
-  Warning,
-  Error,
+  Info = "Info",
+  Warning = "Warning",
+  Error = "Error",
}
```

```diff
  return (
    <div>
      <h1>PlayGround Conditional Rendering</h1>
-      {(() => {
-        switch (status) {
-          case Status.Info:
-            return <InfoNotificationComponent message={message} />;
-          case Status.Warning:
-            return <WarningNotificationComponent message={message} />;
-          case Status.Error:
-            return <ErrorNotificationComponent message={message} />;
-          default:
-            return null;
-        }
-      })()}
+   {{
+     [Status.Info]: <InfoNotificationComponent message={message} />,
+     [Status.Warning]: <WarningNotificationComponent message={message} />,
+     [Status.Error]: <ErrorNotificationComponent message={message} />,
+   }[status]}
    </div>
  );
```

Y ya que estamos podemos sacar esto como una función:

_./src/components/playground/playground.tsx_

```diff
+ const NOTIFICATION_STATES = (message: string) => ({
+  [Status.Info]: <InfoNotificationComponent message={message} />,
+  [Status.Warning]: <WarningNotificationComponent message={message} />,
+  [Status.Error]: <ErrorNotificationComponent message={message} />,
+ });

export const PlayGround: React.FC = () => {
```

Y en el tsx

```diff
      <h1>PlayGround Conditional Rendering</h1>
      {
-        {
-          [Status.Info]: <InfoNotificationComponent message={message} />,
-          [Status.Warning]: <WarningNotificationComponent message={message} />,
-          [Status.Error]: <ErrorNotificationComponent message={message} />,
-        }[status]
+        NOTIFICATION_STATES(message)[status]
      }
    </div>
```

¿Que opcióna es la que más te ha gustado?
