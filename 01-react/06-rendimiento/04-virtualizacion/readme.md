# Resumen

En un cliente nos pueden pedir cargar listas con muchas filas
de un tirón en una página, sin paginación ni nada...

Si vamos del tirón a montarlas en el DOM nos vamos a meter
en problemas, la aplicación va a ir muy mal de rendimiento
y esto va a penalizar tanto en experiencia de usuario, como
en posicionamiento (mal rendimiento de la página).

Para evitar esto, existe un truco, que es sólo montar en el
DOM las filas que estén visibles en ese momento (más unas
cuantas por arriba y por abajo por si el usuario hacer scroll
que sea rápido), e ir creando filas bajo demanda, de esta manera
el usuario tiene la ilusión de que todos las filas están cargadas
en el DOM.

A esta técnica se le llama _virtualización_, hace años había una
librería que se llamaba _react-virtualized_, pero el mismo autor
saco una nueva versión llamada _react-window_ vamos a montar
un ejemplo con esto.

# Manos a la obra

- Partimos de 00-boilerplate.

- Vamos a leer de una api una lista de 1000 fotos de una api de pruebas:
  https://jsonplaceholder.typicode.com/photos?_limit=1000

- Tipamos el modelo para la API

_./src/components/photo/photo.model.ts_

```ts
export interface Photo {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}
```

- Para ello vamos a definir un hook para cargar la lista de fotos:

_./src/components/photo/use-photos.hook.ts_

```tsx
import { useEffect, useState } from "react";
import { Photo } from "./photo.model";

export const usePhotos = () => {
  const [photos, setPhotos] = useState<Photo[] | null>(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/photos?_limit=1000")
      .then((response) => response.json())
      .then((photosData) => {
        setPhotos(photosData);
      });
  }, []);

  return {
    photos,
  };
};
```

Vamos a crear un componente que muestre la lista de fotos tal cual:, para ello:

- Creamos un componente card que muestre cada foto:

_./src/components/photo/photo-card.component.css_

```css
.container {
  display: flex;
  flex-direction: row;
  width: 600px;
  height: 200px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  color: black;
  overflow: hidden;
}
```

_./src/components/photo/photo-card.component.tsx_

```tsx
import React, { FunctionComponent } from "react";
import { Photo } from "./photo.model";
import classes from "./photo-card.component.css";

interface Props {
  photo: Photo;
}

export const PhotoCard: FunctionComponent<Props> = ({ photo }) => {
  return (
    <div className={classes.container}>
      <a href={photo.url}>
        <img src={photo.thumbnailUrl} alt={photo.title} />
      </a>
      <p>{photo.title}</p>
    </div>
  );
};
```

- Vamos a crear la lista tal cual

_./src/components/photo/photo-list.component.css_

```css
.container {
  width: 800px;
  height: 800px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow: auto;
}
```

_./src/components/photo/photo-list.component.tsx_

```tsx
import React from "react";
import { usePhotos } from "./use-photos.hook";
import { PhotoCard } from "./photo-card.component";
import classes from "./photo-list.component.css";
import { Photo } from "./photo.model";

interface Props {
  photos: Photo[];
}

export const PhotosList: React.FC<Props> = (props) => {
  const { photos } = props;

  if (!photos) {
    return null;
  }

  return (
    <div className={classes.container}>
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  );
};
```

Vamos a añadir un barrel:

_./src/components/photo/index.ts_

```ts
export * from "./photo-list.component";
export * from "./photo.model";
export * from "./use-photos.hook";
```

Vamos a darle uso en la App:

_./src/app.tsx_

```diff
import React from "react";
+ import { PhotosList, usePhotos } from "./components/photo";

export const App = () => {
+  const { photos } = usePhotos();

-  return <h1>Hello React !!</h1>;
+ return <PhotosList photos={photos}/>;
};
```

- Si estoy pasamos el light house podemos ver que tiene un rendimiento muy malo.

- Si incrementamos la consulta a 5000 elementos puedes ver que ya a la aplicación
  le cuesta y que light house nos un numero bastante malo.

- Vamos a ver como podemos mejorar esto con react-window.

Aquí lo que hacemos es sólo pintas los elementos visible (y alguno más
por si el usuario hace scroll), el resto se va creando bajo demanda.

- Vamos a instalar react-window:

```bash
npm install react-window @types/react-window
```

- Como los elementos que estamos usando tienen todos el mismo
  tamaño podemos usar el componente _FixedSizeList_.

_./src/components/components/photo-list.component.tsx_

```diff
import React from "react";
import { usePhotos } from "./use-photos.hook";
import { PhotoCard } from "./photo-card.component";
import classes from "./photo-list.component.css";
import { Photo } from "./photo.model";
+ import { FixedSizeList } from 'react-window';
```

_./src/components/components/photo-list.component.tsx_

```diff
  return (
    <div className={classes.container}>
-      {photos.map((photo) => (
-        <PhotoCard key={photo.id} photo={photo} />
-      ))}
+    <FixedSizeList width={800} height={800}  itemCount={photos.length} itemSize={200}>
+      {({ index }) => {
+        const photo = photos[index];
+        return <PhotoCard key={photo.id} photo={photo}/>;
+      }}
+    </FixedSizeList>
    </div>
  );
```

- Hasta ahora hemos tenido que indicarle explícitamente el tamaño de la lista, pero
  muchas veces esto no es posible ya que queremos que ocupe todo el ancho y alta que tenga
  disponible en pantalla o del contenedor padre, para trabajar con esto debemos de usar
  otra ayuda _react-virtualized-auto-sizer_.

```bash
npm install react-virtualized-auto-sizer @types/react-virtualized-auto-sizer
```

Vamos a modificar el estilado de la lista para que tome el 100% del viewport.

_./src/components/photo/photo-list.component.css_

```diff
.container {
-  width: 800px;
-  height: 800px;
+  width: 80vw;
+  height: 80vh;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow: auto;
}
```

- Y vamos a incrustar autosizer en la lista:

_./src/components/photo/photo-list.component.tsx_

```diff
import React from "react";
import { usePhotos } from "./use-photos.hook";
import { PhotoCard } from "./photo-card.component";
import classes from "./photo-list.component.css";
import { Photo } from "./photo.model";
import { FixedSizeList } from "react-window";
+ import AutoSizer from 'react-virtualized-auto-sizer';
```

_./src/components/photo/photo-list.component.tsx_

```diff
  return (
    <div className={classes.container}>
+    <AutoSizer>
+      {({ height, width }) => (
        <FixedSizeList
-          width={800}
-          height={800}
+          width={width}
+          height={height}
          itemCount={photos.length}
          itemSize={200}
        >
          {({ index }) => {
            const photo = photos[index];
            return <PhotoCard key={photo.id} photo={photo} />;
          }}
        </FixedSizeList>
+      )}
+    </AutoSizer>
    </div>
  );
```

# Referencia

Este ejemplo está sacado de este post:
https://wanago.io/2022/06/27/long-lists-react-virtualization/
