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

Y ahora definimos la entidad de _Kanban_ que de momento ponemos como
una lista de columnas.

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

- Y para terminar, es _KanbanContent_ será la entidad de punto de entrada
  que instanciemos en nuestro componente, así que mejor tener una función
  para instanciar un kanban vacío que sirva como punto de entrada seguro
  (creamos un factory), de esta manera nos ahorramos ir haciendo chequeos
  de campo nulo etc...

_./src/kanban/model.ts_

```diff
export interface KanbanContent {
  columns: Column[];
}

+ export const createDefaultKanbanContent = (): KanbanContent => ({
+  columns: [],
+ });
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

### Componentes

Vamos empezar a trabajar en el UI

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
import { loadKanbanContent } from "./kanban.api";
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

Es hora de probar que esto funciona (se tiene que ver un rectángulo grande
vacio)... parece poca cosa pero con menos código he metido fallos grandes :).

```bash
npm start
```

✅ Somos capaces de mostrar un contenedor vació...

Vamos a definir el componente de columnas:

- Vamos a por el estilado.
- En nuestro caso el componente columna va a recibir del contenedor el nombre de la misma y una lista de tareas (lo llamaremos content, aquí con el naming
  tendríamos mucha discusión, quizás un nombre más apropiado podría ser
  _cardContentCollection_).

Sobre el estilado:

- La columna va a ser otro contenedor flex.
- Para la prueba va a tener un ancho fijo (apuntar martillo fino para después
  si añadir media queries para poner un ancho relativo o por porcentajes).
- Le pondremos overflow por si hubiera más cards que espacio en la columna
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

- Hora de tocar el código, como en el contenedor, montamos el minimo, y
  simplemente mostramos el nombre de cada card para probar que tenemos
  un mínimo.

_./src/kanban/column/column.component.tsx_

```tsx
import React from "react";
import classes from "./column.component.css";
import { CardContent } from "./model";

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

- Ya nos falta tiempo para probarlo :), vamos a integrarlo en nuestro
  contenedor de Kanban:

_./src/kanban/kanban.container.tsx_

```diff
import React from "react";
import {
  KanbanContent,
  createDefaultKanbanContent,
  CardContent,
} from "./model";
import { loadKanbanContent } from "./container.api";
+ import { Column } from "./column.component";
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

Esto empieza a tener buena pinta, ahora vamos a por el componente de card:

En cuanto estilado vamos a definir:

- Una clase para estilar el card (ancho, borde...).
- Una clase para estilar el handler sobre el que se hará drag
  (podríamos haber elegido poder hacer drag en toda la card, pero mejor
  delimitarlo a un área).

El diseño es mínimo, más adelante habría que aplicar _martillo fino_ para
dejar una card con aspecto profesional.

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
+ import {Card} from './card.component';
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

- A ver que tal sale :)

```bash
npm start
```

- Ya tenemos nuestro tablero montado, es hora de ver como va quedando
  nuestra carpeta _kanban_ parece que hay muchos ficheros, sería buena idea
  organizar un poco, vamos a crear dos carpetas:
- _components_: donde meteremos los componentes que no son contenedores.
- _api_: donde meteremos los ficheros que se encargan de la comunicación
  con el backend (que en este caso son mock).

Vamos a crear un barrel para cada una de ellas:

_./src/kanban/components/index.ts_

```ts
export * from "./card.component";
export * from "./column.component";
```

_./src/kanban/api/index.ts_

```ts
export * from "./kanban.api";
```

Y arreglamos los imports de:

- api
- components
- kanban.container

### Drag & Drop

Es hora de ir a por el _cogollo_ de la demo, vamos a implementar la funcionalidad
de drag and drop entre columnas.

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

- Siguiente paso, tenemos que definir que tipos de items vamos a habilitar para arrastrar:
  - En este caso añadimos sólo las cards (a futuro podríamos también dar la opción de arrastrar columnas).
  - La definición de _itemTypes_ la vamos a colocar debajo de _kanban_, si fueramos a usarlo a nivel de
    aplicación global y kanban estuviera dentro de un panel de la ventana podríamos pensar en promocionar
    _ItemTypes_ a un nivel superior (de nuevo, martillo fino, igual con el drag and drop, ¿Lo dejamos
    a nivel de contenedor de kanban?).

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

- Siguiente paso, vamos a definir la acción de drag en el componente de card, para ello:
  - Hacemos uso del hook _useDrag_ de _react-dnd_.
  - Esto nos devuelve un array con tres entradas:
    - Item 0: aquí recibimos una serie de propiedades que nos ayudan a definir el comportamiento del drag.
    - Item 1: un ref del objeto que queremos arrastrar (en este caso la card)
    - Item 2: un ref del objeto que vamos a usar para poner como preview cuando arrastremos (aquí
      podemos también cambiar y usar una imagen).
  - Las ref las tenemos que asociar:
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

- Nos queda sólo un detalle, vamos a mostrar el card con una opacidad para marcar que es el elemento que se
  está arrastrando.

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

- De momento parece que todo va genial :), ahora toca el drop, de primeras podría parece algo fácil,
  vamos a partir por la opción más lógica definir las diferentes columnas (backlog, doing, done) cómo áreas de drop
  (después volveremos sobre esto), de primeras sólo ponemos un console.log para ver que llega el evento de drop.

Cómo funciona este _useDrop_:

- Nos devuelve un array con dos entradas:
  - Item 0: aquí recibimos una serie de propiedades que nos ayudan a definir el comportamiento del drop.
  - Item 1: un ref del objeto que queremos que sea el área de drop (en este caso la columna)
- Las ref las tenemos que asociar:
  - Al componente que queremos que sea el área de drop.

Dentro del _useDrop_ definimos un objeto con las siguientes entradas:

- accept: aquí definimos que tipo de items vamos a aceptar, en este caso sólo las cards.
- drop: aquí definimos la acción que vamos a realizar cuando se produzca el drop, en este caso sólo
  vamos a mostrar un mensaje, fijate que en esta funcion devolvemos información acerca de donde se
  ha soltado el item, esta info la recibe el EndDrag.

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
+  }));

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

- Si probamos y vemos la consola vemos que se ejecuta tanto el drop como el drag... seguimos en racha :),
  ahora toca que se realiza la operación "de verdad".

- En teoría añadir la card a la columna destino es sencillo, en el drop tenemos el punto de entrada y el
  item, que vamos a hacer:

  - El componente column no tiene el estado de las listas, sólo ve el contenido de su card.
  - Creamos una prop de tipo callback para informar al componente de tipo kanba container.
  - El kanban container se encarga de actualizar la lista y ya la información fluye hacia abajo.

Varios detalles aquí:

- Empezamos a sufrir de "drill prop" subiendo y bajando datos y callbacks por las props, empieza a
  oler a que usar un contexto podría ser de ayuda (otro TODO para la lista de "martillo fino") y este
  es el momento en que te pueden preguntar _¿Pero si funciona para que lo vas a tocar? tampoco está tan mal..._ ese es el problema que si empezamos así y sumamos un montón de _tampoco está tan mal_ acabamos con un _esto está muy mal y no hay quien lo mantenga_, así que más adelante evaluaremos si centralizar en un contexto a aporta o no.

- De momento vamos a añadir la card al final de la lista, si has usado herramientas como trello te habrás
  dado cuenta de que cuando haces drop te inserta la tarjeta entre las tarjetas en las que lo hayas soltado,
  esto, apuntado para el TODO de "martillo fino", y lo resolveremos más adelante (este es de los "detalles"
  que nos va a llevar bastante trabajo de arreglar).

  Empezamos por el componente column (zona de drop), añadimos una propiedad de tipo callback para informar al componente padre que se ha producido el drop, y la ejecutamos en el _useDrop_.

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

- Vamos a implementar el handler en el kanban container.

En esta caso tenemos que insertar un card en la lista que toque, tenemos que hacerlo de forma
inmutable para asegurarnos que todo se actualiza correctamente, no nos vale un _push_, podemos
por ejemplo usar el spread operator para crear una nueva lista con el nuevo card, pero como vamos
a tener que manejar inmutabilidad en varios sitios, vamos a hacer uso de _immer_ una librería que
nos permita trabajar de manera mutable en una _caja de arena_ y después lo convierte todo a inmutable.

- Instalamos la librería:

```bash
npm install immer --save
```

_./src/kanban/kanban.container.tsx_

```diff
import React from "react";
import {
  KanbanContent,
  createDefaultKanbanContent,
+  CardContent,
} from "./model";
import { loadKanbanContent } from "./api";
import { Column } from "./components";
import classes from "./kanban.container.css";
+ import produce from "immer";
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
+               onAddCard={handleAddCard} />
        />
      ))}
    </div>
```

Hasta aquí bien, nos hace falta saber la columna en la que tenemos que hacer el drop, aquí podíamos ver
si el card le informa de la columna, peeerooo... esa información ya la tenemos, si te fijas en el propio
kanban container cuando le pasamos las card en el map del componente _column_ ya sabemos a que columna
pertenece, ¿Qué podemos hacer? utilizar curry.

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

- ¡ Bueeeenoooo ! Este es el momento en el que te vienes arriba y piensas que esto de drag & drop
  es pan comido... vamos a empezar a meternos en el fango.

- Añadimos una tarjeta a la columna destino, pero necesitamos eliminarla de la columna origen,
  Podemos seguir dos aproximaciones:

  - En la card tenemos un evento "end" del drag en el que podemos comprobar que todo ha ido bien
    y eliminar la tarjeta de la columna origen.

  - En la columna destino podríamos en el AddCard del container hacer las dos operaciones: borrar la
    antigua de la columna que toque y añadir la nueva.

¿Qué opcíon tomarías? ... esta decisión tan inocente vamos a ver que nos va a llevar a más de un quebradero
de cabeza :).

Vamos a arrancar por la primera, tenemos dos puntos de entrada:

- El evento "end" del drag, donde eliminamos la card antigua.
- El evento "drop" del drop, donde la añadimos a la columna que toque.

El drop ya lo tenemos implementados, vamos a por el end drag, en principio podría ser algo así como

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

Y vamos a burbujear esto hacía la columna y hacía el container (esto ya empieza a oler a contexto :),
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
+  const { name, content, onAddCard, onRemoveCard  } = props;
```

_./src/kanban/components/column.component.tsx_

```diff
  return (
    <div ref={drop} className={classes.container}>
      <h4>{name}</h4>
      {content.map((card) => (
        <Card key={card.id}
              content={card}
+             onRemoveCard={onRemoveCard} />
              />
      ))}
    </div>
  );
```

Vámonos al kanban container y vamos a implementar el remove card, vamos a currificar el id de la columna
¿Me decís vosotros como funcionaría?

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

- Si nos paramos este código empieza a oler a que hace falta un refactor, empezamos a tener un _bombazo_
  de código en el componente, pero bueno vamos a probar y ver nuestro drag & drop en acción:

```bash
npm start
```

En este momento nos entra el modo pánico... ¡ Esto ha dejado de funcionar y tiene un comportamiento caotico !
Prueba a arrastrar y soltar tarjetas y ver que pasa:

- La primera vez que arrastras una tarjeta, desaparece de la columna origen y no aparece en la destino.
- La segunda vez que arrastras una tarjeta, aparece la anterior en la columna origen y no aparece en la
  de destino :).

Esto es un indicador de que nuestro código se está convirtiendo en una _castaña_ empieza a alcanzar
el status de _spaghetti code_ y que es hora de refactorizar.

Lo primero vamos a investigar porque pasa esto, os dejo un tiempo para que lo investiguéis, y me digáis
que puede ser (iré dando pistas).

**_ESPERA 10/15 MINUTOS INVESTIGACION_**

Pistas:

- Estamos tratando con un callback, que puede pasar con el estado si no tenemos cuidado.
- Comenta la linea en la que se borra.

**_SOLUCION_**

Lo que está pasando aquí es que al hacer un setState en el callback estamos tirando del valor antiguo
que tenía la función (¿os acordáis del ejemplo de async closure?), entonces cuando hacemos un setState
lo estamos haciendo con los valores de la columna antigua antes de hacer el drop (primero se ejecuta el
drop después el end drag), de ahí el glitch que tenemos.

Vamos primero a poner un parche para que funcione, y luego toca pararse y refactorizar antes de que
esto se nos vaya de las manos.

La solución es tocar en una sola línea de código, en el setState del callback, vamos a pasarle una función
en vez del nuevo valor, en está función se nos alimenta el último estado, no el que se quedó colgado en el
closure:

```diff
    if (columnIndex !== -1) {
-      setKanbanContent(
+      setKanbanContent((kanbanContentLatest) =>
-        produce(kanbanContentLatest, (draft) => {
+        produce(kanbanContentLatest, (draft) => {
-          draft.columns[columnIndex].content = kanbanContent.columns[
+          draft.columns[columnIndex].content = kanbanContentLatest.columns[
            columnIndex
          ].content.filter((c) => c.id !== card.id);
        })
      );
    }
```

- Vale con esto las cosas vuelven a funcionar, pero nos deja mal sabor de boca:
  - El código que se ha quedado es un galimatias.
  - Partimos de que controlamos el orden, primero drop después end drag (tendríamos que añadir lo mismo
    en el EndDrag).
  - Tenemos riesgo de introducir más condiciones de carrera.
  - Todavía no hemos empezado a _rascar casos arista_, por ejemplo:
    - Que pasa si arrastro y suelto una card en la misma columna.
    - Que pasa si quiero insertar una card siguiendo un orden.
    - ...

Ahora mismo toca parar y refactorizar, que un código funcione no quiere decir que sea una solución aceptable,
vamos a plantear este escenario, podemos pensar en varias aproximaciones:

- Una podría ser utilizar useReducer, tener el estado en el reducer y las acciones ADDCard y RemoveCard,
  de esta manera sacamos estado fuera y nos quitamos el problema del closure hell. Este caso podría ser útil si
  la zona de drag y la de drop no se hablaran, pero en este caso tenemos un container comun.

- La segunda es dejar que el drop se encarga de todo, de esta manera:
  - Tenemos un único punto de entrada (no hay condiciones de carrera).
  - Simplificamos código (al menos la parte de drag y el burbujeo hacia arriba).

De momento vamos a por la segunda opción, dejando al puerta a utilizar useReducer a futuro (por ejemplo
se complica la cosa y ahora queremos distinguir entre drag y eliminar y drag y copiar, etc...)

Qué solución podemos darle:

- En vez de AddCard vamos a llamar a este evento MoveCard (tienen más sentido, a futuro seguramente pongamos
  un AddCard para crear una tarjeta en blanco).

- Se va originar en el columnDrop, y la información que va a tener va a ser:

  - Columna Origen.
  - Item.

- La columna destino la podemos seguir sacando con el curry (también podríamos plantearnos pasarla para abajo).

Esto origina un evento en el que se burbujea al contenedor esta información y se hace todo de una tacada,
eliminar el elemento y añadir el nuevo.

Que es lo positivo de esto... que además de quedarnos el código más claro, resolvemos el caso arista de arrastro
y suelto en la misma columna.

¡ Manos a la obra !

- Lo primero vamos a añadir a la estructura del drag el column Id al que pertenece la tarjeta (podríamos
  iterar por las mismas, pero si ya sabemos de partida la columna origen, nos ahorramos ese paso)

_./src/kanban/model.ts_

```diff
export const createDefaultKanbanContent = (): KanbanContent => ({
  columns: [],
});

+ interface DragItemInfo {
+   columnId: number;
+   content: CardContent;
+ }

+ export const createDragItemInfo = (columnId: number, content: CardContent): DragItemInfo => ({
+  columnId,
+  content,
+ });
```

- En el container vamos a pasar el columnId para que lo recoja la card:

_./src/kanban/kanbanContainer.tsx_

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

> ¿Es buena idea pasar el columnId de forma separada? ¿ Deberíamos pasar el card? ¿Y si creamos
> una entidad VM para pasar el card con el valor del columnId (de hecho seguramente en servidor
> tendríamos el id de la columna a la que pertenece cada card)? Si almacenamos el columnId en el card
> también podríamos tener un sólo array de cards... todas estas opciones tienen sus pros y sus contras,
> en este caso vamos a pasar el columnId de forma separada.

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
-  const [{ opacity }, drag, preview] = useDrag(() => ({
+  const [{ opacity }, drag, preview] = useDrag(() => ({
    type: ItemTypes.CARD, // Definimos que es de tipo CARD esto lo usaremos en el drop
-    item: content,
+    item: createDragItemInfo(columnId,content),
```

Eliminamos la parte del drop:

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

Y vamos a gestionar el bubble up desde la columna:

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
+          onMoveCard={onMoveCard}
        />
      ))}
    </div>
  );
```

Y vamos a realizar los cambios en el container:

_./src/kanban/kanban.container.tsx_

```diff

```

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

- Bueno ya lo tenemos algo más estable, nos queda un último escollo que es en vez de añadir la carta al final
  siempre que hacemos drop, que la inserte en medio si la soltamos en mitad de la columna, esto no va a ser fácil
  ya que tenemos que calcular la posición en la que cae la card y ver sobre que card destino se ha posado y calcular el indice del array...

Antes de empezar con esto vamos a hacer limpia de código, que pasos vamos a tomar:

- Simplificar los componentes (_vaciar el cangrejo_).
- Evitar el prop drill hell usando Contexto useReducer.

### Simplificar los componentes

Lo primero, vamos a _vaciar el cangrejo_ tenemos componentes con mucho código, podemos:

- Extraer parte del código a lógica de negocios (le podemos añadir tests).
- Podemos sacarlo a custom hooks (aquí le podríamos añadir tests, o esperar a ver si el tema
  de insertar en medio impacta mucho en el código).

Vamos a ir evaluando componentes, empezamos por el kanban container:

- La parte en la que creamos el kanbanContent y hacemos la carga inicial la podíamos envolver
  en un custom hook.

- El HandleMoveCard tiene logica que se puede pasar a funciones de negocio sin estado que sean
  fácilmente testeables.

- Creamos el custom hook (lo vamos a dejar dentro del fichero del container, pero lo podríamos sacar a un fichero aparte):

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
-  const [kanbanContent, setKanbanContent] = React.useState<KanbanContent>(
-    createDefaultKanbanContent()
-  );
-
-  React.useEffect(() => {
-    loadKanbanContent().then((content) => setKanbanContent(content));
-  }, []);
```

- Vamos a extraer la lógica de búsqueda de columna, añadir y eliminar card a un método de negocio, de primeras
  en bruto (aquí sería buena idea añadir tests para ver que funciona como esperamos), vamos a ponerlo tal cual
  y después lo optimizamos.

_./src/kanban.business.ts_

```ts
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

- Antes de seguir refactorizando vamos a añadir unas pruebas para ver si esto pinta bien
  (podíamos haberlo hecho siguiendo TDD)

Arrancamos en modo test en otro terminal:

```bash
npm run test:watch
```

_./src/kanban.business.spec.ts_

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

El fichero business podríamos dejarlo más simple, iremos a por él más tarde (otro item para la lista de
_martillo fino_)

Ahora que funciona vamos a hacer el refactor en el container:

_./src/kanban/kanban.container.tsx_

```diff
import React from "react";
import {
  KanbanContent,
  createDefaultKanbanContent,
  CardContent,
  DragItemInfo,
} from "./model";
import { loadKanbanContent } from "./api";
import { Column } from "./components";
import classes from "./kanban.container.css";
import produce from "immer";
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

- No está mal como se ha quedado, a futuro si el tema de drag & drop crece (se añade más funcionalidad),
  podríamos plantearnos encapsularla todo en un hook.

- Vamos ahora a por la columna:
  - Este componente tal y como esta no haría falta refactorizarlo.
  - Si empieza a llenarse de código, podríamos plantearnos sacar la funcionalidad de drop a u custom
    hook que podría llamarse _useCardDrop_ y le pasamos por parametro el callback de onMoveCard y pasamos
    como return del hook el ref que hay que poner en el elemento que queremos que sea dropable.

De momento no lo vamos a hacer, aquí tenemos una regla y es la de "recojo carrete":

- Vamos haciendo refactors hasta que el código se vea limpio y entendible.
- Esperamos que hayan cambios a futuro que puede que hagan más complejo ese código, entonces refactorizamos.
- A veces me puedo pasar refactorizando, en ese caso hago como alguien que practica la pesca "recojo carrete"
  y tiro a la versión anterior.

Vamos a por la card:

- En card pasa algo parecido, podríamos extraer el drag en un hook, pero en principio no lo vamos a hacer
  ya que el componente de momento es simple.
- Podría ser buena idea extraerlo para implementar pruebas unitarias del hook en concreto.

### Pasar a contexto o useReducer

Aunque hemos hecho limpia, seguimos teniendo un código un poco lioso:

- Hay propiedades que viajan de container a card.
- Hay callbacks que viajan de card a container.

Esto es complicado de seguir, además que en el container tenemos mucho estado metido y lógica
de actualización metida, podríamos plantear:

- Almacenar en un contexto el estado de las columnas/cards y exponerlo a nivel de container con un provider.
- Utilizar useReducer a nivel de container y pasar el dispatch, creando una acción para la carga inicial
  y otra para la actualización de la posición de la card.

Ambas opciones tienen sus pros y su contras:

- El contexto es interesante, pero metemos getContext por mitad de la jerarquía.
- El Reducer añade mucho orden pero tenemos que ir pasando dispatch de padre a hijo aunque un
  componente de la jerarquía no lo use.

En este caso nos vamos a quedar con la solución del contexto:

- Vamos a definir el contexto del kanban:

_./src/kanban/provider/kanban.context.tsx_

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

_./src/kanban/provider/kanban.provider.tsx_

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

- Vamos a colocar el context en el app donde se instancia el kanban, así
  cuando si creamos más de un kanban no compartiran estado (también, podríamos
  haber creado un componente wrapper dentro de la carpeta kanban).

_./src/kanban/index.ts_

```diff
export * from "./kanban.container";
+ export * from "./providers/kanban.provider";
```

_./src/app.tsx_

```diff
import React from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
- import { KanbanContainer } from "./kanban";
+ import { KanbanContainer, KanbanProvider } from "./kanban";


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

- Vamos a hacer limpia de _kanban.container_ y añadir nuestro contexto
  (vemos que lo dejamos todo funcionando y después empezaremos a quitar
  propiedades en los columns y cards para tirar de contexto).

_./src/kanban/kanban.container.tsx_

```diff
import React from "react";
import {
  KanbanContent,
-  createDefaultKanbanContent,
-  CardContent,
-  DragItemInfo,
} from "./model";
import { loadKanbanContent } from "./api";
import { Column } from "./components";
import classes from "./kanban.container.css";
- import produce from "immer";
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
      const { columnId: columnOriginId, content } = dragItemInfo;

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

- Primer paso del refactor dado, ahora vamos a quitar drill prop de la column
  y la card (podríamos eliminar más propiedades y añadir helpers en el contexto,
  ¿Merece la pena? ¿Qué opinas?).

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

- En la card no tenemos callback drill props.

De momento nos quedamos así con el refactor, vamos a hacer una prueba
rápida y ver que todo sigue funcionando.

¿Qué hemos ganado?

- Simplificado drill prop.
- Separador contenedor de estado.
- Eliminado curry al asignar el callback de move column.

### Insertar cards

Hasta ahora hemos estado haciendo drops de las cartas al final de la columna,
pero cuando yo arrastro y suelto normalmente quiero intercalar la card en una
posición determinada.

Para esto podemos optar por dos aproximaciones:

- Cuando hago drop, itero por los _divs_ de cada card y veo donde cae el
  la coordenada drop con respecto a mi card y con eso calculo el indice para
  insertar.

- Otra opción es que las cards se conviertan en areas de drop y añada una card vacía
  oculta que ocupe el resto de la columna.

La segunda opción parece un poco "hack", pero en teoría podría ser la que menos
quebraderos de cabeza podría dar (te animo a que pruebes a implementarla).

Pero... ¿Por qué la primera opción nos va a dar guerra?

- Nuestra area de drop es la columna.
- A priori ReactDnd no sabe que coordenada tiene cada card en esa columna destino.
- Tenemos que buscar una forma de calcularla... aquí podríamos pensar: usamos ref :)... bien pero no tenemos un card, tenemos un array de cards, nos haría falta un
  ref por cada card, es decir un array de refs, y además estas ref son dinámicas,
  puedo añadir y quitar cards de una columna.

¿Cómo podemos hacer esto?

- Vamos a crear un registro de refs (uno por cada card de la columna), usamos
  este registro en vez de un array para evitar problemas si se borran keys etc.

- Este registro de refs lo vamos a recalcular si cambia el array de cards de la columna, para esto usamos useMemo (si el layout de las columnas fuera flexible y
  pudiera redimensionarse tendríamos que o bien quitar el useMemo o bien combinarlo
  con los saltos de las media queries).

- El registro de refs lo enlazo con el listado de Cards.

- Vamos a empezar por definir el tipo de registro de refs.

_./src/kanban/components/column.component.tsx_

```diff
interface Props {
  name: string;
  content: CardContent[];
  onAddCard: (card: CardContent, index: number) => void;
  onRemoveCard: (cardContent: CardContent) => void;
}

+ type CardDivKeyValue = {
+  [key: string]: React.MutableRefObject<HTMLDivElement>;
+ };
```

Vamos a crear la lista de refs que se asociaran al repintar el componente.

_./src/kanban/components/column.tsx_

```diff
+  const itemsRef = React.useMemo(() => {
+    const newItemsRef = content.reduce<CardDivKeyValue>(
+      (cardRefs, item) => ({
+        ...cardRefs,
+        [item.id]: React.createRef(),
+      }),
+      {}
+    );
+    return newItemsRef;
+  }, [props.content]);

  return (
```

- Y ahora vamos a asociar cada ref a cada card (para el nombre de la propiedad
  accedo por el operador de array).

_./src/kanban/components/column.tsx_

```diff
  return (
    <div ref={drop} className={classes.container}>
      <h4>{name}</h4>
      {content.map((card) => (
        <Card
          key={card.id}
+         ref={itemsRef[card.id]}
          columnId={columnId}
          content={card} />
      ))}
    </div>
  );
```

Esto nos falla, ¿Por qué? Los ref de primeras sólo los podemos usar
en componentes primitivos, ¿Qué tenemos que hacer para usar un ref en
un componente custom? Los _forwardRef_, vamos a definirlo en el card
(añadimos un div más para nuevo ref, podríamos estudiar si podemos asignar
más de un ref... martillo fino :))):

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

Ya parece que lo tengo, vamos a implementar un método que teniendo en cuenta
la coordenada X,Y del drop, me lo compare con las X,Y de las card y si encuentra
una que este en esa zona me devuelva el indice en el array de cards (se podría
hacer algo más fino y si cae en la mitad superior que de el indice anterior y si
es la mitad inferior que de el indice siguiente... esto para la lista de martillo fino :)).

Este método esta propio para añadirle pruebas unitarias y ver que funciona
como esperamos y en diferentes casos arista...

_./src/kanban/components/column.business.ts_

```ts
import { XYCoord } from "react-dnd";

// Movemos el type tb
export type CardDivKeyValue = {
  [key: string]: React.MutableRefObject<HTMLDivElement>;
};

export const getArrayPositionBasedOnCoordinates = (
  cardDivElements: CardDivKeyValue,
  offset: XYCoord
) => {
  // Por defecto añadimos en la última
  let position = Object.keys(cardDivElements).length;

  // Iteramos por el objeto de refs
  Object.keys(cardDivElements).forEach((key, index) => {
    const cardDiv = cardDivElements[key];
    const cardDivPosition = cardDiv.current.getBoundingClientRect();

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

_./src/kanban/components/column.tsx_

```diff
import React from "react";
import { useDrop } from "react-dnd";
import classes from "./column.component.css";
import { CardContent, ItemTypes, DragItemInfo } from "../model";
import { Card } from "./card.component";
import { KanbanContext } from "../providers/kanban.context";
+ import {CardDivKeyValue, getArrayPositionBasedOnCoordinates} from "./column.business";
```

Y vamos a sacar un console.log con la posición a ver que tal funciona:

_./src/kanban/components/column.tsx_

```diff
- type CardDivKeyValue = {
-  [key: string]: React.MutableRefObject<HTMLDivElement>;
- };

export const Column: React.FC<Props> = (props) => {
  const { columnId, name, content } = props;
  const { moveCard } = React.useContext(KanbanContext);

  const [collectedProps, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: DragItemInfo, monitor) => {
+     console.log("** Card Index:",getArrayPositionBasedOnCoordinates(itemsRef, monitor.getClientOffset()));
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

- Parece que va bien pero conforme vamos añadiendo y soltando elementos
  de repente pega un castañazo la aplicación, tenemos:

```
Uncaught TypeError: Cannot read properties of null (reading 'getBoundingClientRect')
```

- En este caso si nos ponemos a depurar (para que fuera más fácil podríamos
  poner un console.log con los elementos de la lista de cards en cada drop y ver
  que se quedan los antiguos), ¿Qué podemos hacer? Crearnos un _useRef_ raíz
  para que no se quede el closure con los elementos antiguos cuando se llama
  desde el callback del drop:

_./src/kanban/components/column.tsx_

```diff
+  const rootRef = React.useRef<CardDivKeyValue>(null);

  const [collectedProps, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: DragItemInfo, monitor) => {
      console.log(
        "** Card Index:",
-        getArrayPositionBasedOnCoordinates(itemsRef, monitor.getClientOffset())
+        getArrayPositionBasedOnCoordinates(rootRef.current, monitor.getClientOffset())

      );

      moveCard(columnId, item);

      return {
        name: `DropColumn`,
      };
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const itemsRef = React.useMemo(() => {
    const newItemsRef = content.reduce<CardDivKeyValue>(
      (cardRefs, item) => ({
        ...cardRefs,
        [item.id]: React.createRef(),
      }),
      {}
    );

+    rootRef.current = newItemsRef;

    return newItemsRef;
  }, [props.content]);
```

y en el render

_./src/kanban/components/column.tsx_

```diff
  return (
    <div ref={drop} className={classes.container}>
      <h4>{name}</h4>
      {content.map((card) => (
        <Card
-          ref={itemsRef[card.id]}
+          ref={rootRef.current[card.id]}
          key={card.id}
          columnId={columnId}
          content={card}
        />
      ))}
    </div>
  );
};
```

- Ahora que parece que se porta vamos a aplicar esto a los cards
  y eliminar el console.log, para ello vamos a añadir un parámetro
  más a moveCard.

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

+      const index = getArrayPositionBasedOnCoordinates(rootRef.current, monitor.getClientOffset());
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

Vamos a arreglar las pruebas que se han roto (añadimos el parametro
para que pase e inserte al final, tendríamos que añadir más
casos y probar inserciones):

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
