# 00 Board

Parte de desarrollar una aplicación es ver como afrontar problemas con cierto grade complejidad.

Vamos a poner en pausa el hacer ejemplos pequeños, y meternos a simular que resolver un problema con cierto grado de complejidad (lo simplificaremos en parte para evitar que que quepa en el marco de tiempo del curso).

Que vamos a practicar:

- Como afrontar un desafió nuevo.
- Como elegir librerías.
- Cómo no reventar tu proyecto e ir avanzando por spikes.
- Cómo terminar con una base de código mantenible.

## Punto de partida

Este ejemplo toma como punto de partida el ejemplo _00-boilerplate_, copiatelo a una carpeta y haz `npm install` y `npm run dev`.

¿Qué nos piden?

Quieren que construyamos un tablero Kanban, y que me permita hacer drag and drop de cards de una columna a otra.

Este problema tiene un punto caliente: la funcionalidad de drag and drop que traen los navegadores son castañas pilongas con bugs y además limitadas, así que tendremos que elegir bien que librería usar.

Además de esto nos encontraremos con el dilema de si hacerlo genérico o empezar por algo específico.

Igual puedes pensar... ¿Oye esto del Drag & Drop lo voy a usar en otros proyectos? Si trabajas en una organización grande, es muy probable que más de un producto lo use.

Y más allá del drag and drop, vamos a ver que criterios podemos seguir para elegir una librería.

## Elegir librería

Hemos comentado que ir con Drag and Drop a bajo nivel con las APIs del navegador es un infierno:

- Las APIs nativas puedes comportarse de forma distina en diferentes navegadores.

- Complejidad y verbosidad: las APIs nativas son bastante verbosas y requieren muchos eventos y configuraciones manuales.

- Los eventos como `dragstart`, `dragend`, `dragover`, `drop` pueden ser complicados de manejar, especialmente cuando intentas gestioanr efectos visuales y actualizaciones en la interfaz de usuario.

- Las APIs nativas además tienen limitaciones, para ciertos casos no llegan (por ejemplo, reordenación de listas, o clonacíon de elementos arrastrados).

Así que bueno, salvo que queramos crear nuestra librería por gusto (ojo por gusto no suele ser... que lo pague el cliente y aceptar el desvío en tiempo :D), vamos a ver si alguien ha liberado una librería popular que nos puede ahorrar meses de desarrollo.

En React tenemos varias librería que nos pueden ayudar, las más populares:

- React Draggable.
- React DnD.
- React Beautiful DnD.
- Pragamatic Drag And Drop.

### Primera batida rápida

Bueno empezamos con lío, ¿Cual elegimos? Vamos a ver que factores nos pueden ayudar a tomar la decisión:

Primero, mira lo que se usa en "casa", igual en tu organización tenéis una librería como estándar y en varios proyectos la tienen integrada, esto puede ser un punto importante pero ¡ OJO ! no tiene porque ser determinante ¿Por qué? - Las librerías de tercero se pueden quedar obsoletas. - Se pueden quedar sin soporte. - Pueden no cubrir todas las necesidades.

Así que punto importante aquí... preguntas:

- ¿Qué necesito?
- ¿Desde cuando usáis esta librería?
- ¿Funciona bien con la versión de React que estamos usando?
- ¿Cómo la usáis? ¿Se adapta a mis casos?

Seguimos, otro tema importante es la licencia del proyecto, ¿Es licencia MIT? Aquí nos podemos encontrar con un problema si esa librería tiene una licencia restrictiva (podría ser que no permitiera el uso comercial o que tuviéramos que publicar nuestro código fuente como open source)

Uno obvio (y ojo tampoco determinante) es el número de estrellas que tiene el proyecto, un proyecto con un buen número de estrellas suele querer decir que es un proyecto que lo ha usado bastante gente y en el que seguramente encontraremos bastante ayuda en _StackOverflow_.

También es importante ver el flujo de descargas de la librería, para eso podemos irnos a _npm trends_, aquí sacamos una gráfica de descargas (por cierto muy divertido ver el bajón de descargas en el periodo navideño), y podemos estudiar cual es la que más descargas tienes y cómo evoluciona a lo largo del tiempo (que no quiere decir que sea la mejor...)

Otro factor importante ¿Cómo de actualizado está el proyecto? Vamos a ver cuándo se hizo la última _release_ y cómo de actualizado está el repositorio, ya que igual en su día fue muy popular, pero ahora se encuentra abandonado (igual no es compatible con la última versión de React, o tiene fallos de seguridad que no se han corregido...).

Seguimos para bingo ¿Quién ha desarrollado la librería?

- Si es un autor de otras librerías de renombre podemos esperar que la librería tenga cierta calidad.

- Si pertenece a un grupo de autores y además cuenta con un buen _sponsorship_, podemos esperar que la librería tenga su mantenimiento.

- Si es de una empresa (_Facebook_, _Microsoft_, _Google_, _Air Bnb_) podemos esperar un código supuestamente de calidad, y en cuanto a mantenimiento depende, puede que mientras le haga falta tenga una evolución perfecta, en cuanto no, puede entrar en vía muerta.

Otra cosa poco reconocida en nuestro trabajo es estar al día en el "salseo del desarrollo", si sigues en twitter / youtube a ciertos desarrolladores / streamers (de los serios), te puedes ir enterando de que novedades van entrando en el mundo del desarrollo y como otras van muriendo, ... esto es fundamental, y es una pena que no se suela reconocer como parte de tu jornada laboral.

También le puedes pregunar a la IA de turno, pero ojo, hay mucho riesgo de que te de recomendaciones que puedan estar obsoletas, que pasa si le preguntamos a por ejemplo chat GPT.... ¿Esto es lo que dice la IA? Perfe... es una opinión más vamos seguir con nuestro análisis y ver si el robot tenía razón :).

### Vamos a entrar en más detalle

Ahora que tenemos una idea de lo que hay, sigamos con nuestro ejercicio de análisis.

- Toca ponernos con el readme y ver que ofrece, igual nos encontramos de primeras que el proyecto ya no tiene mantenimiento oficial.

- Seguimos con temas técnicos, evaluar que funcionalidad ofrece, y que queremos implementar.

- Es importante ver que material de aprendizaje tiene:

  - Documentación.
  - Video tutoriales.
  - Posts de terceros.
  - ...

- Otro tema a tener en cuenta es hacer un audit de la librería y ver si tiene dependencias anticuadas etc...

- Esto nos puede servir para descartar alguna opción, el último paso es construir una prueba de concepto con los desafíos más comunes que necesitamos para probarlo, es importante pedir tiempo en un sprint para hacer un _spike_ ya que una decisión errónea puede tener un coste a largo plazo muy alto.

Vamos a ponernos manos a la obra evaluando las librerías que hemos visto antes:

- **React Draggable (react-draggable):**

  - Licencia MIT

  - El proyecto tiene 8800 estrellas

  - El autor y grupo son los creadores de _React Grid Layout_.

  - El sistema de _releases_ no tiene _tags_ (en la página de git dicen que no sacan desde 2016, pero mirando changelog.md (en rel repo) en
    septiembre de 2023 se sacó la 4.4.6, también puedes verlo en bundlephobia)

  - En el _readme_ no hablan de compatibilidad con React 18 (aunque en el change log si han hecho algo).

  - No suben de versión major desde 2019.

  - No cuenta con página de documentación, solo el readme.md principal.

  - Vamos a npm trends y ponemos últimos 5 años y vemos que tuvo su pico de descargas en 2022 y ahora va en caída libre.

La impresión que da es que fue un proyecto popular, tiene una solución simple, pero esta mantenido a mínimos.

- **React DND:**

  - Licencia MIT

  - 20.6K estrellas

  - Tiene página de documentación oficial

  - La última release fue el 5 de abril de 22 (la versión 16)

  - El proyecto parece que no tiene mucho movimieto si te fijas pocas actualizaciones en el repo.

  - Su proyecto principal es _React DND_

  - En el readme no se indica que el proyecto esté discontinuado

  - Mirando la documentación tiene implementación con _hooks_

  - El proyecto está escrito con _TypeScript_

  - Si miramos en npm trends (unimos a la grafica anterior), es una librería que va en subida (ojo esto podrá llevarnos a un falso positivo) y si la comparamos con _react-draggable_, podemos ver como se están igualando, per la supuesto "super subida" que tenía era más una colina...

Parece que es un proyecto popular, con una buena documentación, con un mantenimiento relativo.

- React-beautiful-dnd
  - Licencia Apache 2.0 (no es MIT, pero en principio es bastante permisiva, habría que verlo en detalle por si acaso)
  - 32K estrellas
  - Leyendo la documentación (i) se indica que es una especialización de Drag & Drop para listas, es decir una abstracción
  - En la página principal comentan que el proyecto tienen un mantenimiento mínimo correctivo, pero no hay planes de desarrollo.
  - Y... te recomiendan que te pases a Pragmatic Drag and Drop (que la acaban de sacar ellos).
  - Detrás del proyecto hay una empresa (Atlassian -> Trello :))

comparado con React Dnd

- El proyecto está oficialmente discontinuado
- El proyecto está escrito con JavaScript
- La última release es de agosto de 22

Parece un proyecto popular, que resuelve un problema concreto, pero cuyo mantenimiento esta en mínimos.

Lo comparamos con npm trends?

- **Pragmatic Drag and Drop**

- Tiene 7700 estrellas

- Este es el proyecto que recomienda Atlassian (los que están detrás de Trello ó Jira).

- Comparado con las otra librerías se ha publicado hace relativamente poco.

- Tiene muy buena documentación.

- Comentan que es multilibrería.

- Hay un video en el que explican que han mejorado con esta librería sobre su anterior: https://www.youtube.com/watch?v=5SQkOyzZLHM

- Es la que se está usando ahora en Trello y Jira.

- Resuelve varios escenarios (no sólo listas).

- Tiene mantenimiento oficial y activo.

- Si te vas al mundo del "salseo" es muy recomendada por diferentes creadores (en España midudev).

si nos vamos a npm-trend el comportamiento es curioso, por un lado el pico de descargas de cuando salió, y por otro si comparamos con las demás que son más veteranas todavía tiene que pillar tracción.

Ahora vendría la prueba más importante:

- Estudiar en qué casos de uso se va a usar el _drag and drop_.

- Elegir un par de librerías (por ejemplo las que están abandonadas las descartaría).

- Montar un _spike_ e ir probando ambas.

- Documentar los resultados.

- Decidir con cual nos quedamos.

En nuestro caso esta prueba que es la más importante (_power point_ no compila), nos la saltamos por razones de tiempo y porque esto es un curso, también comentarte que la hemos hecho antes :)... en nuestro caso la ganadora a fecha de hoy es Prágmatica Dnd.

Las ventajas

- Es una librería que usa Atlassian en desarrollos muy importantes.
- Es una evolución de una líbrería popular.
- Resuelve limitaciones de su sucesor.
- Es multilibrería.
- Tiene una documentación muy buena.
- Tiene un mantenimiento activo.
- tiene una aproximacíon moderna y mucho mejor rendimiento.

Las desventajas

- Es una librería nueva y no tiene todos los casos implementados (por ejemplo si en vez de clonar el item HTML, quieres mostrar otro indicador te lo tienes que currar).

# Siguiente paso en el proceso

Ya tenemos nuestro ejemplo de punto de partida copiado (si no copiatelo de **00-boilerplate**, haz un `npm install` y `npm run dev`).

- Antes de ponernos con el _Drag & Drop_ vamos a definir nuestro componente de _kanban_, para ello:

  - Vamos a crear un proyecto de prueba (si lo que hemos hecho está bien montado podremos pasarlo al proyecto real y conectarlo), de esta manera:

    - Avanzamos de forma ligera (hay veces que proyectos grandes tardan en transpilar o meten ruido con otros temas).

    - Nos centramos en la funcionalidad y tenemos un árbol de ficheros más pequeño.

  - Creamos una carpeta para encapsular esta funcionalidad (más adelante si es necesario refactorizaremos la estructura de carpetas si hace falta.)

  - Pensamos en qué modelo de datos nos hace falta.

  - Creamos una fuente de datos _mock_ y una _api_ de datos _mock_ que cumpla con el contrato real y sea fácilmente sustituible por el real.

  - Empezamos a crear el árbol de componentes, preocupándonos más de funcionalidad que de diseño (ya habrá tiempo de ajustarlo).

  - Una vez que lo tenemos armado, podemos empezar a refactorizar para sacar funcionalidad fuera de los componentes, o podemos seguir implementando, en este caso decidimos implementar la funcionalidad de _drag & drop_.

  - Para _Drag & Drop_ analizamos las estrategias que tenemos en este caso y apostamos por una.

  - Arrancamos la funcionalidad de _drag & drop_, y empieza la fiesta.

  - Nos encontramos con un montón de casos arista, que iremos resolviendo
    (algunos con dolor y tirando de _stackoverflow_ y la IA de turno :))

  - Mientras implementamos detectamos ciertos métodos que son pura lógica de negocios (algoritmos / funciones de ayuda que no tienen que ver con React), si las tenemos claramente definidas las sacamos de los componentes e implementamos pruebas unitarias (incluso podemos seguir TDD).

  - También puede que haya cosas que mejorar que nos paren el flow de desarrollo, aquí podemos ir añadiendo TODOs y volver a ellos para limpiar el código una vez que tengamos el cogollo que queríamos hacer listo.

  - ¿Y en los componentes seguimos TDD o metemos pruebas unitarias? Ahora mismo tenemos un problema y es que no sabemos bien que hacer y nuestro _kanban_ y puede sufrir cambios drásticos, en este caso, yo abogaría por jugar y entender la librería, y ya plantear pruebas unitarias cuando sepamos que aproximación vamos a tomar (incluso cuando pasemos al proyecto real reescribir con pruebas unitarias en la cabeza).

  - Otro tema importante en cuanto ponga el _boilerplate_ y haga _install_ toca crear
    un repo de git local, ¿Y eso por qué?

    - Vamos guardando _commits_ de hitos que vamos alcanzando.

    - Me permite jugar con el código y si "la lío parda" puedo hacer un _discard_
      _changes_.

    - Ya tenemos un primer paso dado, si quisiéramos compartir la prueba
      con un compañero sólo tendríamos que hacer un set origin y subirlo a algún
      proveedor (github, gitlab, bitbucket, etc)...

¿Por qué seguir este proceso?

1. No sabemos cómo resolver este problema, así que es bueno hacer un solución aparte (_spike_) para jugar con plastilina y no tener la presión de que estoy con el proyecto real y que tengo que subir algo ya.

2. No sabemos cómo funciona la librería de _drag & drop_, seguramente tengamos que cambiar muchas cosas en esta prueba.

3. Nos obliga a pensar en una solución más genérica que no esté atada a la arquitectura y dominio de la solución real (por supuesto tenemos que
   chequear que lo que estamos implementando se integre bien).

4. Es más fácil poder extraer un pedazo de código o incluso montar un _codesandbox_ y preguntar dudas en la comunidad sin exponer piezas de código o datos confidenciales.

5. Una vez que tenemos "la mierda prueba" lista, sí podemos empezar a implementarla en la solución real, teniendo en la cabeza pruebas unitarias y de ensamblaje (descubriremos más casos arista que no hemos probado), _refactors_, y adaptación al dominio.

# Modelo de datos y api

Vamos a empezar por ver que estructura de datos nos va a hacer falta:

- Un tablero de _kanban_ va a tener una lista de columnas.

- Una lista de columnas va a tener una lista de tareas/historias (podemos llamarle
  cards)

- Una card la vamos a definir simple de momento, con un _id_ y un título.

Oye pero en mi aplicación real tengo más campos o campos diferentes ¿Qué hacemos?

- De primeras queremos probar la librería, nos podemos preocupar de esto
  más adelante.

- Una vez que nos toque ir a por la implementación real, lo primero es crear un _mapper_, es decir una función que transforme del dominio de mi aplicación al dominio de entidades del _kanban_ y viceversa, de esta manera no manchamos la implementación del _kanban_ con temas específicos de mi aplicación, que después hagan más difícil de usarlo en otras aplicaciones o incluso en la misma _app_ con otras entidades.

- Nos toca plantearnos escenarios:

  - Igual tenemos claro que queremos tener título, descripción del _card_ y poco más, en este caso mapeamos entidades y a lo sumo añadimos un campo "_object_" o "_data_" en el que tenemos la entidad original (esto se podría mirar de tipar con genéricos).

  - Igual queremos una edición rica en la carta o flexible, una opción podría ser pasarle como _children_ o en props el componente que queremos pintar en el _card_ en concreto.

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

- La api debe tener la misma firma que si estuviéramos cargando datos desde una _API Rest_ (async y promesas), así cuando reemplacemos el _mock_ por datos reales sólo vamos a tener que tocar en la API.

- Los datos _mock_ los definimos en un fichero aparte, así es más fácil de eliminar y no metemos ruido.

De momento tanto api como _mock_ lo vamos a definir dentro del componente _kanban_, en la implementación final seguramente lo saquemos fuera de la carpeta (sea directamente la página de aplicación la que pida los datos a un servidor le pasemos un _mapper_ y lo convirtamos a entidades de la aplicación), pero no nos metemos aquí ahora, mejor no meter más elementos de complejidad en la ecuación, primero gateamos, después andamos y finalmente corremos (recordatorio: es importante que esto sea un _spike_ y que tengamos 2/3 semanas para jugar sin presión).

Los datos _mock_:

_./src/kanban/mock-data.ts_

```ts
import { KanbanContent } from "./model";

// TODO: Move this in the future outside the kanban component folder
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

> Cuando tengamos código o implementaciones que necesitan un meneo, es buena idea añadirle un TODO para que cuando llegue la Pull Request salgan a flote (en este fase, no deben de haber TODO's o si los hay deben de estar justificados y aceptar deuda técnica).

- Y ahora vamos a definir la API

_./src/kanban/kanban.api.ts_

```ts
import { KanbanContent } from "./model";
import { mockData } from "./mock-data";

// TODO: Move this outside kanban component folder
export const loadKanbanContent = async (): Promise<KanbanContent> => {
  return mockData;
};
```

¿Por qué no empotramos los datos directamente en el _container_ y a tirar millas? Es importante que la parte de UI se quede con el menor ruido posible, y es buena práctica sacar todo el código que se pueda que no tenga que ver con UI a ficheros TS planos, de esta manera:

- Ayudamos a evitar que el componente se vuelva un monstruo: el típico fichero con 5000 lineas de código, con un _sphaguetti_.

- Al aislar código en fichero TS ya sabemos que no es dependiente de React y un compañero que no sepa React puede trabajar en esa parte sin problemas.

- Es más fácil de testear, tenemos piezas que hacen una cosa y una sola cosa.

### Componentes

Vamos empezar a trabajar en el UI

- Definamos el contenedor del _kanban_, lo primero un poco de estilado:

El div contenedor:

- Va a ser un flexbox.
- Lo suyo es que ocupe todo el espacio disponible.
- Las columnas las mostrará de izquierda a derecha, dejando un espacio entre ellas.
- Además le añadimos un overflow (si hubieran más card que espacio en la columna),
  aquí podríamos ver si a futuro añadir un scroll, etc...

_./src/kanban/kanban.container.module.css_

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

- Este no va a ser el diseño definitivo, pero al menos lo tenemos enfocado (cuando la prueba sea un éxito, nos preocuparemos de darle estilo con el martillo fino, rem, media queries, etc...).

- Lo mismo con los colores, tematización, ya aplicaremos esto cuando integremos (aquí tocará decidir si aplicar directamente _harcodear_ estilos o si exponer una api de tematización)

Si te fijas hay un montón de decisiones que podrían añadir ruido a nuestra prueba de concepto, nuestro objetivo como desarrolladores / arquitectos software es retrasar todas las decisiones que no sean indispensable y centrarnos en el núcleo de nuestra prueba de (no está de más ir apuntando todo lo que va saliendo por el camino, tanto para tenerlo en cuenta más adelante, como para enumerarlo en la demo del _spike_ y añadirlo a la _user story_ de implementación real, es muy peligroso mostrar una demo que todo funcione y que el perfil no técnico piense que ya está todo hecho).

Vamos a definir el componente contenedor:

_./src/kanban/kanban.container.tsx_

```tsx
import React from "react";
import { KanbanContent, createDefaultKanbanContent } from "./model";
import { loadKanbanContent } from "./kanban.api";
import classes from "./kanban.container.module.css";

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

Es hora de probar que esto funciona (se ve un rectángulo con tres títulos)... parece poca cosa pero con menos código he metido fallos grandes :), de hecho primer patón, no ocupa toda la pantalla el kanban, pero esto es más problema de aplicación, el _body_ es un contenedor flex ,y tenemos que decirle al _div_ root que ocupe todo el espacio que pueda (podemos ponerle un _flex_ a 1), para esto podemos jugar con las dev tools.

Vamos a cambiarlo en la hoja de estilos.

_./app.css_

```diff
#root {
  max-width: 1280px;
+ flex: 1;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
```

Ahora ejecutamos y ya podemos ver que ocupa bastante espacio :).

```bash
npm start
```

✅ Somos capaces de mostrar un contenedor vacio...

Vamos a definir el componente de columnas:

- Vamos a por el estilado.
- En nuestro caso el componente columna va a recibir del contenedor el nombre de la misma y una lista de tareas (lo llamaremos _content_, el como nombrar variables / componentes / carpetas, lleva mucha discusión y estudio, es muy importante, quizás un nombre más apropiado podría ser _cardContentCollection_).

Sobre el estilado:

- La columna va a ser otro contenedor flex.

- Para la prueba va a tener un ancho fijo (apuntar martillo fino para después si añadir media queries para poner un ancho relativo o por porcentajes).

- Le pondremos _overflow_ por si hubiera más _cards_ que espacio en la columna (martillo fino todo, resolver esto cuando se integre en real)

- Le añadimos un color de fondo a cada columna (TODO martillo fino aquí, o bien en la aplicación real usar los colores que vengan, o bien exponer una API de CSS / tematizado o mediante variables HTML).

- La altura le damos el 100% del alto del contenedor padre.

_./src/kanban/column/column.component.module.css_

```css
.container {
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  align-items: center;
  width: 250px; /* TODO: relative sizes or media queries?*/
  height: 100vh; /* TODO: review height, shouldn't be 100vh*/
  overflow: hidden; /*TODO: scroll? */
  border: 1px solid rgb(4, 1, 19); /* TODO: Theme colors, variables, CSS API? */
  background-color: aliceblue;
}
```

- Hora de tocar el código, seguimos los mismos pasos que con en el contenedor, montamos el mínimo, y simplemente mostramos el nombre de cada _card_.

_./src/kanban/column/column.component.tsx_

```tsx
import React from "react";
import classes from "./column.component.module.css";
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

En cuanto estilado vamos a definir: Una clase para estilar el card (ancho, borde...).

El diseño es mínimo, más adelante habría que aplicar _martillo fino_ para dejar una _card_ con aspecto profesional.

_./src/kanban/card/card.component.module.css_

```css
.card {
  display: flex;
  border: 1px dashed gray; /* TODO: review sizes, colors...*/
  padding: 5px 15px;
  background-color: white;
  width: 210px;
}
```

Vamos ahora a por el tsx:

_./src/kanban/card/card.component.tsx_

```tsx
import React from "react";
import { CardContent } from "../model";
import classes from "./card.component.module.css";

interface Props {
  content: CardContent;
}

export const Card: React.FC<Props> = (props) => {
  const { content } = props;

  return <div className={classes.card}>{content.title}</div>;
};
```

- Como siempre corremos a usarlo en nuestro componente de columna y ver los resultados:

_./src/kanban/column/column.component.tsx_

```diff
import React from "react";
import classes from "./column.component.css";
import { CardContent } from "./model";
+ import { Card } from '../card/card.component';
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
    </div>
  );
```

- A ver qué tal sale :)

```bash
npm start
```

✅ Somos capaces de mostrar las _cards_...

- Ya tenemos nuestro tablero montado, es hora de ver cómo va quedando nuestra carpeta _kanban_ parece que hay muchos ficheros, sería buena idea organizar un poco, vamos a crear dos carpetas:
- _components_: donde meteremos los componentes que no son contenedores.
- _api_: donde meteremos los ficheros que se encargan de la comunicación
  con el _backend_ (que en este caso son _mock_).

Vamos a crear un _barrel_ para cada una de ellas:

_./src/kanban/components/index.ts_

```ts
export * from "./card";
export * from "./column";
```

> Hay que crear los barrer para la subcarpeta card y column

_./src/kanban/api/index.ts_

```ts
export * from "./kanban.api";
```

Y arreglamos los _imports_ de:

- api
- components
- kanban.container

_./src/kanban/kanban.container.tsx_

```diff
import React from "react";
import { KanbanContent, createDefaultKanbanContent } from "./model";
- import { loadKanbanContent } from "./api/kanban.api";
+ import { loadKanbanContent } from "./api";
- import { Column } from "./components/column/column.component";
+ import { Column } from "./components";
  import classes from "./kanban.container.module.css";
```

