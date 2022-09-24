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

(Kanban, calendarios, ...)

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

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Siguiente paso, vamos a instalar la librería _react-dnd_ que le hace falta
  un _backend_ (ojo no es backend de servidor) para trabajar con drag & drop
  en este caso elegimos la librería _react-dnd-html5-backend_.

```bash
npm install react-dnd react-dnd-html5-backend
```

- Vamos a habilitar el proveedor de drag and drop a nivel de aplicación.

_./src/app.tsx_

```diff
import React from "react";

export const App = () => {
-  return <h1>Hello React !!</h1>;
+  
};
```
