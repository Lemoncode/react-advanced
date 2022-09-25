# 00 Drag Drop Avanzado

En este ejemplo vamos a poner en práctica un parte importante de lo que hemos aprendido:

- setState
- useRef
- ForwardRef
- Drag And Drop
- Context

Además de esto:

- Vamos a establecer una guía para elegir librería de third parties.
- No iremos por el happy path, veremos errores de diseño/implementación
  y como ir haciendo refactor.
- Iremos haciendo refactors para llegar a una base de código mantenible.

Vamos a implementar una tablero de kanban con drag and drop

## Resumen

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

## Paso a Paso

### Elegir librerías

En React tenemos varias librerías que los implementan, las más populares:

- React Draggable
- React Dnd
- React Beautiful Dnd.

Lo primero ¿Qué librería elegimos?

Esta un decisión complicada, para que nos sirve para siguientes decisiones vamos a ver que factores nos pueden ayudar a tomar la decisión
(ninguno de estos es determinante per se pero si nos pueden guiar a tomar la decisión menos mala):

- El primero que debemos de ver es la licencia del proyecto ¿Es licencia MIT? Aquí nos podemos encontrar con un problema si esa librería
  tiene una licencia restrictiva (podría ser que no permitiera el uso comercial o que tuviéramos que publicar nuestro código fuente como open source)

- Uno obvio es el número de estrellas que tiene el proyecto, un proyecto con un buen número de estrellas suele quere decir que es un proyecto
  que lo ha usado bastante gente y que seguramente encontramos bastante ayuda en StackOverflow.

- Otro factor importante ¿Cómo de actualizado está el proyecto? Vamos a ver cuando se hizo la última release y como de actualizado está el
  proyecto, ya que igual en su día fue muy popular, pero ahora se encuentra abandonado (igual no es compatible con la última versión de React,
  o tiene fallos de seguridad que no se han corregido...).

- Otro tema interesante es comparar el flujo de descargas de npm trends, aquí sacamos una grafica de descargas (por cierto muy divertido
  ver el bajón de descargas en el periodo navideño), aquí podemos descargar cual es la que más descargas tienes y como evoluciona a lo
  largo del tiempo (que no quiere decir que sea la mejor...)

- Es buena idea fijarnos en el autor y grupo que ha desarrollado la librería:

  - Si es un autor de otras librerías de renombre podemos esperar que la librería tenga cierta calidad.
  - Si es pertenece a un grupo de autores y además cuenta con un buen sponsorship, podemos esperar que la librería tenga su mantenimiento.
  - Si es de una empresa (Facebook, Microsoft, Google, Air Bnb) podemos esperar un código supuestamente de calidad, y en cuanto a mantenimiento
    depende, puede que mientras le haga falta tenga una evolución perfecta, en cuanto no puede entrar en vía muerta.

- Después de ver estos temas rápidos, toca ponernos con el readme y ver que ofrece, igual nos encontramos de primeras que el proyecto
  ya no tiene mantenimiento oficial.

- Seguimos con temas técnicos, evaluar que funcionalidad ofrece, y que queremos implementar.

- Es importante ver que material de aprendizaje tiene:

  - Documentación.
  - Video tutoriales.
  - Posts de terceros.
  - ...

- Otro tema a tener en cuenta es hacer un audit de la librería y ver si tiene dependencias anticuadas etc..

- Esto nos puede servir para descartar alguna opción, el último paso es construir una prueba de concepto con los desafíos más comunes que necesitamos
  y probarlo, es importante pedir tiempo en un sprint para hacer un spike ya que una decisión erronea puede tener un coste a largo plazo muy alto.

Vamos a ponernos manos a la obra evaluando las librerías que hemos visto antes:

- React Draggable:
  - Licencia MIT
  - El proyecto tiene 7900 estrellas
  - El autor y grupo son los creadores de React Grid Layout.
  - Nos encontramos que es líder en descargas.
  - El sistema de releases no tiene tags (en la página de git dicen que no sacan desde 2016, pero mirando commit en abril se saco la 4.4.5)
  - En el readme no hablan de compatibilidad con React 18
  - No cuenta con página de documentación.

La impresión que da es que fue un proyecto popular, tiene una solución simple, pero esta mantenido a medias.

- React DND:
  - Licencia MIT
  - 18K estrellas
  - Tiene página de documentación oficial
  - La última release fue el 5 de abril de 22 (la versión 16)
  - El proyecto parece tener movimiento, el ultimo issue con actividad de los autores es de finales de julio del 22.
  - Su proyecto principal es React DND
  - En el readme no se indica que el proyecto esté discontinuado
  - Mirando la documentación tiene implementación con hooks
  - El proyecto está escrito con TypeScript

Parece que es un proyecto popular, con una buena documentación, con un mantenimiento activo.

- React-beautiful-dnd
  - Licencia Apache 2.0 (no es MIT, pero en principio es bastante permisiva, habría que verlo en detalle por si acaso)
  - 28K estrellas
  - Hay un video tutorial pero es antiguo (de antes de los React Hooks)
  - En la página principal comentan que el proyecto tienen un mantenimiento mínimo correctivo, pero no hay planes de desarrollo
  - Detrás del proyecto hay una empresa (Atlassian -> Trello :))
  - Leyendo la documentación (not for everyone) se indica que es una especialización de Drag & Drop para listas, es decir una abstracción
    comparado con React Dnd
  - El proyecto está escrito con JavaScript
  - La última release es de agosto de 22

Parece un proyecto popular, que resuelve un problema concreto, pero cuyo mantenimiento esta en mínimos.

Ahora vendría la prueba más importante:

- Estudiar en que casos de uso se va a usar el drag a drop.
- Elegir un par de librerías.
- Montar un spike y ir probando ambas.
- Documentar los resultados.
- Decidir con cual nos quedamos.

En nuestro caso esta prueba que es la más importante (power point no compila), nos la saltamos por razones de tiempo y porque esto
es un curso, vamos a tirar con React Dnd, que en la primera fase salió como ganadora
(al ser un kanban esto podría ser un error de bulto ya que la librería de
Atlassian esta justo especializada en eso pero así jugamos a más bajo nivel).

### Boilerplate

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Antes de ponernos con el Drag & Drop vamos a definir nuestro componente de
  kanban, para ello:

  - Vamos a crear un proyecto de prueba (si lo que hemos hecho está bien
    montado podremos pasarlo al proyecto real y conectarlo), de esta manera:
    - Avanzamos de forma ligera (hay veces que proyectos grandes tardan en
      transpilar o meten ruido con otros temas).
    - Nos centramos en la funcionalidad y tenemos un arbol de ficheros
      más pequeño.
  - Creamos una carpeta en la encapsular esta funcionalidad (más adelante
    si es necesario refactorizaremos la estructura de carpetas si hace falta.)
  - Pensamos en que modelo de datos nos hace falta.
  - Creamos una fuente de datos mock y un api de datos mock que cumpla con
    el contrato real y sea fácilmente sustituible por el real.
  - Empezamos a crear el árbol de componentes, preocupándonos más de funcionalidad
    que de diseño (ya habrá tiempo de ajustarlo).
  - Una vez que lo tenemos armado, podemos empezar a refactorizar para sacar
    funcionalidad fuera de los componentes, o podemos seguir implementando, en
    este caso decidimos implementar la funcionalidad de drag & drop.
  - Para Drag & Drop analizamos las estrategias que tenemos en este caso
    y apostamos por una.
  - Arrancamos la funcionalidad de drag & drop, y empieza la fiesta.
  - Nos encontramos con un montón de casos arista, que iremos resolviendo
    (algunos con dolor y tirando de stackoverflow :))
  - Mientras implementamos detectamos ciertos métodos que son pura lógica
    de negocios (algortimos / funciones de ayuda que no tienen que ver con React),
    si las tenemos claramente definidas las sacamos de los componentes e implementamos
    pruebas unitarias (incluso podemos seguir TDD).
  - ¿Y en los componentes seguimos TDD o metemos prueba? Ahora mismo tenemos un
    problema y es que no sabemos bien que hacer y nuestro kanban puede sufrir
    cambios drásticos, en este caso, yo abogaría por jugar y entender la librería,
    y ya plantear pruebas unitarias cuando sepamos que aproximación vamos a tomar
    (incluso cuando pasemos al proyecto real reescribir con pruebas unitarias en la
    cabeza).
  - Otro tema importante en cuanto ponga el boilerplate y haga install toca crear
    un repo de git local, ¿Y eso porqué?
    - Vamos guardando commits de hitos que vamos alcanzando.
    - Me permite jugar con el código y si la lio parda puedo hacer un discard
      changes.
    - Ya tenemos un primer paso dado, si quisiéramos compartir la prueba
      con un compañero sólo tendríamos que hacer un set origin y subirlo a algún
      proveedor (github, gitlab, bitbucket, etc)...

¿Por qué seguir este proceso?

1. No sabemos como resolver este problema, así que es bueno hacer un solución
   aparte (spike) para jugar con plastilina y no tener la presión de que estoy
   con el proyecto real y que tengo que subir algo ya.

2. No sabemos como funciona la librería de drag & drop, seguramente tengamos
   que cambiar muchas cosas en este prueba.

3. Nos obliga a pensar en una solución más genérica que no esté atada a
   la arquitectura y dominio de la solucíon real (por supuesto tenemos que
   chequear que lo que estamos implementando se integre bien).

4. Es más fácil poder extraer un pedazo de código o incluso montar un codesandbox
   y preguntar dudas en la comunidad sin exponer piezas de código o datos confidenciales.

4.Una vez que tenemos "la mierda prueba" lista ya si podemos empezar a
implementarla en la solución real, teniendo en la cabeza pruebas unitarias
y de ensamblaje (descubriremos casos arista que no hemos probado), refactors,
y adaptación al dominio.

### Modelo de datos y api

Vamos a empezar por ver que estructura de datos nos va a hacer falta:

- Un tablero de kanban va a tener una lista de columnas.
- Una lista de columnas va a tener una lista de tareas/historias (podemos llamarle
  cards)
- Una card la vamos a definir simple de momento, con un id y un título.

Oye pero en mi aplicación real tengo más campos o campos diferentes
¿Qué hacemos?

- De primeras queremos probar la librería, nos podemos preocupar de esto
  más adelante.

- Una vez que nos toque lo primero es crear un mapper, es decir una función
  que transforme del dominio de mi aplicación al dominio de entidades del kanban
  y viceversa, de esta manera no manchamos la implementación del kanban con
  temas específicos de mi aplicación, que después hagan más difícil de
  usarlo en otras aplicaciones o incluso en la misma app con otras entidades.

- Nos toca plantearnos escenarios:

  - Igual tenemos claro que queremos tener titulo, descripción del card y poco más, en este caso mapeamos entidades y a lo sumo añadimos un campo "object" o
    "data" en el que tenemos la entidad original (esto se podría mirar de tipar
    con genéricos).

  - Igual queremos una edición rica en la carta o flexible, una opción podría
    ser pasarle como children o en props el componente que queremos pintar en el
    card en concreto.

> Mucho cuidado con el Meta Meta y el irnos a super genéricos, cuanto más nos
> dirigimos en esa dirección la curva de complejidad del componente se dispara a
> exponencial, hay que encontrar la justa medida entre genérico y fácil de
> mantener (o si hay que ir a super genérico que sea por justificación de negocio),
> mi consejo aquí siempre es "hacer varios jarrones" antes de "intentar hacer el
> molde".

Así pues de momento creamos el siguiente modelo, primero definimos un item
(card):

_./src/model.ts_

```ts
export interface CardContent {
  id: number;
  title: string;
}
```

Vamos ahora a por la columna:

- Tiene un título.
- Tiene una lista de cartas.

```diff
export interface CardContent {
  id: number;
  title: string;
}

+ export interface Column {
+  name: string;
+  content: CardContent[];
+ }
```

Y ahora definimos la entidad de _Kanban_ que de momento ponemos como
una lista de columnas.

```diff
export interface CardContent {
  id: number;
  title: string;
}

export interface Column {
  name: string;
  content: CardContent[];
}

+ export interface KanbanContent {
+  columns: Column[];
+ }
```

- Y para terminar, es _KanbanContent_ será la entidad de punto de entrada
  que instanciemos en nuestro componente, así que mejor tener una función
  para instanciar un kanban vacío que sirva como punto de entrada seguro
  (creamos un factory), de esta manera nos ahorramos ir haciendo chequeos
  de campo nulo etc...

```diff
export interface KanbanContent {
  columns: Column[];
}

+ export const createDefaultKanbanContent = (): KanbanContent => ({
+  columns: [],
+ });
```

### Componentes

### Drag & Drop

- Vamos a instalar la librería _react-dnd_ que le hace falta
  un _backend_ (ojo no es backend de servidor) para trabajar con drag & drop
  en este caso elegimos la librería _react-dnd-html5-backend_.

```bash
npm install react-dnd react-dnd-html5-backend
```

- Vamos a habilitar el proveedor de drag and drop a nivel de aplicación.

_./src/app.tsx_

```diff
import React from "react";
+ import { HTML5Backend } from "react-dnd-html5-backend";

export const App = () => {
-  return <h1>Hello React !!</h1>;
+  return (
+    <DndProvider backend={HTML5Backend}>
+       <h1>Hello React !!</h1>
+    </DndProvider>
+  );
};
```

Toca crear una api simulada para cargar los datos, así como datos de prueba,
a tener en cuenta:

- La api debe tener la misma firma que si estuviéramos cargando datos
  desde una API Rest (async y promesas), así cuando reemplacemos el mock
  por datos reales sólo vamos a tener que tocar en la API.

- Los datos mock los definimos en un fichero aparte, así es más fácil de
  eliminar y no metemos ruido.

De momento tanto api como mock lo vamos a definir dentro del componente kanban,
en la implementación final seguramente lo saquemos fuera de la carpeta
(sea directamente la página de aplicación la que pida los datos a un servidor
le pasemos un mapper y lo convirtamos a entidades de la aplicación), pero de
momento no nos metemos aquí, mejor no meter más elementos de complejidad
en la ecuación, primero gateamos, después andamos y finalmente corremos
(es importante que esto sea un spike y que tengamos 2/3 semanas para jugar
sin presión).

Los datos mock (estamos simulando en cards el proceso de creación del Kanban,
toma inception :))

_./src/kanban/mock-data.ts_

```ts
import { CardContent, KanbanContent } from "./model";

export const mockData: KanbanContent = {
  columns: [
    {
      name: "Backglog",
      content: [
        {
          id: 1,
          title: "Crear las cards",
        },
        {
          id: 2,
          title: "Colocar las cards",
        },
        {
          id: 3,
          title: "Implementar drag card",
        },
        {
          id: 4,
          title: "Implementar drop card",
        },
        {
          id: 5,
          title: "Implementar drag & drop column",
        },
      ],
    },
    {
      name: "Doing",
      content: [
        {
          id: 6,
          title: "Delete a card",
        },
      ],
    },
    {
      name: "Done",
      content: [
        {
          id: 7,
          title: "Crear el boilerplate",
        },
        {
          id: 8,
          title: "Definir el modelo de datos",
        },
        {
          id: 9,
          title: "Crear las columnas",
        },
      ],
    },
  ],
};
```

- Y ahora vamos a definir la API

_./src/kanban/kanban.api.ts_

```ts
import { CardContent, KanbanContent } from "./model";
import { mockData } from "./mock-data";

export const loadKanbanContent = async (): Promise<KanbanContent> => {
  return mockData;
};
```

¿Por qué no empotramos los datos directamente en el container y a tirar
millas? Es importante que la parte de UI se quede con el menor ruido
posible, y es buena práctica sacar todo el código que se pueda que no tenga
que ver con UI a ficheros TS planos, de esta manera:

- Ayudamos a evitar que el componente se vuelva un monstruo: el típico
  con 5000 lineas de código, con un sphaguetti.
- Al aislar código en TS ya sabemos que no es dependiente de React y un
  compañero que no sepa React puede trabajar en ese código sin problemas.
- Es más fácil de testear, tenemos piezas que hacen una cosa y una sóla
  cosa.

- Definamos el contenedor del kanban, lo primero un poco de estilado:

El div contenedor:

- Va a ser un flexbox.
- Lo suyo es que ocupe todo el espacio disponible.
- Que las columnas las muestre de izquierda a derecha, dejando un espacio entre ellas.
- Además le añadimos un overflow (si hubieran más card que espacio en la columna),
  aquí podríamos ver si a futuro añadir un scroll, etc...

_./src/kanban/kanban.container.css_

```css
.container {
  display: flex;
  flex-direction: row;
  flex: 1;
  column-gap: 5px;
  min-width: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  border: 1px solid rgb(89, 118, 10);
  background-color: burlywood;
}
```

A tener en cuenta:

- Este no va a ser el diseño definitivo, pero al menos lo tenemos enfocado
  (cuando la prueba sea un éxito, nos preocuparemos de darle estilo con el
  martillo fino, rem, media queries, etc...).
- Lo mismo con los colores, tematización, ya aplicaremos esto cuando integremos
  (aquí tocará decidir si aplicar directamente harcodear estilos o si exponer
  una api de tematización)

Si te fijas hay un montón de decisiones que podrían añadir ruido a nuestra
prueba de concepto, nuestro objetivo como desarrolladores / arquitectos
software es retrasar todas las decisiones que no sean indispensable y
centrarnos en el núcleo de nuestra prueba de concepto (no está de más
ir apuntando todo lo que va saliendo por el camino, tanto para tenerlo en
cuenta más adelante, como para enumerarlo en la demo del spike y añadirlo
a la user story de implementación real, es muy peligroso mostrar una demo
que todo funcione y que el perfil no técnico piense que ya está todo hecho).

Vamos a definir el componente contenedor:

_./src/kanban/kanban.container.tsx_

```tsx
import React from "react";
import {
  KanbanContent,
  createDefaultKanbanContent,
  CardContent,
} from "./model";
import { loadKanbanContent } from "./container.api";
import classes from "./container.css";

export const KanbanContainer: React.FC = () => {
  const [kanbanContent, setKanbanContent] = React.useState<KanbanContent>(
    createDefaultKanbanContent()
  );

  React.useEffect(() => {
    loadKanbanContent().then((content) => setKanbanContent(content));
  }, []);

  return (
    <div className={classes.container}>
      {kanbanContent.columns.map((column) => (
        <h4>{column.name}</h4>
      ))}
    </div>
  );
};
```

Es decir acabamos de hacer la prueba más tonta para ver si el contenedor:

- Se crea vació con los estilos correctos.
- Se carga con datos.

En este momento podemos elegir entre dos aproximaciones:

- Nos ponemos a crear el componente columna y despues el card y integreamos
  en la aplicación principal a ver si se monta todo.
- Integramos cuanto antes en el contenedor principal y empezamos a tener
  feedback visual de que todo va conectando.

Mi consejo aquí es siempre ir a por la segunda solución, en cuanto antes podamos
sacar cosas por la UI antes detectaremos problemas y será más fácil de arreglar,
ya que hay menos código y menos componentes para ver si son los responsables
de generar el fallo.

Así que vamos a crear un barrel dentro del kanban para exportar nuestro contenedor:

_./src/kanban/index.ts_

```ts
export * from "./container";
```

Y lo instanciamos en el app de nuestra aplicación de prueba:

_./src/app.tsx_

```tsx
import React from "react";
import { KanbanContainer } from "./kanban";

export const App = () => {
-  return <h1>Hello React !!</h1>;
+  return <KanbanContainer />;
};
```

Es hora de probar que esto funciona (se tiene que ver un rectángulo grande
vacio)... parece poca cosa pero con menos código he metido fallos grandes :).

```bash
npm start
```

✅ Somos capaces de mostrar un contenedor vació...

Vamos a definir el componente de columnas:
