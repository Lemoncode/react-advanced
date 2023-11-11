# 00 Drag Drop Avanzado

En este ejemplo vamos a poner en práctica un parte importante de lo que hemos aprendido:

- setState
- useRef
- ForwardRef
- Drag And Drop
- Context

Además de esto:

- Vamos a establecer una guía para elegir librería de _third parties_.
- No iremos por el _happy path_, veremos errores de diseño/implementación
  y como ir haciendo _refactor_.
- Iremos haciendo _refactors_ para llegar a una base de código mantenible.

Vamos a implementar un tablero de _kanban_ con _drag and drop_.

## Resumen

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

## Paso a Paso

### Elegir librerías

En React tenemos varias librerías que los implementan, las más populares:

- React Draggable
- React Dnd
- React Beautiful Dnd.

Lo primero ¿Qué librería elegimos?

Esta un decisión complicada, para que nos sirve para siguientes decisiones vamos a ver qué factores nos pueden ayudar a tomar la decisión (ninguno de estos es determinante pero si nos pueden guiar a tomar la decisión menos mala):

- El primero que debemos de ver es la licencia del proyecto ¿Es licencia MIT? Aquí nos podemos encontrar con un problema si esa librería tiene una licencia restrictiva (podría ser que no permitiera el uso comercial o que tuviéramos que publicar nuestro código fuente como open source)

- Uno obvio es el número de estrellas que tiene el proyecto, un proyecto con un buen número de estrellas suele querer decir que es un proyecto que lo ha usado bastante gente y que seguramente encontramos bastante ayuda en _StackOverflow_.

- Otro factor importante ¿Cómo de actualizado está el proyecto? Vamos a ver cuándo se hizo la última _release_ y cómo de actualizado está el proyecto, ya que igual en su día fue muy popular, pero ahora se encuentra abandonado (igual no es compatible con la última versión de React, o tiene fallos de seguridad que no se han corregido...).

- Otro tema interesante es comparar el flujo de descargas de _npm trends_, aquí sacamos una gráfica de descargas (por cierto muy divertido ver el bajón de descargas en el periodo navideño), aquí podemos descargar cual es la que más descargas tienes y cómo evoluciona a lo largo del tiempo (que no quiere decir que sea la mejor...)

- Es buena idea fijarnos en el autor y grupo que ha desarrollado la librería:

  - Si es un autor de otras librerías de renombre podemos esperar que la librería tenga cierta calidad.
  - Si pertenece a un grupo de autores y además cuenta con un buen _sponsorship_, podemos esperar que la librería tenga su mantenimiento.
  - Si es de una empresa (_Facebook_, _Microsoft_, _Google_, _Air Bnb_) podemos esperar un código supuestamente de calidad, y en cuanto a mantenimiento depende, puede que mientras le haga falta tenga una evolución perfecta, en cuanto no puede entrar en vía muerta.

- Después de ver estos temas rápidos, toca ponernos con el readme y ver que ofrece, igual nos encontramos de primeras que el proyecto ya no tiene mantenimiento oficial.

- Seguimos con temas técnicos, evaluar que funcionalidad ofrece, y que queremos implementar.

- Es importante ver que material de aprendizaje tiene:

  - Documentación.
  - Video tutoriales.
  - Posts de terceros.
  - ...

- Otro tema a tener en cuenta es hacer un audit de la librería y ver si tiene dependencias anticuadas etc...

- Esto nos puede servir para descartar alguna opción, el último paso es construir una prueba de concepto con los desafíos más comunes que necesitamos para probarlo, es importante pedir tiempo en un sprint para hacer un _spike_ ya que una decisión errónea puede tener un coste a largo plazo muy alto.

Vamos a ponernos manos a la obra evaluando las librerías que hemos visto antes:

- React Draggable:
  - Licencia MIT
  - El proyecto tiene 7900 estrellas
  - El autor y grupo son los creadores de _React Grid Layout_.
  - Nos encontramos que es líder en descargas.
  - El sistema de _releases_ no tiene _tags_ (en la página de git dicen que no sacan desde 2016, pero mirando commit en abril se sacó la 4.4.5)
  - En el _readme_ no hablan de compatibilidad con React 18
  - No cuenta con página de documentación.

La impresión que da es que fue un proyecto popular, tiene una solución simple, pero esta mantenido a medias.

- React DND:
  - Licencia MIT
  - 18K estrellas
  - Tiene página de documentación oficial
  - La última release fue el 5 de abril de 22 (la versión 16)
  - El proyecto parece tener movimiento, el último _issue_ con actividad de los autores es de finales de julio del 22.
  - Su proyecto principal es _React DND_
  - En el readme no se indica que el proyecto esté discontinuado
  - Mirando la documentación tiene implementación con _hooks_
  - El proyecto está escrito con _TypeScript_

Parece que es un proyecto popular, con una buena documentación, con un mantenimiento activo.

- React-beautiful-dnd
  - Licencia Apache 2.0 (no es MIT, pero en principio es bastante permisiva, habría que verlo en detalle por si acaso)
  - 28K estrellas
  - Hay un video tutorial pero es antiguo (de antes de los _[React Hooks]()_)
  - En la página principal comentan que el proyecto tienen un mantenimiento mínimo correctivo, pero no hay planes de desarrollo.
  - Detrás del proyecto hay una empresa (Atlassian -> Trello :))
  - Leyendo la documentación (i) se indica que es una especialización de Drag & Drop para listas, es decir una abstracción
    comparado con React Dnd
  - El proyecto está escrito con JavaScript
  - La última release es de agosto de 22

Parece un proyecto popular, que resuelve un problema concreto, pero cuyo mantenimiento esta en mínimos.

Ahora vendría la prueba más importante:

- Estudiar en qué casos de uso se va a usar el _drag and drop_.
- Elegir un par de librerías.
- Montar un _spike_ e ir probando ambas.
- Documentar los resultados.
- Decidir con cual nos quedamos.

En nuestro caso esta prueba que es la más importante (_power point_ no compila), nos la saltamos por razones de tiempo y porque esto es un curso, vamos a tirar con _React Dnd_, que en la primera fase salió como ganadora(al ser un _kanban_ esto podría ser un error de bulto ya que la librería de _Atlassian_ está justo especializada en eso pero así jugamos a más bajo nivel).

### Boilerplate

- Primero copiamos _00-boiler-plate_, y hacemos un _npm install_

```bash
npm install
```

- Antes de ponernos con el _Drag & Drop_ vamos a definir nuestro componente de _kanban_, para ello:

  - Vamos a crear un proyecto de prueba (si lo que hemos hecho está bien montado podremos pasarlo al proyecto real y conectarlo), de esta manera:
    - Avanzamos de forma ligera (hay veces que proyectos grandes tardan en
      transpilar o meten ruido con otros temas).
    - Nos centramos en la funcionalidad y tenemos un árbol de ficheros
      más pequeño.
  - Creamos una carpeta para encapsular esta funcionalidad (más adelante
    si es necesario refactorizaremos la estructura de carpetas si hace falta.)
  - Pensamos en qué modelo de datos nos hace falta.
  - Creamos una fuente de datos _mock_ y una _api_ de datos _mock_ que cumpla con
    el contrato real y sea fácilmente sustituible por el real.
  - Empezamos a crear el árbol de componentes, preocupándonos más de funcionalidad
    que de diseño (ya habrá tiempo de ajustarlo).
  - Una vez que lo tenemos armado, podemos empezar a refactorizar para sacar
    funcionalidad fuera de los componentes, o podemos seguir implementando, en
    este caso decidimos implementar la funcionalidad de _drag & drop_.
  - Para _Drag & Drop_ analizamos las estrategias que tenemos en este caso
    y apostamos por una.
  - Arrancamos la funcionalidad de _drag & drop_, y empieza la fiesta.
  - Nos encontramos con un montón de casos arista, que iremos resolviendo
    (algunos con dolor y tirando de _stackoverflow_ :))
  - Mientras implementamos detectamos ciertos métodos que son pura lógica
    de negocios (algoritmos / funciones de ayuda que no tienen que ver con React),
    si las tenemos claramente definidas las sacamos de los componentes e implementamos
    pruebas unitarias (incluso podemos seguir TDD).
  - ¿Y en los componentes seguimos TDD o metemos prueba? Ahora mismo tenemos un
    problema y es que no sabemos bien que hacer y nuestro _kanban_ puede sufrir
    cambios drásticos, en este caso, yo abogaría por jugar y entender la librería,
    y ya plantear pruebas unitarias cuando sepamos que aproximación vamos a tomar
    (incluso cuando pasemos al proyecto real reescribir con pruebas unitarias en la
    cabeza).
  - Otro tema importante en cuanto ponga el _boilerplate_ y haga _install_ toca crear
    un repo de git local, ¿Y eso por qué?
    - Vamos guardando _commits_ de hitos que vamos alcanzando.
    - Me permite jugar con el código y si la lío parda puedo hacer un _discard_
      _changes_.
    - Ya tenemos un primer paso dado, si quisiéramos compartir la prueba
      con un compañero sólo tendríamos que hacer un set origin y subirlo a algún
      proveedor (github, gitlab, bitbucket, etc)...

¿Por qué seguir este proceso?

1. No sabemos cómo resolver este problema, así que es bueno hacer un solución
   aparte (_spike_) para jugar con plastilina y no tener la presión de que estoy
   con el proyecto real y que tengo que subir algo ya.

2. No sabemos cómo funciona la librería de _drag & drop_, seguramente tengamos
   que cambiar muchas cosas en este prueba.

3. Nos obliga a pensar en una solución más genérica que no esté atada a
   la arquitectura y dominio de la solucíon real (por supuesto tenemos que
   chequear que lo que estamos implementando se integre bien).

4. Es más fácil poder extraer un pedazo de código o incluso montar un _codesandbox_
   y preguntar dudas en la comunidad sin exponer piezas de código o datos confidenciales.

5. Una vez que tenemos "la mierda prueba" lista ya si podemos empezar a
   implementarla en la solución real, teniendo en la cabeza pruebas unitarias
   y de ensamblaje (descubriremos casos arista que no hemos probado), _refactors_,
   y adaptación al dominio.

### Modelo de datos y api

Vamos a empezar por ver que estructura de datos nos va a hacer falta:

- Un tablero de _kanban_ va a tener una lista de columnas.
- Una lista de columnas va a tener una lista de tareas/historias (podemos llamarle
  cards)
- Una card la vamos a definir simple de momento, con un _id_ y un título.

Oye pero en mi aplicación real tengo más campos o campos diferentes
¿Qué hacemos?

- De primeras queremos probar la librería, nos podemos preocupar de esto
  más adelante.

- Una vez que nos toque lo primero es crear un _mapper_, es decir una función
  que transforme del dominio de mi aplicación al dominio de entidades del _kanban_
  y viceversa, de esta manera no manchamos la implementación del _kanban_ con
  temas específicos de mi aplicación, que después hagan más difícil de
  usarlo en otras aplicaciones o incluso en la misma _app_ con otras entidades.

- Nos toca plantearnos escenarios:

  - Igual tenemos claro que queremos tener título, descripción del _card_ y poco más, en este caso mapeamos entidades y a lo sumo añadimos un campo "_object_" o
    "_data_" en el que tenemos la entidad original (esto se podría mirar de tipar
    con genéricos).

  - Igual queremos una edición rica en la carta o flexible, una opción podría
    ser pasarle como _children_ o en props el componente que queremos pintar en el
    _card_ en concreto.

> Mucho cuidado con el Meta Meta y el irnos a super genéricos, cuanto más nos
> dirigimos en esa dirección la curva de complejidad del componente se dispara a
> exponencial, hay que encontrar la justa medida entre genérico y fácil de
> mantener (o si hay que ir a super genérico que sea por justificación de negocio),
> mi consejo aquí siempre es "hacer varios jarrones" antes de "intentar hacer el
> molde".

Así pues de momento creamos el siguiente modelo, primero definimos un _item_ (_card_):

_./src/kanban/model.ts_

```ts
export interface CardContent {
  id: number;
  title: string;
}
```

Vamos ahora a por la columna:

- Tiene un título.
- Tiene una lista de cartas.

_./src/kanban/model.ts_

```diff
export interface CardContent {
  id: number;
  title: string;
}

+ export interface Column {
+  id: number;
+  name: string;
+  content: CardContent[];
+ }
```

Y ahora definimos la entidad de _Kanban_ que de momento ponemos como una lista de columnas.

_./src/kanban/model.ts_

```diff
export interface CardContent {
  id: number;
  title: string;
}

export interface Column {
  id : number;
  name: string;
  content: CardContent[];
}

+ export interface KanbanContent {
+  columns: Column[];
+ }
```

- Y para terminar, _KanbanContent_ será la entidad de punto de entrada que instanciaremos en nuestro componente, así que mejor tener una función para instanciar un _kanban_ vacío que sirva como punto de entrada seguro(creamos un _factory_), de esta manera nos ahorramos ir haciendo chequeos de campo nulo etc...

_./src/kanban/model.ts_

```diff
export interface KanbanContent {
  columns: Column[];
}

+ export const createDefaultKanbanContent = (): KanbanContent => ({
+  columns: [],
+ });
```

Toca crear una api simulada para cargar los datos, así como datos de prueba, a tener en cuenta:

- La api debe tener la misma firma que si estuviéramos cargando datos
  desde una _API Rest_ (async y promesas), así cuando reemplacemos el _mock_
  por datos reales sólo vamos a tener que tocar en la API.

- Los datos _mock_ los definimos en un fichero aparte, así es más fácil de
  eliminar y no metemos ruido.

De momento tanto api como _mock_ lo vamos a definir dentro del componente _kanban_, en la implementación final seguramente lo saquemos fuera de la carpeta (sea directamente la página de aplicación la que pida los datos a un servidor le pasemos un _mapper_ y lo convirtamos a entidades de la aplicación), pero de momento no nos metemos aquí, mejor no meter más elementos de complejidad en la ecuación, primero gateamos, después andamos y finalmente corremos (es importante que esto sea un _spike_ y que tengamos 2/3 semanas para jugar sin presión).

Los datos _mock_ (estamos simulando en _cards_ el proceso de creación del Kanban, toma _inception_ :))

_./src/kanban/mock-data.ts_

```ts
import { KanbanContent } from "./model";

export const mockData: KanbanContent = {
  columns: [
    {
      id: 1,
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
      id: 2,
      name: "Doing",
      content: [
        {
          id: 6,
          title: "Delete a card",
        },
      ],
    },
    {
      id: 3,
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
import { KanbanContent } from "./model";
import { mockData } from "./mock-data";

export const loadKanbanContent = async (): Promise<KanbanContent> => {
  return mockData;
};
```

¿Por qué no empotramos los datos directamente en el _container_ y a tirar millas? Es importante que la parte de UI se quede con el menor ruido posible, y es buena práctica sacar todo el código que se pueda que no tenga
que ver con UI a ficheros TS planos, de esta manera:

- Ayudamos a evitar que el componente se vuelva un monstruo: el típico
  con 5000 lineas de código, con un _sphaguetti_.
- Al aislar código en TS ya sabemos que no es dependiente de React y un
  compañero que no sepa React puede trabajar en ese código sin problemas.
- Es más fácil de testear, tenemos piezas que hacen una cosa y una sola
  cosa.

### Componentes

Vamos empezar a trabajar en el UI

- Definamos el contenedor del _kanban_, lo primero un poco de estilado:

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
  width: 100%;
  height: 100%;
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
  (aquí tocará decidir si aplicar directamente _harcodear_ estilos o si exponer
  una api de tematización)

Si te fijas hay un montón de decisiones que podrían añadir ruido a nuestra prueba de concepto, nuestro objetivo como desarrolladores / arquitectos software es retrasar todas las decisiones que no sean indispensable y centrarnos en el núcleo de nuestra prueba de concepto (no está de más ir apuntando todo lo que va saliendo por el camino, tanto para tenerlo en cuenta más adelante, como para enumerarlo en la demo del _spike_ y añadirlo a la _user story_ de implementación real, es muy peligroso mostrar una demo que todo funcione y que el perfil no técnico piense que ya está todo hecho).

Vamos a definir el componente contenedor:

_./src/kanban/kanban.container.tsx_

```tsx
import React from "react";
import { KanbanContent, createDefaultKanbanContent } from "./model";
import { loadKanbanContent } from "./kanban.api";
import classes from "./kanban.container.css";

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
        <h4 key={column.id}>{column.name}</h4>
      ))}
    </div>
  );
};
```

Es decir acabamos de hacer la prueba más tonta para ver si el contenedor:

- Se crea vació con los estilos correctos.
- Se carga con datos.

En este momento podemos elegir entre dos aproximaciones:

- Nos ponemos a crear el componente columna y después el card y integramos
  en la aplicación principal a ver si se monta todo.
- Integramos cuanto antes en el contenedor principal y empezamos a tener
  _feedback_ visual de que todo va conectando.

Mi consejo aquí es siempre ir a por la segunda solución, en cuanto antes podamos sacar cosas por la UI antes detectaremos problemas y será más fácil de arreglar, ya que hay menos código y menos componentes para ver si son los responsables de generar el fallo.

Así que vamos a crear un _barrel_ dentro del _kanban_ para exportar nuestro contenedor:

_./src/kanban/index.ts_

```ts
export * from "./kanban.container";
```

Y lo instanciamos en el app de nuestra aplicación de prueba:

_./src/app.tsx_

```diff
import React from "react";
+ import { KanbanContainer } from "./kanban";

export const App = () => {
-  return <h1>Hello React !!</h1>;
+  return <KanbanContainer />;
};
```

Es hora de probar que esto funciona (se tiene que ver un rectángulo grande vacío)... parece poca cosa pero con menos código he metido fallos grandes :).

```bash
npm start
```

✅ Somos capaces de mostrar un contenedor vació...

Vamos a definir el componente de columnas:

- Vamos a por el estilado.
- En nuestro caso el componente columna va a recibir del contenedor el nombre de la misma y una lista de tareas (lo llamaremos _content_, aquí con el _naming_ tendríamos mucha discusión, quizás un nombre más apropiado podría ser _cardContentCollection_).

Sobre el estilado:

- La columna va a ser otro contenedor flex.
- Para la prueba va a tener un ancho fijo (apuntar martillo fino para después
  si añadir media queries para poner un ancho relativo o por porcentajes).
- Le pondremos _overflow_ por si hubiera más _cards_ que espacio en la columna
  (martillo fino todo, resolver esto cuando se integre en real)
- Le añadimos un color de fondo a cada columna (TODO martillo fino aquí, o bien
  en la aplicación real usar los colores que vengan, o bien exponer una API de
  CSS / tematizado o mediante variables HTML).
- La altura le damos el 100% del alto del contenedor padre.

_./src/kanban/column/column.component.css_

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 250px;
  height: 100vh;
  overflow: hidden;
  border: 1px solid rgb(4, 1, 19);
  background-color: aliceblue;
}
```

- Hora de tocar el código, cómo en el contenedor, montamos el mínimo, y simplemente mostramos el nombre de cada _card_ para probar que tenemos un mínimo.

_./src/kanban/column/column.component.tsx_

```tsx
import React from "react";
import classes from "./column.component.css";
import { CardContent } from "../model";

interface Props {
  name: string;
  content: CardContent[];
}

export const Column: React.FC<Props> = (props) => {
  const { name, content } = props;

  return (
    <div className={classes.container}>
      <h4>{name}</h4>
      {content.map((card) => (
        <h5>{card.title}</h5>
      ))}
    </div>
  );
};
```

> Pregunta aquí... ¿Merecería la pena exponer la columna en el barrel?

- Ya nos falta tiempo para probarlo :), vamos a integrarlo en nuestro contenedor de _Kanban_:

_./src/kanban/kanban.container.tsx_

```diff
import React from "react";
import {
  KanbanContent,
  createDefaultKanbanContent,
  CardContent,
} from "./model";
import { loadKanbanContent } from "./container.api";
+ import { Column } from "./column/column.component";
import classes from "./container.css";

```

```diff
  return (
    <div className={classes.container}>
      {kanbanContent.columns.map((column) => (
-        <h4 key={column.id}>{column.name}</h4>
+         <Column key={column.id} name={column.name} content={column.content} />
      ))}
      ))}
    </div>
  );
};
```

- Corremos a probarlo :)

```bash
npm start
```

✅ Somos capaces de mostrar las columnas del _kanban_...

Esto empieza a tener buena pinta, ahora vamos a por el componente de _card_:

En cuanto estilado vamos a definir:

- Una clase para estilar el card (ancho, borde...).
- Una clase para estilar el _handler_ sobre el que se hará _drag_ (podríamos haber elegido poder hacer _drag_ _en_ toda la _card_, pero mejor delimitarlo a un área).

El diseño es mínimo, más adelante habría que aplicar _martillo fino_ para dejar una _card_ con aspecto profesional.

_./src/kanban/card.component.css_

```css
.card {
  border: 1px dashed gray;
  padding: 5px 15px;
  margin-bottom: 10px;
  background-color: white;
  width: 210px;
}

.drag-handle {
  background-color: green;
  width: 18px;
  height: 18px;
  display: inline-block;
  margin-right: 10px;
  cursor: move;
}
```

Vamos ahora a por el tsx:

_./src/kanban/card.component.tsx_

```tsx
import React from "react";
import { CardContent } from "./model";
import classes from "./card.component.css";

interface Props {
  content: CardContent;
}

export const Card: React.FC<Props> = (props) => {
  const { content } = props;

  return (
    <div className={classes.card}>
      <div className={classes.dragHandle} />
      {content.title}
    </div>
  );
};
```

- Como siempre corremos a usarlo en nuestro componente de columna y ver los resultados:

_./src/kanban/column/column.component.tsx_

```diff
import React from "react";
import classes from "./column.component.css";
import { CardContent } from "./model";
+ import {Card} from '../card.component';
```

_./src/kanban/column/column.component.tsx_

```diff
  return (
    <div className={classes.container}>
      <h4>{name}</h4>
      {content.map((card) => (
-        <h5>{card.title}</h5>
+       <Card key={card.id} content={card} />
      ))}
      ))}
    </div>
  );
```

- A ver qué tal sale :)

```bash
npm start
```

✅ Somos capaces de mostrar las _cards_...

- Ya tenemos nuestro tablero montado, es hora de ver cómo va quedando
  nuestra carpeta _kanban_ parece que hay muchos ficheros, sería buena idea
  organizar un poco, vamos a crear dos carpetas:
- _components_: donde meteremos los componentes que no son contenedores.
- _api_: donde meteremos los ficheros que se encargan de la comunicación
  con el _backend_ (que en este caso son _mock_).

Vamos a crear un _barrel_ para cada una de ellas:

_./src/kanban/components/index.ts_

```ts
export * from "./card.component";
export * from "./column.component";
```

_./src/kanban/api/index.ts_

```ts
export * from "./kanban.api";
```

Y arreglamos los _imports_ de:

- api
- components
- kanban.container

### Drag & Drop

Es hora de ir a por el _cogollo_ de la demo, vamos a implementar la funcionalidad de _drag and drop_ entre columnas.

- Vamos a instalar la librería _react-dnd_ que le hace falta un _backend_ (ojo no es _backend_ de servidor) para trabajar con _drag & drop_ en este caso elegimos la librería _react-dnd-html5-backend_.

```bash
npm install react-dnd react-dnd-html5-backend
```

- Vamos a habilitar el proveedor de _drag and drop_ a nivel de aplicación.

_./src/app.tsx_

```diff
import React from "react";
+ import { HTML5Backend } from "react-dnd-html5-backend";
+ import { DndProvider } from "react-dnd";
import { KanbanContainer } from "./kanban";

export const App = () => {
-  return <KanbanContainer />;
+  return (
+    <DndProvider backend={HTML5Backend}>
+       <KanbanContainer />
+    </DndProvider>
+  );
};
```

- Siguiente paso, tenemos que definir qué tipos de _items_ vamos a habilitar para arrastrar:
  - En este caso añadimos sólo las _cards_ (a futuro podríamos también dar la opción de arrastrar columnas).
  - La definición de _itemTypes_ la vamos a colocar debajo de _kanban_, si fuéramos a usarlo a nivel de aplicación global y _kanban_ estuviera dentro de un panel de la ventana podríamos pensar en promocionar _ItemTypes_ a un nivel superior (de nuevo, martillo fino, igual con el _drag and drop_, ¿Lo dejamos a nivel de contenedor de _kanban_?).

_./src/kanban/model.ts_

```diff
+ export const ItemTypes = {
+  CARD: 'card',
+ }

export interface CardContent {
  id: number;
  title: string;
}
```

- Siguiente paso, vamos a definir la acción de _drag_ en el componente de _card_, para ello:
  - Hacemos uso del hook _useDrag_ de _react-dnd_.
  - Esto nos devuelve un array con tres entradas:
    - Item 0: aquí recibimos una serie de propiedades que nos ayudan a definir el comportamiento del drag.
    - Item 1: un _ref_ del objeto que queremos arrastrar (en este caso la _card_)
    - Item 2: un _ref_ del objeto que vamos a usar para poner como _preview_ cuando arrastremos (aquí
      podemos también cambiar y usar una imagen).
  - Las _ref_ las tenemos que asociar:
    - Al componente que queremos arrastrar.
    - Al rectángulo verde sobre el que haremos drag

_./src/kanban/components/card.component.tsx_

```diff
import React from "react";
+ import { useDrag } from "react-dnd";
- import { CardContent } from "../model";
+ import { CardContent, ItemTypes } from "../model";
import classes from "./card.component.css";
```

_./src/kanban/components/card.component.tsx_

```diff
export const Card: React.FC<Props> = (props) => {
  const { content } = props;

+  const [{ opacity }, drag, preview] = useDrag(() => ({
+    type: ItemTypes.CARD, // Definimos que es de tipo CARD esto lo usaremos en el drop
+    item: content,        // Aquí le pasamos el contenido de la card, así en el drop tenemos toda la info
+    collect: (monitor) => ({  // En esta función monitorizamos el estado del drag y cambiamos la opacidad del card
+      opacity: monitor.isDragging() ? 0.4 : 1,
+    }),
+    end: (item, monitor) => { // Una vez que ha concluido el drag, si el drop ha sido exitoso, mostramos un mensaje
+      if (monitor.didDrop) {
+        console.log("Drop succeeded !")
+      }
+    },
+  }));

  return (
-    <div className={classes.card}>
+    <div ref={preview} className={classes.card}>
-      <div className={classes.dragHandle} />
+      <div ref={drag} className={classes.dragHandle} />
      {content.title}
    </div>
  );
};
```

- Nos queda sólo un detalle, vamos a mostrar el _card_ con una opacidad para marcar que es el elemento que se está arrastrando.

_./src/kanban/components/card.component.css_

```diff
  return (
-    <div ref={preview} className={classes.card}>
+    <div ref={preview} className={classes.card} style={{opacity}}>
```

- Vamos a probar :)

```bash
npm start
```

- De momento parecer que todo va genial :), ahora toca el _drop_, de primeras podría parece algo fácil, vamos a partir por la opción más lógica definir las diferentes columnas (_backlog_, _doing_, _done_) cómo áreas de _drop_ (después volveremos sobre esto), de primeras sólo ponemos un _console.log_ para ver que llega el evento de _drop_.

✅ Somos capaces de hacer drag (bueno no va fino del todo peeerooo)...

Cómo funciona este _useDrop_:

- Nos devuelve un _array_ con dos entradas:
  - Item 0: aquí recibimos una serie de propiedades que nos ayudan a definir el comportamiento del _drop_.
  - Item 1: un _ref_ del objeto que queremos que sea el área de _drop_ (en este caso la columna)
- Las _ref_ las tenemos que asociar:
  - Al componente que queremos que sea el área de drop.

Dentro del _useDrop_ definimos un objeto con las siguientes entradas:

- accept: aquí definimos que tipo de _items_ vamos a aceptar, en este caso sólo las _cards_.
- drop: aquí definimos la acción que vamos a realizar cuando se produzca el _drop_, en este caso sólo vamos a mostrar un mensaje, fíjate que en esta función devolvemos información acerca de donde se ha soltado el _item_, esta _info_ la recibe el _EndDrag_.

_./src/kanban/components/column.component.css_

```diff
import React from "react";
+ import { useDrop } from "react-dnd";
import classes from "./column.component.css";
- import { CardContent } from "../model";
+ import { CardContent, ItemTypes } from "../model";
```

_./src/kanban/components/column.component.css_

```diff
export const Column: React.FC<Props> = (props) => {
  const { name, content } = props;

+  const [collectedProps, drop] = useDrop(() => ({
+    accept: ItemTypes.CARD,
+    drop: (item: CardContent, monitor) => {
+      console.log("Drop", item);
+
+      return {
+        name: `DropColumn`,
+      };
+    },
+    collect: (monitor: any) => ({
+      isOver: monitor.isOver(),
+      canDrop: monitor.canDrop(),
+    }),
+  }), [content]);

  return (
-    <div className={classes.container}>
+    <div ref={drop} className={classes.container}>
      <h4>{name}</h4>
      {content.map((card) => (
        <Card key={card.id} content={card} />
      ))}
    </div>
  );
};
```

- Si probamos y vemos la consola vemos que se ejecuta tanto el _drop_ como el _drag_... seguimos en racha :), ahora toca que se realiza la operación "de verdad".

- En teoría añadir la card a la columna destino es sencillo, en el _drop_ tenemos el punto de entrada y el _item_, que vamos a hacer:

  - El componente column no tiene el estado de las listas, sólo ve el contenido de su _card_.
  - Creamos una _prop_ de tipo _callback_ para informar al componente de tipo _kanba_ _container_.
  - El _kanban container_ se encarga de actualizar la lista y ya la información fluye hacia abajo.

Varios detalles aquí:

- Empezamos a sufrir de "_drill prop_" subiendo y bajando datos y _callbacks_ por las _props_, empieza a oler a que usar un contexto podría ser de ayuda (otro TODO para la lista de "_martillo fino_") y este es el momento en que te pueden preguntar _¿Pero si funciona para qué lo vas a tocar? tampoco está tan mal..._ ese es el problema que si empezamos así y sumamos un montón de _tampoco está tan mal_ acabamos con un _esto está muy mal y no hay quien lo mantenga_, así que más adelante evaluaremos si centralizar en un contexto a aporta o no.

- De momento vamos a añadir la _card_ al final de la lista, si has usado herramientas como _trello_ te habrás dado cuenta de que cuando haces _drop_ te inserta la tarjeta entre las tarjetas en las que lo hayas soltado, esto, apuntado para el TODO de "_martillo fino_", y lo resolveremos más adelante (este es de los "_detalles_" que nos va a llevar bastante trabajo de arreglar).

Empezamos por el componente column (zona de _drop_), añadimos una propiedad de tipo _callback_ para informar al componente padre que se ha producido el _drop_, y la ejecutamos en el _useDrop_.

_./src/kanban/components/column.component.tsx_

```diff
interface Props {
  name: string;
  content: CardContent[];
+  onAddCard: (card: CardContent) => void;
}

```

_./src/kanban/components/column.component.tsx_

```diff
export const Column: React.FC<Props> = (props) => {
-  const { name, content } = props;
+  const { name, content, onAddCard } = props;


  const [collectedProps, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: CardContent, monitor) => {
-      console.log("Drop", item);
+      onAddCard(item);

      return {
        name: `DropColumn`,
      };
    },
```

- Vamos a implementar el _handler_ en el _kanban container_.

En esta caso tenemos que insertar un _card_ en la lista que toque, tenemos que hacerlo de forma inmutable para asegurarnos que todo se actualiza correctamente, no nos vale un _push_, podemos por ejemplo usar el _spread operator_ para crear una nueva lista con el nuevo _card_, pero como vamos a tener que manejar inmutabilidad en varios sitios, vamos a hacer uso de _immer_ una librería que nos permita trabajar de manera mutable en una _caja de arena_ y después lo convierte todo a inmutable.

- Instalamos la librería:

```bash
npm install immer --save
```

_./src/kanban/kanban.container.tsx_

```diff
import React from "react";
+ import produce from "immer";
import {
  KanbanContent,
  createDefaultKanbanContent,
+  CardContent,
} from "./model";
import { loadKanbanContent } from "./api";
import { Column } from "./components";
import classes from "./kanban.container.css";

```

_./src/kanban/kanban.container.tsx_

```diff
  React.useEffect(() => {
    loadKanbanContent().then((content) => setKanbanContent(content));
  }, []);

+ const handleAddCard = (card: CardContent) => {
+  // Me hace falta saber a que columna tengo que hacer el drop :)
+ }
```

_./src/kanban/kanban.container.tsx_

```diff
    <div className={classes.container}>
      {kanbanContent.columns.map((column) => (
        <Column key={column.id}
                name={column.name}
                content={column.content}
+               onAddCard={handleAddCard}
        />
      ))}
    </div>
```

Hasta aquí bien, nos hace falta saber la columna en la que tenemos que hacer el drop, aquí podíamos ver si añadir esa información al _card_, peeerooo... esa información ya la tenemos, si te fijas en el propio _kanban container_ cuando le pasamos las _card_ en el map _del_ componente _column_ ya sabemos a qué columna pertenece, ¿Qué podemos hacer? utilizar curry.

_./src/kanban/kanban.container.tsx_

```diff
- const handleAddCard = (card: CardContent) => {
+ const handleAddCard = (columnId : number) => (card: CardContent) => {
-  // Me hace falta saber a que columna tengo que hacer el drop :)
+  setKanbanContent(produce(kanbanContent, draft => {
+    const column = draft.columns.find(c => c.id === columnId);
+    if (column) {
+      column.content.push(card);
+    }
+  }));
  }

```

_./src/kanban/kanban.container.tsx_

```diff
    <div className={classes.container}>
      {kanbanContent.columns.map((column) => (
        <Column
          key={column.id}
          name={column.name}
          content={column.content}
-          onAddCard={handleAddCard}
+          onAddCard={handleAddCard(column.id)}
        />
      ))}
    </div>
```

- Vamos a probar si esto funciona.

```bash
npm start
```

- ¡Bueeeenoooo! Este es el momento en el que te vienes arriba y piensas que esto de _drag & drop_ es pan comido... vamos a empezar a meternos en el fango, primero completemos el _drop_...

- Añadimos una tarjeta a la columna destino, pero necesitamos eliminarla de la columna origen, podemos seguir dos aproximaciones:

  - En la _card_ tenemos un evento "_end_" del _drag_ en el que podemos comprobar que todo ha ido bien y eliminar la tarjeta de la columna origen.

  - En la columna destino podríamos en el _AddCard_ del _container_ hacer las dos operaciones: borrar la antigua de la columna que toque y añadir la nueva.

¿Qué opción tomarías? ... esta decisión tan inocente vamos a ver que nos va a llevar a más de un quebradero de cabeza :).

Vamos a arrancar por la primera, tenemos dos puntos de entrada:

- El evento "_end_" del drag, donde eliminamos la _card_ antigua.
- El evento "_drop_" del _drop_, donde la añadimos a la columna que toque.

El _drop_ ya lo tenemos implementado, vamos a por el _end drag_, en principio podría ser algo así como

_./src/kanban/components/card.component.tsx_

```diff
interface Props {
  content: CardContent;
+ onRemoveCard: (cardContent: CardContent) => void;
}

export const Card: React.FC<Props> = (props) => {
-  const { content } = props;
+  const { content, onRemoveCard } = props;
```

_./src/kanban/components/card.component.tsx_

```diff
    end: (item, monitor) => {
      // Una vez que ha concluido el drag, si el drop ha sido exitoso, mostramos un mensaje
      if (monitor.didDrop) {
-        console.log("Drop succeeded !");
+        onRemoveCard(content);
      }
    },
  }));
```

Y vamos a _burbujear_ esto hacía la columna y hacía el _container_ (esto ya empieza a oler a contexto :),
apuntar martillo fino :))

_./src/kanban/components/column.component.tsx_

```diff
interface Props {
  name: string;
  content: CardContent[];
  onAddCard: (card: CardContent) => void;
+ onRemoveCard: (cardContent: CardContent) => void;
}

export const Column: React.FC<Props> = (props) => {
-  const { name, content, onAddCard  } = props;
+  const { name, content, onAddCard, onRemoveCard } = props;
```

_./src/kanban/components/column.component.tsx_

```diff
  return (
    <div ref={drop} className={classes.container}>
      <h4>{name}</h4>
      {content.map((card) => (
        <Card key={card.id}
              content={card}
+             onRemoveCard={onRemoveCard}
              />
      ))}
    </div>
  );
```

Vámonos al _kanban container_ y vamos a implementar el _remove_ _card_, vamos a _currificar_ el _id_ de la columna ¿Me decís vosotros cómo funcionaría?

_./src/kanban/kanban.container.tsx_

```diff
  const handleAddCard = (columnId: number) => (card: CardContent) => {
    setKanbanContent(
      produce(kanbanContent, (draft) => {
        const column = draft.columns.find((c) => c.id === columnId);
        if (column) {
          column.content.push(card);
        }
      })
    );
  };

+  const handleRemoveCard = (columnId: number) => (card: CardContent) => {
+    const columnIndex = kanbanContent.columns.findIndex(
+      (c) => c.id === columnId
+    );
+
+    if (columnIndex !== -1) {
+      setKanbanContent(
+        produce(kanbanContent, (draft) => {
+          draft.columns[columnIndex].content = kanbanContent.columns[
+            columnIndex
+          ].content.filter((c) => c.id !== card.id);
+        })
+      );
+    }
+  };

  return (
    <div className={classes.container}>
```

_./src/kanban/kanban.container.tsx_

```diff
  return (
    <div className={classes.container}>
      {kanbanContent.columns.map((column) => (
        <Column
          key={column.id}
          name={column.name}
          content={column.content}
          onAddCard={handleAddCard(column.id)}
+         onRemoveCard={handleRemoveCard(column.id)}
        />
      ))}
    </div>
  );
```

- Si nos paramos este código empieza a oler a que hace falta un _refactor_, empezamos a tener un _bombazo_ de código en el componente, pero bueno vamos a probar y ver nuestro _drag & drop_ en acción:

```bash
npm start
```

En este momento nos entra el modo pánico... ¡Esto ha dejado de funcionar y tiene un comportamiento caótico !

✅ La hemos cagado...

Prueba a arrastrar y soltar tarjetas y ver qué pasa:

- La primera vez que arrastras una tarjeta, desaparece de la columna origen y no aparece en la destino.
- La segunda vez que arrastras una tarjeta, aparece la anterior en la columna origen y no aparece en la
  de destino :).

Esto es un indicador de que nuestro código se está convirtiendo en una _castaña_, empieza a alcanzar el status de _spaghetti code_ y que es hora de refactorizar.

Lo primero vamos a investigar porque pasa esto, os dejo un tiempo para que lo investiguéis, y me digáis que puede ser (iré dando pistas).

**_ESPERA 10/15 MINUTOS INVESTIGACION_**

Pistas:

- Estamos tratando con un _callback_, ¿qué puede pasar con el estado si no tenemos cuidado?
- Comenta la línea en la que se borra el _card_.

**_SOLUCIÓN_**

Lo que está pasando aquí es que al hacer un _setState_ en el _callback_ estamos tirando del valor antiguo que tenía la función (¿os acordáis del ejemplo de _async closure_?), entonces cuando hacemos un _setState_ lo estamos haciendo con los valores de la columna antigua antes de hacer el _drop_ (primero se ejecuta el _drop_ después el _end drag_), de ahí el _glitch_ que tenemos.

Vamos primero a poner un parche para que funcione, y luego toca pararse y refactorizar antes de que esto se nos vaya de las manos.

La solución es tocar en una sola línea de código, en el _setState_ del _callback_, vamos a pasarle una función en vez del nuevo valor, en esta función se nos alimenta el último estado, no el que se quedó colgado en el _closure_:

_./src/kanban/kanban.container.ts_

```diff
    if (columnIndex !== -1) {
-      setKanbanContent(
+      setKanbanContent((kanbanContentLatest) =>
-        produce(kanbanContent, (draft) => {
+        produce(kanbanContentLatest, (draft) => {
-          draft.columns[columnIndex].content = kanbanContent.columns[
+          draft.columns[columnIndex].content = kanbanContentLatest.columns[
            columnIndex
          ].content.filter((c) => c.id !== card.id);
        })
      );
    }
```

✅ Funciona, volvemos a sentirnos dios peeeroooo...

- Vale con esto las cosas vuelven a funcionar, pero nos deja mal sabor de boca:
  - El código que se ha quedado es un galimatías.
  - Partimos de que controlamos el orden, primero _drop_ después _end drag_ (tendríamos que añadir lo mismo en el _EndDrag_).
  - Tenemos riesgo de introducir más condiciones de carrera.
  - Todavía no hemos empezado a _rascar casos arista_, por ejemplo:
    - Qué pasa si arrastro y suelto una card en la misma columna.
    - Qué pasa si quiero insertar una card siguiendo un orden.
    - ...

Ahora mismo toca parar y refactorizar, que un código funcione no quiere decir que sea una solución aceptable, vamos a plantear este escenario, podemos pensar en varias aproximaciones:

- Una podría ser utilizar _useReducer_, tener el estado en el _reducer_ y las acciones _AddCard_ y _RemoveCard_,de esta manera sacamos estado fuera y nos quitamos el problema del _closure hell_. Este caso podría ser útil si la zona de _drag_ y la de _drop_ no se hablaran, pero en este caso tenemos un _container_ común.

- La segunda es dejar que el _drop_ se encargue de todo, de esta manera:
  - Tenemos un único punto de entrada (no hay condiciones de carrera).
  - Simplificamos código (al menos la parte de _drag_ y el burbujeo hacia arriba).

De momento vamos a por la segunda opción, dejando la puerta a utilizar _useReducer_ a futuro (por ejemplo se complica la cosa y ahora queremos distinguir entre _drag_ y eliminar y _drag_ y copiar, etc...)

Qué solución podemos darle:

- En vez de _AddCard_ vamos a llamar a este evento _MoveCard_ (tienen más sentido, a futuro seguramente pongamos un _AddCard_ para crear una tarjeta en blanco).

- Se va originar en el _columnDrop_, y la información que va a tener va a ser:

  - Columna Origen.
  - _Item_.

- La columna destino la podemos seguir sacando con el curry (también podríamos plantearnos pasarla para abajo).

Esto origina un evento en el que se burbujea al contenedor esta información y se hace todo de una tacada, eliminar el elemento y añadir el nuevo.

Qué es lo positivo de esto... que además de quedarnos el código más claro, resolvemos el caso arista de arrastro
y suelto en la misma columna.

¡Manos a la obra!

- Lo primero vamos a añadir a la estructura del _drag_ el _column Id_ al que pertenece la tarjeta (podríamos
  iterar por las mismas, pero si ya sabemos de partida la columna origen, nos ahorramos ese paso)

_./src/kanban/model.ts_

```diff
export const createDefaultKanbanContent = (): KanbanContent => ({
  columns: [],
});

+ export interface DragItemInfo {
+   columnId: number;
+   content: CardContent;
+ }

+ export const createDragItemInfo = (columnId: number, content: CardContent): DragItemInfo => ({
+  columnId,
+  content,
+ });
```

- En el _container_ vamos a pasar el _columnId_ para que lo recoja la _card_:

_./src/kanban/kanban-container.tsx_

```diff
  return (
    <div className={classes.container}>
      {kanbanContent.columns.map((column) => (
        <Column
          key={column.id}
+         columnId={column.id}
          name={column.name}
          content={column.content}
          onAddCard={handleAddCard(column.id)}
          onRemoveCard={handleRemoveCard(column.id)}
        />
      ))}
    </div>
  );
```

_./src/kanban/components/column.components.tsx_

```diff
interface Props {
+ columnId : number;
  name: string;
  content: CardContent[];
  onAddCard: (card: CardContent) => void;
  onRemoveCard: (cardContent: CardContent) => void;
}

export const Column: React.FC<Props> = (props) => {
  const {
+         columnId,
          name,
          content,
          onAddCard,
          onRemoveCard,  } = props;
```

_./src/kanban/components/column.components.tsx_

```diff
    <div ref={drop} className={classes.container}>
      <h4>{name}</h4>
      {content.map((card) => (
        <Card
          key={card.id}
+         columnId={columnId}
          content={card}
          onRemoveCard={onRemoveCard} />
      ))}
    </div>
```

> ¿Es buena idea pasar el columnId de forma separada? ¿Deberíamos pasar el card? ¿Y si creamos una entidad VM para pasar el card con el valor del columnId (de hecho seguramente en servidor tendríamos el id de la columna a la que pertenece cada card)? Si almacenamos el columnId en el card también podríamos tener un sólo array de cards... todas estas opciones tienen sus pros y sus contras, en este caso vamos a pasar el columnId de forma separada.

_./src/kanban/components/card.components.tsx_

```diff
import React from "react";
import { useDrag } from "react-dnd";
- import { CardContent, ItemTypes } from "../model";
+ import { CardContent, ItemTypes, createDragItemInfo } from "../model";
import classes from "./card.component.css";

interface Props {
  content: CardContent;
-  onRemoveCard: (cardContent: CardContent) => void;
+ columnId: number;
}

export const Card: React.FC<Props> = (props) => {
-  const { content, onRemoveCard } = props;
+  const { content, columnId } = props;
```

_./src/kanban/components/card.components.tsx_

```diff
  const [{ opacity }, drag, preview] = useDrag(() => ({
    type: ItemTypes.CARD, // Definimos que es de tipo CARD esto lo usaremos en el drop
-    item: content,
+    item: createDragItemInfo(columnId,content),
```

Eliminamos la parte del _drop_:

```diff
  const [{ opacity }, drag, preview] = useDrag(() => ({
    type: ItemTypes.CARD, // Definimos que es de tipo CARD esto lo usaremos en el drop
    item: createDragItemInfo(columnId,content),
    collect: (monitor) => ({
      // En esta función monitorizamos el estado del drag y cambiamos la opacidad del
      // card que está fijo (el elegido para el drag, para que el usuario se de cuenta)
      // de que item está arrastrando
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
-    end: (item, monitor) => {
-      // Una vez que ha concluido el drag, si el drop ha sido exitoso, mostramos un mensaje
-      if (monitor.didDrop) {
-        onRemoveCard(content);
-      }
-    },
  }));
```

Y vamos a gestionar el _bubble up_ desde la columna:

_./src/kanban/components/column.component.tsx_

```diff
import React from "react";
import { useDrop } from "react-dnd";
import classes from "./column.component.css";
- import { CardContent, ItemTypes } from "../model";
+ import { CardContent, ItemTypes, DragItemInfo } from "../model";
import { Card } from "./card.component";
```

_./src/kanban/components/column.component.tsx_

```diff
interface Props {
  columnId: number;
  name: string;
  content: CardContent[];
-  onAddCard: (card: CardContent) => void;
+  onMoveCard: (card: DragItemInfo) => void;
-  onRemoveCard: (cardContent: CardContent) => void;
}

export const Column: React.FC<Props> = (props) => {
-  const { columnId, name, content, onAddCard, onRemoveCard } = props;
+  const { columnId, name, content, onMoveCard } = props;


  const [collectedProps, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
-    drop: (item: CardContent, monitor) => {
+    drop: (item: DragItemInfo, monitor) => {
-      onAddCard(item);
+      onMoveCard(item);

      return {
        name: `DropColumn`,
      };
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
```

_./src/kanban/components/column.component.tsx_

```diff
  return (
    <div ref={drop} className={classes.container}>
      <h4>{name}</h4>
      {content.map((card) => (
        <Card
          key={card.id}
          columnId={columnId}
          content={card}
-          onRemoveCard={onRemoveCard}
        />
      ))}
    </div>
  );
```

Y vamos a realizar los cambios en el _container_:

_./src/kanban/kanban.container.tsx_

```diff
import React from "react";
import {
  KanbanContent,
  createDefaultKanbanContent,
  CardContent,
+ DragItemInfo
} from "./model";
import { loadKanbanContent } from "./api";
```

_./src/kanban/kanban.container.tsx_

```diff
-  const handleAddCard = (columnId: number) => (card: CardContent) => {
-    setKanbanContent(
-      produce(kanbanContent, (draft) => {
-        const column = draft.columns.find((c) => c.id === columnId);
-        if (column) {
-          column.content.push(card);
-        }
-      })
-    );
-  };
-
-  const handleRemoveCard = (columnId: number) => (card: CardContent) => {
-    const columnIndex = kanbanContent.columns.findIndex(
-      (c) => c.id === columnId
-    );
-
-    if (columnIndex !== -1) {
-      setKanbanContent((kanbanContentLatest) =>
-        produce(kanbanContentLatest, (draft) => {
-          draft.columns[columnIndex].content = kanbanContentLatest.columns[
-            columnIndex
-          ].content.filter((c) => c.id !== card.id);
-        })
-      );
-    }
-  };
+
+  const handleMoveCard = (columnDestinationId : number) => (dragItemInfo: DragItemInfo) => {
+    const { columnId : columnOriginId, content } = dragItemInfo;

+    const columnIndexOrigin = kanbanContent.columns.findIndex(
+      (c) => c.id === columnOriginId
+    );
+
+    const columnIndexDestination = kanbanContent.columns.findIndex(
+      (c) => c.id === columnDestinationId
+    );
+
+   if (columnIndexOrigin !== -1 && columnIndexDestination !== -1) {
+      setKanbanContent((kanbanContentLatest) =>
+        produce(kanbanContentLatest, (draft) => {
+          // remove
+          draft.columns[columnIndexOrigin].content = kanbanContentLatest.columns[
+            columnIndexOrigin
+          ].content.filter((c) => c.id !== content.id);
+          // add
+          draft.columns[columnIndexDestination].content.push(content);
+        })
+      );
+    }
+  }
```

_./src/kanban/kanban.container.tsx_

```diff
  return (
    <div className={classes.container}>
      {kanbanContent.columns.map((column) => (
        <Column
          key={column.id}
          columnId={column.id}
          name={column.name}
          content={column.content}
-          onAddCard={handleAddCard(column.id)}
-          onRemoveCard={handleRemoveCard(column.id)}
+          onMoveCard={handleMoveCard(column.id)}
        />
      ))}
    </div>
  );
```

✅ Código un poquito más claro, sigamos...

- Bueno ya lo tenemos algo más estable, nos queda un último escollo que es en vez de añadir la carta al final siempre que hacemos _drop_, que la inserte en medio si la soltamos en mitad de la columna, esto no va a ser fácil ya que tenemos que calcular la posición en la que cae la _card_ y ver sobre que _card_ destino se ha posado y calcular el índice del array...

Antes de empezar con esto vamos a hacer limpia de código, que pasos vamos a tomar:

- Simplificar los componentes (_vaciar el cangrejo_).
- Evitar el _prop drill hell_ usando Contexto o _useReducer_.

### Simplificar los componentes

Lo primero, vamos a _vaciar el cangrejo_ tenemos componentes con mucho código, podemos:

- Extraer parte del código a lógica de negocios (le podemos añadir tests).
- Podemos sacarlo a _custom hooks_ (aquí le podríamos añadir tests, o esperar a ver si el tema de insertar en medio impacta mucho en el código).

Vamos a ir evaluando componentes, empezamos por el _kanban container_:

- La parte en la que creamos el _kanbanContent_ y hacemos la carga inicial la podíamos envolver en un _custom hook_.

- El _HandleMoveCard_ tiene lógica que se puede pasar a funciones de negocio sin estado que sean fácilmente testeables.

- Creamos el _custom hook_ (lo vamos a dejar dentro del fichero del _container_, pero lo podríamos sacar a un fichero aparte):

_./src/kanban/kanban.container.tsx_

```diff
import produce from "immer";

+ const useKanbanState = () : [
+  KanbanContent,
+  React.Dispatch<React.SetStateAction<KanbanContent>>
+ ] => {
+  const [kanbanContent, setKanbanContent] = React.useState<KanbanContent>(
+    createDefaultKanbanContent()
+  );
+
+  React.useEffect(() => {
+    loadKanbanContent().then((content) => setKanbanContent(content));
+  }, []);
+
+  return [kanbanContent, setKanbanContent];
+ }

export const KanbanContainer: React.FC = () => {
+  const [kanbanContent, setKanbanContent] = useKanbanState();
-  const [kanbanContent, setKanbanContent] = React.useState<KanbanContent>(
-    createDefaultKanbanContent()
-  );
-
-  React.useEffect(() => {
-    loadKanbanContent().then((content) => setKanbanContent(content));
-  }, []);
```

- Vamos a extraer la lógica de búsqueda de columna, añadir y eliminar _card_ a un método de negocio, de primeras en bruto (aquí sería buena idea añadir tests para ver que funciona como esperamos), vamos a ponerlo tal cuál y después lo optimizamos.

_./src/kanban/kanban.business.ts_

```ts
import { CardContent, KanbanContent } from "./model";
import produce from "immer";

interface MoveInfo {
  columnOriginId: number;
  columnDestinationId: number;
  content: CardContent;
}

// TODO this can be additionally refactored (apply clean code)
export const moveCardColumn = (
  moveInfo: MoveInfo,
  kanbanContent: KanbanContent
): KanbanContent => {
  const { columnOriginId, columnDestinationId, content } = moveInfo;
  let newKanbanContent = kanbanContent;

  const columnIndexOrigin = kanbanContent.columns.findIndex(
    (c) => c.id === columnOriginId
  );

  const columnIndexDestination = kanbanContent.columns.findIndex(
    (c) => c.id === columnDestinationId
  );

  if (columnIndexOrigin !== -1 && columnIndexDestination !== -1) {
    newKanbanContent = produce(kanbanContent, (draft) => {
      // remove
      draft.columns[columnIndexOrigin].content = kanbanContent.columns[
        columnIndexOrigin
      ].content.filter((c) => c.id !== content.id);
      // add
      draft.columns[columnIndexDestination].content.push(content);
    });
  }

  return newKanbanContent;
};
```

- Antes de seguir refactorizando vamos a añadir unas pruebas para ver si esto pinta bien (podíamos haberlo hecho siguiendo TDD)

Arrancamos en modo test en otro terminal:

```bash
npm run test:watch
```

_./src/kanban/kanban.business.spec.ts_

```ts
import { moveCardColumn } from "./kanban.business";
import { KanbanContent } from "./model";

describe("Kanban business", () => {
  it("should move card from one column to another", () => {
    const kanbanContent: KanbanContent = {
      columns: [
        {
          id: 1,
          name: "Column A",
          content: [
            {
              id: 1,
              title: "Card 1",
            },
            {
              id: 2,
              title: "Card 2",
            },
          ],
        },
        {
          id: 2,
          name: "Column B",
          content: [
            {
              id: 3,
              title: "Card 3",
            },
          ],
        },
      ],
    };

    const moveInfo = {
      columnOriginId: 1,
      columnDestinationId: 2,
      content: {
        id: 1,
        title: "Card 1",
      },
    };

    const newKanbanContent = moveCardColumn(moveInfo, kanbanContent);

    expect(newKanbanContent).toEqual({
      columns: [
        {
          id: 1,
          name: "Column A",
          content: [
            {
              id: 2,
              title: "Card 2",
            },
          ],
        },
        {
          id: 2,
          name: "Column B",
          content: [
            {
              id: 3,
              title: "Card 3",
            },
            {
              id: 1,
              title: "Card 1",
            },
          ],
        },
      ],
    });
  });

  it("should move card from first column to third column", () => {
    const kanbanContent: KanbanContent = {
      columns: [
        {
          id: 1,
          name: "Column A",
          content: [
            {
              id: 1,
              title: "Card 1",
            },
            {
              id: 2,
              title: "Card 2",
            },
          ],
        },
        {
          id: 2,
          name: "Column B",
          content: [
            {
              id: 3,
              title: "Card 3",
            },
          ],
        },
        {
          id: 3,
          name: "Column C",
          content: [],
        },
      ],
    };

    const moveInfo = {
      columnOriginId: 1,
      columnDestinationId: 3,
      content: {
        id: 1,
        title: "Card 1",
      },
    };

    const newKanbanContent = moveCardColumn(moveInfo, kanbanContent);

    expect(newKanbanContent).toEqual({
      columns: [
        {
          id: 1,
          name: "Column A",
          content: [
            {
              id: 2,
              title: "Card 2",
            },
          ],
        },
        {
          id: 2,
          name: "Column B",
          content: [
            {
              id: 3,
              title: "Card 3",
            },
          ],
        },
        {
          id: 3,
          name: "Column C",
          content: [
            {
              id: 1,
              title: "Card 1",
            },
          ],
        },
      ],
    });
  });

  it("should return same state if destination does not exists", () => {
    const kanbanContent: KanbanContent = {
      columns: [
        {
          id: 1,
          name: "Column A",
          content: [
            {
              id: 1,
              title: "Card 1",
            },
            {
              id: 2,
              title: "Card 2",
            },
          ],
        },
      ],
    };

    const moveInfo = {
      columnOriginId: 1,
      columnDestinationId: 2,
      content: {
        id: 1,
        title: "Card 1",
      },
    };

    const newKanbanContent = moveCardColumn(moveInfo, kanbanContent);

    expect(newKanbanContent).toEqual(kanbanContent);
  });

  it("should return same state if origin does not exists", () => {
    const kanbanContent: KanbanContent = {
      columns: [
        {
          id: 1,
          name: "Column A",
          content: [
            {
              id: 1,
              title: "Card 1",
            },
            {
              id: 2,
              title: "Card 2",
            },
          ],
        },
      ],
    };

    const moveInfo = {
      columnOriginId: 2,
      columnDestinationId: 1,
      content: {
        id: 1,
        title: "Card 1",
      },
    };

    const newKanbanContent = moveCardColumn(moveInfo, kanbanContent);

    expect(newKanbanContent).toEqual(kanbanContent);
  });
});
```

> Podríamos haber usado jest.each: https://www.npmjs.com/package/jest-each

El fichero _business_ podríamos dejarlo más simple, iremos a por él más tarde (otro _item_ para la lista de _martillo fino_)

Ahora que funciona vamos a hacer el _refactor_ en el _container_:

_./src/kanban/kanban.container.tsx_

```diff
import React from "react";
import produce from "immer";
import {
  KanbanContent,
  createDefaultKanbanContent,
  CardContent,
  DragItemInfo,
} from "./model";
import { loadKanbanContent } from "./api";
import { Column } from "./components";
import classes from "./kanban.container.css";
+ import { moveCardColumn } from "./kanban.business";
```

_./src/kanban/kanban.container.tsx_

```diff
export const KanbanContainer: React.FC = () => {
  const [kanbanContent, setKanbanContent] = useKanbanState();

  const handleMoveCard =
    (columnDestinationId: number) => (dragItemInfo: DragItemInfo) => {
      const { columnId: columnOriginId, content } = dragItemInfo;

-      const columnIndexOrigin = kanbanContent.columns.findIndex(
-        (c) => c.id === columnOriginId
-      );
-
-      const columnIndexDestination = kanbanContent.columns.findIndex(
-        (c) => c.id === columnDestinationId
-      );
-
-      if (columnIndexOrigin !== -1 && columnIndexDestination !== -1) {
-        setKanbanContent((kanbanContentLatest) =>
-          produce(kanbanContentLatest, (draft) => {
-            // remove
-            draft.columns[columnIndexOrigin].content =
-              kanbanContentLatest.columns[columnIndexOrigin].content.filter(
-                (c) => c.id !== content.id
-              );
-            // add
-            draft.columns[columnIndexDestination].content.push(content);
-          })
-        );
-      }
+      setKanbanContent((kanbanContentLatest) => moveCardColumn({
+         columnOriginId,
+         columnDestinationId,
+         content,
+         },
+         kanbanContentLatest));
    };

    };

  return (
```

✅ Nos sentimos un poco más limpios :)...

- No está mal como se ha quedado, a futuro si el tema de _drag & drop_ crece (se añade más funcionalidad), podríamos plantearnos encapsularla todo en un _hook_.

- Vamos ahora a por la columna:
  - Este componente tal y como esta no haría falta refactorizarlo.
  - Si empieza a llenarse de código, podríamos plantearnos sacar la funcionalidad de _drop_ a un _custom hook_ que podría llamarse _useCardDrop_ y le pasamos por parámetro el _callback_ de _onMoveCard_ y pasamos como _return_ del _hook_ el ref _que_ hay que poner en el elemento que queremos que sea _dropable_.

De momento no lo vamos a hacer, aquí tenemos una regla y es la de "_recojo carrete_":

- Vamos haciendo _refactors_ hasta que el código se vea limpio y entendible.
- Esperamos que hayan cambios a futuro que puede que hagan más complejo ese código, entonces refactorizamos.
- A veces me puedo pasar refactorizando, en ese caso hago como alguien que practica la pesca "_recojo carrete_" y tiro a la versión anterior.

Vamos a por la card:

- En card pasa algo parecido, podríamos extraer el _drag_ en un _hook_, pero en principio no lo vamos a hacer ya que el componente de momento es simple.
- Podría ser buena idea extraerlo para implementar pruebas unitarias del _hook_ en concreto.

### Pasar a contexto o useReducer

Aunque hemos hecho limpia, seguimos teniendo un código un poco lioso:

- Hay propiedades que viajan de _container_ a _card_.
- Hay _callbacks_ que viajan de _card_ a _container_.

Esto es complicado de seguir, además que en el container tenemos mucho estado metido y lógica de actualización metida, podríamos plantear:

- Almacenar en un contexto el estado de las columnas/cards y exponerlo a nivel de _container_ con un _provider_.
- Utilizar _useReducer_ a nivel de _container_ y pasar el _dispatch_, creando una acción para la carga inicial y otra para la actualización de la posición de la _card_.

Ambas opciones tienen sus pros y sus contras:

- El contexto es interesante, pero metemos _getContext_ por mitad de la jerarquía.
- El _Reducer_ añade mucho orden pero tenemos que ir pasando _dispatch_ de padre a hijo aunque un componente de la jerarquía no lo use.

En este caso nos vamos a quedar con la solución del contexto:

- Vamos a definir el contexto del kanban:

_./src/kanban/providers/kanban.context.tsx_

```tsx
import React from "react";
import {
  createDefaultKanbanContent,
  DragItemInfo,
  KanbanContent,
} from "../model";

export interface KanbanContextModel {
  kanbanContent: KanbanContent;
  setKanbanContent: (kanbanContent: KanbanContent) => void;
  moveCard: (columnDestinationId: number, dragItemInfo: DragItemInfo) => void;
}

export const KanbanContext = React.createContext<KanbanContextModel>({
  kanbanContent: createDefaultKanbanContent(),
  setKanbanContent: () =>
    console.warn(
      "** If you area reading this, likely you have forgotten to add the provider on top of your app"
    ),
  moveCard: () => null,
});
```

_./src/kanban/providers/kanban.provider.tsx_

```tsx
import React from "react";
import { moveCardColumn } from "../kanban.business";
import {
  KanbanContent,
  createDefaultKanbanContent,
  DragItemInfo,
} from "../model";
import { KanbanContext } from "./kanban.context";

interface Props {
  children: React.ReactNode;
}

export const KanbanProvider: React.FC<Props> = ({ children }) => {
  const [kanbanContent, setKanbanContent] = React.useState<KanbanContent>(
    createDefaultKanbanContent()
  );

  const moveCard = (
    columnDestinationId: number,
    dragItemInfo: DragItemInfo
  ) => {
    const { columnId: columnOriginId, content } = dragItemInfo;

    setKanbanContent((kanbanContentLatest) =>
      moveCardColumn(
        {
          columnOriginId,
          columnDestinationId,
          content,
        },
        kanbanContentLatest
      )
    );
  };

  return (
    <KanbanContext.Provider
      value={{
        kanbanContent,
        setKanbanContent,
        moveCard,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};
```

- Vamos a colocar el _context_ en el _app_ donde se instancia el _kanban_, así si creamos más de un _kanban_ no compartirán estado (también, podríamos haber creado un componente _wrapper_ dentro de la carpeta _kanban_).

_./src/kanban/index.ts_

```diff
export * from "./kanban.container";
+ export * from "./providers/kanban.provider";
```

_./src/app.tsx_

```diff
import React from "react";
- import { KanbanContainer } from "./kanban";
+ import { KanbanContainer, KanbanProvider } from "./kanban";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

export const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
+     <KanbanProvider>
        <KanbanContainer />
+     </KanbanProvider>
    </DndProvider>
  );
};
```

- Vamos a hacer limpia de _kanban.container_ y añadir nuestro contexto (vemos que lo dejamos todo funcionando y después empezaremos a quitar propiedades en los _columns_ y _cards_ para tirar de contexto).

_./src/kanban/kanban.container.tsx_

```diff
import React from "react";
- import produce from "immer";
import {
-  KanbanContent,
-  createDefaultKanbanContent,
-  CardContent,
   DragItemInfo,
} from "./model";
import { loadKanbanContent } from "./api";
import { Column } from "./components";
import classes from "./kanban.container.css";

- import { moveCardColumn } from "./kanban.business";
+ import { KanbanContext } from "./providers/kanban.context";

- const useKanbanState = (): [
-  KanbanContent,
-  React.Dispatch<React.SetStateAction<KanbanContent>>
-] => {
-  const [kanbanContent, setKanbanContent] = React.useState<KanbanContent>(
-    createDefaultKanbanContent()
-  );
-
-  React.useEffect(() => {
-    loadKanbanContent().then((content) => setKanbanContent(content));
-  }, []);
-
-  return [kanbanContent, setKanbanContent];
- };

export const KanbanContainer: React.FC = () => {
+ const {kanbanContent, setKanbanContent, moveCard} = React.useContext(KanbanContext);
-  const [kanbanContent, setKanbanContent, moveCard] = useKanbanState();

+  React.useEffect(() => {
+    loadKanbanContent().then((content) => setKanbanContent(content));
+  }, []);

  const handleMoveCard =
    (columnDestinationId: number) => (dragItemInfo: DragItemInfo) => {
-      const { columnId: columnOriginId, content } = dragItemInfo;

+      moveCard(columnDestinationId, dragItemInfo);
-      setKanbanContent((kanbanContentLatest) =>
-        moveCardColumn(
-          {
-            columnOriginId,
-            columnDestinationId,
-            content,
-          },
-          kanbanContentLatest
-        )
-      );
    };

  return (
    <div className={classes.container}>
      {kanbanContent.columns.map((column) => (
        <Column
          key={column.id}
          columnId={column.id}
          name={column.name}
          content={column.content}
          onMoveCard={handleMoveCard(column.id)}
        />
      ))}
    </div>
  );
};
```

- Primer paso del _refactor_ dado, ahora vamos a quitar _drill prop_ de la _column_ y la card *(*podríamos eliminar más propiedades y añadir _helpers_ en el contexto, ¿Merece la pena? ¿Qué opinas?

_./src/kanban/kanban.container.tsx_

```diff
import React from "react";
- import { DragItemInfo } from "./model";
import { loadKanbanContent } from "./api/kanban.api";
import { Column } from "./components/column.component";
```

_./src/kanban/kanban.container.tsx_

```diff
-  const handleMoveCard =
-    (columnDestinationId: number) => (dragItemInfo: DragItemInfo) => {
-      const { columnId: columnOriginId, content } = dragItemInfo;
-
-      moveCard(columnDestinationId, dragItemInfo);
-    };

  return (
    <div className={classes.container}>
      {kanbanContent.columns.map((column) => (
        <Column
          key={column.id}
          columnId={column.id}
          name={column.name}
          content={column.content}
-          onMoveCard={handleMoveCard(column.id)}
        />
      ))}
    </div>
  );
```

_./src/kanban/components/column.component.tsx_

```diff
interface Props {
  columnId: number;
  name: string;
  content: CardContent[];
-  onMoveCard: (card: DragItemInfo) => void;
}
```

_./src/kanban/components/column.component.tsx_

```diff
import React from "react";
import { useDrop } from "react-dnd";
import classes from "./column.component.css";
import { CardContent, ItemTypes, DragItemInfo } from "../model";
import { Card } from "./card.component";
+ import { KanbanContext } from "../providers/kanban.context";

export const Column: React.FC<Props> = (props) => {
-  const { columnId, name, content, onMoveCard } = props;
+  const { columnId, name, content } = props;
+  const { moveCard } = React.useContext(KanbanContext);

  const [collectedProps, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: DragItemInfo, monitor) => {
-      onMoveCard(item);
+      moveCard(columnId, item);
      return {
        name: `DropColumn`,
      };
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
```

- En la _card_ no tenemos _callback drill props_.

De momento nos quedamos así con el refactor, vamos a hacer una prueba rápida y ver que todo sigue funcionando.

¿Qué hemos ganado?

- Simplificado _drill prop_.
- Separador contenedor de estado.
- Eliminado _curry_ al asignar el _callback_ de _move column_.

### Insertar cards

Hasta ahora hemos estado haciendo _drops_ de las cartas al final de la columna, pero cuando yo arrastro y suelto normalmente quiero intercalar la _card_ en una posición determinada.

Para esto podemos optar por dos aproximaciones:

- Cuando hago _drop_, itero por los _divs_ de cada _card_ y veo donde cae en
  la coordenada _drop_ con respecto a mi _card_ y con eso calculo el índice para
  insertar.

- Otra opción es que las _cards_ se conviertan en áreas de _drop_ y añada una _card_ vacía
  oculta que ocupe el resto de la columna.

La segunda opción parece un poco "_hack_", pero en teoría podría ser la que menos
quebraderos de cabeza podría dar (te animo a que pruebes a implementarla).

Pero... ¿Por qué la primera opción nos va a dar guerra?

- Nuestra área de _drop_ es la columna.
- A priori _ReactDnd_ no sabe que coordenada tiene cada _card_ en esa columna destino.
- Tenemos que buscar una forma de calcularla... aquí podríamos pensar: usamos _ref_ :)... bien pero no tenemos un _card_, tenemos un array de _cards_, nos haría falta un _ref_ por cada _card_, es decir un array de _refs_, y además estas _ref_ son dinámicas, puedo añadir y quitar _cards_ de una columna.

¿Cómo podemos hacer esto?

- Vamos a crear un registro de _refs_ (uno por cada _card_ de la columna), usaremos un _array_ (se pueden mirar [optimizaciones](https://stackoverflow.com/questions/54633690/how-can-i-use-multiple-refs-for-an-array-of-elements-with-hooks)).

- Este registro de _refs_ lo vamos a recalcular en cada render (los elementos han podido cambiar), se podía optimizar para recalcular sólo si han cambiado ciertas _props_.
- El registro de _refs_ lo enlazo con el listado de _Cards_.

- Vamos a empezar por definir el tipo de registro de _refs_.

Vamos a crear la lista de refs que se asociaran al repintar el componente.

_./src/kanban/components/column.tsx_

```diff
+  const itemsRef = React.useRef<HTMLDivElement[]>([]);

+  itemsRef.current = [];

  return (
```

- Y ahora vamos a asociar cada _ref_ a cada _card_ (para el nombre de la propiedad accedo por el operador de array).

_./src/kanban/components/column.tsx_

```diff
  return (
    <div ref={drop} className={classes.container}>
      <h4>{name}</h4>
-      {content.map((card) => (
+      {content.map((card, idx) => (

        <Card
          key={card.id}
+         ref={(ref) => (itemsRef.current[idx] = ref)}
          columnId={columnId}
          content={card} />
      ))}
    </div>
  );
```

Esto nos falla, ¿Por qué? Los _ref_ de primeras sólo los podemos usar en componentes primitivos, ¿Qué tenemos que hacer para usar un _ref_ en un componente _custom_? Los forwardRef, vamos a definirlo en el _card_ (añadimos un div más para nuevo ref*,* podríamos estudiar si podemos asignar más de un _ref_... _martillo fino_ :))):

_./src/kanban/components/card.component.tsx_

```diff
- export const Card: React.FC<Props> = (props) => {
+ export const Card = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { content, columnId } = props;

  const [{ opacity }, drag, preview] = useDrag(() => ({
    type: ItemTypes.CARD, // Definimos que es de tipo CARD esto lo usaremos en el drop
    item: createDragItemInfo(columnId, content),
    collect: (monitor) => ({
      // En esta función monitorizamos el estado del drag y cambiamos la opacidad del
      // card que está fijo (el elegido para el drag, para que el usuario se de cuenta)
      // de que item está arrastrando
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  }));

  return (
+   <div ref={ref}>
      <div ref={preview} className={classes.card}>
        <div ref={drag} className={classes.dragHandle} style={{ opacity }} />
        {content.title}
      </div>
+  </div>

  );
- };
+ });
```

Ya parece que lo tengo, vamos a implementar un método que teniendo en cuenta la coordenada X,Y del _drop_, me lo compare con las X,Y de las _card_ y si encuentra una que este en esa zona me devuelva el índice en el array de _cards_ (se podría hacer algo más fino y si cae en la mitad superior que del índice anterior y si es la mitad inferior que del índice siguiente... esto para la lista de _martillo fino_ :)).

Este método esta propio para añadirle pruebas unitarias y ver que funciona cómo esperamos y en diferentes casos arista...

_./src/kanban/components/column.business.ts_

```ts
import { XYCoord } from "react-dnd";

export const getArrayPositionBasedOnCoordinates = (
  cardDivElements: HTMLDivElement[],
  offset: XYCoord
) => {
  // Por defecto añadimos en la última
  let position = cardDivElements.length;

  // Iteramos por el objeto de refs
  cardDivElements.forEach((item, index) => {
    const cardDiv = item;
    const cardDivPosition = cardDiv.getBoundingClientRect();

    // Si una card está en la zona de drop le decimos que coloque la
    // nueva justo debajo
    // Esto se podría optimizar y para el bucle aquí
    if (offset.y > cardDivPosition.top && offset.y < cardDivPosition.bottom) {
      position = index + 1; // NextPosition
    }
  });

  return position;
};
```

Vamos ahora a por el componente:

_./src/kanban/components/column.component.tsx_

```diff
import React from "react";
import { useDrop } from "react-dnd";
import classes from "./column.component.css";
import { CardContent, ItemTypes, DragItemInfo } from "../model";
import { Card } from "./card.component";
import { KanbanContext } from "../providers/kanban.context";
+ import {getArrayPositionBasedOnCoordinates} from "./column.business";
```

Y vamos a sacar un console.log con la posición a ver qué tal funciona:

_./src/kanban/components/column.tsx_

```diff
export const Column: React.FC<Props> = (props) => {
  const { columnId, name, content } = props;
  const { moveCard } = React.useContext(KanbanContext);

  const [collectedProps, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: DragItemInfo, monitor) => {
+     console.log("** Card Index:",getArrayPositionBasedOnCoordinates(itemsRef.current, monitor.getClientOffset()));
      moveCard(columnId, item);

      return {
        name: `DropColumn`,
      };
    },
```

Vamos a probarlo:

```bash
npm start
```

- Vamos a eliminar el console.log, para ello vamos a añadir un parámetro más a _moveCard_.

_./src/kanban/components/column.tsx_

```diff
  const [collectedProps, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: DragItemInfo, monitor) => {
-      console.log(
-        "** Card Index:",
-        getArrayPositionBasedOnCoordinates(
-          rootRef.current,
-          monitor.getClientOffset()
-        )
-      );

+      const index = getArrayPositionBasedOnCoordinates(
+        itemsRef.current,
+        monitor.getClientOffset()
+      );
-      moveCard(columnId, item);
+      moveCard(columnId, index, item);

      return {
        name: `DropColumn`,
      };
```

Vamos a actualizar el _moveCard_ del context:

_./src/kanban/providers/kanban.context.ts_

```diff
export interface KanbanContextModel {
  kanbanContent: KanbanContent;
  setKanbanContent: (kanbanContent: KanbanContent) => void;
-  moveCard: (columnDestinationId: number, dragItemInfo: DragItemInfo) => void;
+  moveCard: (columnDestinationId: number, index : number, dragItemInfo: DragItemInfo) => void;

}
```

_./src/kanban/providers/kanban.provider.ts_

```diff
  const moveCard =
-    (columnDestinationId: number, dragItemInfo: DragItemInfo) => {
+    (columnDestinationId: number, index: number, dragItemInfo: DragItemInfo) => {

      const { columnId: columnOriginId, content } = dragItemInfo;

      setKanbanContent((kanbanContentLatest) =>
        moveCardColumn(
          {
            columnOriginId,
            columnDestinationId,
+           cardIndex: index,
            content,
          },
          kanbanContentLatest
        )
      );
    };
```

_./src/kanban/kanban.business.ts_

```diff
interface MoveInfo {
  columnOriginId : number;
  columnDestinationId: number;
+ cardIndex : number;
  content: CardContent;
}

export const moveCardColumn = (moveInfo : MoveInfo, kanbanContent : KanbanContent) : KanbanContent => {

```

_./src/kanban/kanban.business.ts_

```diff
-  const {columnOriginId, columnDestinationId, content} = moveInfo;
+  const {columnOriginId, columnDestinationId, content, cardIndex} = moveInfo;
//(...)
  if (columnIndexOrigin !== -1 && columnIndexDestination !== -1) {
      newKanbanContent = produce(kanbanContent, (draft) => {
        // remove
        draft.columns[columnIndexOrigin].content =
        kanbanContent.columns[columnIndexOrigin].content.filter(
            (c) => c.id !== content.id
          );
-        // add
-        draft.columns[columnIndexDestination].content.push(content);
+       // add at index
+       draft.columns[columnIndexDestination].content.splice(cardIndex, 0, content);
      });
  }
```

Vamos a arreglar las pruebas que se han roto (añadimos el parámetro para que pase e inserte al final, tendríamos que añadir más casos y probar inserciones):

_./src/kanban/kanban.business.spec.ts_

```diff
import { moveCardColumn } from "./kanban.business";
import { KanbanContent } from "./model";

describe("Kanban business", () => {
  it("should move card from one column to another", () => {
    const kanbanContent: KanbanContent = {
      columns: [
        {
          id: 1,
          name: "Column A",
          content: [
            {
              id: 1,
              title: "Card 1",
            },
            {
              id: 2,
              title: "Card 2",
            },
          ],
        },
        {
          id: 2,
          name: "Column B",
          content: [
            {
              id: 3,
              title: "Card 3",
            },
          ],
        },
      ],
    };

    const moveInfo = {
      columnOriginId: 1,
      columnDestinationId: 2,
+       cardIndex: 1,
      content: {
        id: 1,
        title: "Card 1",
      },
    };

    const newKanbanContent = moveCardColumn(moveInfo, kanbanContent);

    expect(newKanbanContent).toEqual({
      columns: [
        {
          id: 1,
          name: "Column A",
          content: [
            {
              id: 2,
              title: "Card 2",
            },
          ],
        },
        {
          id: 2,
          name: "Column B",
          content: [
            {
              id: 3,
              title: "Card 3",
            },
            {
              id: 1,
              title: "Card 1",
            },
          ],
        },
      ],
    });
  });

  it("should move card from first column to third column", () => {
    const kanbanContent: KanbanContent = {
      columns: [
        {
          id: 1,
          name: "Column A",
          content: [
            {
              id: 1,
              title: "Card 1",
            },
            {
              id: 2,
              title: "Card 2",
            },
          ],
        },
        {
          id: 2,
          name: "Column B",
          content: [
            {
              id: 3,
              title: "Card 3",
            },
          ],
        },
        {
          id: 3,
          name: "Column C",
          content: [
          ],
        },
      ],
    };

    const moveInfo = {
      columnOriginId: 1,
      columnDestinationId: 3,
      content: {
        id: 1,
+       cardIndex: 0,
        title: "Card 1",
      },
    };

    const newKanbanContent = moveCardColumn(moveInfo, kanbanContent);

    expect(newKanbanContent).toEqual({
      columns: [
        {
          id: 1,
          name: "Column A",
          content: [
            {
              id: 2,
              title: "Card 2",
            },
          ],
        },
        {
          id: 2,
          name: "Column B",
          content: [
            {
              id: 3,
              title: "Card 3",
            },
          ],
        },
        {
          id: 3,
          name: "Column C",
          content: [
            {
              id: 1,
              title: "Card 1",
            },
          ],
        },
      ],
    });
  });


  it("should return same state if destination does not exists", () => {
    const kanbanContent: KanbanContent = {
      columns: [
        {
          id: 1,
          name: "Column A",
          content: [
            {
              id: 1,
              title: "Card 1",
            },
            {
              id: 2,
              title: "Card 2",
            },
          ],
        },
      ],
    };

    const moveInfo = {
      columnOriginId: 1,
      columnDestinationId: 2,
+     cardIndex: 0,
      content: {
        id: 1,
        title: "Card 1",
      },
    };

    const newKanbanContent = moveCardColumn(moveInfo, kanbanContent);

    expect(newKanbanContent).toEqual(kanbanContent);
  });

  it("should return same state if origin does not exists", () => {
    const kanbanContent: KanbanContent = {
      columns: [
        {
          id: 1,
          name: "Column A",
          content: [
            {
              id: 1,
              title: "Card 1",
            },
            {
              id: 2,
              title: "Card 2",
            },
          ],
        },
      ],
    };

    const moveInfo = {
      columnOriginId: 2,
      columnDestinationId: 1,
+     cardIndex: 0,
      content: {
        id: 1,
        title: "Card 1",
      },
    };

    const newKanbanContent = moveCardColumn(moveInfo, kanbanContent);

    expect(newKanbanContent).toEqual(kanbanContent);
  });
});
```

✅ Pheeeew hemos sudado ¿Podemos hacer esto mejor?
